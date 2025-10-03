'use client';

import { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { PiPencilSimpleLineBold } from 'react-icons/pi';
import DeleteModal from '../../../../utils/DeleteModal';
import { toast } from 'react-toastify';
import announcementService from '../../../../api/announcement.service';
import { useAuth } from '../../../../Context/AuthContext';
import Loader from '../../../../common/Loader';
import { useDebounce } from '../../../../hooks/useDebounce';
import { FaSearch } from 'react-icons/fa';

export default function AnnouncementsList({ onAddClick, onEditClick }) {
  const [announcements, setAnnouncements] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceValue = useDebounce(searchQuery, 500);

  const handleDeleteClick = (id) => {
    if (!id) {
      toast.error('Invalid announcement ID');
      return;
    }
    console.log('id', id);
    setDeleteTarget(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!deleteTarget) {
        toast.error('No announcement selected for deletion');
        return;
      }
      const res = await announcementService.deleteAnnouncement(
        user.accessToken,
        deleteTarget,
      );
      toast.success(res?.message || 'Announcement Delete successfully');
      setAnnouncements((prev) =>
        prev.filter((item) => item._id !== deleteTarget),
      );
      setDeleteTarget(null);
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to delete announcement',
      );
    }
  };

  useEffect(() => {
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      (async () => {
        setLoading(true);
        try {
          const res = await announcementService.getAnnouncement(
            user.accessToken,
            currentPage,
            10,
            debounceValue,
          );
          console.log('res is showing', res);
          setAnnouncements(res.data?.announcement);
          setTotalPages(res.data?.pagination?.totalpages);
        } catch (error) {
          toast.error(
            error.response?.data?.message || 'Failed to fetch announcements',
          );
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [user.accessToken, debounceValue, currentPage]);

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Announcements</h1>
          <div className="flex gap-2 items-center">
            <div className='relative'>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => (
                setSearchQuery(e.target.value), setCurrentPage(1)
              )}
              placeholder="Search Title,Description"
              className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm"
            />
            <FaSearch className="absolute top-2.5 left-2.5 text-gray-400 text-sm" />
            </div>
            <button
              onClick={onAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Add Announcements
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  For Role
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements?.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {announcement.date}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {announcement.time}
                  </td>{' '}
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {announcement.role}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {announcement.title}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {announcement.description}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          onEditClick && onEditClick(announcement._id)
                        }
                        className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                      >
                        <PiPencilSimpleLineBold size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(announcement._id)}
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
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="text-gray-600 border border-gray-300 bg-transparent px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="text-gray-600 border border-gray-300 bg-transparent px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        name="announcement"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
