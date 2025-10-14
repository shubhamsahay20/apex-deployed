import React, { useEffect, useState } from 'react';
import Loader from '../../../../common/Loader';
import { FiEye } from 'react-icons/fi';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import { PiPencilSimpleLineBold } from 'react-icons/pi';
import { IoMdArrowRoundDown, IoMdArrowRoundUp } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import authService from '../../../../api/auth.service';
import { useAuth } from '../../../../Context/AuthContext';
import DeleteModal from '../../../../utils/DeleteModal';
import { toast } from 'react-toastify';
import { useDebounce } from '../../../../hooks/useDebounce';

const Category = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectId, setSelectId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const debounceValue = useDebounce(searchQuery, 500);

  const toggleExpand = (idx) => {
    setExpandedRows((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return toast.error('Please select a CSV file to upload');
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Invalid file format. Please upload a .csv file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await authService.UploadCsv(user.accessToken, formData);
      toast.success(res?.data?.message || 'CSV uploaded successfully');
      await fetchCategories();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'CSV upload failed');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectId) return toast.error('No category selected for deletion');
    setLoading(true);
    try {
      const res = await authService.DeleteCategory(selectId, user.accessToken);
      toast.success(res.data?.data?.message || 'Category deleted successfully');

      // Update categories to remove deleted category
      setCategories((prev) =>
        prev.map((article) => ({
          ...article,
          category: article.category.filter((c) => c._id !== selectId),
        }))
      );

      setShowDeleteModal(false);
      setSelectId(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error deleting category');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await authService.getCategories(
        user.accessToken,
        currentPage,
        10,
        debounceValue
      );
      setCategories(response?.data?.data || []);
      setTotalPages(response?.data?.pagination?.totalPages || 1);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to fetch categories'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      fetchCategories();
    }
  }, [user.accessToken, debounceValue, currentPage]);

  const handleEdit = (id) => navigate(`/editcategory/${id}`);
  const handleDelete = (catId) => {
    setSelectId(catId);
    setShowDeleteModal(true);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-6xl bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
          <h2 className="text-xl font-medium text-gray-700">Article List</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => (
                  setSearchQuery(e.target.value), setCurrentPage(1)
                )}
                placeholder="Search Article"
                className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm"
              />
              <FaSearch className="absolute top-2.5 left-2.5 text-gray-400 text-sm" />
            </div>
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition text-gray-700 cursor-pointer">
              <FaPlus /> Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={() => navigate('/addcategory')}
              className=" flex items-center gap-1 bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
            >
              <FaPlus /> Create Article
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3">Article</th>
                <th className="px-6 py-3">Category Name</th>
                <th className="px-6 py-3">Size</th>
                <th className="px-6 py-3">Color</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Quality</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {categories
                .map((row, idx) => {
                  const activeCategories =
                    row.category?.filter((c) => c.isActive !== false) || [];
                  if (activeCategories.length === 0) return null;

                  const first = activeCategories[0];
                  const hasMore = activeCategories.length > 1;
                  const isExpanded = expandedRows[idx];

                  return (
                    <React.Fragment key={idx}>
                      {/* First category row */}
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center gap-2">
                          {row.article}
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
                        <td className="px-6 py-4">{first.categoryCode}</td>
                        <td className="px-6 py-4">{first.size}</td>
                        <td className="px-6 py-4">{first.color}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(first.type)
                              ? first.type.map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                                  >
                                    {item}
                                  </span>
                                ))
                              : first.type}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(first.quality)
                              ? first.quality.map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium"
                                  >
                                    {item}
                                  </span>
                                ))
                              : first.quality}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-4 text-lg">
                            <button
                              title="View"
                              onClick={() =>
                                navigate(`/ViewArticle-details/${row._id}`)
                              }
                            >
                              <FiEye className="text-blue-600 hover:text-blue-700 cursor-pointer" />
                            </button>
                            <button
                              title="Edit"
                              onClick={() => handleEdit(row._id)}
                            >
                              <PiPencilSimpleLineBold className="text-green-600 hover:text-green-700 cursor-pointer" />
                            </button>
                            <button
                              title="Delete"
                              onClick={() => handleDelete(first._id)}
                            >
                              <FiTrash2 className="text-red-600 hover:text-red-700 cursor-pointer" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded rows */}
                      {isExpanded &&
                        activeCategories.slice(1).map((cat, i) => (
                          <tr
                            key={`${idx}-${i}`}
                            className="border-b bg-gray-50 text-gray-700"
                          >
                            <td className="px-6 py-4"></td>
                            <td className="px-6 py-4">{cat.categoryCode}</td>
                            <td className="px-6 py-4">{cat.size}</td>
                            <td className="px-6 py-4">{cat.color}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(cat.type)
                                  ? cat.type.map((item, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                                      >
                                        {item}
                                      </span>
                                    ))
                                  : cat.type}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(cat.quality)
                                  ? cat.quality.map((item, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium"
                                      >
                                        {item}
                                      </span>
                                    ))
                                  : cat.quality}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-4 text-lg">
                                <button
                                  title="Edit"
                                  onClick={() => handleEdit(row._id)}
                                >
                                  <PiPencilSimpleLineBold className="text-green-600 hover:text-green-700 cursor-pointer" />
                                </button>
                                <button
                                  title="Delete"
                                  onClick={() => handleDelete(cat._id)}
                                >
                                  <FiTrash2 className="text-red-600 hover:text-red-700 cursor-pointer" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <button
            className="px-4 py-1.5 border rounded text-sm text-gray-700 hover:bg-gray-100"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-1.5 border rounded text-sm text-gray-700 hover:bg-gray-100"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>

        {/* Delete Modal */}
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          isOpen={showDeleteModal}
          name="Category"
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};

export default Category;
