import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import cartService from '../../../api/cart.service';
import { useAuth } from '../../../Context/AuthContext';
import CartModal from '../../../utils/CartModal';
import DeleteModal from '../../../utils/DeleteModal';
import Loader from '../../../common/Loader';
import { RxCross2 } from 'react-icons/rx';

const TotalCart = () => {
  const { user } = useAuth();

  const [salesCarts, setSalesCarts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedCart, setSelectedCart] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // 🔹 Fetch ALL sales persons carts
 useEffect(() => {
  const fetchTotalCart = async () => {
    setLoading(true);
    try {
      const res = await cartService.getTotalCart(user.accessToken);

      // ✅ FIXED RESPONSE MAPPING
      const orders = res?.data?.sellorder || [];

      // 🔹 Group orders by sales person (createdBy)
      const grouped = Object.values(
        orders.reduce((acc, order) => {
          const spId = order.createdBy?._id;

          if (!spId) return acc;

          if (!acc[spId]) {
            acc[spId] = {
              salesPerson: order.createdBy,
              orders: [],
            };
          }

          acc[spId].orders.push(order);
          return acc;
        }, {})
      );

      setSalesCarts(grouped);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load carts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchTotalCart();
}, [user.accessToken]);


  const handleProceed = (order) => {
    setSelectedCart(order);
    setCartOpen(true);
  };

  const confirmOrder = async () => {
    try {
      const res = await cartService.proceedToOrder(
        user.accessToken,
        selectedCart._id
      );

      toast.success(res.message || 'Order placed');

      // 🔹 Remove order from UI
      setSalesCarts((prev) =>
        prev.map((sp) => ({
          ...sp,
          orders: sp.orders.filter((o) => o._id !== selectedCart._id),
        }))
      );

      setCartOpen(false);
      setSelectedCart(null);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleDelete = (orderId) => {
    setDeleteId(orderId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await cartService.DeleteOrder(user.accessToken, deleteId);

      toast.success(res.message || 'Order deleted');

      setSalesCarts((prev) =>
        prev.map((sp) => ({
          ...sp,
          orders: sp.orders.filter((o) => o._id !== deleteId),
        }))
      );

      setDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Total Sales Cart
        </h1>

        {salesCarts.length === 0 ? (
          <div className="text-center py-20 text-gray-600 font-semibold">
            🛒 No carts available
          </div>
        ) : (
          salesCarts.map((salesPerson) => (
            <div key={salesPerson.salesPerson._id} className="mb-12">
              {/* 🔹 Sales Person Header */}
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-l-4 border-blue-500 pl-3">
                Sales Person: {salesPerson.salesPerson.name}
              </h2>

              {/* 🔹 Orders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {salesPerson.orders
                  .filter(
                    (o) =>
                      (o.items && o.items.length > 0) ||
                      (o.WishList && o.WishList.length > 0)
                  )
                  .map((order) => (
                    <div
                      key={order._id}
                      className="bg-white rounded-2xl shadow-md p-6 border flex flex-col"
                    >
                      {/* Customer + Delete */}
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-semibold text-gray-800">
                          {order.customer?.name}
                        </p>
                        <RxCross2
                          className="cursor-pointer"
                          onClick={() => handleDelete(order._id)}
                        />
                      </div>

                      {/* Address */}
                      {order.Location?.length > 0 && (
                        <div className="mb-4 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                          <p className="text-xs text-orange-600 font-medium mb-1">
                            📍 Address
                          </p>
                          <p className="text-sm text-gray-700">
                            {order.Location[0].address},{' '}
                            {order.Location[0].city},{' '}
                            {order.Location[0].state}
                          </p>
                        </div>
                      )}

                      {/* Items */}
                      <div className="space-y-3 mb-4">
                        {[...(order.items || []), ...(order.WishList || [])].map(
                          (itm, i) => (
                            <div
                              key={i}
                              className="border rounded-lg p-3 bg-gray-50"
                            >
                              {itm.image?.length > 0 && (
                                <img
                                  src={itm.image[0]}
                                  alt={itm.article}
                                  className="w-24 h-24 mx-auto mb-2 rounded"
                                />
                              )}

                              <p className="text-sm font-medium">
                                Article:{' '}
                                <span className="text-blue-600">
                                  {itm.article}
                                </span>
                              </p>

                              <p className="text-sm">
                                Qty:{' '}
                                <span className="font-semibold">
                                  {itm.quantity}
                                </span>
                              </p>
                            </div>
                          )
                        )}
                      </div>

                      <button
                        onClick={() => handleProceed(order)}
                        className="mt-auto w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        Proceed To Order
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <DeleteModal
        name="Order"
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        name={selectedCart?.customer?.name}
        onConfirm={confirmOrder}
      />
    </div>
  );
};

export default TotalCart;
