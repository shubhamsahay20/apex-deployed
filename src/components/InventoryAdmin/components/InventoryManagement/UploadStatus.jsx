import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../Context/AuthContext';
import { FiArrowLeft } from 'react-icons/fi';
import cartService from '../../../../api/cart.service';
import warehouseService from '../../../../api/warehouse.service';
import { toast } from 'react-toastify';
import ApproveModal from '../../../../utils/ApproveModal';

const UploadStatus = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [approveModalOpan, setApproveModalOpan] = useState(false);
  const [approveModalId, setApproveModalId] = useState(null);

  const handleAccept = async () => {
    console.log('order id', id);

    setApproveModalId(id);
    setApproveModalOpan(true);
  };

  const confirmApproved = async () => {
    const selectApprove = orderDetails.find(
      (item) => item._id === approveModalId,
    );

    console.log('selectApprove', selectApprove._id);

    try {
      await inventoryService.addNotes(user.accessToken, selectApprove._id, {
        text: 'Approved',
        approvalStatus: 'APPROVED',
      });

      setOrderDetails((prev) =>
        prev.map((o) =>
          o._id === selectApprove._id
            ? { ...o, inventoryManagerApproval: 'APPROVED' }
            : o,
        ),
      );

      toast.success('Order Approved');
      setApproveModalId(null);
      setApproveModalOpan(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve');
    }
  };

  // ✅ Reject function
  const handleReject = () => {
    try {
        console.log("id",id);
        
      setSelectedOrder(id);
      setActionType('Rejected');
      setIsModalOpen(true);
    } catch (error) {
      toast.error(error.res.data.message);
    }
  };

  // allocations[itemIndex] = [ { warehouseId, quantity }, ... ]
  const [allocations, setAllocations] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await cartService.getSalesOrderById(user.accessToken, id);
        setOrders(res);

        const warehouseRes = await warehouseService.getAllWarehouse(
          user.accessToken,
        );
        setWarehouses(warehouseRes?.data?.data?.warehouses || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id, user.accessToken]);

  // Add a new warehouse allocation row
  const addWarehouseAllocation = (itemIndex) => {
    setAllocations((prev) => ({
      ...prev,
      [itemIndex]: [
        ...(prev[itemIndex] || []),
        { warehouseId: '', quantity: '' },
      ],
    }));
  };

  // Update warehouse selection
  const handleSelect = (itemIndex, allocIndex, warehouseId) => {
    setAllocations((prev) => {
      const updated = [...(prev[itemIndex] || [])];
      updated[allocIndex].warehouseId = warehouseId;
      return { ...prev, [itemIndex]: updated };
    });
  };

  // Update quantity input with validation
  const handleQuantity = (itemIndex, allocIndex, quantity, maxQty) => {
    setAllocations((prev) => {
      const updated = [...(prev[itemIndex] || [])];

      const newQuantity = Number(quantity) || 0;
      updated[allocIndex].quantity = newQuantity;

      // Calculate sum for this article
      const total = updated.reduce(
        (sum, a) => sum + (Number(a.quantity) || 0),
        0,
      );

      if (total > maxQty) {
        alert(
          `Total quantity for this article cannot exceed ${maxQty}. Currently: ${total}`,
        );
        return prev; // reject update
      }

      return { ...prev, [itemIndex]: updated };
    });
  };

  if (loading) return <p className="p-6">Loading...</p>;

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
                <th className="px-4 py-2 text-left">Warehouse Allocations</th>
              </tr>
            </thead>
            <tbody>
              {orders?.items?.map((item, itemIndex) => (
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

                  {/* Multi Warehouse Allocations */}
                  <td className="px-4 py-2">
                    {(allocations[itemIndex] || []).map((alloc, allocIndex) => (
                      <div
                        key={allocIndex}
                        className="flex items-center gap-2 mb-2"
                      >
                        <select
                          value={alloc.warehouseId}
                          onChange={(e) =>
                            handleSelect(itemIndex, allocIndex, e.target.value)
                          }
                          className="border rounded p-1"
                        >
                          <option value="">Select warehouse</option>
                          {warehouses.map((wh) => (
                            <option key={wh._id} value={wh._id}>
                              {wh.name}
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          min="0"
                          value={alloc.quantity}
                          onChange={(e) =>
                            handleQuantity(
                              itemIndex,
                              allocIndex,
                              e.target.value,
                              item.quantity,
                            )
                          }
                          className="border rounded p-1 w-20"
                        />
                      </div>
                    ))}

                    {/* Add another warehouse row */}
                    <button
                      onClick={() => addWarehouseAllocation(itemIndex)}
                      className="text-blue-600 text-sm"
                    >
                      + Add Warehouse
                    </button>

                    {/* Show total vs max */}
                    {allocations[itemIndex] && (
                      <p className="text-xs text-gray-600 mt-1">
                        Total Assigned:{' '}
                        {allocations[itemIndex].reduce(
                          (sum, a) => sum + (Number(a.quantity) || 0),
                          0,
                        )}{' '}
                        / {item.quantity}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <button
          className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
          onClick={handleAccept}
        >
          Approve
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
          onClick={handleReject}
        >
          Reject
        </button>
      </div>

      <ApproveModal
        isOpen={approveModalOpan}
        onClose={() => setApproveModalOpan(false)}
        onConfirm={confirmApproved}
      />
    </div>
  );
};

export default UploadStatus;
