import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import {
  exportProductionPDF,
  printProductionPDF,
} from '../../../../utils/PdfModel';
import { useAuth } from '../../../../Context/AuthContext';
import { useFetchStock } from '../../../../hooks/useFetchStock';
import Loader from '../../../../common/Loader';
import { useDebounce } from '../../../../hooks/useDebounce';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';

const InternalTransfer = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const debounceValue = useDebounce(searchQuery, 500);
  const { loading, stock, totalPages, currentPage, setCurrentPage } =
    useFetchStock(user.accessToken, debounceValue);
  const [expanded, setExpanded] = useState({});

  if (loading) return <Loader />;
  if (!stock?.length) return <p>No stock available</p>;

  // Group rows by productionNo + articles
  const groupedData = stock.reduce((acc, row) => {
    const key = `${row.productionNo}-${row.articles}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  return (
    <div className=" space-y-6">
      <div className="bg-white rounded shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Internal Transfers{' '}
          </h2>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => (
                  setSearchQuery(e.target.value), setCurrentPage(1)
                )}
                placeholder="Search Warehouse Name"
                className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm"
              />
              <FaSearch className="absolute top-2.5 left-2.5 text-gray-400 text-sm" />
            </div>

            <button
              onClick={() => printProductionPDF(stock)}
              className="border px-4 py-1.5 rounded-md text-sm text-gray-700 border-gray-300"
            >
              Print
            </button>

            <button
              onClick={() => exportProductionPDF(stock)}
              className="border px-4 py-1.5 rounded-md text-sm text-gray-700 border-gray-300"
            >
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-3 py-2">Production No</th>
                <th className="px-3 py-2">Article</th>
                <th className="px-3 py-2">Quantity</th>
                <th className="px-3 py-2">From Warehouse</th>
                <th className="px-3 py-2">To Warehouse</th>
                {/* <th className="px-3 py-2 text-center">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedData).map(([key, rows]) => {
                const isExpanded = expanded[key];
                return (
                  <React.Fragment key={key}>
                    <tr
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() =>
                        rows.length > 1 &&
                        setExpanded((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }))
                      }
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        {rows[0].productionNo}{' '}
                        {rows.length > 1 && (
                          <span className="ml-1  inline-block align-middle">
                            {isExpanded ? (
                              <RiArrowDropUpLine size={25} />
                            ) : (
                              <RiArrowDropDownLine size={25} />
                            )}
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-2 whitespace-nowrap">
                        {rows[0].articles}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {rows[0].quantity}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {rows[0].fromWarehouse}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {rows[0].toWarehouse}
                      </td>
                     
                    </tr>

                    {isExpanded &&
                      rows.slice(1).map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-t hover:bg-gray-50 bg-gray-100"
                        >
                          <td className="px-3 py-2 whitespace-nowrap">
                            {row.productionNo}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {row.articles}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {row.quantity}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {row.fromWarehouse}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {row.toWarehouse}
                          </td>
                          
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-1 border rounded"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Add Internal Transfers{' '}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  placeholder="Date"
                  className="border rounded px-3 py-2 text-sm w-full"
                />
                <input
                  type="text"
                  placeholder="Article"
                  className="border rounded px-3 py-2 text-sm w-full"
                />
                <input
                  type="text"
                  placeholder="Sale Reference"
                  className="border rounded px-3 py-2 text-sm w-full"
                />
                <input
                  type="text"
                  placeholder="Customer"
                  className="border rounded px-3 py-2 text-sm w-full"
                />
                <input
                  type="text"
                  placeholder="Warehouse"
                  className="border rounded px-3 py-2 text-sm w-full"
                />
                <select className="border rounded px-3 py-2 text-sm w-full">
                  <option>Status</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Packed">Packed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
              >
                Add Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalTransfer;
