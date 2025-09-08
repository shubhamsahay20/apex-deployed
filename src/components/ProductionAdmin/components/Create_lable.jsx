import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const Create_label = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      article: '301',
      size: '6X10',
      color: 'BK',
      type: 'S/H',
      warehouse: 'Warehouse 01',
      stock: 183,
    },
    {
      id: 2,
      article: '348',
      size: '9X10',
      color: 'BK',
      type: 'S/H',
      warehouse: 'Warehouse 01',
      stock: 256,
    },
    {
      id: 3,
      article: '369',
      size: '6X9',
      color: 'BK',
      type: 'S',
      warehouse: 'Warehouse 01',
      stock: 430,
    },
    {
      id: 4,
      article: '442',
      size: '6X11',
      color: 'BK',
      type: 'S/H',
      warehouse: 'Warehouse 01',
      stock: 245,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleConfirmDelete = () => {
    setProducts((prev) => prev.filter((item) => item.id !== selectedId));
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Internal Transfer
        </h2>
        <div className="flex gap-2">
          <button className="border px-4 py-1.5 text-sm rounded hover:bg-gray-100">
            Print
          </button>
          <button className="border px-4 py-1.5 text-sm rounded hover:bg-gray-100">
            PDF
          </button>
        </div>
      </div>

      {/* Order Info */}
      <div className="bg-gray-100 p-4 rounded-md text-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Production</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Date</span>
            <span className="font-medium">24/05/2025</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Size</span>
            <span className="font-medium">6X10</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Article Number</span>
            <span className="font-medium">346</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Color</span>
            <span className="font-medium">BK</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Deliverable Quantity</span>
            <span className="font-medium">544</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Soft/Hard</span>
            <span className="font-medium">S/H</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Warehouse</span>
            <span className="font-medium">Warehouse 01</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Factory</span>
            <span className="font-medium">Factory 46</span>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white border rounded-md overflow-x-auto">
        <div className="flex justify-between items-center px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Products For Delivery
          </h3>
          <button className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-700">
            Print
          </button>
        </div>

        <table className="min-w-full text-sm border-t">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {[
                'Article',
                'Size',
                'Color',
                'Soft/Hard',
                'Warehouse',
                'Stock',
                'Action',
              ].map((head, idx) => (
                <th key={idx} className="px-4 py-2 text-left border-t border-b">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{prod.article}</td>
                <td className="px-4 py-2">{prod.size}</td>
                <td className="px-4 py-2">{prod.color}</td>
                <td className="px-4 py-2">{prod.type}</td>
                <td className="px-4 py-2">{prod.warehouse}</td>
                <td className="px-4 py-2">{prod.stock}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      setSelectedId(prod.id);
                      setShowModal(true);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-600 px-4 py-3 border-t">
          <button className="border px-3 py-1 rounded text-gray-500 hover:bg-gray-100">
            Previous
          </button>
          <span>Page 1 of 10</span>
          <button className="border px-3 py-1 rounded text-gray-500 hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white p-4 border rounded-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Logs</h3>
        {[1, 2].map((i) => (
          <div key={i} className="flex items-start gap-3 mb-4">
            <img
              src="https://ui-avatars.com/api/?name=John+Mathew"
              className="w-8 h-8 rounded-full"
              alt="avatar"
            />
            <div>
              <p className="text-sm font-medium">John Mathew</p>
              <p className="text-xs text-gray-500 mb-1">8:3{i} a.m</p>
              <p className="text-sm text-gray-600">
                {i === 2 ? (
                  <>
                    Dorem consectetur{' '}
                    <span className="text-blue-600 underline">
                      adipisicing elit.
                    </span>
                  </>
                ) : (
                  'Dorem ipsum dolor sit amet, consectetur elit.'
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <div className="mb-4">
              <div className="bg-red-100 inline-block p-3 rounded-full">
                <FaTrash className="text-red-500 text-xl" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Partially Cancel Delivery Order
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this item?
            </p>
            <div className="flex justify-center gap-4 border-t pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                No
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Create_label;
