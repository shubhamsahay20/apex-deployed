import React from 'react';
import { IoTrashOutline } from 'react-icons/io5';

const DeleteModal = ({ name, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full h-[346px] max-w-sm flex flex-col justify-between rounded-md bg-white dark:bg-boxdark shadow-lg">
        {/* Top content */}
        <div className="p-10">
          {/* Icon in orange circle */}
          <div className="flex justify-center mt-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
              <IoTrashOutline className="text-3xl text-orange-500" />
            </div>
          </div>

          {/* Title and message */}
          <h2 className="mt-4 text-center text-lg font-semibold px-4 text-gray-700 dark:text-white">
            Cancel {name}
          </h2>
          <p className="mt-2 text-center text-sm px-4 text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this {name}?
          </p>
        </div>

        {/* Buttons at bottom */}
        <div className="">
          <div className="flex ">
             <button
              onClick={onClose}
              className="flex-1 font-semibold border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 font-semibold px-4 py-2 border border-gray-200 hover:bg-gray-100 text-red-700 hover:text-red-700"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
