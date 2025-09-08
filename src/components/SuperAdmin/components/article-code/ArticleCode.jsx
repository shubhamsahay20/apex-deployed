import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { PiPencilSimpleLineBold } from 'react-icons/pi';
import DeleteModal from '../../../../utils/DeleteModal';
import authService from '../../../../api/auth.service';
import { useAuth } from '../../../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ArticleCode = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectId, setSelectId] = useState(null);

  const [selectedData, setSelectedData] = useState({
    article: '',
    categoryName: '',
    articleCode: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await authService.getCategories(
          user.accessToken,
          currentPage,
          10,
        );

        if (res?.data?.data) {
          setAnnouncements(res.data.data);
          setTotalPages(res.data.pagination?.totalPages);
        } else {
          toast.error('No categories found');
        }
        // console.log(res.data.data, 'response');
        // setAnnouncements(res.data.data);
        // setTotalPages(res.data.pagination.totalPages);
      } catch (error) {
        toast.error(
          error?.response?.data.message || 'Failed to fetch categories',
        );
      }
    })();
  }, [user.accessToken, currentPage]);

  const handleAdd = () => {
    navigate('/add-articlecode');
  };

  const handleDelete = (item) => {
    if (!item?._id) {
      toast.error('Invalid category ID');
      return;
    }
    setSelectId(item._id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async() => {
    if (!selectId) {
      toast.error('No category selected to delete');
      return;
    }

    try {
     await authService.DeleteCategory(selectId, user.accessToken);
      toast.success('Category deleted successfully');
      setAnnouncements((prev) => prev.filter((item) => item._id !== selectId));
      setDeleteModalOpen(false);
      setSelectId(null);

      // setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message, 'Error deleting Category');
    }
  };

  const handleView = (item) => {
    if (!item) {
      toast.error('Invalid category data');
      return;
    }
    setSelectedData(item);
    setIsEdit(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-6xl bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4 border-b bg-white">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
            Article Codes
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by Article or Category"
              className="px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring w-full sm:w-60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition mt-2 sm:mt-0"
            >
              <FaPlus /> Add Code
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3">Article</th>
                <th className="px-6 py-3">Category </th>
                <th className="px-6 py-3">Article Code</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {announcements
                .filter((item) => item.articleCode)
                .map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{row.article}</td>
                    <td className="px-6 py-4">
                      {row.category.map((item) => item.categoryCode)}
                    </td>
                    <td className="px-6 py-4">{row.articleCode}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4 text-lg">
                        <button title="View" onClick={() => handleView(row)}>
                          {/* <FiEye className="text-blue-600 hover:text-blue-700 cursor-pointer" /> */}
                        </button>
                        <button
                          title="Edit"
                          onClick={() =>
                            navigate(`/edit-articlecode/${row._id}`)
                          }
                        >
                          <PiPencilSimpleLineBold className="text-green-600 hover:text-green-700 cursor-pointer" />
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          className="text-red-600 hover:text-red-800 p-1 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-1.5 border rounded text-sm hover:bg-gray-100"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-1.5 border rounded text-sm hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        name="Article Code"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ArticleCode;
