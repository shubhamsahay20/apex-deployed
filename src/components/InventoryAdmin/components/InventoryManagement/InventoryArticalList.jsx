import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CiCalendar } from 'react-icons/ci';
import DeleteModal from '../../../../utils/DeleteModal';
import { FiEdit3, FiEye, FiTrash2 } from 'react-icons/fi';
import { PiPencilSimpleLineBold } from 'react-icons/pi';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';
import cartService from '../../../../api/cart.service';
import ApproveModal from '../../../../utils/ApproveModal';
import inventoryService from '../../../../api/inventory.service';
import { useDebounce } from '../../../../hooks/useDebounce';

const InventorySummaryItem = ({ title, value, color }) => (
  <div className="text-center px-4">
    <p className={`text-sm font-medium ${color}`}>{title}</p>
    <p className="text-xs text-gray-700 font-semibold">{value}</p>
  </div>
);

const deliveryData = [
  {
    date: '26/09/2023',
    article: '301',
    saleRef: 'SO/346564',
    customer: 'Soit IT Sol',
    Quantity: '8',
    status: 'Delivered',
    LastStatus: 'Accepted',
    id: 1,
  },
  {
    date: '26/09/2023',
    article: '301',
    saleRef: 'SO/346564',
    customer: 'Soit IT Sol',
    Quantity: '20',
    status: 'Delivered',
    LastStatus: 'Rejected',
    id: 2,
  },
];

