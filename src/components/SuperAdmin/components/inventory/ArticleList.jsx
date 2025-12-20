import React, { useEffect, useState } from 'react';
import InventoryCards from './InventoryCards';
import { exportArticlesDataPDF } from '../../../../utils/PdfModel';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';
import salesService from '../../../../api/sales.service';
import reportService from '../../../../api/report.service';
import { useDebounce } from '../../../../hooks/useDebounce';
import Loader from '../../../../common/Loader';
import ImageModal from '../../../../utils/ImageModal';

const ArticleList = () => {
  const { user } = useAuth();
  const [articledetails, setArticledetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inventoryData, setInventoryData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const debounceValue = useDebounce(searchQuery, 500);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // ✅ Fetch Inventory Summary
  useEffect(() => {
    const fetchInventorySummary = async () => {
      try {
        setLoading(true);
        const res = await reportService.inventorySummary(user.accessToken);
        setInventoryData(res?.data || {});
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch inventory data');
      } finally {
        setLoading(false);
      }
    };
    if (user?.accessToken) fetchInventorySummary();
  }, [user]);

  //  Fetch Article List
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await salesService.getAllArtical(
          user.accessToken,
          currentPage,
          10,
          debounceValue
        );
        setArticledetails(res?.data || []);
        setTotalPages(res?.pagination?.totalPages || 1);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };
    if (user?.accessToken) {
      if (debounceValue.length === 0 || debounceValue.length >= 2) fetchData();
    }
  }, [user, currentPage, debounceValue]);

  //  Inventory Summary Cards
  const cards = [
    {
      label: 'Available Stock',
      value: inventoryData?.totalStock || 0,
      color: 'text-blue-600',
    },
    {
      label: 'Approved Quantity',
      value: inventoryData?.totalQuantity || 0,
      color: 'text-indigo-600',
    },
    {
      label: 'Total Orders',
      value: inventoryData?.totalOrder || 0,
      color: 'text-orange-500',
    },
    {
      label: 'Delivered Stock',
      value: inventoryData?.deliverables || 0,
      color: 'text-green-600',
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
          Inventory Overview
        </h2>
      </div>

      {/* Summary Cards */}
      <InventoryCards cards={cards} />

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        {/* Search and Export */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <h3 className="text-lg font-semibold text-gray-700">
            Articles List
          </h3>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search article, code, or order"
              className="w-full md:w-64 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              onClick={() => exportArticlesDataPDF(articledetails)}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-md border border-gray-100">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-gray-700">
                <th className="p-3 text-left font-medium">Image</th>
                <th className="p-3 text-left font-medium">Article</th>
                <th className="p-3 text-left font-medium">Category Code</th>
                <th className="p-3 text-left font-medium">Size</th>
                <th className="p-3 text-left font-medium">Color</th>
                <th className="p-3 text-left font-medium">Soft/Hard</th>
                <th className="p-3 text-left font-medium">Quality</th>
                <th className="p-3 text-center font-medium">Production Qty</th>
                <th className="p-3 text-center font-medium">Warehouse Qty</th>
                <th className="p-3 text-center font-medium">Order Qty</th>
                <th className="p-3 text-center font-medium">Cart Qty</th>
                <th className="p-3 text-center font-medium">Total Qty</th>
              </tr>
            </thead>

            <tbody>
              {articledetails?.length > 0 ? (
                articledetails.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-t ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="p-3">
                      <img
                        src={row.image}
                        alt={row.article}
                        onClick={() => setModalImage(row.image)}
                        className="w-12 h-12 object-cover rounded-full border border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                      />
                    </td>
                    <td className="p-3 font-semibold text-gray-800">
                      {row.article}
                    </td>
                    <td className="p-3 text-gray-700">{row.categoryCode}</td>
                    <td className="p-3 text-gray-700">{row.size}</td>
                    <td className="p-3 text-gray-700">{row.color}</td>
                    <td className="p-3 text-gray-700">{row.type}</td>
                    <td className="p-3 text-gray-700">{row.quality}</td>
                    <td className="p-3 text-center text-blue-600 font-medium">
                      {row.Production_Qty}
                    </td>
                    <td className="p-3 text-center text-blue-600 font-medium">
                      {row.Warehouse_Qty}
                    </td>
                    <td className="p-3 text-center text-blue-600 font-medium">
                      {row.Order_Qty}
                    </td>
                    <td className="p-3 text-center text-blue-600 font-medium">
                      {row.Cart_Qty}
                    </td>
                    <td className="p-3 text-center text-green-600 font-semibold">
                      {row.Total_Available}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-8 text-gray-500 italic"
                  >
                    No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="text-sm border border-gray-300 px-4 py-1.5 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>

          <span className="text-xs text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="text-sm border border-gray-300 px-4 py-1.5 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {modalImage && (
        <ImageModal imageUrl={modalImage} onClose={() => setModalImage(null)} />
      )}
    </div>
  );
};

export default ArticleList;
