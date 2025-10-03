import React, { useEffect, useState } from 'react';
import Loader from '../../../../common/Loader';
import { FaFilter, FaPlus, FaSearch } from 'react-icons/fa';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { PiPencilSimpleLineBold } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import authService from '../../../../api/auth.service';
import { useAuth } from '../../../../Context/AuthContext';
import DeleteModal from '../../../../utils/DeleteModal';
import { toast } from 'react-toastify';
import { IoFilter } from 'react-icons/io5';
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
  const debounceValue = useDebounce(searchQuery, 500);

  // CSV Upload Handler with loading management
  const handleCSVUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (!file) {
      toast.error('Please select a CSV file to upload');
      return;
    }

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Invalid file format. Please upload a .csv file');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await authService.UploadCsv(user.accessToken, formData);
      toast.success(res?.data?.message || 'CSV uploaded successfully:');
      await fetchCategories();
    } catch (error) {
      console.log('error for uploading', error);
      toast.error(error?.response?.data?.message || 'CSV upload failed');
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler now async and loader-enabled
  const confirmDelete = async () => {
    if (!selectId) {
      toast.error('No category selected for deletion');
      return;
    }
    setLoading(true);

    try {
     const res =  await authService.DeleteCategory(selectId, user.accessToken);
     console.log("res delete",res.data.data);
     
      toast.success( res.data?.data?.message ||'Category deleted successfully');
      setCategories((prev) => prev.filter((item) => item._id !== selectId));
      setShowDeleteModal(false);
      setSelectId(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error deleting Category');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories with loader
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await authService.getCategories(
        user.accessToken,
        currentPage,
        10,
        debounceValue,
      );
      setCategories(response?.data?.data || []);
      setTotalPages(response?.data?.pagination?.totalPages || 1);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to fetch categories',
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

  const handleEdit = (id) => {
    navigate(`/editcategory/${id}`);
  };

  const handleDelete = (item) => {
    setSelectId(item._id);
    setShowDeleteModal(true);
  };

  // Loader conditional render
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-6xl bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
          <h2 className="text-xl font-medium text-gray-700">Category</h2>
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
            {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition text-gray-700">
              <IoFilter /> Filters
            </button> */}
            <button
              onClick={() => navigate('/addcategory')}
              className=" flex items-center gap-1 bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
            >
              <FaPlus /> Create Category
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Article
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {categories
                .filter((row) => row.isActive === true)
                .map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{row.article}</td>
                    <td className="px-6 py-4">
                      {row.category.map((item) => item.categoryCode).join(', ')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4 text-lg">
                        <button
                          title="Edit"
                          className="hover:scale-110 transition-transform"
                          onClick={() => handleEdit(row._id)}
                        >
                          <PiPencilSimpleLineBold className="text-green-600 hover:text-green-700 cursor-pointer" />
                        </button>
                        <button
                          title="Delete"
                          className="hover:scale-110 transition-transform"
                          onClick={() => handleDelete(row)}
                        >
                          <FiTrash2 className="text-red-600 hover:text-red-700 cursor-pointer" />
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

        {/* Add/Edit Modal */}
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
