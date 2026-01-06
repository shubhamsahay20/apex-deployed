import React, { useEffect, useState } from 'react'
import { exportArticlesPDF } from '../../../utils/PdfModel'
import { useAuth } from '../../../Context/AuthContext'
import { toast } from 'react-toastify'
import wishlistService from '../../../api/wishlist.service'
import { useDebounce } from '../../../hooks/useDebounce'
import { FaSearch, FaFileExport } from 'react-icons/fa'
import Loader from '../../../common/Loader'
import ImageModal from '../../../utils/ImageModal'
import { FiTrash2 } from 'react-icons/fi'

const WishlistData = () => {
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [articledetails, setArticledetails] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const debounceValue = useDebounce(searchQuery, 500)
  const [modalImage, setModalImage] = useState(null)

  const handleDelete = async (id) => {
  if (!id) return;

  const confirmDelete = window.confirm(
    'Are you sure you want to delete this article?'
  );

  if (!confirmDelete) return;

  try {
    await wishlistService.DeleteWishlist(user.accessToken, id);

    toast.success('Article deleted successfully');

    // 🔥 Remove deleted item from UI without refetch
    setArticledetails(prev =>
      prev.filter(item => item._id !== id)
    );
  } catch (error) {
    toast.error(error.message || 'Failed to delete article');
  }
};


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await wishlistService.getAllWishlists(
          user.accessToken,
          currentPage,
          10,
          debounceValue
        )

        // pagination
        setTotalPages(res?.pagination?.totalPages || 1)

        // 🔥 FLATTEN API RESPONSE (IMPORTANT FIX)
        const flattenedData =
          res?.data?.flatMap(item =>
            item.WishList.map(w => ({
              _id: item._id,
              article: w.article,
              categoryCode: w.categoryCode,
              size: w.size,
              color: w.color,
              type: w.type,
              quality: w.quality,
              quantity: w.quantity,
              // quantities (not provided by wishlist API)
              Production_Qty: 0,
              Warehouse_Qty: 0,
              Order_Qty: 0,
              Cart_Qty: w.quantity || 0,
              Total_Available: w.quantity || 0,

              // image
              image: w.image?.[0] || '/placeholder.png'
            }))
          ) || []

        setArticledetails(flattenedData)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      fetchData()
    }
  }, [user, currentPage, debounceValue])

  if (loading) return <Loader />

  return (
    <div className='bg-gray-100 min-h-screen p-4 sm:p-6'>
      <div className='bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5'>
          <h3 className='text-xl font-semibold text-gray-800'>Products List</h3>

          <div className='flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto'>
            {/* Search */}
            <div className='relative w-full sm:w-64'>
              <FaSearch className='absolute top-3 left-3 text-gray-400 text-sm' />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                type='text'
                placeholder='Search by Article or Order'
                className='pl-9 pr-3 py-2 border rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Export */}
            <button
              onClick={() => exportArticlesPDF(articledetails)}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition'
            >
              <FaFileExport size={14} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto rounded-lg border border-gray-200 shadow-sm'>
          <table className='w-full text-sm text-left border-collapse'>
            <thead className='bg-gray-50 sticky top-0 z-10'>
              <tr className='text-gray-700'>
                <th className='p-3'>S/No.</th>
                <th className='p-3'>Image</th>
                <th className='p-3'>Article</th>
                <th className='p-3'>Category Code</th>
                <th className='p-3'>Size</th>
                <th className='p-3'>Color</th>
                <th className='p-3'>Soft/Hard</th>
                <th className='p-3'>Quality</th>
                <th className="p-3">Quantity</th>
                <th className='p-3'>Action</th>
                {/* <th className="p-3">Order Qty</th>
                <th className="p-3">Cart Qty</th>
                <th className="p-3">Total Qty</th> */}
              </tr>
            </thead>

            <tbody>
              {articledetails.length > 0 ? (
                articledetails.map((row, idx) => {
                  const isLowStock = row.Total_Available < 10

                  return (
                    <tr
                      key={idx}
                      className={`border-t hover:bg-blue-50 transition ${
                        isLowStock
                          ? 'bg-red-50'
                          : idx % 2 === 0
                          ? 'bg-white'
                          : 'bg-gray-50'
                      }`}
                    >
                      <td className='p-3' >{idx + 1}</td>
                      <td className='p-3'>
                        <img
                          src={row.image}
                          alt='article'
                          onClick={() => setModalImage(row.image)}
                          className='w-10 h-10 rounded-full object-cover border cursor-pointer hover:scale-110 transition'
                        />
                      </td>
                      <td className='p-3 font-medium'>{row.article}</td>
                      <td className='p-3'>{row.categoryCode}</td>
                      <td className='p-3'>{row.size}</td>
                      <td className='p-3'>{row.color}</td>
                      <td className='p-3'>{row.type}</td>
                      <td className='p-3'>{row.quality}</td>
                       <td className="p-3 ">
                        {row.quantity}
                      </td>
                      <td className='px-3 py-2 whitespace-nowrap flex items-center gap-3 justify-center'>
                      
                        <FiTrash2
                          className='text-red-500 cursor-pointer'
                          onClick={() => handleDelete(row._id)}
                        />
                      </td>
                     
                      {/* <td className="p-3 text-blue-600 font-semibold">
                        {row.Warehouse_Qty}
                      </td>
                      <td className="p-3 text-blue-600 font-semibold">
                        {row.Order_Qty}
                      </td>
                      <td className="p-3 text-blue-600 font-semibold">
                        {row.Cart_Qty}
                      </td>
                      <td className="p-3 text-blue-600 font-semibold">
                        {row.Total_Available}
                      </td> */}
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan='12' className='text-center py-8 text-gray-500'>
                    No Articles Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Image Modal */}
        {modalImage && (
          <ImageModal
            imageUrl={modalImage}
            onClose={() => setModalImage(null)}
          />
        )}

        {/* Pagination */}
        <div className='flex items-center justify-between mt-6'>
          <button
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
            className='px-4 py-2 border rounded disabled:opacity-50'
          >
            Previous
          </button>

          <span className='text-sm'>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
            className='px-4 py-2 border rounded disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default WishlistData
