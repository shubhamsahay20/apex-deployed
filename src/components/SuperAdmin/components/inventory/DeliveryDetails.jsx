import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import cartService from '../../../../api/cart.service';
import { useAuth } from '../../../../Context/AuthContext';

const DeliveryDetails = () => {
  const [orders, setOrders] = useState({});
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const{user} = useAuth()

  const id = location.state?._id;
  useEffect(() => {
    const fetchOrders = async () => {
      console.log('hii');

      try {
        // 👇 replace with your actual API endpoint
        const res = await cartService.getSalesOrderById(user.accessToken,id);
        console.log("response which i am gettin",res);
        
        setOrders(res);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading sales orders details...
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>No sales orders found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FiArrowLeft
          className="text-gray-600 cursor-pointer"
          size={22}
          onClick={() => navigate(-1)}
        />
        <h2 className="text-xl font-semibold text-gray-800">
          Sales Order Details
        </h2>
      </div>

      {/* Orders */}
        <div key={orders._id} className="mb-10 bg-white shadow rounded-lg p-6">
          {/* Order Info */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Sales Order No: {orders.salesOrderNo}
            </h3>
            <p className="text-gray-600">Customer: {orders.customer?.name}</p>
            <p className="text-gray-600">
              Address: {orders.Location?.[0]?.address},{' '}
              {orders.Location?.[0]?.city}, {orders.Location?.[0]?.state},{' '}
              {orders.Location?.[0]?.country} - {orders.Location?.[0]?.pincode}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Account Approval:{' '}
              <span
                className={`${
                  orders.accountSectionApproval === 'APPROVED'
                    ? 'text-green-600'
                    : 'text-red-600'
                } font-medium`}
              >
                {orders.accountSectionApproval}
              </span>{' '}
              | Inventory Approval:{' '}
              <span
                className={`${
                  orders.inventoryManagerApproval === 'APPROVED'
                    ? 'text-green-600'
                    : 'text-red-600'
                } font-medium`}
              >
                {orders.inventoryManagerApproval}
              </span>
            </p>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Article No.</th>
                  <th className="px-4 py-2 text-left">Category Code</th>
                  <th className="px-4 py-2 text-left">Color</th>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Quality</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {orders.items.map((item, itemIndex) => (
                  <tr
                    key={itemIndex}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">{item.article}</td>
                    <td className="px-4 py-2">{item.categoryCode}</td>
                    <td className="px-4 py-2">{item.color}</td>
                    <td className="px-4 py-2">{item.size}</td>
                    <td className="px-4 py-2">{item.type}</td>
                    <td className="px-4 py-2">{item.quality}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default DeliveryDetails;