const InventoryArticalList = () => {
  const navigate = useNavigate();
  const [cancel, setCancel] = useState(deliveryData);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteData, setNoteData] = useState({ title: '', description: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState('');
  const [orderDetails, setOrderDetails] = useState([]);
  const [approveModalOpan, setApproveModalOpan] = useState(false);
  const [approveModalId, setApproveModalId] = useState(null);
  const [searchQuery,setSearchQuery] = useState("")
  const debounceValue = useDebounce(searchQuery,500)


  const { user } = useAuth();

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

  useEffect(() => {
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      (async () => {
        try {
          const res = await cartService.getAllSalesOrder(
            user.accessToken,
            currentPage,
          10,
          debounceValue
        );
        console.log('res coming ', res.sellorder);
        setOrderDetails(res.sellorder);
        setTotalPages(res.pagination?.totalPages);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    })();
  }}, [currentPage,debounceValue, user.accessToken]);

  const handleView = (row) => {
    navigate('/inventory-management/OrderDetails', {
      state: row,
    });
  };

  const handleEdit = (row) => {
    navigate('/inventory-management/article-list/edit-article', {
      state: row,
    });
  };

  const handleDelete = (id) => {
    setCancel(cancel.filter((item) => item.id !== id));
    setDeleteModalOpen(true);
  };

  const handleAccept = async (order) => {
    console.log('order id', order._id);

    setApproveModalId(order._id);
    setApproveModalOpan(true);
  };

  // ✅ Reject function
  const handleReject = (order) => {
    try {
      setSelectedOrder(order._id);
      setActionType('Rejected');
      setIsModalOpen(true);
    } catch (error) {
      toast.error(error.res.data.message);
    }
  };

  // ✅ Save Note
  const handleSaveNote = async () => {
    try {
      const data = {
        text: noteData.description,
        approvalStatus: noteData.title || 'REJECTED',
      };
      const res = await inventoryService.addNotes(
        user.accessToken,
        selectedOrder,
        data,
      );
      console.log('response after edit approved', res);
      setOrderDetails((prev) =>
        prev.map((o) =>
          o._id === selectedOrder
            ? { ...o, inventoryManagerApproval: data.approvalStatus }
            : o,
        ),
      );
      setIsModalOpen(false);
      setNoteData({ title: '', description: '' });
      setActionType('');
      toast.success('Order Rejected');
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div>
      {/* <div className="bg-white rounded-lg p-4 text shadow-sm">
        <h2 className="text-gray-800 text-base font-semibold mb-4">
          Inventory
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x">
          <InventorySummaryItem
            title="Cartons Available"
            value="1,114"
            color="text-blue-600"
          />
          <InventorySummaryItem
            title="Today's Production"
            value="124"
            color="text-indigo-700"
          />
          <InventorySummaryItem
            title="Today's Orders"
            value="2,868"
            color="text-orange-500"
          />
          <InventorySummaryItem
            title="Today's Sale"
            value="1,442"
            color="text-green-600"
          />
        </div>
      </div> */}

      <div className="bg-white rounded shadow p-4 my-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Sales Order List
          </h2>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e)=>(
                  setSearchQuery(e.target.value),
                  setCurrentPage(1)
                )}
                type="text"
                placeholder="Search Order"
                className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm"
              />
              <FaSearch className="absolute top-2.5 left-2.5 text-gray-400 text-sm" />
            </div>
            {/* <button className="flex items-center gap-1 border px-3 py-1.5 rounded-md text-sm text-gray-700 border-gray-300">
              <CiCalendar className="text-sm" /> Today
            </button> */}

            <button className="border px-4 py-1.5 rounded-md text-sm text-gray-700 border-gray-300">
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Sale Order No.</th>
                <th className="px-3 py-2">Customer Name</th>
                <th className="px-3 py-2">Quantity</th>
                <th className="px-3 py-2">Account Status</th>
                <th className="px-3 py-2">Inventory Status</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {orderDetails.map((row, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(row.updatedAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.salesOrderNo}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.customer?.name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.items.reduce((total, e) => total + e.quantity, 0)}
                  </td>

                  {/* ✅ Privacy Status Column */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium 
    ${
      row.accountSectionApproval === 'APPROVED'
        ? 'bg-green-100 text-green-700'
        : row.accountSectionApproval === 'REJECTED'
        ? 'bg-red-100 text-red-700'
        : 'bg-gray-100 text-gray-700'
    }`}
                    >
                      {row.accountSectionApproval}
                    </span>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap">
                    {(() => {
                      switch (row.inventoryManagerApproval) {
                        case 'APPROVED':
                          return (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs">
                              APPROVED
                            </span>
                          );

                        case 'REJECTED':
                          return (
                            <div className="flex items-center gap-2">
                              <span className="px-3  py-1 bg-red-100 text-red-700 rounded text-xs">
                                REJECTED
                              </span>
                              <PiPencilSimpleLineBold
                                onClick={() =>
                                  navigate(
                                    `/inventory-management/article-list/upload/${row._id}`,
                                  )
                                }
                              />
                            </div>
                          );

                        default:
                          return (
                            <button
                              onClick={() =>
                                navigate(
                                  `/inventory-management/article-list/upload/${row._id}`,
                                )
                              }
                              className="px-4 bg-blue-200 py-1 border rounded"
                            >
                              {' '}
                              Update Status{' '}
                            </button>
                          );
                      }
                    })()}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap flex items-center gap-3 justify-center">
                    <FiEye
                      className="text-green-600 cursor-pointer"
                      onClick={() => handleView(row)}
                    />
                    {/* <PiPencilSimpleLineBold
                      className="text-blue-600 cursor-pointer"
                      onClick={() => handleEdit(row)}
                    /> */}
                    <FiTrash2
                      onClick={() => handleDelete(row.id)}
                      className="text-red-500 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-1 border rounded"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        name="Content"
        onClose={() => setDeleteModalOpen(false)}
      />

      {/* Reject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {actionType ? `${actionType} Order - Add Reason` : 'Add Note'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  type="text"
                  value={noteData.title}
                  onChange={(e) =>
                    setNoteData({ ...noteData, title: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter note title"
                >
                  <option value=""> Select Status </option>
                  <option value="REJECTED"> REJECTED </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note Description
                </label>
                <textarea
                  value={noteData.description}
                  onChange={(e) =>
                    setNoteData({ ...noteData, description: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter reason / note description"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                onClick={handleSaveNote}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
      <ApproveModal
        isOpen={approveModalOpan}
        onClose={() => setApproveModalOpan(false)}
        onConfirm={confirmApproved}
      />
    </div>
  );
};

export default InventoryArticalList;
