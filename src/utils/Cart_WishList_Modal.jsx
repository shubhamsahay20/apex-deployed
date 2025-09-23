// ConfirmModal.jsx
export default function Cart_WishList({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onCancel}
          >
            WishList
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={onConfirm}
          >
            Cart
          </button>
        </div>
      </div>
    </div>
  );
}
