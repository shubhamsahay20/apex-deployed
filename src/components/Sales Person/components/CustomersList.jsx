import React, { useEffect, useState } from 'react';
// import { FiEye, FiTrash2 } from "react-icons/fi";
// import { PiPencilSimpleLineBold } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import authService from '../../../api/auth.service';
import { useAuth } from '../../../Context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../../../common/Loader'; // ✅ Import Loader

const CustomersList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false); // ✅ Loader state

  useEffect(() => {
    (async () => {
      setLoading(true); // ✅ Show loader while fetching
      try {
        const res = await authService.getAllCustomers(user.accessToken, currentPage, 9);
        setCustomers(res.data?.data || []);
        setTotalPages(res.data?.pagination?.totalPages || 1);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching customers");
      } finally {
        setLoading(false); // ✅ Hide loader after fetching
      }
    })();
  }, [user.accessToken, currentPage]);

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    customers.splice(deleteIndex, 1);
    setCustomers([...customers]); // ✅ Update state after deletion
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const handleView = (customer) => {
    navigate('/customer-details', { state: customer });
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      {loading ? (
        <Loader /> // ✅ Show Loader instead of table while loading
      ) : (
        <>
          {/* Top Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
            <h2 className="text-xl font-semibold">Customers List</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Search customer"
                className="border px-3 py-1.5 rounded-md text-sm w-48 focus:outline-none"
              />
              <button className="border px-3 py-1.5 rounded text-sm">Print</button>
              <button className="border px-3 py-1.5 rounded text-sm">Export</button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-md">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Phone</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Address</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((entry, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3">{entry.name}</td>
                    <td className="p-3">{entry.phone}</td>
                    <td className="p-3">{entry.email}</td>
                    <td className="p-3">
                      {entry.location.map((item) => item.address).join(", ")} ,{" "}
                      {entry.location.map((item) => item.city.toUpperCase()).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded bg-gray-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded bg-gray-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm px-4">
          <div className="relative bg-white rounded-lg shadow-md w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              Delete Confirmation
            </h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this customer?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm"
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

export default CustomersList;
