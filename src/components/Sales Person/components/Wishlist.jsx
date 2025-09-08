import React, { useEffect, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import cartService from '../../../api/cart.service'
import { useAuth } from '../../../Context/AuthContext'
import { IoMdArrowRoundUp } from 'react-icons/io'
import { IoMdArrowRoundDown } from 'react-icons/io'

const Wishlist = () => {
  const [wishListOrder, setWishListOrder] = useState([])
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [expandedRows, setExpandedRows] = useState({}) // track which rows are expanded

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await cartService.getAllWishListOrder(
          user.accessToken,
          currentPage,
          10
        )
        console.log('get all order', res.data)
        setWishListOrder(res.data.sellorder || [])
        setTotalPages(res.data.pagination?.totalPages)
      } catch (error) {
        toast.error(error.response?.data?.message)
      }
    }
    fetchData()
  }, [user.accessToken, currentPage])

  const toggleExpand = idx => {
    setExpandedRows(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  return (
    <div className='p-6 bg-white border rounded shadow-sm min-h-screen'>
      <h2 className='text-base font-semibold text-gray-800 mb-4'>
        My Wishlist
      </h2>

      <div className='overflow-auto'>
        <table className='w-full text-sm border-collapse'>
          <thead>
            <tr className='bg-gray-50 text-left text-gray-600 border-b'>
              <th className='px-6 py-5'>SalesOrderNo</th>
              <th className='px-6 py-5'>Articles</th>
              <th className='px-6 py-5'>Size</th>
              <th className='px-6 py-5'>Color</th>
              <th className='px-6 py-5'>Soft/Hard</th>
              <th className='px-6 py-5'>Quality</th>
              <th className='px-6 py-5'>Customer</th>
              <th className='px-6 py-5'>Action</th>
            </tr>
          </thead>
          <tbody>
            {wishListOrder
              .filter(item => item.WishList && item.WishList.length > 0)
              .map((item, idx) => {
                const firstArticle = item.WishList[0]
                const hasMore = item.WishList.length > 1
                const isExpanded = expandedRows[idx]

                return (
                  <React.Fragment key={idx}>
                    <tr className='border-t hover:bg-gray-50'>
                      <td className='px-6 py-5 flex items-center gap-2'>
                        {item.salesOrderNo}{'  '}
                        {hasMore && (
                          <button
                            onClick={() => toggleExpand(idx)}
                            // className='text-blue-500 hover:text-blue-700 text-lg'
                          >
                            {isExpanded ? (
                              <IoMdArrowRoundUp />
                            ) : (
                              <IoMdArrowRoundDown />
                            )}
                          </button>
                        )}
                      </td>
                      <td className='px-6 py-5'>{firstArticle.article}</td>
                      <td className='px-6 py-5'>{firstArticle.size}</td>
                      <td className='px-6 py-5'>{firstArticle.color}</td>
                      <td className='px-6 py-5'>{firstArticle.type}</td>
                      <td className='px-6 py-5'>{firstArticle.quality}</td>
                      <td className='px-6 py-5'>{item.customer?.name}</td>
                      <td className='px-6 py-5 flex gap-2 items-center'>
                        <button className='text-red-500 hover:text-red-700'>
                          <FiTrash2 />
                        </button>
                        {/* {hasMore && (
                          <button
                            onClick={() => toggleExpand(idx)}
                            className="text-blue-500 hover:underline text-xs"
                          >
                            {isExpanded ? 'Hide' : 'Show More'}
                          </button>
                        )} */}
                      </td>
                    </tr>

                    {isExpanded &&
                      item.WishList.slice(1).map((e, i) => (
                        <tr
                          key={`${idx}-${i}`}
                          className='border-t bg-gray-50 text-gray-700'
                        >
                          <td className='px-6 py-5'></td>
                          <td className='px-6 py-5'>{e.article}</td>
                          <td className='px-6 py-5'>{e.size}</td>
                          <td className='px-6 py-5'>{e.color}</td>
                          <td className='px-6 py-5'>{e.type}</td>
                          <td className='px-6 py-5'>{e.quality}</td>
                          <td className='px-6 py-5'></td>
                          <td className='px-6 py-5'></td>
                        </tr>
                      ))}
                  </React.Fragment>
                )
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between mt-4 text-sm'>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className='border px-4 py-1.5 rounded'
        >
          Previous
        </button>
        <span className='text-gray-500'>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className='border px-4 py-1.5 rounded'
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Wishlist
