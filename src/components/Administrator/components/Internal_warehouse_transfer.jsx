import React, { useEffect, useRef, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../../Context/AuthContext';
import factoryService from '../../../api/factory.service';
import warehouseService from '../../../api/warehouse.service';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import Loader from '../../../common/Loader';
import stockService from '../../../api/stock.service';
import qrService from '../../../api/qr.service';

const Internal_warehouse_transfer = () => {
  const { user } = useAuth();

  const [warehouseData, setWarehouseData] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState('');
  const [factoryName, setFactoryName] = useState('');
  const [factory, setFactory] = useState({ id: '', name: '' });
const [fromWarehouse, setFromWarehouse] = useState(''); // warehouseId
  const [toWarehouse, setToWarehouse] = useState(''); // warehouseId
 const [productionNo, setProductionNo] = useState('');
  const [article, setArticle] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [availableQty, setAvailableQty] = useState(0);
  const [pnNumber, setPnNumber] = useState([]);
 const [category, setCategory] = useState({
    categoryCode: '',
    color: '',
    size: '',
    type: '',
    quality: '',
  });

  const [qrData, setQrData] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [loading, setLoading] = useState(false);

  const printRef = useRef();

  // Fetch stock data
  useEffect(() => {
    (async () => {
      const prores = await stockService.getStockByPn(user.accessToken);
      const allStockData = prores.items.map((item) => ({
        productionNo: item.productionNo,
        article: item.article,
        categoryCode: item.categoryCode,
        size: item.size,
        type: item.type,
        color: item.color,
        quality: item.quality,
        factory: item.factory,
        warehouseData: item.warehouseData,
      }));

      const uniquePn = Array.from(
        new Map(allStockData.map((item) => [item.productionNo, item])).values(),
      );
      setPnNumber(uniquePn);
    })();
  }, [user.accessToken]);

  // Fetch warehouses
  useEffect(() => {
    (async () => {
      const res = await warehouseService.getAllWarehouse(user.accessToken);
      setWarehouseData(res.data.data || []);
    })();
  }, [user.accessToken]);

  const handleCreateQr = async () => {
    if (
      !selectedFactory ||
      !fromWarehouse ||
      !toWarehouse ||
      !productionNo ||
      !article ||
      !quantity
    ) {
      toast.error('Please fill all fields');
      return;
    }

    const selectedPN = pnNumber.find((pn) => pn.productionNo === productionNo);
    const selectedWarehouse = selectedPN?.warehouseData.find(
      (w) => w.warehouseId === fromWarehouse,
    );

    const payload = {
      factory: factory.id,
      factory_name: factoryName,
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
      const res = await qrService.internalStockTransfer(
        user.accessToken,
        payload,
      );
      toast.success(res.data?.message || 'QR generated successfully!');

      console.log('res is after qr', res.data);

      setQrData(res.data);
      setSelectedFactory('');
      setFactoryName('');
      setFactory({ id: '', name: '' });
      setFromWarehouse('');
      setToWarehouse('');
      setProductionNo('');
      setArticle('');
      setAvailableQty(0);
      setQuantity(0);
      setCategory({
        categoryCode: '',
        color: '',
        size: '',
        type: '',
        quality: '',
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error generating QR');
    }
  };

  const handleReset = () => {
    setSelectedFactory('');
    setFactoryName('');
    setFactory({ id: '', name: '' });
    setFromWarehouse('');
    setToWarehouse('');
    setProductionNo('');
    setArticle('');
    setAvailableQty(0);
    setQuantity(0);
    setCategory({
      categoryCode: '',
      color: '',
      size: '',
      type: '',
      quality: '',
    });
    setQrData([]);
  };

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
    } catch (error) {
      toast.error('Error printing QR');
    } finally {
      setIsPrinting(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="max-w-6xl mx-auto py-5 px-4 bg-gray-50 min-h-screen">
      <h2 className="text-lg font-semibold mb-4">Create Transfer QR Code</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Production No */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">
            Production No
          </label>
          <select
            className="w-full p-2 rounded border border-gray-300"
            value={productionNo}
            onChange={(e) => {
              const value = e.target.value;
              const selected = pnNumber.find((pn) => pn.productionNo === value);
              setProductionNo(value);

              // ✅ Reset warehouse + qty every time Production No changes
              setFromWarehouse('');
              setQuantity(0);
              setAvailableQty(0);

              if (selected) {
                setArticle(selected.article || '');
                setCategory({
                  categoryCode: selected.categoryCode || '',
                  color: selected.color || '',
                  size: selected.size || '',
                  type: selected.type || '',
                  quality: selected.quality || '',
                });

                // ✅ Factory still comes from Production No
                setSelectedFactory(selected.factory?._id || '');
                setFactoryName(selected.factory?.name || '');
                setFactory({
                  id: selected.factory?._id || '',
                  name: selected.factory?.name || '',
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
                setSelectedFactory('');
                setFactoryName('');
                setFactory({ id: '', name: '' });
              }
            }}
          >
            <option value="">Select Production No</option>
            {pnNumber.map((pn) => (
              <option key={pn.productionNo} value={pn.productionNo}>
                {pn.productionNo}
              </option>
            ))}
          </select>
        </div>

        {/* From Warehouse */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">
            From Warehouse
          </label>
          <select
            className="w-full p-2 rounded border border-gray-300"
            value={fromWarehouse}
            onChange={(e) => {
              const value = e.target.value;
              setFromWarehouse(value);

              const selectedPN = pnNumber.find(
                (pn) => pn.productionNo === productionNo,
              );
              if (selectedPN) {
                const wh = selectedPN.warehouseData.find(
                  (w) => w.warehouseId === value,
                );
                if (wh) {
                  setAvailableQty(wh.availableQuantity || 0);
                  setQuantity(wh.availableQuantity > 0 ? 1 : 0); // ✅ reset quantity
                  setCategory({
                    categoryCode:
                      wh.categoryCode || selectedPN.categoryCode || '',
                    color: wh.color || selectedPN.color || '',
                    size: wh.size || selectedPN.size || '',
                    type: wh.type || selectedPN.type || '',
                    quality: wh.quality || selectedPN.quality || '',
                  });
                  setArticle(selectedPN.article || '');
                } else {
                  setAvailableQty(0);
                  setQuantity(0);
                }
              }
            }}
          >
            <option value="">Select Warehouse</option>
            {pnNumber
              .find((pn) => pn.productionNo === productionNo)
              ?.warehouseData.map((w) => (
                <option key={w.warehouseId} value={w.warehouseId}>
                  {w.warehouseName} (Available: {w.availableQuantity})
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

        {/* Category Fields */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">
            Category Code
          </label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={category.categoryCode}
            readOnly
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
      {qrData?.createdInDestination?.length > 0 && (
        <div
          ref={printRef}
          className="grid gap-4 mt-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          }}
        >
          {qrData.createdInDestination.map((qr, i) => {
            // Find matching stockCreated to get article

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
                    alt={`QR Code ${i + 1}`}
                    className="w-20 h-20 mb-2"
                    onError={(e) => {
                      console.error('QR image failed to load:', e);

                      e.target.style.display = 'none';
                    }}
                  />
                )}

                {qr.qrId && <div>QR ID: {qr.qrId.split('-')[1]}</div>}

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

export default Internal_warehouse_transfer;
