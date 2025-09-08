import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import factoryService from '../../../../api/factory.service';
import { useAuth } from '../../../../Context/AuthContext';

// ⬇️ import PDF utils
import { exportProductionPDF, printProductionPDF } from "../../../../utils/PdfModel";

const FactoryDetails = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const { id } = useParams();

  const [factoryDetails, setFactoryDetails] = useState({});
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [stockData, setStockData] = useState([
    { article: '301', size: '6X10', color: 'BK', type: 'S/H', quantity: 183 },
    { article: '348', size: '9X10', color: 'BK', type: 'S/H', quantity: 256 },
    { article: '369', size: '6X9', color: 'BK', type: 'S/H', quantity: 430 },
    { article: '442', size: '6X11', color: 'BK', type: 'S', quantity: 245 },
    { article: '552', size: '9X11', color: 'BK', type: 'S/H', quantity: 446 },
  ]);

  const handleDelete = () => {
    setStockData((prev) => prev.filter((_, idx) => idx !== deleteIndex));
    setDeleteIndex(null);
  };

  useEffect(() => {
    (async () => {
      const res = await factoryService.getFactoryById(user.accessToken, id);
      setFactoryDetails(res.data.data);
    })();
  }, []);

  // 👉 Format the stock data for PDF
  const handleExportPDF = () => {
    const headers = [["Article", "Size", "Color", "Type", "Quantity"]];
    const rows = stockData.map(item => [
      item.article,
      item.size,
      item.color,
      item.type,
      item.quantity
    ]);
    exportProductionPDF(rows, headers, "Stock_Availability.pdf");
  };

  const handlePrintPDF = () => {
    const headers = [["Article", "Size", "Color", "Type", "Quantity"]];
    const rows = stockData.map(item => [
      item.article,
      item.size,
      item.color,
      item.type,
      item.quantity
    ]);
    printProductionPDF(rows, headers);
  };

  return (
    <div className="p-6 bg-[#F5F6FA] min-h-screen space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="text-sm text-[#1F2937] w-full max-w-xl space-y-2">
          <div className="grid grid-cols-2 gap-y-2">
            <p className="text-[#6B7280] font-medium">Factory Name</p>
            <p className="text-[#6B7280]">{factoryDetails?.name}</p>

            <p className="text-[#6B7280] font-medium">City</p>
            <p className="text-[#6B7280]">{factoryDetails?.location?.city}</p>

            <p className="text-[#6B7280] font-medium">State</p>
            <p className="text-[#6B7280]">{factoryDetails?.location?.state}</p>

            <p className="text-[#6B7280] font-medium">Country</p>
            <p className="text-[#6B7280]">{factoryDetails?.location?.country}</p>

            <p className="text-[#6B7280] font-medium">Zip Code</p>
            <p className="text-[#6B7280]">{factoryDetails?.location?.pincode}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrintPDF}
            className="px-4 py-1.5 border border-gray-300 rounded bg-white text-sm text-gray-700"
          >
            Print
          </button>
          <button 
            onClick={handleExportPDF}
            className="px-4 py-1.5 border border-gray-300 rounded bg-white text-sm text-gray-700"
          >
            PDF
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-[#1F2937]">
            Stock Availability Details
          </h3>
          <button 
            onClick={handlePrintPDF}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded"
          >
            Print
          </button>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-[#F9FAFB] text-[#6B7280]">
            <tr>
              <th className="p-3 font-normal">Article</th>
              <th className="p-3 font-normal">Size</th>
              <th className="p-3 font-normal">Color</th>
              <th className="p-3 font-normal">Soft/Hard</th>
              <th className="p-3 font-normal">Quantity Available</th>
              <th className="p-3 font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="text-[#1F2937]">
            {stockData.map((item, index) => (
              <tr key={index} className="border-t hover:bg-[#F9FAFB]">
                <td className="p-3">{item.article}</td>
                <td className="p-3">{item.size}</td>
                <td className="p-3">{item.color}</td>
                <td className="p-3">{item.type}</td>
                <td className="p-3">{item.quantity}</td>
                <td
                  className="p-3 text-center text-red-500 cursor-pointer"
                  onClick={() => setDeleteIndex(index)}
                >
                  <FiTrash2 />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <button className="px-3 py-1 border rounded bg-gray-50">
            Previous
          </button>
          <span>Page 1 of 10</span>
          <button className="px-3 py-1 border rounded bg-gray-50">Next</button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative animate-fade-in">
            {/* Close Icon */}
            <button
              onClick={() => setDeleteIndex(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Stock Item?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteIndex(null)}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactoryDetails;
