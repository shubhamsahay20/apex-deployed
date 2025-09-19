import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import cartService from '../../../../api/cart.service';
import { useAuth } from '../../../../Context/AuthContext';
import CartModal from '../../../../utils/CartModal';
import { RxCross2 } from 'react-icons/rx';
import DeleteModal from '../../../../utils/DeleteModal';
import Loader from '../../../../common/Loader';

const Cart = () => {
  const { user } = useAuth();
  const [salesOrder, setSalesOrder] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [selectedCart, setSelectedCart] = useState(null);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        const res = await cartService.getOrderBySalesPerson(user.accessToken);
        console.log('get all order', res.data);
        setSalesOrder(res.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally {
        setLoading(false); 
      }
    };
    fetchData();
  }, [user.accessToken]);

  const handleSubmit = (item) => {
    setSelectedCart(item);
    setCartOpen(true);
  };

  const confirmOrder = async () => {
    try {
      if (!selectedCart) return;
      const id = selectedCart._id;
      const res = await cartService.proceedToOrder(user.accessToken, id);
      console.log('order deliver', res);

      // remove the order from UI after success
      setSalesOrder((prev) => prev.filter((o) => o._id !== id));

      toast.success(res.message || 'order delivered');
      setCartOpen(false);
      setSelectedCart(null);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleDelete = (order) => {
    console.log('hi', order._id);
    setDeleteId(order._id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await cartService.DeleteOrder(user.accessToken, deleteId);
      setSalesOrder((prev) => prev.filter((o) => o._id !== deleteId));

      console.log('delete res', res);
      toast.success(res.message || 'Order Deleted Successfully');
      setDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  if (loading) return <Loader />; 

 return (
  <div className="min-h-screen bg-gray-50 p-6">
    {/* Header */}
    <div className="max-w-6xl mx-auto mb-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        Cart
      </h1>
    </div>

    {/* Cart Customers */}
    {salesOrder.filter((order) => order.items && order.items.length > 0).length === 0 ? (
      <div className="max-w-6xl mx-auto text-center py-20">
        <p className="text-lg font-semibold text-gray-600">🛒 Your cart is empty</p>
      </div>
    ) : (
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salesOrder
          .filter((order) => order.items && order.items.length > 0)
          .map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 flex flex-col"
            >
              {/* Customer */}
              <div className="mb-4 flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-800 text-center">
                  {order?.customer?.name}
                </p>
                <RxCross2 onClick={() => handleDelete(order)} />
              </div>

              {/* Address */}
              {order?.Location?.length > 0 && (
                <div className="mb-6 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <p className="text-xs text-orange-600 font-medium mb-1">
                    📍 Customer ADDRESS
                  </p>
                  <p className="text-sm text-gray-700">
                    {order.Location[0].address}, {order.Location[0].city},{" "}
                    {order.Location[0].state}
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="space-y-4">
                {order?.items?.map((itm, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <p className="font-medium text-gray-700 mb-2">
                      Article:{" "}
                      <span className="text-blue-600">{itm.article}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded text-center">
                        Size: {itm.size}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded text-center">
                        Color: {itm.color}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded text-center">
                        Type: {itm.type}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded text-center">
                        Quality: {itm.quality}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700">
                      Quantity:{" "}
                      <span className="font-semibold text-blue-700">
                        {itm.quantity}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Submit Button at Bottom */}
              <button
                onClick={() => handleSubmit(order)}
                className="w-full mt-auto py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Proceed To Order
              </button>
            </div>
          ))}
      </div>
    )}

    <DeleteModal
      name="Order"
      isOpen={deleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      onConfirm={handleConfirmDelete}
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

export default Cart;
