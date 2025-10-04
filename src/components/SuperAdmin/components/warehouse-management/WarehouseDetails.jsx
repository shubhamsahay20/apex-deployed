import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import warehouseService from '../../../../api/warehouse.service';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';

// ⬇️ import PDF utils
import {
  exportProductionPDF,
  printProductionPDF,
} from '../../../../utils/PdfModel';
import { useDebounce } from '../../../../hooks/useDebounce';
import { FaSearch } from 'react-icons/fa';
import Loader from '../../../../common/Loader';

const WarehouseDetails = () => {
  const { state } = useLocation();
  const [deleteIndex, setDeleteIndex] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceValue = useDebounce(searchQuery, 500);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      (async () => {
        setLoading(true)
        try {
          const res = await warehouseService.getWarehouseDetailsById(
            user.accessToken,
            id,
            currentPage,
            10,
            debounceValue,
          );
          console.log('warehouse response', res);

          setUserData(res);
          setTotalPage(res.pagination?.totalPages);
        } catch (error) {
          toast.error(error?.response?.data?.message);
        } finally{
          setLoading(false)
        }
      })();
    }
  }, [user.accessToken, debounceValue, currentPage, id]);

  const handleDelete = () => {
    setStockData((prev) => prev.filter((_, idx) => idx !== deleteIndex));
    setDeleteIndex(null);
  };

  // 👉 Format stock data for PDF/Print
  const handleExportPDF = () => {
    const headers = [['Article', 'Size', 'Color', 'Type', 'Quantity']];
    const rows = stockData.map((item) => [
      item.article,
      item.size,
      item.color,
      item.type,
      item.quantity,
    ]);
    exportProductionPDF(rows, headers, 'Warehouse_Stock.pdf');
  };

  const handlePrintPDF = () => {
    const headers = [['Article', 'Size', 'Color', 'Type', 'Quantity']];
    const rows = stockData.map((item) => [
      item.article,
      item.size,
      item.color,
      item.type,
      item.quantity,
    ]);
    printProductionPDF(rows, headers);
  };

    if(loading) return <Loader/>


  return (
    <div className="p-6 bg-[#F5F6FA] min-h-screen space-y-6">
      <div className="w-full bg-[#F5F6FA] py-8 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-6">
          {/* Warehouse Info Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg w-full space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-6">
              Warehouse Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Warehouse Name
                </p>
                <p className="text-base font-semibold">
                  {userData?.warehouse?.warehouseName || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800">Address</p>
                <p className="text-base font-semibold">
                  {userData?.warehouse?.warehouseLocation?.address || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800">State</p>
                <p className="text-base font-semibold">
                  {userData?.warehouse?.warehouseLocation?.state || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800">City</p>
                <p className="text-base font-semibold">
                  {userData?.warehouse?.warehouseLocation?.city || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800">Pincode</p>
                <p className="text-base font-semibold">
                  {userData?.warehouse?.warehouseLocation?.pincode || '-'}
                </p>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
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
              placeholder="Search Article "
              className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm"
            />
            <FaSearch className="absolute top-2.5 left-2.5 text-gray-400 text-sm" />{' '}
            <button
              onClick={handlePrintPDF}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded"
            >
              Print
            </button>
          </div>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-[#F9FAFB] text-[#6B7280]">
            <tr>
              <th className="p-3 font-normal">Article</th>
              <th className="p-3 font-normal">Category Code</th>
              <th className="p-3 font-normal">Size</th>
              <th className="p-3 font-normal">Color</th>
              <th className="p-3 font-normal">Soft/Hard</th>
              <th className="p-3 font-normal">Quantity Available</th>
              {/* <th className="p-3 font-normal">Action</th> */}
            </tr>
          </thead>
          <tbody className="text-[#1F2937]">
            {userData?.aggregatedStock?.map((item, index) => (
              <tr key={index} className="border-t hover:bg-[#F9FAFB]">
                <td className="p-3">{item.article}</td>
                <td className="p-3">{item.categoryCode}</td>
                <td className="p-3">{item.size}</td>
                <td className="p-3">{item.color}</td>
                <td className="p-3">{item.type}</td>
                <td className="p-3">{item.AvailableQuantity}</td>
                {/* <td
                  className="p-3 text-center text-red-500 cursor-pointer"
                  onClick={() => setDeleteIndex(index)}
                >
                  <FiTrash2 />
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded bg-gray-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPage}
          </span>
          <button
            disabled={currentPage === totalPage}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded bg-gray-50"
          >
            Next
          </button>
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

export default WarehouseDetails;
