import React, { useEffect, useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { PiPencilSimpleLineBold } from 'react-icons/pi';
import DeleteModal from '../../../../utils/DeleteModal';
import {
  exportProductionPDF,
  printProductionPDF,
} from '../../../../utils/PdfModel';
import { toast } from 'react-toastify';
import schemesService from '../../../../api/schemes.service';
import { useAuth } from '../../../../Context/AuthContext';

const initialschemes = [
  {
    date: '11/12/22',
    name: 'Connect Enterprises',
    completion: '86%',
    type: 'Norem ipsum dolor sit consect',
    id: '1',
  },
  {
    date: '21/12/22',
    name: 'SS Enterprises',
    completion: '65%',
    type: 'Norem ipsum dolor sit consect',
    id: '2',
  },
  {
    date: '5/12/22',
    name: 'Geet Enterprises',
    completion: '55%',
    type: 'Norem ipsum dolor sit consect',
    id: '3',
  },
  {
    date: '8/12/22',
    name: 'Galaxy Enterprises',
    completion: '84%',
    type: 'Norem ipsum dolor sit consect',
    id: '4',
  },
  {
    date: '9/1/23',
    name: 'Maya Enterprises',
    completion: '92%',
    type: 'Norem ipsum dolor sit consect',
    id: '5',
  },
  {
    date: '9/1/23',
    name: 'KK Enterprises',
    completion: '32%',
    type: 'Norem ipsum dolor sit consect',
    id: '6',
  },
];

const SchemeList = ({ handleAddClick, handleEditClick }) => {
  const { user } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await schemesService.getAllSchemes(user.accessToken);
        console.log('res data', res?.data.schemes);
        setSchemes(res.data?.schemes);
      } catch (error) {
        toast.error(error.response?.message);
      }
    })();
  }, [user]);

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
          <button className="border px-4 py-2 rounded text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1">
            Filters
          </button>
          <button
            onClick={() => exportProductionPDF(initialschemes)}
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
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Scheme Name</th>
              <th className="p-3 font-medium">Scheme Description</th>
              <th className="p-3 font-medium">Scheme Type</th>
              <th className="p-3 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((scheme, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-3">{scheme.date}</td>
                <td className="p-3">{scheme.schemesName}</td>
                <td className="p-3">{scheme.schemesDescription}</td>
                <td className="p-3">{scheme.schemesType}</td>
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
        <button className="px-3 py-1 border rounded bg-gray-50">
          Previous
        </button>
        <span>Page 1 of 10</span>
        <button className="px-3 py-1 border rounded bg-gray-50">Next</button>
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
