import { useEffect, useState } from 'react'
import { FiEye, FiTrash2, FiSearch, FiCalendar } from 'react-icons/fi'
import DeleteModal from '../../utils/DeleteModal'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import productionService from '../../api/production.service'
import { useAuth } from '../../Context/AuthContext'
import { exportProductionDataPDF, printProductionDataPDF } from '../../utils/PdfModel';
import { useDebounce } from '../../hooks/useDebounce'
import Loader from '../../common/Loader'

const ProductionManager_Management = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const debounceValue = useDebounce(searchQuery, 500)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      ;(async () => {
        try {
          setLoading(true)
          const res = await productionService.getAllProduction(
            user.accessToken,
            currentPage,
            10,
            debounceValue
          )
          setData(res?.data?.products || [])
          setTotalPage(res?.data?.pagination?.totalPages || 1)
        } catch (error) {
          toast.error(
            error?.response?.data?.message || 'Failed to fetch production data'
          )
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [currentPage, user.accessToken, debounceValue])

  const handleDelete = id => {
    setDeleteTarget(id)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const res = await productionService.deleteProduction(
        user.accessToken,
        deleteTarget
      )

      setData(prev => prev.filter(item => item._id !== deleteTarget))
      toast.success(
        res?.data?.message || 'Production Number deleted successfully'
      )
    } catch (error) {
      console.error('Delete API Error:', error)

      toast.error(error?.response?.data?.message || 'Failed to delete record')
    } finally {
      setDeleteTarget(null)
      setDeleteModalOpen(false)
    }
  }
  if (loading) return <Loader />

  return (
    <div className='p-4 bg-white rounded-xl shadow-md'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2'>
        <h2 className='text-lg font-semibold'>Production</h2>

        <div className='flex flex-wrap gap-2 items-center'>
          <div className='relative'>
            <FiSearch className='absolute left-2 top-2.5 text-gray-400' />
            <input
              type='text'
              placeholder='Search Article or PN '
              className='pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm'
              value={searchQuery}
              onChange={e => (
                setSearchQuery(e.target.value), setCurrentPage(1)
              )}
            />
          </div>

          {/* <button className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-md text-sm">
            <FiCalendar />
            Today
          </button> */}

          <button
            onClick={() =>
              navigate('/production-manager/management/add-production')
            }
            className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700'
          >
            Add Production
          </button>

          <button
            onClick={() => printProductionDataPDF(data)}
            className='border border-gray-300 px-4 py-2 rounded-md text-sm'
          >
            Print
          </button>

          <button
            onClick={() => exportProductionDataPDF(data)}
            className='border border-gray-300 px-4 py-2 rounded-md text-sm'
          >
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='min-w-full text-sm border-separate border-spacing-y-2'>
          <thead>
            <tr className='text-left'>
              <th className='px-4 py-2'>Date</th>
              <th className='px-4 py-2'>Production No</th>
              <th className='px-4 py-2'>Article</th>
              <th className='px-4 py-2'>Production Quantity</th>
              <th className='px-4 py-2'>Production Factory</th>
              <th className='px-4 py-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={idx}
                className='bg-white shadow-sm rounded-xl text-gray-700'
              >
                <td>
                  {new Date(item.productionDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className='px-4 py-3'>{item.productionNo}</td>
                <td className='px-4 py-3'>{item.article}</td>
                <td className='px-4 py-3'>{item.productionQuantity}</td>
                <td className='px-4 py-3'>{item.factory?.name}</td>
                <td className='px-4 py-3'>
                  <div className='flex gap-4 items-center'>
                    <FiEye
                      className='text-green-600 cursor-pointer'
                      onClick={() =>
                        navigate(`/production-manager/view-details/${item._id}`)
                      }
                    />
                    {/* <FiEye className="text-green-600 hover:text-green-800 cursor-pointer" /> */}
                    <FiTrash2
                      onClick={() => handleDelete(item._id)}
                      className='text-red-500 hover:text-red-700 cursor-pointer'
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='flex justify-between items-center mt-4 text-sm text-gray-600'>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className='px-3 py-1 border rounded-md'
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPage}
        </span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={totalPage === currentPage}
          className='px-3 py-1 border rounded-md'
        >
          Next
        </button>
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        name='Product'
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default ProductionManager_Management
