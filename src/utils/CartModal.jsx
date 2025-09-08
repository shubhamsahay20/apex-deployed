import React from "react";
import { IoClose } from "react-icons/io5";

const ConfirmModal = ({ isOpen,name, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <IoClose className="text-2xl" />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
  Confirm {name ? `${name}'s` : "Customer"} Order
</h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to place {name} order?
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
