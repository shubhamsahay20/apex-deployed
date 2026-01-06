import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { CiCalendar } from 'react-icons/ci'
import { BsDownload } from 'react-icons/bs'
import { FaFilePdf } from 'react-icons/fa6'
import {
  exportProductionPDF,
  printProductionPDF
} from '../../../../utils/PdfModel'
import { useAuth } from '../../../../Context/AuthContext'
import { toast } from 'react-toastify'
import logsService from '../../../../api/logs.service'
import Loader from '../../../../common/Loader' 
import { useDebounce } from '../../../../hooks/useDebounce'

const Logs = () => {
  const { user } = useAuth()
  const [logData, setLogData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedValue = useDebounce(searchQuery, 500)
  const [loading, setLoading] = useState(false) 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true) 
      try {
        const res = await logsService.getLogs(
          user.accessToken,
          currentPage,
          10,
          debouncedValue
        )
        setLogData(res.data)
        setTotalPage(res.pages)
      } catch (error) {
        toast.error(error.response?.data?.message)
      } finally {
        setLoading(false) 
      }
    }
    if (debouncedValue.length === 0 || debouncedValue.length >= 2) {
      fetchData()
    }
  }, [user, debouncedValue, currentPage])

  if (loading) return <Loader />

  return (
    <div className='p-6 bg-white rounded-xl shadow-md'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6'>
        <h2 className='text-xl font-semibold text-gray-800'>Logs</h2>

        <div className='flex flex-wrap items-center gap-3'>
          {/* Search */}
          <div className='relative'>
            <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              value={searchQuery}
              onChange={e => (
                setSearchQuery(e.target.value), setCurrentPage(1)
              )}
              placeholder='Search Name,Activity'
              className='border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>

          {/* Date Filter */}
        

          {/* Print & PDF */}
          <button
            onClick={() => printProductionPDF(logData)}
            className='border border-gray-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 transition'
          >
            <BsDownload /> Print
          </button>
          <button
            onClick={() => exportProductionPDF(logData)}
            className='border border-gray-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 transition'
          >
            <FaFilePdf /> PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto rounded-lg border border-gray-200'>
        <table className='w-full text-sm text-left border-collapse'>
          <thead className='bg-gray-100 text-gray-700'>
            <tr>
              <th className='p-3 border-b'>S/No.</th>
              <th className='p-3 border-b'>Date & Time</th>
              <th className='p-3 border-b'>Type</th>
              <th className='p-3 border-b'>Name</th>
              <th className='p-3 border-b'>Activity</th>
            </tr>
          </thead>
          <tbody>
            {logData.length > 0 ? (
              logData.map((log, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-blue-50 transition`}
                >
                  
                  <td className='p-3 border-b text-gray-700'>{index+1}</td>
                  <td className='p-3 border-b text-gray-700'>
                    {log.updatedAt}
                  </td>
                  <td className='p-3 border-b text-gray-700'>{log.type}</td>
                  <td className='p-3 border-b text-gray-700'>{log.name}</td>
                  <td className='p-3 border-b text-gray-700'>{log.Action}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan='4'
                  className='p-4 text-center text-gray-500 italic'
                >
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='flex justify-between items-center mt-5 text-sm text-gray-600'>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          Previous
        </button>

        <span className='font-medium'>
          Page {currentPage} of {totalPage}
        </span>

        <button
          disabled={currentPage === totalPage}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === totalPage
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Logs
