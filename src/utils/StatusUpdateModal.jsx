import React, { useEffect, useState } from 'react';

const StatusUpdateModal = ({ isOpen, onClose, row, onConfirm }) => {
  console.log('Got open!!!!');

  const [newStatus, setNewStatus] = useState(row?.deliveryStatus);

  useEffect(() => {
  if (row) {
    setNewStatus(row.deliveryStatus);
  }
}, [row]);

    console.log('value', row?.deliveryStatus);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-96 p-6">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Update Delivery Status
        </h2>

        {/* Dropdown */}
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="w-full border rounded-lg p-2 mb-6"
        >
          <option value="PENDING">Pending</option>
          <option value="HOLD">Hold</option>
          <option value="DELIVERED">Delivered</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(row, newStatus)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
