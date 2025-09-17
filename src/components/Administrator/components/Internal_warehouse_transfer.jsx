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

  // keep both id + name for server + UI
  const [selectedFactory, setSelectedFactory] = useState(''); // id for payload
  const [factoryName, setFactoryName] = useState(''); // name for payload/UI
  const [factory, setFactory] = useState({ id: '', name: '' });
  const [warehouses, setWarehouse] = useState({ id: '', name: '' });

  const [fromWarehouse, setFromWarehouse] = useState(''); // id for payload
  const [toWarehouse, setToWarehouse] = useState(''); // id for payload

  const [productionNo, setProductionNo] = useState('');
  const [article, setArticle] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [availableQty, setAvailableQty] = useState(0); // ✅ cap for quantity
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

  // ✅ Create QR
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

    // Build the payload exactly like you want
    const payload = {
      factory: factory.id,
      factory_name: factoryName,
      fromWarehouse,
      toWarehouse,
      productionNo,
      article,
      quantity,
      category,
    };

    console.log('my payload', payload);

    setLoading(true);
    try {
      const res = await qrService.internalStockTransfer(
        user.accessToken,
        payload,
      );

      console.log('response after internal transfer', res);

      toast.success(res.data?.message || 'QR generated successfully!');
      setQrData(res.data); // store response to show QR codes
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error generating QR');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Print QR
  const handlePrint = async () => {
    if (!qrData || !qrData.qrCodes || qrData.qrCodes.length === 0) {
      toast.error('No QR data available to print.');
      return;
    }

    setIsPrinting(true);
    try {
      const doc = new jsPDF();
      let x = 10,
        y = 20;
      const qrSize = 40;
      const gap = 10;

      qrData.qrCodes.forEach((qr, index) => {
        if (qr.qrData) {
          doc.addImage(qr.qrData, 'PNG', x, y, qrSize, qrSize);
        }
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
      console.error(error);
      toast.error('Error printing QR');
    } finally {
      setIsPrinting(false);
    }
  };

  // ✅ Fetch Stock Data and extract unique Production Numbers (attach availableQuantity)
  useEffect(() => {
    (async () => {
      const prores = await stockService.getAllStock(user.accessToken);

      // Flatten with factory & warehouse & availableQuantity attached
      const allStockData = prores.stock.stock.flatMap((item) =>
        item.stockdata.map((stock) => ({
          ...stock,
          factory: item.factory,
          warehouse: item.warehouse,
          availableQuantity: item.availableQuantity ?? 0, // ✅ attach
        })),
      );

      // Deduplicate by productionNo (keep first occurrence)
      const uniquePn = Array.from(
        new Map(allStockData.map((item) => [item.productionNo, item])).values(),
      );

      setPnNumber(uniquePn);
    })();
  }, [user.accessToken]);

  // ✅ Fetch Warehouses
  useEffect(() => {
    (async () => {
      const res = await warehouseService.getAllWarehouse(user.accessToken);
      console.log("res warehouse",res.data.data);
      
      setWarehouseData(res.data.data || []);
    })();
  }, [user.accessToken]);

  const handleReset = () => {
    setSelectedFactory('');
    setFactoryName('');
    setFactory({ id: '', name: '' });

    setFromWarehouse('');
    setWarehouse({ id: '', name: '' });

    setToWarehouse('');
    setProductionNo('');
    setArticle('');
    setAvailableQty(0);
    setQuantity(1);

    setCategory({
      categoryCode: '',
      color: '',
      size: '',
      type: '',
      quality: '',
    });
    setQrData([]);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="max-w-6xl mx-auto py-5 px-4 bg-gray-50 min-h-screen">
      <h2 className="text-lg font-semibold mb-4">Create Transfer QR Code</h2>

      {/* Form Fields */}
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

              if (selected) {
                // Fill main details
                setArticle(selected.article || '');
                setCategory({
                  categoryCode: selected.categoryCode || '',
                  color: selected.color || '',
                  size: selected.size || '',
                  type: selected.type || '',
                  quality: selected.quality || '',
                });

                // ✅ available qty from parent
                const avail = Number(selected.availableQuantity || 0);
                setAvailableQty(avail);

                // default quantity within bounds
                setQuantity(avail > 0 ? Math.min(1, avail) : 0);

                // ✅ factory + warehouse (both id + name)
                setSelectedFactory(selected.factory?._id || '');
                setFactoryName(selected.factory?.name || '');
                setFactory({
                  id: selected.factory?._id || '',
                  name: selected.factory?.name || '',
                });

                // fromWarehouse id for payload, name for UI
                const fwId = selected.warehouse?._id || '';
                const fwName = selected.warehouse?.name || '';
                setFromWarehouse(fwId);
                setWarehouse({ id: fwId, name: fwName });
              } else {
                // clear if none
                setArticle('');
                setAvailableQty(0);
                setQuantity(0);
                setFactory({ id: '', name: '' });
                setSelectedFactory('');
                setFactoryName('');
                setWarehouse({ id: '', name: '' });
                setFromWarehouse('');
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
                disabled={w._id === warehouses.id} // prevent same as fromWarehouse
              >
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Factory (read-only, auto-filled) */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">Factory</label>
          <input
            type="text"
            className="w-full p-2 rounded border border-gray-300 bg-gray-100"
            value={factory.name}
            readOnly
            placeholder="Auto-filled from production no."
          />
        </div>

        {/* From Warehouse (read-only, auto-filled) */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">
            From Warehouse
          </label>
          <input
            className="w-full p-2 rounded border border-gray-300 bg-gray-100"
            value={warehouses.name}
            readOnly
            placeholder="Auto-filled from production no."
          />
        </div>

        {/* Article */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">Article</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={article}
            onChange={(e) => setArticle(e.target.value)}
          />
        </div>

        {/* Quantity with cap */}
        <div>
          <label className="block mb-1 text-sm text-gray-700">
            Quantity{' '}
            {availableQty > 0 && (
              <span className="text-xs text-gray-500">
                (Available: {availableQty})
              </span>
            )}
          </label>
          <input
            type="number"
            className="w-full p-2 rounded border border-gray-300"
            value={quantity}
            min={availableQty > 0 ? 1 : 0}
            max={availableQty}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (Number.isNaN(val)) return;

              if (availableQty <= 0) {
                setQuantity(0);
                toast.error('No available quantity.');
                return;
              }

              if (val < 1) {
                setQuantity(1);
                return;
              }

              if (val > availableQty) {
                setQuantity(availableQty);
                toast.error(`Quantity cannot exceed ${availableQty}`);
                return;
              }

              setQuantity(val);
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
            onChange={(e) =>
              setCategory({ ...category, categoryCode: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700">Color</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={category.color}
            onChange={(e) =>
              setCategory({ ...category, color: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700">Size</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={category.size}
            onChange={(e) => setCategory({ ...category, size: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700">Type</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={category.type}
            onChange={(e) => setCategory({ ...category, type: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700">Quality</label>
          <input
            className="w-full p-2 rounded border border-gray-300"
            value={category.quality}
            onChange={(e) =>
              setCategory({ ...category, quality: e.target.value })
            }
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
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          onClick={handleCreateQr}
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

      {/* QR Preview */}
      {/* QR Preview */}
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
