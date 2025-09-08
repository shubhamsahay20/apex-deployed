import React, { useEffect, useRef, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import productionService from '../../../api/production.service';
import { useAuth } from '../../../Context/AuthContext';
import warehouseService from '../../../api/warehouse.service';
import qrService from '../../../api/qr.service';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import Loader from '../../../common/Loader';

const CreateQRCode = () => {
  const { user } = useAuth();
  const [productData, setProductData] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [selectedProduction, setSelectedProduction] = useState('');
  const [factory, setFactory] = useState('');
  const [articleNo, setArticleNo] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [quantities, setQuantities] = useState({});
  const [qrData, setQrData] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [loading,setLoading] = useState(false)

  const printRef = useRef();

  const handleCreateQr = async () => {
    const selectedProd = productData.find((p) => p._id === selectedProduction);
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
      productIds: [selectedProd.article],
    };

     setLoading(true); 

    try {
      const res = await qrService.AddQrCode(user.accessToken, payload);
      toast.success(res.data?.message || 'Qr generated');
      setQrData(res);
    } catch (error) {
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false)
    }
  };

  // ✅ Updated print function to download QR codes instead of table
  const handlePrint = async () => {
    if (!qrData || (Array.isArray(qrData) && qrData.length === 0)) {
      toast.error('No QR data available to print. Please create QR codes first.');
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
      let x = 10, y = 20; 
      const qrSize = 40; // QR image size
      const gap = 10;    // Gap between labels

      qrCodes.forEach((qr, index) => {
        // Add QR Image
        if (qr.qrData) {
          doc.addImage(qr.qrData, 'PNG', x, y, qrSize, qrSize);
        }

        // Add text below QR
        doc.setFontSize(10);
        doc.text(`Article: ${qr.article || 'N/A'}`, x, y + qrSize + 5);
        doc.text(`Size: ${qr.size || 'N/A'}`, x, y + qrSize + 10);
        doc.text(`Color: ${qr.color || 'N/A'}`, x, y + qrSize + 15);
        doc.text(`Type: ${qr.type || 'N/A'}`, x, y + qrSize + 20);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, x, y + qrSize + 25);

        // Layout: 3 per row
        x += qrSize + gap + 30;
        if ((index + 1) % 3 === 0) {
          x = 10;
          y += qrSize + 40;
          if (y > 250) { // Add new page if page is full
            doc.addPage();
            x = 10;
            y = 20;
          }
        }
      });

      // ✅ Download PDF instead of opening print dialog
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
      const res = await productionService.getAllProduction(user.accessToken);
      setProductData(res.data?.products || []);
    })();
  }, [user.accessToken]);

  useEffect(() => {
    (async () => {
      const res = await warehouseService.getAllWarehouse(user.accessToken);
      setWarehouseData(res.data.data.warehouses || []);
    })();
  }, [user.accessToken]);

  const handleProductionChange = (e) => {
    const id = e.target.value;
    setSelectedProduction(id);

    const selected = productData.find((item) => item._id === id);
    if (selected) {
      setFactory(selected.factory?.name || '');
      setArticleNo(selected.article || '');
      setQuantities({ [selected._id]: selected.productionQuantity || 1 });
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
    setQrData([]); // Clear QR data on reset
  };

  const hasQrData = qrData && (
    Array.isArray(qrData) 
      ? qrData.some(prod => prod.qrCodes && prod.qrCodes.length > 0)
      : qrData.qrCodes && qrData.qrCodes.length > 0
  );

  return loading ? (<Loader/>):(
    <div className="max-w-6xl mx-auto py-5 px-4 bg-gray-50 min-h-screen">
      <h2 className="text-lg font-semibold mb-4">Create QR Code</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 text-sm text-gray-700">
            Production No.
          </label>
          <select
            className="w-full p-2 rounded border border-gray-300"
            value={selectedProduction}
            onChange={handleProductionChange}
          >
            <option value="">Choose Production No.</option>
            {productData.map((item) => (
              <option key={item._id} value={item._id}>
                {item.productionNo}
              </option>
            ))}
          </select>
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

      <div className="bg-white shadow rounded p-6">
        <div className="mb-4 font-medium">
          Select Products For Creating QR Code
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Article</th>
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
                  <td className="py-2 text-center">{prod.category[0]?.size}</td>
                  <td className="py-2 text-center">{prod.category[0]?.color}</td>
                  <td className="py-2 text-center">{prod.category[0]?.type}</td>
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
            <div>QR ID: {(qr.qrId).split('-')[1]}</div>
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
