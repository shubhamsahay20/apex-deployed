import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../../Context/AuthContext'
import { FiArrowLeft } from 'react-icons/fi'
import cartService from '../../../../api/cart.service'
import warehouseService from '../../../../api/warehouse.service'
import { toast } from 'react-toastify'
import ApproveModal from '../../../../utils/ApproveModal'
import inventoryService from '../../../../api/inventory.service'
import RejectModal from '../../../../utils/RejectModal'

const UploadStatus = () => {
  const { id } = useParams()
  const [orders, setOrders] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()
  const [warehouses, setWarehouses] = useState([])
  const [approveModalOpan, setApproveModalOpan] = useState(false)
  const [rejectModalOpan, setRejectModalOpan] = useState(false)
  const [stockReport, setStockReport] = useState([])
  const [allocations, setAllocations] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  const confirmApproved = async () => {
    try {
      const payload = {
        salesorderNO: orders.salesOrderNo,
        customer: orders.customer?._id,
        inventoryManagerApproval: 'APPROVED',
        items: orders.items.map((item, index) => ({
          article: item.article,
          quantity: item.quantity,
          quality: item.quality,
          type: item.type,
          size: item.size,
          color: item.color,
          categoryCode: item.categoryCode,
          warehouses: (allocations[index] || []).map(alloc => ({
            warehouse: alloc.warehouseId,
            quantity: alloc.quantity
          }))
        }))
      }

      console.log('Payload to send:', payload)
      const res = await inventoryService.approval(user.accessToken, id, payload)
      console.log('approval response', res)
      toast.success(res.message || 'Order approved and allocations saved!')
      setApproveModalOpan(false)
      navigate(`/inventory-management/article-list`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve order')
      console.error(error.response?.data?.message)
    }
  }

  const confirmReject = async () => {
    try {
      const payload = {
        salesorderNO: orders.salesOrderNo,
        customer: orders.customer?._id,
        inventoryManagerApproval: 'REJECTED'
      }

      const res = await inventoryService.approval(user.accessToken, id, payload)
      console.log('reject response', res)
      toast.info(res.message || 'Order Rejected Successfully')
      setRejectModalOpan(false)
      navigate(`/inventory-management/article-list`)
    } catch (error) {
      console.log(error.response.data.message)
    }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await cartService.getSalesOrderById(user.accessToken, id)
        console.log('order response', res)

        setOrders(res)

        const warehouseRes = await warehouseService.getAllWarehouse(
          user.accessToken
        )
        setWarehouses(warehouseRes?.data?.data || [])

        const inventoryinfo = await inventoryService.getStockInInventory(
          user.accessToken,
          currentPage,
          5
        )
        console.log('response of inventory info', inventoryinfo)
        setStockReport(inventoryinfo.data)
        setTotalPage(inventoryinfo.totalPages)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [id, user.accessToken, currentPage])

  // Add a new warehouse allocation row
  const addWarehouseAllocation = itemIndex => {
    setAllocations(prev => ({
      ...prev,
      [itemIndex]: [
        ...(prev[itemIndex] || []),
        { warehouseId: '', quantity: '' }
      ]
    }))
  }

  // Remove warehouse allocation row
  const removeWarehouseAllocation = (itemIndex, allocIndex) => {
    setAllocations(prev => {
      const updated = [...(prev[itemIndex] || [])]
      updated.splice(allocIndex, 1)
      return { ...prev, [itemIndex]: updated }
    })
  }

  // Update warehouse selection
  const handleSelect = (itemIndex, allocIndex, warehouseId) => {
    setAllocations(prev => {
      const updated = [...(prev[itemIndex] || [])]
      updated[allocIndex].warehouseId = warehouseId
      return { ...prev, [itemIndex]: updated }
    })
  }

  // Update quantity input with validation
  const handleQuantity = (itemIndex, allocIndex, quantity, maxQty) => {
    setAllocations(prev => {
      const updated = [...(prev[itemIndex] || [])]
      const prevQty = updated[allocIndex].quantity
      const newQuantity = Number(quantity) || 0

      // Calculate total if this change is applied
      const tempUpdated = [...updated]
      tempUpdated[allocIndex].quantity = newQuantity
      const total = tempUpdated.reduce(
        (sum, a) => sum + (Number(a.quantity) || 0),
        0
      )

      if (total > maxQty) {
        alert(`Total quantity for this article cannot exceed ${maxQty}.`)
        // revert to old value
        updated[allocIndex].quantity = prevQty
        return { ...prev, [itemIndex]: updated }
      }

      updated[allocIndex].quantity = newQuantity
      return { ...prev, [itemIndex]: updated }
    })
  }

  if (loading) return <p className='p-6'>Loading...</p>

  return (
    <div className='max-w-6xl mx-auto p-6'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-6'>
        <FiArrowLeft
          className='text-gray-600 cursor-pointer'
          size={22}
          onClick={() => navigate(-1)}
        />
        <h2 className='text-xl font-semibold text-gray-800'>
          Sales Order Details
        </h2>
      </div>

      {/* Stock Report */}
      <div className='mb-10 bg-white shadow rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-700 mb-4'>
          Stock Report
        </h3>
        {stockReport && stockReport.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full border border-gray-200 rounded-lg overflow-hidden'>
              <thead className='bg-gray-100 text-gray-700'>
                <tr>
                  <th className='px-4 py-2 text-left'>Article</th>
                  <th className='px-4 py-2 text-left'>Factory Name</th>
                  <th className='px-4 py-2 text-left'>Warehouse Name</th>
                  <th className='px-4 py-2 text-left'>Factory Quantity</th>
                  <th className='px-4 py-2 text-left'>Warehouse Quantity</th>
                  <th className='px-4 py-2 text-left'>Total Quantity</th>
                </tr>
              </thead>
              <tbody>
                {stockReport.map((row, idx) => (
                  <tr key={idx} className='border-t hover:bg-gray-50'>
                    <td className='px-4 py-2'>{row.article}</td>
                    <td className='px-4 py-2'>{row.factory}</td>
                    <td className='px-4 py-2'>{row.warehouse}</td>
                    <td className='px-4 py-2'>{row.stockAtFactory}</td>
                    <td className='px-4 py-2'>{row.stockAtWarehouse}</td>
                    <td className='px-4 py-2'>{row.totalQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='text-gray-500 text-sm'>No stock data available.</p>
        )}
        <div className='flex justify-between items-center mt-4 text-sm text-gray-600'>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className='px-3 py-1 border rounded bg-gray-50'
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPage}
          </span>
          <button
            disabled={currentPage === totalPage}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className='px-3 py-1 border rounded bg-gray-50'
          >
            Next
          </button>
        </div>
      </div>

      <h1 className='text-lg font-semibold text-red-600 bg-blue-50 p-2 rounded capitalize'>
        If stock is at Production, please check with the Administrator to decide
        which warehouse it should go to, then assign warehouse for the Order,
      </h1>

      {/* Orders */}
      <div key={orders._id} className='mb-10 bg-white shadow rounded-lg p-6'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-gray-700'>
            Sales Order No: {orders.salesOrderNo}
          </h3>
          <p className='text-gray-600'>Customer: {orders.customer?.name}</p>
          <p className='text-gray-600'>
            Address: {orders.Location?.[0]?.address},{' '}
            {orders.Location?.[0]?.city}, {orders.Location?.[0]?.state},{' '}
            {orders.Location?.[0]?.country} - {orders.Location?.[0]?.pincode}
          </p>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full border border-gray-200 rounded-lg overflow-hidden'>
            <thead className='bg-gray-100 text-gray-700'>
              <tr>
                <th className='px-4 py-2 text-left'>Article No.</th>
                <th className='px-4 py-2 text-left'>Category Code</th>
                <th className='px-4 py-2 text-left'>Color</th>
                <th className='px-4 py-2 text-left'>Size</th>
                <th className='px-4 py-2 text-left'>Type</th>
                <th className='px-4 py-2 text-left'>Quality</th>
                <th className='px-4 py-2 text-left'>Quantity</th>
                <th className='px-4 py-2 text-left'>Warehouse Allocations</th>
              </tr>
            </thead>
            <tbody>
              {orders?.items?.map((item, itemIndex) => (
                <tr
                  key={itemIndex}
                  className='border-t hover:bg-gray-50 transition-colors'
                >
                  <td className='px-4 py-2'>{item.article}</td>
                  <td className='px-4 py-2'>{item.categoryCode}</td>
                  <td className='px-4 py-2'>{item.color}</td>
                  <td className='px-4 py-2'>{item.size}</td>
                  <td className='px-4 py-2'>{item.type}</td>
                  <td className='px-4 py-2'>{item.quality}</td>
                  <td className='px-4 py-2'>{item.quantity}</td>

                  <td className='px-4 py-2'>
                    {(allocations[itemIndex] || []).map((alloc, allocIndex) => (
                      <div
                        key={allocIndex}
                        className='flex items-center gap-2 mb-2'
                      >
                        <select
                          value={alloc.warehouseId}
                          onChange={e =>
                            handleSelect(itemIndex, allocIndex, e.target.value)
                          }
                          className='border rounded p-1'
                        >
                          <option value=''>Select warehouse</option>
                          {warehouses
                            .filter(
                              wh =>
                                !allocations[itemIndex]?.some(
                                  (a, i) =>
                                    a.warehouseId === wh._id && i !== allocIndex
                                )
                            )
                            .map(wh => (
                              <option key={wh._id} value={wh._id}>
                                {wh.name}
                              </option>
                            ))}
                        </select>

                        <input
                          type='number'
                          min='0'
                          value={alloc.quantity}
                          onChange={e =>
                            handleQuantity(
                              itemIndex,
                              allocIndex,
                              e.target.value,
                              item.quantity
                            )
                          }
                          className='border rounded p-1 w-20'
                        />

                        {/* Show remove button only if more than one allocation exists */}
                        {allocations[itemIndex]?.length > 1 && (
                          <button
                            type='button'
                            onClick={() =>
                              removeWarehouseAllocation(itemIndex, allocIndex)
                            }
                            className='text-red-500 text-xs border border-red-400 rounded px-2 hover:bg-red-50'
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      onClick={() => addWarehouseAllocation(itemIndex)}
                      className='text-blue-600 text-sm'
                    >
                      + Add Warehouse
                    </button>

                    {allocations[itemIndex] && (
                      <p className='text-xs text-gray-600 mt-1'>
                        Total Assigned:{' '}
                        {allocations[itemIndex].reduce(
                          (sum, a) => sum + (Number(a.quantity) || 0),
                          0
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

      <div className='flex justify-center gap-2'>
        <button
          className='px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600'
          onClick={() => setApproveModalOpan(true)}
        >
          Approve
        </button>
        <button
          className='px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600'
          onClick={() => setRejectModalOpan(true)}
        >
          Reject
        </button>
      </div>

      <ApproveModal
        isOpen={approveModalOpan}
        onClose={() => setApproveModalOpan(false)}
        onConfirm={confirmApproved}
      />

      <RejectModal
        isOpen={rejectModalOpan}
        onClose={() => setRejectModalOpan(false)}
        onConfirm={confirmReject}
      />
    </div>
  )
}

export default UploadStatus
