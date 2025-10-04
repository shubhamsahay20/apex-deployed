import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import factoryService from '../../../../api/factory.service';
import { useAuth } from '../../../../Context/AuthContext';
import {
  exportProductionPDF,
  printProductionPDF,
} from '../../../../utils/PdfModel';
import { useDebounce } from '../../../../hooks/useDebounce';
import { FaSearch } from 'react-icons/fa';
import Loader from '../../../../common/Loader';

const FactoryDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [factoryDetails, setFactoryDetails] = useState({});
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceValue = useDebounce(searchQuery, 500);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setFactoryDetails((prev) => ({
      ...prev,
      aggregatedStock: prev.aggregatedStock.filter(
        (_, idx) => idx !== deleteIndex,
      ),
    }));
    setDeleteIndex(null);
  };

  useEffect(() => {
    const fetchFactoryDetails = async () => {
      setLoading(true);
      try {
        const res = await factoryService.getFactoryStockId(
          user.accessToken,
          id,
          currentPage,
          10,
          debounceValue,
        );
        console.log('response', res.data);

        setFactoryDetails(res.data);
        setTotalPages(res.data?.pagination?.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      fetchFactoryDetails();
    }
  }, [id, currentPage, debounceValue, user.accessToken]);

  const handleExportPDF = () => {
    const headers = [['Article', 'Size', 'Color', 'Type', 'Quantity']];
    const rows = factoryDetails?.aggregatedStock?.map((item) => [
      item.article,
      item.size,
      item.color,
      item.type,
      item.totalQuantity,
    ]);
    exportProductionPDF(rows, headers, 'Stock_Availability.pdf');
  };

  const handlePrintPDF = () => {
    const headers = [['Article', 'Size', 'Color', 'Type', 'Quantity']];
    const rows = factoryDetails?.aggregatedStock?.map((item) => [
      item.article,
      item.size,
      item.color,
      item.type,
      item.totalQuantity,
    ]);
    printProductionPDF(rows, headers);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-[#F5F6FA] min-h-screen space-y-6">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Factory Details
        </h2>
        <hr className="mb-6" />
        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
          <div className="flex flex-col">
            <span className="text-gray-600 font-medium">Factory Name</span>
            <span className="text-gray-900 font-semibold">
              {factoryDetails?.factory?.factoryName || '-'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 font-medium">Address</span>
            <span className="text-gray-900 font-semibold">
              {factoryDetails?.factory?.factoryLocation?.address || '-'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 font-medium">State</span>
            <span className="text-gray-900 font-semibold">
              {factoryDetails?.factory?.factoryLocation?.state || '-'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 font-medium">City</span>
            <span className="text-gray-900 font-semibold">
              {factoryDetails?.factory?.factoryLocation?.city || '-'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 font-medium">Country</span>
            <span className="text-gray-900 font-semibold">
              {factoryDetails?.factory?.factoryLocation?.country || '-'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 font-medium">Pincode</span>
            <span className="text-gray-900 font-semibold">
              {factoryDetails?.factory?.factoryLocation?.pincode || '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-[#1F2937]">
            Stock Availability Details
          </h3>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => (
                setSearchQuery(e.target.value), setCurrentPage(1)
              )}
              placeholder="Search Article"
              className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm"
            />
            <FaSearch className="absolute top-2.5 left-2.5 text-gray-400 text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#F9FAFB] text-[#6B7280]">
              <tr>
                <th className="p-3 font-normal">Article</th>
                <th className="p-3 font-normal">Size</th>
                <th className="p-3 font-normal">Color</th>
                <th className="p-3 font-normal">Soft/Hard</th>
                <th className="p-3 font-normal">Total Quantity</th>
                <th className="p-3 font-normal">Dispatch Quantity</th>
                <th className="p-3 font-normal">Available Quantity</th>
              </tr>
            </thead>
            <tbody className="text-[#1F2937]">
              {factoryDetails?.aggregatedStock?.map((item, index) => (
                <tr key={index} className="border-t hover:bg-[#F9FAFB]">
                  <td className="p-3">{item.article}</td>
                  <td className="p-3">{item.size}</td>
                  <td className="p-3">{item.color}</td>
                  <td className="p-3">{item.type}</td>
                  <td className="p-3">{item.totalQuantity}</td>
                  <td className="p-3">{item.dispatchStock}</td>
                  <td className="p-3">{item.AvailableQuantity}</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-400">
                    No stock data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative animate-fade-in">
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
