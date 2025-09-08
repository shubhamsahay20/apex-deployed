import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaPrint, FaFilePdf, FaCalendarAlt } from 'react-icons/fa'
// ⬆️ keep your existing imports
import { exportSalesPDF, printSalesPDF } from '../../../../utils/PdfModel'; 

import {
  exportProductionPDF,
  printProductionPDF
} from '../../../../utils/PdfModel'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
} from 'chart.js'
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)
import { useAuth } from '../../../../Context/AuthContext'
import roleService from '../../../../api/role.service'

const dummyDetails = {
  name: 'John Mathew',
  phone: '9923 345 876',
  email: 'Johnm326@gmail.com',
  location: 'United States, Los Angeles',
  status: 'Active',
  image: 'https://randomuser.me/api/portraits/men/11.jpg'
}

const salesData = {
  labels: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  datasets: [
    {
      label: 'Sales',
      data: [
        60000, 59000, 40000, 36000, 48000, 26000, 52000, 47000, 49000, 41000,
        39000, 37000
      ],
      backgroundColor: '#3b82f6',
      borderRadius: 4
    }
  ]
}

const tableData = [
  {
    date: '11/1/23',
    article: 3201,
    customer: 'John Mathew',
    size: '8210',
    color: 'BK',
    sell: 544,
    quantity: 25,
    status: 'In Progress'
  },
  {
    date: '12/1/23',
    article: 3202,
    customer: 'John Mathew',
    size: '8210',
    color: 'BK',
    sell: 441,
    quantity: 23,
    status: 'Out for Delivery'
  },
  {
    date: '1/1/24',
    article: 3203,
    customer: 'John Mathew',
    size: '8210',
    color: 'BK',
    sell: 488,
    quantity: 20,
    status: 'In Progress'
  },
  {
    date: '2/1/24',
    article: 4202,
    customer: 'John Mathew',
    size: '8210',
    color: 'BK',
    sell: 570,
    quantity: 21,
    status: 'Out for Delivery'
  },
  {
    date: '3/1/24',
    article: 4223,
    customer: 'John Mathew',
    size: '8210',
    color: 'BK',
    sell: 480,
    quantity: 26,
    status: 'No Progress'
  },
  {
    date: '7/1/24',
    article: 5096,
    customer: 'John Mathew',
    size: '739',
    color: 'H1',
    sell: 344,
    quantity: 34,
    status: 'Pending'
  }
]

const RoleDetailsViewPage = () => {
  const { role, id } = useParams()
  const { user } = useAuth()
  const [userDetail, setUserDetail] = useState(null)

  // const user = dummyDetails;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await roleService.getRoleByID(user.accessToken, id)
        console.log('response from backend', res.data)

        setUserDetail(res?.data || null)
      } catch (error) {
        console.error('Error fetching role details:', error)
      }
    }
    fetchData()
  }, [id, user.accessToken])

  return (
    <div className='bg-gray-50 min-h-screen p-4 space-y-6'>
      <div className='bg-white p-4 rounded-md shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
        {userDetail && (
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full'>
            <div className='flex items-center gap-4'>
              <img
                src={userDetail.image}
                alt='avatar'
                className='w-20 h-20 rounded-full object-cover'
              />
              <div>
                <h2 className='text-lg font-semibold'>
                  {userDetail.role.replace(/-/g, ' ') + ' Details'}
                </h2>
                <div className='text-sm text-gray-600 mt-2 space-y-1'>
                  <div>
                    <strong>Name:</strong> {userDetail.name}
                  </div>
                  <div>
                    <strong>Phone Number:</strong> {userDetail.phone}
                  </div>
                  <div>
                    <strong>Email Address:</strong> {userDetail.email}
                  </div>
                  <div>
                    <strong>Location:</strong> {userDetail.location}
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <span className='text-green-600'>{userDetail.status}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => printSalesPDF(tableData)}
                className='border border-gray-300 px-4 py-2 rounded-md text-sm'
              >
                Print
              </button>
              <button
                onClick={() => exportSalesPDF(tableData)}
                className='flex items-center gap-2 px-4 py-2 border rounded text-sm hover:bg-gray-100'
              >
                <FaFilePdf /> PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sales Chart */}
      <div className='bg-white p-4 rounded-md shadow'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-semibold'>Sales Data</h3>
          <div className='flex gap-2 text-sm'>
            <button className='bg-blue-600 text-white px-3 py-1 rounded'>
              Sales
            </button>
            <button className='border px-3 py-1 rounded flex items-center gap-2'>
              <FaCalendarAlt /> Weekly
            </button>
          </div>
        </div>
        <Bar
          data={salesData}
          options={{
            responsive: true,
            plugins: { legend: { display: false } }
          }}
        />
      </div>

      {/* Sales Table */}
      <div className='bg-white p-4 rounded-md shadow overflow-x-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-semibold'>Sales List</h3>
          <div className='flex items-center gap-2 text-sm'>
            <input
              type='text'
              placeholder='Search Article, Date'
              className='border px-4 py-1 rounded'
            />

            <div className='flex items-center gap-1 border px-3 py-1 rounded cursor-pointer'>
              <FaCalendarAlt /> Today
            </div>
            <button
              onClick={() => exportSalesPDF(tableData)}
              className='border border-gray-300 px-4 py-2 rounded-md text-sm'
            >
              Export
            </button>
          </div>
        </div>

        <table className='min-w-[800px] w-full text-sm'>
          <thead className='bg-gray-50 text-gray-600'>
            <tr>
              <th className='text-left px-3 py-2'>Date</th>
              <th className='text-left px-3 py-2'>Article</th>
              <th className='text-left px-3 py-2'>Customer</th>
              <th className='text-left px-3 py-2'>Size</th>
              <th className='text-left px-3 py-2'>Color</th>
              <th className='text-left px-3 py-2'>Sell</th>
              <th className='text-left px-3 py-2'>Quantity</th>
              <th className='text-left px-3 py-2'>Status</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index} className='border-t hover:bg-gray-50'>
                <td className='px-3 py-2 whitespace-nowrap'>{item.date}</td>
                <td className='px-3 py-2 whitespace-nowrap'>{item.article}</td>
                <td className='px-3 py-2 whitespace-nowrap'>{item.customer}</td>
                <td className='px-3 py-2 whitespace-nowrap'>{item.size}</td>
                <td className='px-3 py-2 whitespace-nowrap'>{item.color}</td>
                <td className='px-3 py-2 whitespace-nowrap'>{item.sell}</td>
                <td className='px-3 py-2 whitespace-nowrap'>{item.quantity}</td>
                <td
                  className={`px-3 py-2 whitespace-nowrap ${
                    item.status === 'In Progress'
                      ? 'text-blue-600'
                      : item.status === 'Out for Delivery'
                      ? 'text-green-600'
                      : item.status === 'Pending'
                      ? 'text-orange-500'
                      : 'text-gray-500'
                  }`}
                >
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className='flex justify-between items-center mt-4 text-sm text-gray-600'>
          <button className='border px-4 py-1 rounded'>Previous</button>
          <span>Page 1 of 10</span>
          <button className='border px-4 py-1 rounded'>Next</button>
        </div>
      </div>
    </div>
  )
}

export default RoleDetailsViewPage
