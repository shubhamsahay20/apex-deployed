import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaCalendarAlt, FaEye, FaTrash } from 'react-icons/fa'
import { FiEye, FiTrash2 } from 'react-icons/fi'
import {
  exportProductionPDF,
  printProductionPDF
} from '../../../../utils/PdfModel'
const deliveryData = [
  {
    date: '26/09/2023',
    article: '301',
    saleRef: 'SO/346564',
    customer: 'Soit IT Sol',
    warehouse: 'Warehouse 01',
    status: 'Delivered'
  },
  {
    date: '25/09/2023',
    article: '442',
    saleRef: 'SO/348239',
    customer: 'Angela Carter',
    warehouse: 'Warehouse 02',
    status: 'Delivered'
  },
  {
    date: '24/09/2023',
    article: '144',
    saleRef: 'SO/431234',
    customer: 'Victor James',
    warehouse: 'Warehouse 01',
    status: 'Cancelled'
  },
  {
    date: '23/09/2023',
    article: '156',
    saleRef: 'SO/623453',
    customer: 'Sharp Camela',
    warehouse: 'Warehouse 02',
    status: 'Cancelled'
  },
  {
    date: '26/09/2023',
    article: '596',
    saleRef: 'SO/532234',
    customer: 'Jhon Ronan',
    warehouse: 'Warehouse 02',
    status: 'Delivered'
  },
  {
    date: '21/09/2023',
    article: '015',
    saleRef: 'SO/324353',
    customer: 'Victor James',
    warehouse: 'Warehouse 01',
    status: 'Packed'
  },
  {
    date: '21/09/2023',
    article: '422',
    saleRef: 'SO/323453',
    customer: 'Victor James',
    warehouse: 'Warehouse 01',
    status: 'Packed'
  }
]

const Production = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  const handleView = row => {
    navigate('/inventory/product-add', { state: row })
  }

  return (
    <div className=' space-y-6'>
      {/* Cards */}
     
      {/* Delivery Orders List */}
      <div className='bg-white rounded shadow p-4'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4'>
          <h2 className='text-lg font-semibold text-gray-800'>Production </h2>
          <div className='flex gap-2 items-center'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search Article, order'
                className='pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm'
              />
              <FaSearch className='absolute top-2.5 left-2.5 text-gray-400 text-sm' />
            </div>
            <button className='flex items-center gap-1 border px-3 py-1.5 rounded-md text-sm text-gray-700 border-gray-300'>
              <FaCalendarAlt className='text-sm' /> Today
            </button>
            <button
              onClick={() => navigate('/inventory/product-add')}
              className='bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-blue-700 transition'
            >
              Add Product
            </button>
            <button
              onClick={() => printProductionPDF(deliveryData)}
              className='border px-4 py-1.5 rounded-md text-sm text-gray-700 border-gray-300'
            >
              Print
            </button>

            <button
              onClick={() => exportProductionPDF(deliveryData)}
              className='border px-4 py-1.5 rounded-md text-sm text-gray-700 border-gray-300'
            >
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left border'>
            <thead className='bg-gray-50 text-gray-600 font-medium'>
              <tr>
                <th className='px-3 py-2'>Date</th>
                <th className='px-3 py-2'>Production Factory </th>
                <th className='px-3 py-2'>Cartel Quantity</th>

                <th className='px-3 py-2 text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {deliveryData.map((row, index) => (
                <tr key={index} className='border-t hover:bg-gray-50'>
                  <td className='px-3 py-2 whitespace-nowrap'>{row.date}</td>
                  <td className='px-3 py-2 whitespace-nowrap'>{row.article}</td>

                  <td className='px-3 py-2 whitespace-nowrap'>
                    <span
                      className={`font-medium ${
                        row.status === 'Delivered'
                          ? 'text-green-600'
                          : row.status === 'Packed'
                          ? 'text-blue-600'
                          : 'text-red-600'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className='px-3 py-2 whitespace-nowrap flex items-center gap-3 justify-center'>
                    <FiEye
                      className='text-green-600 cursor-pointer'
                      onClick={() => handleView(row)}
                    />
                    <FiTrash2 className='text-red-500 cursor-pointer' />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between mt-4 text-sm text-gray-600'>
          <button className='px-4 py-1 border rounded'>Previous</button>
          <span>Page 1 of 10</span>
          <button className='px-4 py-1 border rounded'>Next</button>
        </div>
      </div>

      {/* Add Order Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm'>
          <div className='bg-white rounded-xl p-6 w-full max-w-xl'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold text-gray-800'>
                Add Internal Transfers{' '}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                ✕
              </button>
            </div>
            <form className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <input
                  type='date'
                  placeholder='Date'
                  className='border rounded px-3 py-2 text-sm w-full'
                />
                <input
                  type='text'
                  placeholder='Article'
                  className='border rounded px-3 py-2 text-sm w-full'
                />
                <input
                  type='text'
                  placeholder='Sale Reference'
                  className='border rounded px-3 py-2 text-sm w-full'
                />
                <input
                  type='text'
                  placeholder='Customer'
                  className='border rounded px-3 py-2 text-sm w-full'
                />
                <input
                  type='text'
                  placeholder='Warehouse'
                  className='border rounded px-3 py-2 text-sm w-full'
                />
                <select className='border rounded px-3 py-2 text-sm w-full'>
                  <option>Status</option>
                  <option value='Delivered'>Delivered</option>
                  <option value='Packed'>Packed</option>
                  <option value='Cancelled'>Cancelled</option>
                </select>
              </div>
              <button
                type='submit'
                className='w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition'
              >
                Add Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const Card = ({ title, value, color }) => (
  <div className='bg-white rounded shadow p-4'>
    <p className='text-xs text-gray-500 mb-1'>{title}</p>
    <h3 className={`text-lg font-bold ${color}`}>{value}</h3>
  </div>
)

export default Production
