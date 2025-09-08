import React from "react";

const ApproveModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-96 p-6">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Approve this action?
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Are you sure you want to approve? You can’t undo this action.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveModal;
