import React, { useEffect, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { PiPencilSimpleLineBold } from 'react-icons/pi';
import { toast } from 'react-toastify';
import cartService from '../../../api/cart.service';
import { useAuth } from '../../../Context/AuthContext';
import accountService from '../../../api/account.service';
import ApproveModal from '../../../utils/ApproveModal';
import reportService from '../../../api/report.service';
import { useDebounce } from '../../../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import { exportAccountDetailPDF } from '../../../utils/PdfModel';

const AccountingDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteData, setNoteData] = useState({ title: '', description: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState('');
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [approveModalOpan, setApproveModalOpan] = useState(false);
  const [approveModalId, setApproveModalId] = useState(null);
  const [accountData, setAccountData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const debounceValue = useDebounce(searchQuery, 500);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const navigate = useNavigate();

  const handleSaveNote = async () => {
    try {
      const data = {
        text: noteData.description,
        approvalStatus: noteData.title || 'REJECTED',
      };
      const res = await accountService.addNotes(
        user.accessToken,
        selectedOrder,
        data,
      );
      console.log('response after edit approved', res);
      setOrderDetails((prev) =>
        prev.map((o) =>
          o._id === selectedOrder
            ? { ...o, accountSectionApproval: data.approvalStatus }
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

  const confirmApproved = async () => {
    const selectApprove = orderDetails.find(
      (item) => item._id === approveModalId,
    );

    console.log('selectApprove', selectApprove._id);

    try {
      await accountService.addNotes(user.accessToken, selectApprove._id, {
        text: 'Approved',
        approvalStatus: 'APPROVED',
      });

      setOrderDetails((prev) =>
        prev.map((o) =>
          o._id === selectApprove._id
            ? { ...o, accountSectionApproval: 'APPROVED' }
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

  const handleAccept = async (order) => {
    console.log('order id', order._id);

    setApproveModalId(order._id);
    setApproveModalOpan(true);
  };

  const handleReject = async (order) => {
    try {
      setSelectedOrder(order._id);
      setActionType('Rejected');
      setIsModalOpen(true);
    } catch (error) {
      toast.error(error.res.data.message);
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
            debounceValue,
          );
          console.log('res coming ', res.sellorder);
          setOrderDetails(res.sellorder);
          setTotalPages(res.pagination?.totalPages);

          console.log('iiii');

          const accountSection = await reportService.accountSectionSummary(
            user.accessToken,
          );
          console.log('accountSection1231', accountSection.data);
          setAccountData(accountSection.data);
        } catch (error) {
          toast.error(error.response?.data?.message);
        }
      })();
    }
  }, [currentPage, user.accessToken, debounceValue]);

  console.log('order details', orderDetails);

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="bg-white rounded-lg border p-4 mb-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Accounting Management
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 p-1 divide-y-1 sm:divide-y-0 sm:divide-x">
          <div className="py-1">
            <p className="text-base font-medium text-blue-600">Total Orders</p>
            <p className="text-sm font-semibold text-gray-800">
              {accountData.totalOrders}
            </p>
          </div>
          <div className="py-1">
            <p className="text-base font-medium text-blue-900">
              Total Approved
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {accountData.totalApproved}
            </p>
          </div>
          <div className="py-1">
            <p className="text-base font-medium text-orange-600">
              Total Pending
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {accountData.totalPending}
            </p>
          </div>

          <div className="py-1">
            <p className="text-base font-medium text-orange-600">
              Total Rejected
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {accountData.totalRejected}
            </p>
          </div>
        </div>
      </div>

      {/* Order Table Header */}
      <div className="bg-white border rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-base font-semibold text-gray-800 mb-2 sm:mb-0">
            Order Details
          </h2>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => (
                  setSearchQuery(e.target.value), setCurrentPage(1)
                )}
                placeholder="Search Sales Order"
                className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <button
              className="border border-gray-300 px-4 py-1.5 text-sm rounded hover:bg-gray-100"
              onClick={() => exportAccountDetailPDF(orderDetails)}
              disabled={orderDetails.length === 0}
            >
              Export
            </button>
          </div>
        </div>

        {/* Order Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-[#F9FAFB] border-b">
              <tr>
                {[
                  'Date',
                  'Sale Order No.',
                  'Sales Person',
                  'Sales Phone No',
                  'Customer Name',
                  'Total Quantity',
                  'Status',
                  'Action',
                ].map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-2 font-medium text-gray-700 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((item, idx) => (
                <tr
                  key={item._id}
                  className={`border-b hover:bg-gray-50 ${
                    item.scheme ? 'bg-yellow-200' : ''
                  }`}
                  onClick={() => item.scheme && setSelectedScheme(item.scheme)}
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.salesOrderNo}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.createdBy?.name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.createdBy?.phone}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.customer.name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.items.reduce((total, e) => total + e.quantity, 0)}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap">
                    {(() => {
                      switch (item.accountSectionApproval) {
                        case 'APPROVED':
                          return (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs">
                              Approved
                            </span>
                          );

                        case 'REJECTED':
                          return (
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs">
                              Rejected
                            </span>
                          );

                        default:
                          return (
                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                                onClick={(e) => (
                                  e.stopPropagation(), handleAccept(item)
                                )}
                              >
                                Approve
                              </button>
                              <button
                                className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                onClick={(e) => (
                                  e.stopPropagation(), handleReject(item)
                                )}
                              >
                                Reject
                              </button>
                            </div>
                          );
                      }
                    })()}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <FiEye
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/account-section/view-order', {
                            state: item,
                          });
                        }}
                        className="text-green-600 w-4 h-4 cursor-pointer hover:scale-110 transition"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-100"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal (only for Reject) */}
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

      {selectedScheme && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Scheme Details</h2>
            <p>
              <strong>Name:</strong> {selectedScheme.schemesName}
            </p>
            <p>
              <strong>Discount:</strong> {selectedScheme.schemesType}
            </p>
            <p>
              <strong>Description:</strong> {selectedScheme.schemesDescription}
            </p>

            <button
              onClick={() => setSelectedScheme(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
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

export default AccountingDashboard;
