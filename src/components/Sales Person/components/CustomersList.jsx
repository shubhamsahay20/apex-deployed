import React, { useEffect, useState } from 'react';
// import { FiEye, FiTrash2 } from "react-icons/fi";
// import { PiPencilSimpleLineBold } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import authService from '../../../api/auth.service';
import { useAuth } from '../../../Context/AuthContext';
import { toast } from 'react-toastify';

// const data = [
//   {
//     name: 'Solit IT Sol',
//     phone: '990 32 64 970',
//     email: 'any1994@gmail.com',
//     country: 'Andhra-Pradesh',
//     city: 'Visakhapatnam',
//     orderQuantity: 32,
//   },
//   {
//     name: 'Angela Carter',
//     phone: '990 32 64 970',
//     email: 'any1994@gmail.com',
//     country: 'Andhra-Pradesh',
//     city: 'Vijayawada',
//     orderQuantity: 232,
//   },

//   {
//     name: 'Jhon Ronan',
//     phone: '990 32 64 970',
//     email: 'jeny19@gmail.com',
//     country: 'Andhra-Pradesh',
//     city: 'Visakhapatnam',
//     orderQuantity: 32,
//   },
// ];

const CustomersList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const res = await authService.getAllCustomers(user.accessToken,currentPage,9);
        setCustomers(res.data?.data);
        setTotalPages(res.data?.pagination?.totalPages);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    })();
  }, [user.accessToken, currentPage]);

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    data.splice(deleteIndex, 1);
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const handleView = (customer) => {
    navigate('/customer-details', { state: customer });
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold">Customers List</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search customer"
            className="border px-3 py-1.5 rounded-md text-sm w-48 focus:outline-none"
          />
          {/* <button className="border px-3 py-1.5 rounded text-sm">Today</button> */}
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
              {/* <th className="p-3 font-medium">Order Quantity</th> */}
              {/* <th className="p-3 font-medium text-center">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {customers.map((entry, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-3">{entry.name}</td>
                <td className="p-3">{entry.phone}</td>
                <td className="p-3">{entry.email}</td>
                <td className="p-3">
                  {entry.location.map((item) => item.address)} ,{' '}
                  {entry.location.map((item) => item.city.toUpperCase())}
                </td>
                {/* <td className="p-3">{entry.orderQuantity}</td> */}
                {/* <td className="p-3 flex justify-center gap-3">
                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={() => handleView(entry)}
                  >
                    <FiEye size={16} />
                  </button>
                  <button
                    className="text-blue-600 hover:text-red-800"
                    onClick={() => handleDelete(index)}
                  >
                      <PiPencilSimpleLineBold size={16}/>
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(index)}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <button onClick={()=>setCurrentPage((prev)=>prev-1)} disabled={currentPage===1} className="px-3 py-1 border rounded bg-gray-50">
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={()=>setCurrentPage((prev)=>prev+1)} disabled={currentPage===totalPages} className="px-3 py-1 border rounded bg-gray-50">Next</button>
      </div>

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
