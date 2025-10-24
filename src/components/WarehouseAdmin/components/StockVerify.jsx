import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCarBattery, FaSearch } from 'react-icons/fa';
import { FiEdit, FiX, FiEye, FiTrash2 } from 'react-icons/fi';

import {
  exportStockVerifyPDF,
  printProductionPDF,
} from '../../../utils/PdfModel';
import { toast } from 'react-toastify';

import { useDebounce } from '../../../hooks/useDebounce';
import { useAuth } from '../../../Context/AuthContext';
import warehouseService from '../../../api/warehouse.service';
import stockService from '../../../api/stock.service';
import Loader from '../../../common/Loader';

const StockVerify = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debounceValue = useDebounce(searchQuery, 500);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [scanStatus, setScanStatus] = useState(null);
  const [scanQuantity, setScanQuantity] = useState('');
  const [salesDetails, setSalesDetails] = useState([]);
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [updateRow, setUpdateRow] = useState(null);
  const [loading, setLoading] = useState(false);

  // open modal on click
  const handleUpdateStatus = (data) => {
    const selecttabledata = salesDetails.find(
      (item) => item.orderId === data.orderId,
    );
    console.log('tabledata', selecttabledata);
    setUpdateRow(selecttabledata);
    setSelectedOrderId(selecttabledata.orderId);
    setIsStatusModalOpen(true);
  };
  console.log('order id,', selectedOrderId);

  const handleView = (row) => {
    navigate('/inventory/delivery-details', { state: row });
  };

  const getSalesOrder = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      getSalesOrder();
    }
  }, [user, currentPage, debounceValue]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (!scanStatus) {
        toast.error('Please Select Status');
      }
      const payload = {
        article: updateRow.article,
        warehouse: updateRow.warehouse._id,
        quantity: updateRow.quantity,
        ScanByorder: scanStatus,
      };
      console.log('payload', payload);
      const res = await stockService.MarkWarehouseScanned(
        user.accessToken,
        selectedOrderId,
        payload,
      );

      console.log('response', res);
      toast.success(res.data?.message);
      getSalesOrder();

      setIsStatusModalOpen(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log('error while  status updating', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

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
              onClick={() => exportStockVerifyPDF(salesDetails)}
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
                <th className="px-3 py-2">Action</th>
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
                    <button
                      className={`underline ${
                        row.ScanByorder === 'SCANNED'
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:text-blue-800'
                      }`}
                      onClick={() => {
                        if (row.ScanByorder !== 'SCANNED') {
                          handleUpdateStatus(row);
                        }
                      }}
                      disabled={row.ScanByorder === 'SCANNED'}
                    >
                      {row.ScanByorder || 'Click'}
                    </button>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <FiEye
                        onClick={(e) => {
                          navigate('/warehouse-management/view-stock', {
                            state: row,
                          });
                          // your eye logic
                        }}
                        className="text-green-600 w-4 h-4 cursor-pointer hover:scale-110 transition"
                      />
                      {/* <PiPencilSimpleLineBold
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           // your eye logic
                                         }}
                                         className="text-blue-500 w-4 h-4 cursor-pointer hover:scale-110 transition"
                                       /> */}
                      {/* <FiTrash2
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           // your eye logic
                                         }}
                                         className="text-red-600 w-4 h-4 cursor-pointer hover:scale-110 transition"
                                       /> */}
                    </div>
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
      {isStatusModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-4">Scan Details</h2>
              <FiX onClick={() => setIsStatusModalOpen(false)} />
            </div>

            {/* Status field */}
            <label className="block mb-2 text-sm font-medium">Status</label>
            <select
              value={scanStatus}
              onChange={(e) => setScanStatus(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            >
              <option value="">Please Update Status</option>
              <option value="SCANNED">SCANNED</option>
              <option value="UNSCANNED">UNSCANNED</option>
            </select>

            {/* Quantity field */}
            {/* <label className="block mb-2 text-sm font-medium">Quantity</label>
            <input
              type="number"
              value={scanQuantity}
              onChange={(e) => setScanQuantity(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            /> */}

            <div className="flex justify-end gap-3">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-white bg-blue-400 border rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockVerify;
