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

  const [loading, setLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const [openPN, setOpenPN] = useState(false);
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState('');
  const debounceSearch = useDebounce(search, 500);
  const dropdownRef = useRef(null);

  const [warehouseData, setWarehouseData] = useState([]);
  const [pnNumber, setPnNumber] = useState([]);

  const [productionNo, setProductionNo] = useState('');
  const [article, setArticle] = useState('');
  const [factory, setFactory] = useState({ id: '', name: '' });
  const [fromWarehouse, setFromWarehouse] = useState('');
  const [toWarehouse, setToWarehouse] = useState('');
  const [availableQty, setAvailableQty] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState({
    categoryCode: '',
    color: '',
    size: '',
    type: '',
    quality: '',
  });

  // Normalized QR response object:
  // { qrCodes: [], createdInDestination: [], deletedFromSource: [], stockCreated: [], message: '' }
  const [qrData, setQrData] = useState(null);
  const printRef = useRef();

  // ---------- helper: normalize API response ----------
  const normalizeQrResponse = (res) => {
    // Accept many shapes: res, res.data, res.data.data
    const top = res ?? {};
    const d1 = top.data ?? top; // if res.data exists, use that, else top
    const d2 = d1.data ?? d1; // sometimes data is nested inside data.data
    // Now d2 should be the object holding arrays like qrCodes, createdInDestination, etc.
    const qrCodes =
      d2.qrCodes ||
      d2.createdInDestination || // sometimes createdInDestination holds actual QRs
      d2.data?.qrCodes ||
      top.qrCodes ||
      [];
    const createdInDestination = Array.isArray(d2.createdInDestination)
      ? d2.createdInDestination
      : [];
    const deletedFromSource = Array.isArray(d2.deletedFromSource)
      ? d2.deletedFromSource
      : [];
    const stockCreated = Array.isArray(d2.stockCreated) ? d2.stockCreated : [];
    const message = d2.message || d1.message || top.message || '';

    // Ensure qrCodes is an array
    const qrCodesArr = Array.isArray(qrCodes) ? qrCodes : [];

    return {
      qrCodes: qrCodesArr,
      createdInDestination,
      deletedFromSource,
      stockCreated,
      message,
      raw: top,
    };
  };

  // ---------- initial: fetch PN list (stock) ----------
  useEffect(() => {
    (async () => {
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
      } catch (err) {
        toast.error(
          err?.response?.data?.message || 'Failed to fetch stock PNs',
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [user.accessToken]);

  // ---------- load warehouses ----------
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

  // ---------- productions dropdown (search + infinite) ----------
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
      console.log('fetchProducts res:', res);
      const products = res?.items || res?.data || [];
      const pagination = res?.data?.pagination || null;

      if (pageNo === 1) setProductData(products);
      else setProductData((prev) => [...prev, ...products]);

      if (pagination) setHasMore(pageNo < (pagination.totalPages || 1));
      else setHasMore(products.length === 20);
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

  // close dropdown when clicking outside
  useEffect(() => {
    const onClick = (ev) => {
      if (dropdownRef.current && !dropdownRef.current.contains(ev.target)) {
        setOpenPN(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // ---------- selecting a PN ----------
  const selectProductionNo = async (pn) => {
    const pnValue =
      typeof pn === 'string' ? pn : pn.productionNo || pn.id || '';
    setProductionNo(pnValue);
    setOpenPN(false);
    setFromWarehouse('');
    setToWarehouse('');
    setQuantity(0);
    setAvailableQty(0);
    setQrData(null);

    let selectedPN = pnNumber.find((p) => p.productionNo === pnValue);
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
    } else {
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

  // ---------- handle from warehouse change ----------
  const handleFromWarehouseChange = (value) => {
    setFromWarehouse(value);
    setQrData(null);

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
      setCategory((prev) => ({
        categoryCode: wh.categoryCode || prev.categoryCode || '',
        color: wh.color || prev.color || '',
        size: wh.size || prev.size || '',
        type: wh.type || prev.type || '',
        quality: wh.quality || prev.quality || '',
      }));
      if (wh.article) setArticle(wh.article);
    } else {
      setAvailableQty(0);
      setQuantity(0);
    }
  };

  // ---------- create QR / internal transfer ----------
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
      console.log('internalStockTransfer response:', res);

      // normalize the response (handles several shapes)
      const normalized = normalizeQrResponse(res);
      console.log('normalized QR response:', normalized);

      toast.success(normalized.message || 'QR generated successfully!');
      setQrData(normalized);

      // Reset the form fields (keeping qrData so preview/print works)
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

      // refresh PN list
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
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error generating QR');
    } finally {
      setLoading(false);
    }
  };

  // ---------- print QR PDF ----------
  const handlePrint = async () => {
    // Accept both normalized.qrCodes and normalized.createdInDestination
    const codes =
      qrData?.qrCodes && qrData.qrCodes.length > 0
        ? qrData.qrCodes
        : qrData?.createdInDestination || [];

    if (!codes || codes.length === 0) {
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

      codes.forEach((qr, index) => {
        if (qr.qrData) {
          try {
            doc.addImage(qr.qrData, 'PNG', x, y, qrSize, qrSize);
          } catch (e) {
            console.warn('addImage failed for a QR (skipping):', e);
          }
        }
        doc.setFontSize(10);
        doc.text(
          `Article: ${qr.article || qr.product?.article || 'N/A'}`,
          x,
          y + qrSize + 5,
        );
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
      console.error('print error:', err);
      toast.error('Error printing QR');
    } finally {
      setIsPrinting(false);
    }
  };

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

  // ---------- UI ----------
  if (loading) return <Loader />;

  // Determine whether we have QR data
  const hasQrData = !!(
    (qrData?.qrCodes && qrData.qrCodes.length > 0) ||
    (qrData?.createdInDestination && qrData.createdInDestination.length > 0)
  );

  return (
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
            type="text"
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
          disabled={!hasQrData || isPrinting}
          className={`rounded px-4 py-2 ${
            !hasQrData || isPrinting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isPrinting ? 'Printing...' : 'Print QR Codes'}
        </button>
      </div>

      {/* Notification */}
      {hasQrData && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
          <p className="text-green-700 text-sm">
            ✅ QR codes generated and ready to print
          </p>
        </div>
      )}

      {/* Preview area */}
      {(qrData?.createdInDestination?.length > 0 ||
        qrData?.qrCodes?.length > 0) && (
        <div
          ref={printRef}
          className="grid gap-4 mt-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          }}
        >
          {(qrData?.createdInDestination?.length > 0
            ? qrData.createdInDestination
            : qrData.qrCodes
          ).map((qr, i) => {
            const stockItem =
              qrData?.stockCreated?.find((s) => s.qrId === qr.qrId) || {};
            return (
              <div
                key={`${qr.qrId || i}`}
                className="qr-label border rounded p-2 flex flex-col items-center text-center text-xs break-inside-avoid"
              >
                {stockItem?.article && (
                  <div className="font-semibold mb-1">
                    Article: {stockItem.article}
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
