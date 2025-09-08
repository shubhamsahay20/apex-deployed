import React, { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import authService from '../../../../api/auth.service';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../Context/AuthContext';

// ⬇️ Import PDF utils
import { exportProductionPDF, printProductionPDF } from "../../../../utils/PdfModel";

const CustomerDetailsView = () => {
  const [orderHistory, setOrderHistory] = useState([
    {
      id: 1,
      article: '301',
      quantity: 83,
      size: '6X10',
      color: 'BK',
      type: 'S/H',
      status: 'Delivered',
    },
    {
      id: 2,
      article: '348',
      quantity: 56,
      size: '9X10',
      color: 'BK',
      type: 'S/H',
      status: 'Delivered',
    },
    {
      id: 3,
      article: '369',
      quantity: 30,
      size: '6X9',
      color: 'BK',
      type: 'H',
      status: 'Cancelled',
    },
    {
      id: 4,
      article: '442',
      quantity: 45,
      size: '6X11',
      color: 'BK',
      type: 'S/H',
      status: 'Delivered',
    },
  ]);

  const { id } = useParams();
  const { user } = useAuth();
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    (async () => {
      const res = await authService.getCustomerById(user.accessToken, id);
      setCustomer(res.data.data);
    })();
  }, []);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setOrderHistory(orderHistory.filter((item) => item.id !== deleteId));
    setShowConfirm(false);
    setDeleteId(null);
  };

  // 👉 Format data for PDF export/print
  const handleExportPDF = () => {
    const headers = [["Article", "Quantity", "Size", "Color", "Type", "Status"]];
    const rows = orderHistory.map(item => [
      item.article,
      item.quantity,
      item.size,
      item.color,
      item.type,
      item.status
    ]);
    exportProductionPDF(rows, headers, "Customer_OrderHistory.pdf");
  };

  const handlePrintPDF = () => {
    const headers = [["Article", "Quantity", "Size", "Color", "Type", "Status"]];
    const rows = orderHistory.map(item => [
      item.article,
      item.quantity,
      item.size,
      item.color,
      item.type,
      item.status
    ]);
    printProductionPDF(rows, headers);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold text-gray-800">
          Customer Details
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={handlePrintPDF}
            className="bg-white border border-gray-300 text-sm px-4 py-1.5 rounded shadow-sm"
          >
            Print
          </button>
          <button 
            onClick={handleExportPDF}
            className="bg-white border border-gray-300 text-sm px-4 py-1.5 rounded shadow-sm"
          >
            PDF
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md border text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="font-medium">Customer Name:</span>{' '}
            <span className="text-gray-500">{customer?.name}</span>
          </div>
          <div>
            <span className="font-medium">Phone Number:</span>{' '}
            <span className="text-gray-500">{customer?.phone}</span>
          </div>
          <div>
            <span className="font-medium">Email Address:</span>{' '}
            <span className="text-gray-500">{customer?.email}</span>
          </div>
          <div>
            <span className="font-medium">Country:</span>{' '}
            <span className="text-gray-500">
              {customer?.location?.length > 0
                ? customer.location[0].country
                : '-'}
            </span>
          </div>
          <div>
            <span className="font-medium">City:</span>{' '}
            <span className="text-gray-500">
              {customer?.location?.length > 0 ? customer.location[0].city : '-'}
            </span>
          </div>
          <div>
            <span className="font-medium">Sales person:</span>{' '}
            <span className="text-gray-500">
              {customer?.salesPersonId?.name}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-md">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-sm font-semibold text-gray-700">Order History</h3>
          <button 
            onClick={handlePrintPDF}
            className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-700"
          >
            Print
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Article</th>
              <th className="text-left">Quantity Ordered</th>
              <th className="text-left">Size</th>
              <th className="text-left">Color</th>
              <th className="text-left">Soft/Hard</th>
              <th className="text-left">Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-3">{item.article}</td>
                <td>{item.quantity}</td>
                <td>{item.size}</td>
                <td>{item.color}</td>
                <td>{item.type}</td>
                <td
                  className={
                    item.status === 'Delivered'
                      ? 'text-green-600 font-medium'
                      : item.status === 'Cancelled'
                      ? 'text-red-500 font-medium'
                      : ''
                  }
                >
                  {item.status}
                </td>
                <td className="text-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-80 text-center">
            <div className="text-red-500 mb-4">
              <FiTrash2
                size={32}
                className="mx-auto bg-red-100 p-2 rounded-full"
              />
            </div>
            <h4 className="text-lg font-semibold mb-2">Delete Order</h4>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this order?
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-2 rounded border border-gray-300 text-sm"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="w-full py-2 rounded bg-red-500 text-white text-sm hover:bg-red-600"
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

export default CustomerDetailsView;
