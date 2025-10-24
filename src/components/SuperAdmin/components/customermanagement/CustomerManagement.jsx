import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { PiPencilSimpleLineBold } from 'react-icons/pi';
import { toast } from 'react-toastify';
import authService from '../../../../api/auth.service';
import { useAuth } from '../../../../Context/AuthContext';
import DeleteModal from '../../../../utils/DeleteModal';
import Loader from '../../../../common/Loader'; // ✅ Import Loader

// ✅ Import PDF utils
import {
  exportProductionPDF,
  printProductionPDF,
} from '../../../../utils/PdfModel';
import { useDebounce } from '../../../../hooks/useDebounce';

const CustomerManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectId, setSelectId] = useState(null);

  const [loading, setLoading] = useState(false); // ✅ For API fetching
  const [deleteLoading, setDeleteLoading] = useState(false); // ✅ For delete process

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceValue = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await authService.getAllCustomers(
          user.accessToken,
          currentPage,
          10,
          debounceValue,
        );
        setCustomers(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      fetchCustomers();
    }
  }, [currentPage, user.accessToken, debounceValue]);

  const handleDelete = (id) => {
    setSelectId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    if (!selectId) return;
    try {
      await authService.DeleteCustomer(user.accessToken, selectId);
      setCustomers((prev) => prev.filter((item) => item._id !== selectId));
      toast.success('Customer deleted successfully');
      setShowDeleteModal(false);
      setSelectId(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error deleting Customer');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ✅ Show loader when fetching customers */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded shadow p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Customer List
            </h2>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => (
                    setSearchQuery(e.target.value), setCurrentPage(1)
                  )}
                  placeholder="Search Customer Name"
                  className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm"
                />
                <FaSearch className="absolute top-2.5 left-2.5 text-gray-400 text-sm" />
              </div>

              <button
                onClick={() => navigate('/customer/add-new-customer')}
                className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
              >
                Add Customer
              </button>

              <button
                onClick={() => printProductionPDF(customers)}
                className="border px-4 py-1.5 rounded-md text-sm text-gray-700 border-gray-300"
              >
                Print
              </button>

              <button
                onClick={() => exportProductionPDF(customers)}
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
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Sales Person</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((row, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap">{row.name}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.phone}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.salesPersonId?.name}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.email}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.location.map((item) => item.city).join(' ,')}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap flex items-center gap-3 justify-center">
                      <FiEye
                        className="text-green-600 cursor-pointer"
                        onClick={() =>
                          navigate(`/customer/${row._id}/view-customer`)
                        }
                      />
                      <PiPencilSimpleLineBold
                        className="text-green-600 cursor-pointer"
                        onClick={() =>
                          navigate(`/customer/${row._id}/edit-customer`)
                        }
                      />
                      <FiTrash2
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(row._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="text-sm border px-4 py-1.5 rounded"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="text-sm border px-4 py-1.5 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <DeleteModal
        name="Customer"
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onClose={() => setShowDeleteModal(false)}
        loading={deleteLoading} // ✅ If you want to disable confirm button while deleting
      />
    </div>
  );
};

export default CustomerManagement;
