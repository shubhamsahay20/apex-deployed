import React, { useEffect, useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { PiPencilSimpleLineBold } from 'react-icons/pi';
import DeleteModal from '../../../../utils/DeleteModal';
import {
 exportSchemesPDF,
  printProductionPDF,
} from '../../../../utils/PdfModel';
import { toast } from 'react-toastify';
import schemesService from '../../../../api/schemes.service';
import { useAuth } from '../../../../Context/AuthContext';
import { useDebounce } from '../../../../hooks/useDebounce';
import { FaSearch } from 'react-icons/fa';
import Loader from '../../../../common/Loader';

export const SchemeList = ({ handleAddClick, handleEditClick }) => {
  const { user } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceValue = useDebounce(searchQuery, 500);
  const[loading,setLoading] = useState(false)

  useEffect(() => {
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      (async () => {
        setLoading(true)
        try {
          const res = await schemesService.getAllSchemes(
            user.accessToken,
            currentPage,
            10,
            debounceValue,
          );
          console.log('res data-------------->', res?.data.schemes);
          setSchemes(res.data?.schemes);
          console.log('schemes',schemes);
          
          setTotalPage(res.data?.pagination?.totalpages);
        } catch (error) {
          toast.error(error.response?.message);
        } finally{
          setLoading(false)
        }
      })();
    }
  }, [user, debounceValue, currentPage]);

  const handleDelete = (id) => {
    console.log('item', id);
    setDeleteTarget(id);

    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!deleteTarget) {
        toast.error('No announcement selected for deletion');
        return;
      }
      const res = await schemesService.DeleteSchemeById(
        user.accessToken,
        deleteTarget,
      );
      toast.success(res?.message || 'Scheme Delete successfully');
      setSchemes((prev) => prev.filter((item) => item._id !== deleteTarget));
      setDeleteTarget(null);
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete scheme');
    }
  };

  if (loading) return <Loader/>
  return (
    <div className="p-6 bg-white rounded-md shadow">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Schemes</h2>
        <div className="flex gap-2">
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Add Schemes
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => (
                setSearchQuery(e.target.value), setCurrentPage(1)
              )}
              placeholder="Search Description,Name"
              className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm"
            />
            <FaSearch className="absolute top-2.5 left-2.5 text-gray-400 text-sm" />
          </div>
          {/* <button className="border px-4 py-2 rounded text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1">
            Filters
          </button> */}
          <button
            onClick={() => exportSchemesPDF(schemes)}
            className="border px-4 py-1.5 rounded-md text-sm text-gray-700 border-gray-300"
          >
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-md">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 font-medium"> Starting Date</th>
              <th className="p-3 font-medium"> Ending Date</th>
              <th className="p-3 font-medium">Scheme Name</th>
              <th className="p-3 font-medium">Scheme Description</th>
              <th className="p-3 font-medium">Scheme Type</th>
              <th className="p-3 font-medium">To Apply</th>
              <th className="p-3 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((scheme, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-3">{scheme.date}</td>
                <td className="p-3">{scheme.expireDate}</td>
                <td className="p-3">{scheme.schemesName}</td>
                <td className="p-3">{scheme.schemesDescription}</td>
                <td className="p-3">{scheme.schemesType}</td>
                <td className="p-3">{scheme.schemesQuantity}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() =>
                      handleEditClick && handleEditClick(scheme._id)
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PiPencilSimpleLineBold size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(scheme._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 border rounded bg-gray-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPage}
        </span>
        <button
          disabled={currentPage === totalPage}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 border rounded bg-gray-50"
        >
          Next
        </button>
      </div>
      <DeleteModal
        name="Scheme"
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default SchemeList;
