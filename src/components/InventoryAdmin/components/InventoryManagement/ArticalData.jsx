import React, { useEffect, useState } from 'react';
import { exportProductionPDF } from '../../../../utils/PdfModel';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';
import salesService from '../../../../api/sales.service';
import { useDebounce } from '../../../../hooks/useDebounce';
import { FaSearch, FaFileExport } from 'react-icons/fa';

const ArticalData = () => {
  const { user } = useAuth();
  const [articledetails, setArticledetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceValue = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await salesService.getAllArtical(
          user.accessToken,
          currentPage,
          10,
          debounceValue
        );
        setTotalPages(res?.pagination?.totalPages);
        setArticledetails(res?.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    };

    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      fetchData();
    }
  }, [user, currentPage, debounceValue]);

  return (
    <div className="space-y-6 bg-gray-100 min-h-screen p-4 sm:p-6">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Products List</h3>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute top-3 left-3 text-gray-400 text-sm" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search by Article or Order"
                className="pl-9 pr-3 py-2 border rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Export Button */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => exportProductionPDF(articledetails)}
            >
              <FaFileExport size={14} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600">
                <th className="p-3 font-medium">Article</th>
                <th className="p-3 font-medium">Category Code</th>
                <th className="p-3 font-medium">Size</th>
                <th className="p-3 font-medium">Color</th>
                <th className="p-3 font-medium">Soft/Hard</th>
                <th className="p-3 font-medium">Quality</th>
                <th className="p-3 font-medium">Production Qty</th>
                <th className="p-3 font-medium">Warehouse Qty</th>
                <th className="p-3 font-medium">Total Qty</th>
              </tr>
            </thead>
            <tbody>
              {articledetails.length > 0 ? (
                articledetails.map((row, idx) => {
                  const isLowStock =
                    row.Production_Qty < 10 &&
                    row.Warehouse_Qty < 10 &&
                    row.Total_Available < 10;

                  return (
                    <tr
                      key={idx}
                      className={`border-t hover:bg-gray-50 ${
                        isLowStock ? 'bg-red-100' : ''
                      }`}
                    >
                      <td className="p-3 font-medium text-gray-900">
                        {row.article}
                      </td>
                      <td className="p-3">{row.categoryCode}</td>
                      <td className="p-3">{row.size}</td>
                      <td className="p-3">{row.color}</td>
                      <td className="p-3">{row.type}</td>
                      <td className="p-3">{row.quality}</td>
                      <td className="p-3 text-blue-600 font-semibold">
                        {row.Production_Qty}
                      </td>
                      <td className="p-3 text-blue-600 font-semibold">
                        {row.Warehouse_Qty}
                      </td>
                      <td className="p-3 text-blue-600 font-semibold">
                        {row.Total_Available}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center text-gray-500 py-6 font-medium"
                  >
                    No Articles Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            Previous
          </button>
          <span className="text-xs text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticalData;
