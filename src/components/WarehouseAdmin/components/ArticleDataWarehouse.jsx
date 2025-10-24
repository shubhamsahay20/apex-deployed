import React, { useEffect, useState } from 'react'
import { exportWarehousePDF } from '../../../utils/PdfModel'
import { useAuth } from '../../../Context/AuthContext'
import { toast } from 'react-toastify'
import salesService from '../../../api/sales.service'
import { useDebounce } from '../../../hooks/useDebounce'
import Loader from '../../../common/Loader'
import ImageModal from '../../../utils/ImageModal'

const ArticalData = () => {
  const { user } = useAuth()
  const [articledetails, setArticledetails] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const debounceValue = useDebounce(searchQuery, 500)
  const [loading, setLoading] = useState(false)
  const [modalImage, setModalImage] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await salesService.getAllArtical(
          user.accessToken,
          currentPage,
          10,
          debounceValue
        )
        setTotalPages(res?.pagination?.totalPages || 1)
        setArticledetails(res?.data || [])
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      fetchData()
    }

    return () => console.log('clean')
  }, [user, currentPage, debounceValue])

  if (loading) return <Loader />

  return (
    <div className='min-h-screen bg-gray-100 py-8 px-4'>
      <div className='max-w-7xl mx-auto bg-white rounded-lg shadow-md border p-6'>
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3'>
          <h2 className='text-lg sm:text-xl font-semibold text-gray-800'>
            Products List
          </h2>

          <div className='flex items-center gap-3 w-full sm:w-auto'>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              type='text'
              placeholder='Search Article or Order'
              className='w-full sm:w-60 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
            />
            <button
              onClick={() => exportWarehousePDF(articledetails)}
              className='text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition'
            >
              Export
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-sm'>
            <thead>
              <tr className='bg-gray-50 border-b text-gray-700'>
                <th className='p-3 font-medium text-left'>Image</th>
                <th className='p-3 font-medium text-left'>Article</th>
                <th className='p-3 font-medium text-left'>Category Code</th>
                <th className='p-3 font-medium text-left'>Size</th>
                <th className='p-3 font-medium text-left'>Color</th>
                <th className='p-3 font-medium text-left'>Soft/Hard</th>
                <th className='p-3 font-medium text-left'>Quality</th>
                <th className='p-3 font-medium text-left text-center'>
                  Production Qty
                </th>
                <th className='p-3 font-medium text-left text-center'>
                  Warehouse Qty
                </th>
                <th className='p-3 font-medium text-left text-center'>
                  Total Qty
                </th>
              </tr>
            </thead>
            <tbody>
              {articledetails.length > 0 ? (
                articledetails.map((row, idx) => (
                  <tr
                    key={idx}
                    className='border-t hover:bg-gray-50 transition-colors'
                  >
                    <td className='p-3'>
                      <img
                        src={row.image}
                        alt={row.article}
                        onClick={() => setModalImage(row.image)}
                        className='w-12 h-12 object-cover rounded-full border border-gray-200 cursor-pointer hover:scale-105 transition'
                      />
                    </td>

                    <td className='p-3 text-gray-800 font-semibold'>
                      {row.article}
                    </td>
                    <td className='p-3 text-gray-700'>{row.categoryCode}</td>
                    <td className='p-3 text-gray-700'>{row.size}</td>
                    <td className='p-3 text-gray-700'>{row.color}</td>
                    <td className='p-3 text-gray-700'>{row.type}</td>
                    <td className='p-3 text-gray-700'>{row.quality}</td>
                    <td className='p-3 text-center text-blue-600 font-semibold'>
                      {row.Production_Qty}
                    </td>
                    <td className='p-3 text-center text-blue-600 font-semibold'>
                      {row.Warehouse_Qty}
                    </td>
                    <td className='p-3 text-center text-green-600 font-semibold'>
                      {row.Total_Available}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan='10'
                    className='text-center py-6 text-gray-500 italic'
                  >
                    No articles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between mt-6'>
          <button
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm rounded-md border transition ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            Previous
          </button>

          <span className='text-xs text-gray-500'>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm rounded-md border transition ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal imageUrl={modalImage} onClose={() => setModalImage(null)} />
    </div>
  )
}

export default ArticalData
