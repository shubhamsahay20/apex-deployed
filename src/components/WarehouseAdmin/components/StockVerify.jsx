import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { FiEdit, FiEye, FiTrash2 } from 'react-icons/fi';

import {
  exportProductionPDF,
  printProductionPDF,
} from '../../../utils/PdfModel';
import { toast } from 'react-toastify';

import { useDebounce } from '../../../hooks/useDebounce';
import { useAuth } from '../../../Context/AuthContext';
import warehouseService from '../../../api/warehouse.service';

const StockVerify = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceValue = useDebounce(searchQuery, 500);

  const handleView = (row) => {
    navigate('/inventory/delivery-details', { state: row });
  };

  const [salesDetails, setSalesDetails] = useState([]);
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleUpdateStatus = (row) => {
    setSelectedRow(row);
    setIsStatusModalOpen(true);
  };

  const getSalesOrder = async () => {
    try {
      const res = await warehouseService.getOrderByWarehouse(
        user.accessToken,
        currentPage,
        10,
        debounceValue,
      );

      console.log('warehouse data', res.data.data);

      const result = res.data.data;

      setSalesDetails(result);
      setTotalPages(res?.pagination.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      getSalesOrder();
    }
  }, [user, currentPage, debounceValue]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Delivery Orders
          </h2>
          <div className="flex gap-2 items-center">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => (
                  setSearchQuery(e.target.value), setCurrentPage(1)
                )}
                placeholder="Search Article, order"
                className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm"
              />
              <FaSearch className="absolute top-2.5 left-2.5 text-gray-400 text-sm" />
            </div>

            {/* Print Button */}
            <button
              onClick={() => printProductionPDF(salesDetails)}
              className="border px-4 py-1.5 rounded-md text-sm text-gray-700 border-gray-300"
            >
              Print
            </button>

            {/* Export Button */}
            <button
              onClick={() => exportProductionPDF(salesDetails)}
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
                <th className="px-3 py-2">Article No</th>
                <th className="px-3 py-2">Sale Order</th>
                <th className="px-3 py-2">Warehouse</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Quantity</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {salesDetails.map((row, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">{row.article}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.salesOrderNo}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.warehouse.name}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.customer?.name}
                  </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                    {row.quantity}
                  </td>

                    <td className="px-3 py-2 whitespace-nowrap">
                    {row.ScanByorder}
                  </td>


                  <td className="px-3 py-2 whitespace-nowrap flex items-center gap-3 justify-center">
                    <FiEye
                      className="text-green-600 cursor-pointer"
                      onClick={() => handleView(row)}
                    />
                    <FiTrash2 className="text-red-500 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
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
    </div>
  );
};

export default StockVerify;
