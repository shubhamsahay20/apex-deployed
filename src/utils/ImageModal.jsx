import React from "react";
import { ImCross } from "react-icons/im";
const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed mt-20 bg-black bg-opacity-50 inset-0 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
      >
        <img
          src={imageUrl}
          alt="Large preview"
          className="max-w-[90vw] max-h-[80vh] rounded-lg object-contain shadow-lg"
        />
        <button
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
          onClick={onClose}
        >
          <ImCross />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
