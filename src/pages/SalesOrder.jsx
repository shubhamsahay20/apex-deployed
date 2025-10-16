import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { CiCalendar } from 'react-icons/ci'
import { exportProductionPDF, printProductionPDF } from '../utils/PdfModel'
import { exportSalesOrdersPDF, printSalesOrdersPDF } from '../utils/PdfModel'
import { toast } from 'react-toastify'
import { useAuth } from '../Context/AuthContext'
import salesService from '../api/sales.service'
import { useDebounce } from '../hooks/useDebounce'
import Loader from '../common/Loader' // ✅ import loader



const SalesOrder = () => {
  const [salesDetails, setSalesDetails] = useState([])
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [loading, setLoading] = useState(false) // ✅ loader state

  useEffect(() => {
    const getSalesOrder = async () => {
      try {
        setLoading(true) // ✅ start loader
        const res = await salesService.getAllSalesOrder(
          user.accessToken,
          currentPage,
          10,
          debouncedSearch
        )
        console.log('get sales details', res.sellorder)
        setSalesDetails(res?.sellorder)
        setTotalPages(res?.pagination.totalPages)
      } catch (error) {
        toast.error(error.response?.data?.message)
      } finally {
        setLoading(false) // ✅ stop loader
      }
    }

    // ✅ always call API (even for 1 char)
    getSalesOrder()
  }, [currentPage, user, debouncedSearch])

  return (
    <div className='space-y-6'>
      <div className='bg-white rounded shadow p-4 relative'>
        {/* ✅ Loader overlay inside table container */}
        {loading && (
          <div className='absolute inset-0 flex items-center justify-center bg-white/70 z-10'>
            <Loader />
          </div>
        )}

        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4'>
          <h2 className='text-lg font-semibold text-gray-800'>Sales List</h2>
          <div className='flex gap-2 items-center'>
            <div className='relative'>
              <input
                type='text'
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value)
                }}
                placeholder='Search Sales Order'
                className='pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm'
              />
              <FaSearch className='absolute top-2.5 left-2.5 text-gray-400 text-sm' />
            </div>
            {/* <button className="flex items-center gap-1 border px-3 py-1.5 rounded-md text-sm text-gray-700 border-gray-300">
              <CiCalendar className="text-sm" /> Today
            </button> */}
            <button
              onClick={() => printSalesOrdersPDF(salesDetails)}
              className='border px-4 py-1.5 rounded-md text-sm text-gray-700 border-gray-300'
            >
              Print
            </button>

            <button
              onClick={() => exportSalesOrdersPDF(salesDetails)}
              className='border px-4 py-1.5 rounded-md text-sm text-gray-700 border-gray-300'
            >
              Export
            </button>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left border'>
            <thead className='bg-gray-50 text-gray-600 font-medium'>
              <tr>
                <th className='px-3 py-2'>Date & Time</th>
                <th className='px-3 py-2'>Sales Order No.</th>
                <th className='px-3 py-2'>Sales Person</th>
                <th className='px-3 py-2'>Sales Person Phone</th>
                <th className='px-3 py-2'>Customer</th>
                <th className='px-3 py-2'>Customer Phone</th>
                <th className='px-3 py-2'>Articles Total Quantity</th>
                <th className='px-3 py-2'>Account Status</th>
                <th className='px-3 py-2'>Inventory Status</th>
                {/* <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Note</th> */}
              </tr>
            </thead>
            <tbody>
              {salesDetails.map((row, i) => (
                <tr
                  key={i}
                  className='border-t hover:bg-gray-50'
                  // onClick={() => navigate(`/SalesDetails/${row._id}`)}
                >
                  <td className='px-3 py-2 whitespace-nowrap'>
                    {new Date(row.updatedAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </td>
                  <td className='px-3 py-2 whitespace-nowrap'>
                    {row.salesOrderNo}
                  </td>
                   <td className='px-3 py-2 whitespace-nowrap'>
                    {row.createdBy.name}
                  </td>
                  <td className='px-3 py-2 whitespace-nowrap'>
                    {row.createdBy.phone}
                  </td>
                  <td className='px-3 py-2 whitespace-nowrap'>
                    {row.customer.name}
                  </td>
                   <td className='px-3 py-2 whitespace-nowrap'>
                    {row.customer.phone}
                  </td>
                  <td className='px-3 py-2 whitespace-nowrap'>
                    {row.items?.reduce((total,item)=> total + (item.quantity || 0),0)}
                  </td>
                  <td className='px-3 py-2 whitespace-nowrap'>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${(() => {
                        switch (row.accountSectionApproval) {
                          case 'APPROVED':
                            return 'bg-green-100 text-green-700'
                          case 'REJECTED':
                            return 'bg-red-100 text-red-700'
                          case 'PENDING':
                            return 'bg-yellow-100 text-yellow-700'
                          default:
                            return 'bg-gray-100 text-gray-700'
                        }
                      })()}`}
                    >
                      {row.accountSectionApproval}
                    </span>
                  </td>
                  <td className='px-3 py-2 whitespace-nowrap'>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${(() => {
                        switch (row.inventoryManagerApproval) {
                          case 'APPROVED':
                            return 'bg-green-100 text-green-700'
                          case 'REJECTED':
                            return 'bg-red-100 text-red-700'
                          case 'PENDING':
                            return 'bg-yellow-100 text-yellow-700'
                          default:
                            return 'bg-gray-100 text-gray-700'
                        }
                      })()}`}
                    >
                      {row.inventoryManagerApproval}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='flex items-center justify-between mt-4 text-sm text-gray-600'>
          <button
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
            className='px-4 py-1 border rounded'
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages}
            className='px-4 py-1 border rounded'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

const Card = ({ title, value, color }) => (
  <div className='bg-white rounded shadow p-4'>
    <p className='text-xs text-gray-500 mb-1'>{title}</p>
    <h3 className={`text-lg font-bold ${color}`}>{value}</h3>
  </div>
)

export default SalesOrder
