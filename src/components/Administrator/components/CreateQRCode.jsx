import React, { useEffect, useRef, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import productionService from '../../../api/production.service';
import { useAuth } from '../../../Context/AuthContext';
import warehouseService from '../../../api/warehouse.service';
import qrService from '../../../api/qr.service';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import Loader from '../../../common/Loader';
import { useDebounce } from '../../../hooks/useDebounce';

const CreateQRCode = () => {
  const { user } = useAuth();
  const [productData, setProductData] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [selectedProduction, setSelectedProduction] = useState('');
  const [factory, setFactory] = useState('');
  const [articleNo, setArticleNo] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [quality, setQuality] = useState('');
  const [color, setColor] = useState('');
  const [type, setType] = useState('');
  const [size, setSize] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [quantities, setQuantities] = useState({});
  const [qrData, setQrData] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [loading, setLoading] = useState(false);

  const printRef = useRef();

  // 🔹 search + scroll states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [fetching, setFetching] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceValue = useDebounce(search, 500);

  // 🔹 Fetch products
  const fetchProducts = async (pageNo = 1, searchTerm = '') => {
    if (fetching) return;
    setFetching(true);
    try {
      const res = await productionService.getProductionWithNoQr(
        user.accessToken,
        pageNo,
        20,
        searchTerm,
      );

      console.log('res  is coming', res.data);

      const products = res.data?.products || [];
      const pagination = res.data?.pagination;

      if (pageNo === 1) {
        setProductData(products);
      } else {
        setProductData((prev) => [...prev, ...products]);
      }

      setHasMore(pageNo < (pagination?.totalPages || 1));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch');
    } finally {
      setFetching(false);
    }
  };

  // search + open trigger
  useEffect(() => {
    if (!open) return; // Only fetch if dropdown is open

    // Call API only if debounced value length is 0 or >= 2
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      setPage(1);
      fetchProducts(1, debounceValue);
    }
  }, [debounceValue, open]);

  // load more when page changes
  useEffect(() => {
    if (page > 1) fetchProducts(page, search);
  }, [page]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !fetching) {
      setPage((prev) => prev + 1);
    }
  };

  const handleCreateQr = async () => {
    const selectedProd = productData.find((p) => p._id === selectedProduction);
    console.log("selected prode }}}} ",selectedProd);
    
    if (!selectedProd) {
      toast.error('Please select a production number first');
      return;
    }
    if (!warehouse) {
      toast.error('Please select a warehouse');
      return;
    }

    const payload = {
      factory: selectedProd.factory?._id,
      warehouse: warehouse,
      factory_name: selectedProd.factory?.name,
      productionNo: selectedProd.productionNo,
      productsInput: [{
       article: selectedProd.article,
       categoryCode:selectedProd.category.categoryCode,
       color:selectedProd.category.color,
       size:selectedProd.category.size,
       type:selectedProd.category.type,
       quality:selectedProd.category.quality

      }],
    };

    setLoading(true);

    try {
      const res = await qrService.AddQrCode(user.accessToken, payload);
      toast.success(res.data?.message || 'Qr generated');
      setQrData(res);
    } catch (error) {
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!qrData || (Array.isArray(qrData) && qrData.length === 0)) {
      toast.error(
        'No QR data available to print. Please create QR codes first.',
      );
      return;
    }

    if (!selectedProduction) {
      toast.error('Please select a production number first');
      return;
    }

    setIsPrinting(true);

    try {
      const qrCodes = Array.isArray(qrData)
        ? qrData
            .filter((prod) => prod._id === selectedProduction)
            .flatMap((prod) => prod.qrCodes || [])
        : qrData?.qrCodes || [];

      if (qrCodes.length === 0) {
        toast.error('No QR codes found for the selected production');
        setIsPrinting(false);
        return;
      }

      const doc = new jsPDF();
      let x = 10,
        y = 20;
      const qrSize = 40;
      const gap = 10;

      qrCodes.forEach((qr, index) => {
        if (qr.qrData) {
          doc.addImage(qr.qrData, 'PNG', x, y, qrSize, qrSize);
        }

        doc.setFontSize(10);
        doc.text(`Article: ${qr.article || 'N/A'}`, x, y + qrSize + 5);
        doc.text(`Size: ${qr.size || 'N/A'}`, x, y + qrSize + 10);
        doc.text(`Color: ${qr.color || 'N/A'}`, x, y + qrSize + 15);
        doc.text(`Type: ${qr.type || 'N/A'}`, x, y + qrSize + 20);
        doc.text(
          `Date: ${new Date().toLocaleDateString()}`,
          x,
          y + qrSize + 25,
        );

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

      doc.save('qr-codes.pdf');
      toast.success('QR codes downloaded');
    } catch (error) {
      console.error('Print error:', error);
      toast.error('An error occurred while generating QR codes PDF');
    } finally {
      setIsPrinting(false);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await warehouseService.getAllWarehouse(user.accessToken);
      setWarehouseData(res.data.data || []);
    })();
  }, [user.accessToken]);

  const handleProductionSelect = (selectedOption) => {
    setSelectedProduction(selectedOption?.value || '');
    const selected = productData.find(
      (item) => item._id === selectedOption?.value,
    );
    if (selected) {
      setFactory(selected.factory?.name || '');
      setArticleNo(selected.article || '');
      setQuantities({ [selected._id]: selected.productionQuantity || 1 });
      setCategoryName(selected.category.categoryCode || '');
      setQuality(selected.category.quality || '');
      setType(selected.category.type || '');
      setColor(selected.category.color || '');
      setSize(selected.category.size || '');

      setOpen(false);
    } else {
      setFactory('');
      setArticleNo('');
      setQuantities({});
    }
  };

  const handleRemove = (prodId) => {
    if (selectedProduction === prodId) {
      setSelectedProduction('');
      setFactory('');
      setArticleNo('');
    }
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[prodId];
      return updated;
    });
  };

  const handleReset = () => {
    setSelectedProduction('');
    setFactory('');
    setArticleNo('');
    setWarehouse('');
    setQuantities({});
    setQrData([]);
  };

  const hasQrData =
    qrData &&
    (Array.isArray(qrData)
      ? qrData.some((prod) => prod.qrCodes && prod.qrCodes.length > 0)
      : qrData.qrCodes && qrData.qrCodes.length > 0);

  return loading ? (
    <Loader />
  ) : (
    <div className="max-w-6xl mx-auto py-5 px-4 bg-gray-50 min-h-screen">
      <h2 className="text-lg font-semibold mb-4">Create QR Code</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* ✅ Search + Infinite Scroll Dropdown for Production No. */}
        <div className="relative text-left">
          <label className="block mb-1 text-sm text-gray-700">
            Production No.
          </label>
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="w-full px-4 py-2 border rounded-lg bg-white text-gray-700 cursor-pointer focus:ring-2 focus:ring-blue-500"
          >
            {selectedProduction
              ? productData.find((p) => p._id === selectedProduction)
                  ?.productionNo
              : '-- Select Production No --'}
          </div>

          {open && (
            <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border-b outline-none"
              />

              <div onScroll={handleScroll} className="max-h-48 overflow-y-auto">
                {productData.map((prod) => (
                  <div
                    key={prod._id}
                    onClick={() => handleProductionSelect({ value: prod._id })}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {prod.productionNo}
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

        <div>
          <label className="block mb-1 text-sm text-gray-700">Article No</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={articleNo}
            readOnly
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700">Category</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={categoryName}
            readOnly
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700">Color</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={color}
            readOnly
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700">Type</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={type}
            readOnly
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700">Size</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={size}
            readOnly
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700">Quality</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={quality}
            readOnly
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700">Factory</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={factory}
            readOnly
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700">Warehouse</label>
          <select
            onChange={(e) => setWarehouse(e.target.value)}
            value={warehouse}
            className="w-full p-2 rounded border border-gray-300"
          >
            <option value="">Choose Warehouse</option>
            {warehouseData.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rest of your code remains unchanged */}
      <div className="bg-white shadow rounded p-6">
        <div className="mb-4 font-medium">
          Select Products For Creating QR Code
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Article</th>
              <th className="py-2 ">Quality</th>
              <th className="py-2">Size</th>
              <th className="py-2">Color</th>
              <th className="py-2">Soft/Hard</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {productData
              .filter((item) => item._id === selectedProduction)
              .map((prod) => (
                <tr className="border-b last:border-0" key={prod._id}>
                  <td className="py-2">{prod.article}</td>
                  <td className="py-2 text-center">{prod?.category?.quality}</td>

                  <td className="py-2 text-center">{prod?.category?.size}</td>
                  <td className="py-2 text-center">{prod.category?.color}</td>
                  <td className="py-2 text-center">{prod.category?.type}</td>
                  <td className="py-2 flex items-center justify-center gap-2">
                    <span className="w-6 text-center">
                      {quantities[prod._id] || 1}
                    </span>
                  </td>
                  <td className="py-2 text-center">
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleRemove(prod._id)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleReset}
            className="bg-gray-200 rounded px-4 py-2 hover:bg-gray-300"
          >
            Reset
          </button>
          <button
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            onClick={handleCreateQr}
          >
            Create QR Code
          </button>
          <button
            onClick={handlePrint}
            disabled={!hasQrData || !selectedProduction || isPrinting}
            className={`rounded px-4 py-2 ${
              !hasQrData || !selectedProduction || isPrinting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isPrinting ? 'Printing...' : 'Print QR Codes'}
          </button>
        </div>
      </div>

      {hasQrData && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
          <p className="text-green-700 text-sm">
            ✅ QR codes generated and ready to print
          </p>
        </div>
      )}

      <div
        ref={printRef}
        className="grid gap-4 mt-6"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        }}
      >
        {(Array.isArray(qrData)
          ? qrData
              .filter((prod) => prod._id === selectedProduction)
              .flatMap((prod) => prod.qrCodes || [])
          : qrData?.qrCodes || []
        ).map((qr, i) => (
          <div
            key={qr.qrId || i}
            className="qr-label border rounded p-2 flex flex-col items-center text-center text-xs break-inside-avoid"
          >
            <div className="font-semibold mb-1">Article {qr.article}</div>
            <img
              src={qr.qrData}
              alt={`QR Code ${i + 1}`}
              className="w-20 h-20 mb-2"
              onError={(e) => {
                console.error('QR image failed to load:', e);
                e.target.style.display = 'none';
              }}
            />
            <div>QR ID: {qr.qrId.split('-')[1]}</div>
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Size: {qr.size}</div>
            <div>Color: {qr.color}</div>
            <div>Soft/Hard: {qr.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateQRCode;
