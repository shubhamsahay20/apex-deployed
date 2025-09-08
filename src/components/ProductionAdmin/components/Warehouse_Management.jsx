import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiFilter, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: 'Factory 46', phone: '990 32 64 970', email: 'any1994@gmail.com', country: 'United States', city: 'Los Angeles' },
  { name: 'Factory 88', phone: '990 32 64 970', email: 'any1994@gmail.com', country: 'United States', city: 'New York' },
  { name: 'Warehouse 01', phone: '990 32 64 970', email: 'any1994@gmail.com', country: 'Canada', city: 'Ottawa' },
  { name: 'Warehouse 02', phone: '990 32 64 970', email: 'any1994@gmail.com', country: 'Canada', city: 'Ottawa' },
  { name: 'Warehouse 03', phone: '990 32 64 970', email: 'any1994@gmail.com', country: 'Canada', city: 'Ottawa' },
  { name: 'Warehouse 04', phone: '990 32 64 970', email: 'any1994@gmail.com', country: 'Canada', city: 'Ottawa' },
];

const Warehouse_Management = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', zip: '', location: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    setShowModal(false);
    setForm({ name: '', phone: '', email: '', zip: '', location: '' });
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    data.splice(deleteIndex, 1);
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const handleView = (warehouse) => {
    navigate('/warehouse-details', { state: warehouse });
  };

  return (
    <div className="p-6 bg-white rounded-md shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h2 className="text-lg font-semibold">Warehouse/Factory Management</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto mt-4 sm:mt-0">
          
            <button className="border px-4 py-1.5 rounded flex items-center gap-2 text-sm"> <FiFilter size={16} />Filters</button>
          
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-md">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Country</th>
              <th className="p-3 font-medium">City</th>
              <th className="p-3 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-3">{entry.name}</td>
                <td className="p-3">{entry.phone}</td>
                <td className="p-3">{entry.email}</td>
                <td className="p-3">{entry.country}</td>
                <td className="p-3">{entry.city}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button className="text-blue-600 hover:text-blue-800" onClick={() => handleView(entry)}>
                    <FiEdit size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(index)}>
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <button className="px-3 py-1 border rounded bg-gray-50">Previous</button>
        <span>Page 1 of 10</span>
        <button className="px-3 py-1 border rounded bg-gray-50">Next</button>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm px-4">
          <div className="relative bg-white rounded-lg shadow-md w-full max-w-2xl p-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4">Create Warehouse/Factory</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Factory/Warehouse Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Zip Code</label>
                <input
                  type="text"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Location</label>
                <select
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Location</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="New York">New York</option>
                  <option value="Ottawa">Ottawa</option>
                  <option value="Toronto">Toronto</option>
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-sm">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-sm">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm px-4">
          <div className="relative bg-white rounded-lg shadow-md w-full max-w-md p-6">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Confirmation</h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this warehouse/factory?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border rounded text-sm">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouse_Management;
