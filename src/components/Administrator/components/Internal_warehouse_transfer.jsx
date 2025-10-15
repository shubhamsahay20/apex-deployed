import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../Context/AuthContext';
import productionService from '../../../api/production.service';
import stockService from '../../../api/stock.service';
import warehouseService from '../../../api/warehouse.service';
import qrService from '../../../api/qr.service';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import Loader from '../../../common/Loader';
import { useDebounce } from '../../../hooks/useDebounce';

const InternalWarehouseTransfer = () => {
  const { user } = useAuth();

  // UI / loading
  const [loading, setLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // PN dropdown (search + infinite scroll)
  const [openPN, setOpenPN] = useState(false);
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState('');
  const debounceSearch = useDebounce(search, 500);
  const dropdownRef = useRef(null);

  // Data lists
  const [warehouseData, setWarehouseData] = useState([]); // all warehouses (for To Warehouse)
  const [pnNumber, setPnNumber] = useState([]); // stock-driven PN list (from stockService)

  // Form states
  const [productionNo, setProductionNo] = useState('');
  const [article, setArticle] = useState('');
  const [factory, setFactory] = useState({ id: '', name: '' });
  const [fromWarehouse, setFromWarehouse] = useState(''); // warehouseId
  const [toWarehouse, setToWarehouse] = useState(''); // warehouseId
  const [availableQty, setAvailableQty] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState({
    categoryCode: '',
    color: '',
    size: '',
    type: '',
    quality: '',
  });

  const [qrData, setQrData] = useState(null);

  const printRef = useRef();

  // -----------------------
  // Initial loads
  // -----------------------
  // 1) Load pn stock once (your original logic) so we can map PN -> warehouseData
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const prores = await stockService.getStockByPn(user.accessToken);
        // Your original mapping: prores.items
        const items = prores?.items || prores?.data?.items || [];
        const allStockData = items.map((item) => ({
          productionNo: item.productionNo,
          article: item.article,
          categoryCode: item.categoryCode,
          size: item.size,
          type: item.type,
          color: item.color,
          quality: item.quality,
          factory: item.factory,
          warehouseData: item.warehouseData || [], // important for From Warehouse
        }));

        // make unique by productionNo (keep latest item)
        const uniquePn = Array.from(
          new Map(allStockData.map((it) => [it.productionNo, it])).values(),
        );
        setPnNumber(uniquePn);
      } catch (err) {
        toast.error(
          err?.response?.data?.message || 'Failed to fetch stock PNs',
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [user.accessToken]);

  // 2) Load all warehouses for To Warehouse dropdown
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await warehouseService.getAllWarehouse(user.accessToken);
        setWarehouseData(res?.data?.data || res?.data || []);
      } catch (err) {
        toast.error(
          err?.response?.data?.message || 'Failed to fetch warehouses',
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [user.accessToken]);

  // -----------------------
  // Production searchable dropdown (productionService)
  // -----------------------
  const fetchProducts = async (pageNo = 1, searchTerm = '') => {
    if (fetching) return;
    setFetching(true);
    try {
      const res = await stockService.getStockByPn(
        user.accessToken,
        pageNo,
        20,
        searchTerm,
      );

      console.log('response', res);

      const products = res?.items || res?.data || [];
      const pagination = res?.data?.pagination || null;

      if (pageNo === 1) setProductData(products);
      else setProductData((prev) => [...prev, ...products]);

      if (pagination) setHasMore(pageNo < (pagination.totalPages || 1));
      else setHasMore(products.length === 20); // fallback guess
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Failed to fetch productions',
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!openPN) return;
    if (debounceSearch.length === 0 || debounceSearch.length >= 2) {
      setPage(1);
      fetchProducts(1, debounceSearch);
    }
  }, [debounceSearch, openPN]);

  useEffect(() => {
    if (page > 1) fetchProducts(page, search);
  }, [page]);

  const handleListScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !fetching) {
      setPage((p) => p + 1);
    }
  };

  // close dropdown on outside click
  useEffect(() => {
    const onClick = (ev) => {
      if (dropdownRef.current && !dropdownRef.current.contains(ev.target)) {
        setOpenPN(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // -----------------------
  // When user selects a productionNo from dropdown
  // -----------------------
  const selectProductionNo = async (pn) => {
    // pn could be a string or an object with productionNo
    const pnValue =
      typeof pn === 'string' ? pn : pn.productionNo || pn.id || '';
    setProductionNo(pnValue);
    setOpenPN(false);

    // Reset dependent fields immediately (like your original)
    setFromWarehouse('');
    setToWarehouse('');
    setQuantity(0);
    setAvailableQty(0);
    setQrData(null);

    // Try to find the stock item in pnNumber (pre-fetched)
    let selectedPN = pnNumber.find((p) => p.productionNo === pnValue);

    // If not found, fetch stock list again and try to find (covers case where pnNumber didn't include this PN)
    if (!selectedPN) {
      try {
        setLoading(true);
        const prores = await stockService.getStockByPn(user.accessToken);
        const items = prores?.items || prores?.data?.items || [];
        const allStockData = items.map((item) => ({
          productionNo: item.productionNo,
          article: item.article,
          categoryCode: item.categoryCode,
          size: item.size,
          type: item.type,
          color: item.color,
          quality: item.quality,
          factory: item.factory,
          warehouseData: item.warehouseData || [],
        }));
        const uniquePn = Array.from(
          new Map(allStockData.map((it) => [it.productionNo, it])).values(),
        );
        setPnNumber(uniquePn);
        selectedPN = uniquePn.find((p) => p.productionNo === pnValue);
      } catch (err) {
        toast.error(
          err?.response?.data?.message || 'Failed to refresh stock data',
        );
      } finally {
        setLoading(false);
      }
    }

    // If we have selectedPN, populate fields exactly like your original code
    if (selectedPN) {
      setArticle(selectedPN.article || '');
      setCategory({
        categoryCode: selectedPN.categoryCode || '',
        color: selectedPN.color || '',
        size: selectedPN.size || '',
        type: selectedPN.type || '',
        quality: selectedPN.quality || '',
      });
      setFactory({
        id: selectedPN.factory?._id || selectedPN.factory?.id || '',
        name: selectedPN.factory?.name || selectedPN.factory?.factoryName || '',
      });

      // Note: keep pnNumber as-is; From Warehouse options will read from selectedPN.warehouseData
    } else {
      // fallback: clear fields
      setArticle('');
      setCategory({
        categoryCode: '',
        color: '',
        size: '',
        type: '',
        quality: '',
      });
      setFactory({ id: '', name: '' });
    }
  };

  // -----------------------
  // When From Warehouse changes (dependent on selected PN's warehouseData)
  // -----------------------
  const handleFromWarehouseChange = (value) => {
    setFromWarehouse(value);
    setQrData(null);

    // find selected PN stock entry
    const selectedPNEntry = pnNumber.find(
      (p) => p.productionNo === productionNo,
    );
    const wh = selectedPNEntry?.warehouseData?.find(
      (w) => w.warehouseId === value,
    );

    if (wh) {
      const avail = wh.availableQuantity ?? wh.availableQty ?? 0;
      setAvailableQty(avail);
      setQuantity(avail > 0 ? 1 : 0);

      // override category with warehouse-level fields if present
      setCategory((prev) => ({
        categoryCode: wh.categoryCode || prev.categoryCode || '',
        color: wh.color || prev.color || '',
        size: wh.size || prev.size || '',
        type: wh.type || prev.type || '',
        quality: wh.quality || prev.quality || '',
      }));

      // prefer article at warehouse-level if provided
      if (wh.article) setArticle(wh.article);
    } else {
      setAvailableQty(0);
      setQuantity(0);
    }
  };

  // -----------------------
  // Create QR (same as your original)
  // -----------------------
  const handleCreateQr = async () => {
    if (
      !factory.id ||
      !fromWarehouse ||
      !toWarehouse ||
      !productionNo ||
      !article ||
      !quantity
    ) {
      toast.error('Please fill all fields');
      return;
    }
    if (fromWarehouse === toWarehouse) {
      toast.error('From and To warehouse cannot be same');
      return;
    }

    const selectedPN = pnNumber.find((pn) => pn.productionNo === productionNo);
    const selectedWarehouse = selectedPN?.warehouseData?.find(
      (w) => w.warehouseId === fromWarehouse,
    );

    const payload = {
      factory: factory.id,
      factory_name: factory.name,
      fromWarehouse,
      toWarehouse,
      productionNo,
      article: selectedPN?.article || article,
      quantity,
      category: {
        categoryCode: selectedWarehouse?.categoryCode || category.categoryCode,
        color: selectedWarehouse?.color || category.color,
        size: selectedWarehouse?.size || category.size,
        type: selectedWarehouse?.type || category.type,
        quality: selectedWarehouse?.quality || category.quality,
      },
    };

    try {
      setLoading(true);
      const res = await qrService.internalStockTransfer(
        user.accessToken,
        payload,
      );
      toast.success(res?.data?.message || 'QR generated successfully!');
      setQrData(res.data || res);

      setProductionNo('');
      setArticle('');
      setFactory({ id: '', name: '' });
      setFromWarehouse('');
      setToWarehouse('');
      setAvailableQty(0);
      setQuantity(0);
      setCategory({
        categoryCode: '',
        color: '',
        size: '',
        type: '',
        quality: '',
      });

      // ✅ Refresh PN list
      const prores = await stockService.getStockByPn(user.accessToken);
      const items = prores?.items || prores?.data?.items || [];
      const allStockData = items.map((item) => ({
        productionNo: item.productionNo,
        article: item.article,
        categoryCode: item.categoryCode,
        size: item.size,
        type: item.type,
        color: item.color,
        quality: item.quality,
        factory: item.factory,
        warehouseData: item.warehouseData || [],
      }));
      const uniquePn = Array.from(
        new Map(allStockData.map((it) => [it.productionNo, it])).values(),
      );
      setPnNumber(uniquePn);

      // keep form values for printing if user wants
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error generating QR');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // Print QR same as original
  // -----------------------
  const handlePrint = async () => {
    if (!qrData?.qrCodes || qrData.qrCodes.length === 0) {
      toast.error('No QR data available to print.');
      return;
    }

    setIsPrinting(true);
    try {
      const doc = new jsPDF();
      let x = 10,
        y = 20;
      const qrSize = 40,
        gap = 10;

      qrData.qrCodes.forEach((qr, index) => {
        if (qr.qrData) doc.addImage(qr.qrData, 'PNG', x, y, qrSize, qrSize);
        doc.setFontSize(10);
        doc.text(`Article: ${qr.article || 'N/A'}`, x, y + qrSize + 5);
        doc.text(`Size: ${qr.size || 'N/A'}`, x, y + qrSize + 10);
        doc.text(`Color: ${qr.color || 'N/A'}`, x, y + qrSize + 15);
        doc.text(`Type: ${qr.type || 'N/A'}`, x, y + qrSize + 20);
        doc.text(`Quality: ${qr.quality || 'N/A'}`, x, y + qrSize + 25);

        x += qrSize + gap + 30;
        if ((index + 1) % 3 === 0) {
          x = 10;
          y += qrSize + 40;
          if (y > 250) {
            doc.addPage();
            x = 10;
            y = 20;
          }
        }
      });

      doc.save('transfer-qr-codes.pdf');
      toast.success('QR codes downloaded');
    } catch (err) {
      toast.error('Error printing QR');
    } finally {
      setIsPrinting(false);
    }
  };

  // -----------------------
  // Reset
  // -----------------------
  const handleReset = () => {
    setProductionNo('');
    setArticle('');
    setFactory({ id: '', name: '' });
    setFromWarehouse('');
    setToWarehouse('');
    setAvailableQty(0);
    setQuantity(0);
    setCategory({
      categoryCode: '',
      color: '',
      size: '',
      type: '',
      quality: '',
    });
    setQrData(null);
  };

  // -----------------------
  // Render
  // -----------------------
  return loading ? (
    <Loader />
  ) : (
    <div className="max-w-6xl mx-auto py-5 px-4 bg-gray-50 min-h-screen">
      <h2 className="text-lg font-semibold mb-4">
        Internal Warehouse Transfer
      </h2>

      {/* Production No Dropdown */}
      <div className="relative mb-4" ref={dropdownRef}>
        <label className="block mb-1 text-sm text-gray-700">
          Production No
        </label>
        <div
          onClick={() => setOpenPN((p) => !p)}
          className="w-full p-2 border rounded bg-white cursor-pointer"
        >
          {productionNo || '-- Select Production No --'}
        </div>

        {openPN && (
          <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border-b outline-none"
            />

            <div
              onScroll={handleListScroll}
              className="max-h-48 overflow-y-auto"
            >
              {productData.map((pn, idx) => (
                <div
                  key={pn.productionNo || pn.id || idx}
                  onClick={() =>
                    selectProductionNo(
                      pn.productionNo || pn.productionNoString || pn.id,
                    )
                  }
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                >
                  {pn.productionNo || pn.productionNoString || pn.id}
                </div>
              ))}

              {fetching && (
                <p className="px-4 py-2 text-sm text-gray-500">Loading...</p>
              )}
              {!fetching && productData.length === 0 && (
                <p className="px-4 py-2 text-sm text-gray-500">
                  No results found
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Form fields (always visible) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* From Warehouse */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">
            From Warehouse
          </label>
          <select
            className="w-full p-2 rounded border border-gray-300"
            value={fromWarehouse}
            onChange={(e) => handleFromWarehouseChange(e.target.value)}
          >
            <option value="">Select Warehouse</option>
            {pnNumber
              .find((pn) => pn.productionNo === productionNo)
              ?.warehouseData?.map((w) => (
                <option key={w.warehouseId} value={w.warehouseId}>
                  {w.warehouseName} (Available:{' '}
                  {w.availableQuantity ?? w.availableQty ?? 0})
                </option>
              ))}
          </select>
        </div>

        {/* To Warehouse */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">
            To Warehouse
          </label>
          <select
            value={toWarehouse}
            onChange={(e) => setToWarehouse(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
          >
            <option value="">Choose Warehouse</option>
            {warehouseData.map((w) => (
              <option
                key={w._id}
                value={w._id}
                disabled={w._id === fromWarehouse}
              >
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Factory */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">Factory</label>
          <input
            type="text"
            className="w-full p-2 rounded border border-gray-300 bg-gray-100"
            value={factory.name}
            readOnly
          />
        </div>

        {/* Article */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">Article</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={article}
            readOnly
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">
            Quantity {availableQty > 0 && `(Available: ${availableQty})`}
          </label>
          <input
            type="number"
            className="w-full p-2 rounded border border-gray-300"
            value={quantity}
            min={availableQty > 0 ? 1 : 0}
            max={availableQty}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < 1) setQuantity(1);
              else if (val > availableQty) {
                setQuantity(availableQty);
                toast.error(`Quantity cannot exceed ${availableQty}`);
              } else setQuantity(val);
            }}
          />
        </div>

        {/* Category fields */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">
            Category Code
          </label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={category.categoryCode}
            readOnly
            type='text'
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-700">Color</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={category.color}
            readOnly
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-700">Size</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={category.size}
            readOnly
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-700">Type</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={category.type}
            readOnly
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-700">Quality</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={category.quality}
            readOnly
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={handleReset}
          className="bg-gray-200 rounded px-4 py-2 hover:bg-gray-300"
        >
          Reset
        </button>
        <button
          onClick={handleCreateQr}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Create QR Code
        </button>
        <button
          onClick={handlePrint}
          disabled={
            !qrData?.qrCodes || qrData.qrCodes.length === 0 || isPrinting
          }
          className={`rounded px-4 py-2 ${
            !qrData?.qrCodes || qrData.qrCodes.length === 0 || isPrinting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isPrinting ? 'Printing...' : 'Print QR Codes'}
        </button>
      </div>

      {/* Preview */}
      {qrData?.createdInDestination?.length > 0 && (
        <div
          ref={printRef}
          className="grid gap-4 mt-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          }}
        >
          {qrData.createdInDestination.map((qr, i) => {
            const stockItem = qrData.stockCreated?.find(
              (s) => s.qrId === qr.qrId,
            );
            return (
              <div
                key={`${qr.qrId}-${i}`}
                className="qr-label border rounded p-2 flex flex-col items-center text-center text-xs break-inside-avoid"
              >
                {stockItem?.article && (
                  <div className="font-semibold mb-1">
                    Article: {stockItem?.article}
                  </div>
                )}
                {qr.qrData && (
                  <img
                    src={qr.qrData}
                    alt={`QR ${i}`}
                    className="w-20 h-20 mb-2"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                )}
                {qr.qrId && <div>QR ID: {String(qr.qrId).split('-')[1]}</div>}
                {qr.createdAt && (
                  <div>Date: {new Date(qr.createdAt).toLocaleDateString()}</div>
                )}
                {qr.size && <div>Size: {qr.size}</div>}
                {qr.color && <div>Color: {qr.color}</div>}
                {qr.type && <div>Type: {qr.type}</div>}
                {qr.quality && <div>Quality: {qr.quality}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InternalWarehouseTransfer;
