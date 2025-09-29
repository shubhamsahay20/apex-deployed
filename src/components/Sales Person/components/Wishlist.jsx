import React, { useEffect, useState } from 'react'
import { FiSearch, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import cartService from '../../../api/cart.service'
import { useAuth } from '../../../Context/AuthContext'
import { IoMdArrowRoundUp } from 'react-icons/io'
import { IoMdArrowRoundDown } from 'react-icons/io'
import DeleteModal from '../../../utils/DeleteModal'
import salesService from '../../../api/sales.service'
import { useDebounce } from '../../../hooks/useDebounce'
import Loader from '../../../common/Loader' // ✅ Import Loader

const Wishlist = () => {
  const [wishListOrder, setWishListOrder] = useState([]);
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceValue = useDebounce(searchQuery, 500);
  const [loading, setLoading] = useState(false); // ✅ Loader state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // ✅ Start loader
      try {
        const res = await cartService.getWishListOrderBySalesPerson(
          user.accessToken,
          currentPage,
          10,
          debounceValue,
        );
        console.log('get all order', res);
        setWishListOrder(res.data || []);
        setTotalPages(res.pagination?.totalPages);
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      fetchData();
    }
  }, [user.accessToken, currentPage, debounceValue]);

  const toggleExpand = (idx) => {
    setExpandedRows((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const deleteId = (id) => {
    setConfirmDeleteId(id);
    console.log('id', id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await salesService.deleteWishlist(
        user.accessToken,
        confirmDeleteId,
      );
      console.log('res after delete', res);
      setWishListOrder((prev) =>
        prev.filter((item) => item._id !== confirmDeleteId),
      );
      toast.success('Order Deleted Successfully');

      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
    console.log('hii');
  };

  if (loading) return <Loader />; // ✅ Show loader while fetching

  return (
    <div className="p-6 bg-white border rounded shadow-sm min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h2 className='text-base font-semibold text-gray-800'>
          My Wishlist
        </h2>
        <div className='relative w-full max-w-xs'>
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={e => (
              setSearchQuery(e.target.value),
              setCurrentPage(1)
            )}
            type='text'
            placeholder='Search Article'
            className='w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
          />
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600 border-b">
              <th className="px-6 py-5">SalesOrderNo</th>
              <th className="px-6 py-5">Articles</th>
              <th className="px-6 py-5">Size</th>
              <th className="px-6 py-5">Color</th>
              <th className="px-6 py-5">Soft/Hard</th>
              <th className="px-6 py-5">Quality</th>
              <th className="px-6 py-5">Quantity</th>
              <th className="px-6 py-5">Customer</th>
              <th className="px-6 py-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {wishListOrder
              .filter((item) => item.WishList && item.WishList.length > 0)
              .map((item, idx) => {
                const firstArticle = item.WishList[0];
                const hasMore = item.WishList.length > 1;
                const isExpanded = expandedRows[idx];

                return (
                  <React.Fragment key={idx}>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="px-6 py-5 flex items-center gap-2">
                        {item.salesOrderNo}
                        {'  '}
                        {hasMore && (
                          <button onClick={() => toggleExpand(idx)}>
                            {isExpanded ? (
                              <IoMdArrowRoundUp />
                            ) : (
                              <IoMdArrowRoundDown />
                            )}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-5">{firstArticle.article}</td>
                      <td className="px-6 py-5">{firstArticle.size}</td>
                      <td className="px-6 py-5">{firstArticle.color}</td>
                      <td className="px-6 py-5">{firstArticle.type}</td>
                      <td className="px-6 py-5">{firstArticle.quality}</td>
                      <td className="px-6 py-5">{firstArticle.quantity}</td>
                      <td className="px-6 py-5">{item.customer?.name}</td>
                      <td className="px-6 py-5 flex gap-2 items-center">
                        <button
                          onClick={() => deleteId(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>

                    {isExpanded &&
                      item.WishList.slice(1).map((e, i) => (
                        <tr
                          key={`${idx}-${i}`}
                          className="border-t bg-gray-50 text-gray-700"
                        >
                          <td className="px-6 py-5"></td>
                          <td className="px-6 py-5">{e.article}</td>
                          <td className="px-6 py-5">{e.size}</td>
                          <td className="px-6 py-5">{e.color}</td>
                          <td className="px-6 py-5">{e.type}</td>
                          <td className="px-6 py-5">{e.quality}</td>
                          <td className="px-6 py-5"></td>
                          <td className="px-6 py-5"></td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="border px-4 py-1.5 rounded"
        >
          Previous
        </button>
        <span className="text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="border px-4 py-1.5 rounded"
        >
          Next
        </button>
      </div>
      <DeleteModal
        name="Wishlist"
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Wishlist;
