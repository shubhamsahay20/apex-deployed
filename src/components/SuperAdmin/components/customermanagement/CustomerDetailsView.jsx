import React, { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import authService from '../../../../api/auth.service';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../Context/AuthContext';

// ⬇️ Import PDF utils
import {
  exportProductionPDF,
  printProductionPDF,
} from '../../../../utils/PdfModel';
import { toast } from 'react-toastify';
import Loader from '../../../../common/Loader';

const CustomerDetailsView = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const { id } = useParams();
  const { user } = useAuth();
  const [customer, setCustomer] = useState({});
  const[loading,setLoading] = useState(false)

  useEffect(() => {
    (async () => {
     try {
      setLoading(true)
       const res = await authService.getCustomerById(user.accessToken, id);
       console.log('response of customer', res.data.data);
       setCustomer(res.data.data);
       setOrderHistory(res.data?.data?.orders);
     } catch (error) {
      toast.error(error.response?.data?.message)   
     }finally{
      setLoading(false)

     }
    })();
  }, []);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // const handleDeleteClick = (id) => {
  //   setDeleteId(id);
  //   setShowConfirm(true);
  // };

  const confirmDelete = () => {
    setOrderHistory(orderHistory.filter((item) => item.id !== deleteId));
    setShowConfirm(false);
    setDeleteId(null);
  };

  // 👉 Format data for PDF export/print
  const handleExportPDF = () => {
    const headers = [['Article', 'Quantity', 'Size', 'Color', 'Type', 'Status']];
    const rows = orderHistory.map((item) => [
      item.article,
      item.quantity,
      item.size,
      item.color,
      item.type,
      item.status,
    ]);
    exportProductionPDF(rows, headers, 'Customer_OrderHistory.pdf');
  };

  const handlePrintPDF = () => {
    const headers = [['Article', 'Quantity', 'Size', 'Color', 'Type', 'Status']];
    const rows = orderHistory.map((item) => [
      item.article,
      item.quantity,
      item.size,
      item.color,
      item.type,
      item.status,
    ]);
    printProductionPDF(rows, headers);
  };

  if(loading) return <Loader/>

  return (
    <div className="p-6 bg-[#F5F6FA] min-h-screen space-y-6">
      {/* Header */}
      <div className="w-full bg-[#F5F6FA] py-8 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-6">
          {/* Customer Info Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg w-full space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-6">
              Customer Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-800">Customer Name</p>
                <p className="text-base font-semibold">{customer?.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Phone Number</p>
                <p className="text-base font-semibold">{customer?.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Email Address</p>
                <p className="text-base font-semibold">{customer?.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Country</p>
                <p className="text-base font-semibold">
                  {customer?.location?.length > 0 ? customer.location[0].country : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">City</p>
                <p className="text-base font-semibold">
                  {customer?.location?.length > 0 ? customer.location[0].city : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Sales Person</p>
                <p className="text-base font-semibold">
                  {customer?.salesPersonId?.name || '-'}
                </p>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          
        </div>
      </div>

      {/* Order History Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-[#1F2937]">Order History</h3>
          <button
            onClick={handlePrintPDF}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded"
          >
            Print
          </button>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="bg-[#F9FAFB] text-[#6B7280]">
            <tr>
              <th className="p-3 font-normal">Article</th>
              <th className="p-3 font-normal">Category Code</th>
              <th className="p-3 font-normal">Quantity Ordered</th>
              <th className="p-3 font-normal">Size</th>
              <th className="p-3 font-normal">Color</th>
              <th className="p-3 font-normal">Soft/Hard</th>
              <th className="p-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="text-[#1F2937]">
            {orderHistory && orderHistory.length > 0 ? (
              orderHistory.map((item) => (
                <tr key={item.id} className="border-t hover:bg-[#F9FAFB]">
                  <td className="p-3">{item.items.map((i) => i.article)}</td>
                  <td className="p-3">{item.items.map((i) => i.categoryCode)}</td>
                  <td className="p-3">{item.items.map((i) => i.quantity)}</td>
                  <td className="p-3">{item.items.map((i) => i.size)}</td>
                  <td className="p-3">{item.items.map((i) => i.color)}</td>
                  <td className="p-3">{item.items.map((i) => i.type)}</td>
                  <td className="p-3">{item.inventoryManagerApproval}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-4 text-gray-500"
                >
                  No order history available for this customer
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative animate-fade-in">
            {/* Close Icon */}
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <div className="text-red-500 mb-4">
              <FiTrash2 size={32} className="mx-auto bg-red-100 p-2 rounded-full" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Delete Order</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
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

export default CustomerDetailsView;
