import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { FiEdit, FiEye, FiTrash2 } from 'react-icons/fi';

import {
  exportProductionPDF,
  printProductionPDF,
} from '../../../../utils/PdfModel';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';
import salesService from '../../../../api/sales.service';
import StatusUpdateModal from '../../../../utils/StatusUpdateModal';
import inventoryService from '../../../../api/inventory.service';
import { useDebounce } from '../../../../hooks/useDebounce';
import DeleteModal from '../../../../utils/DeleteModal';

const DeliveryOrder = () => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderDelete, setOrderDelete] = useState(null);

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
      const res = await salesService.getAllSalesOrder(
        user.accessToken,
        currentPage,
        10,
        debounceValue,
      );

      const sales = res.sellorder;
      const result = sales.filter((e) => e.items && e.items.length > 0);

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
  }, [user.accessToken, currentPage, debounceValue]);

  const confirmDelete = async () => {
    try {
      const res = await salesService.deleteOrder(user.accessToken, orderDelete);
      console.log('res delete', res);
      await getSalesOrder();
      setDeleteModalOpen(false);
      toast.success(res.message || 'Order Successfully Deleted');
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

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
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Sale Order</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Account Status</th>
                <th className="px-3 py-2">Inventory Status</th>
                <th className="px-3 py-2">Warehouse Status</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {salesDetails.map((row, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(row.updatedAt).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.salesOrderNo}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.customer?.name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium 
    ${
      row.accountSectionApproval === 'APPROVED'
        ? 'bg-green-100 text-green-700'
        : row.accountSectionApproval === 'REJECTED'
        ? 'bg-red-100 text-red-700'
        : 'bg-gray-100 text-gray-700'
    }`}
                    >
                      {row.accountSectionApproval}
                    </span>
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium 
    ${
      row.inventoryManagerApproval === 'APPROVED'
        ? 'bg-green-100 text-green-700'
        : row.inventoryManagerApproval === 'REJECTED'
        ? 'bg-red-100 text-red-700'
        : 'bg-gray-100 text-gray-700'
    }`}
                    >
                      {row.inventoryManagerApproval}
                    </span>
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.ScannedByWarehouseManager}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.accountSectionApproval === 'APPROVED' &&
                    row.inventoryManagerApproval === 'APPROVED' &&
                    row.ScannedByWarehouseManager === 'SCANNED' ? (
                      <span
                        className={`font-medium flex items-center gap-2 ${
                          row.deliveryStatus === 'DELIVERED'
                            ? 'text-green-600'
                            : row.deliveryStatus === 'HOLD'
                            ? 'text-blue-600'
                            : row.deliveryStatus === 'PENDING'
                            ? 'text-red-600'
                            : ''
                        }`}
                      >
                        {row.deliveryStatus}

                        {(row.deliveryStatus === 'PENDING' ||
                          row.deliveryStatus === 'HOLD') && (
                          <button
                            onClick={() => handleUpdateStatus(row)}
                            className="ml-2 p-1 rounded-full hover:bg-gray-100"
                            title="Update Status"
                          >
                            <FiEdit />
                          </button>
                        )}
                      </span>
                    ) : null}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap flex items-center gap-3 justify-center">
                    <FiEye
                      className="text-green-600 cursor-pointer"
                      onClick={() => handleView(row)}
                    />
                    <FiTrash2
                      onClick={() => (
                        setDeleteModalOpen(true),
                        console.log('row details', row),
                        setOrderDelete(row._id)
                      )}
                      className="text-red-500 cursor-pointer"
                    />
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

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        row={selectedRow}
        onConfirm={async (row, newStatus) => {
          try {
            const res = await inventoryService.updateDeliveryStatus(
              user.accessToken,
              row._id,
              { deliveryStatus: newStatus },
            );
            toast.success(res?.message);
            await getSalesOrder();
            console.log('getSalesOrder hhiiih', getSalesOrder);
          } catch (error) {
            toast.error(error.response?.data?.message);
          }
          setIsStatusModalOpen(false);
        }}
      />

      <DeleteModal
        name={'Order'}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default DeliveryOrder;
