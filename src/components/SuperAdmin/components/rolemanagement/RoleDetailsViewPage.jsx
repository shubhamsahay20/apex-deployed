import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaFilePdf,
  FaArrowLeft,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaTimes,
  FaUsersCog
} from 'react-icons/fa';
import { exportSalesPDF, printSalesPDF } from '../../../../utils/PdfModel';
import { useAuth } from '../../../../Context/AuthContext';
import roleService from '../../../../api/role.service';

const RoleDetailsViewPage = () => {
  const { role, id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user?.accessToken) {
        setError('Missing required parameters');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await roleService.getRoleByID(user.accessToken, id);
        setUserDetail(res?.data || null);
      } catch (error) {
        setError(
          error.response?.data?.message || 'Failed to fetch role details',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user?.accessToken]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading role details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-gray-100">
          <div className="text-red-500 text-5xl mb-4 animate-pulse">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-gray-100">
          <div className="text-gray-400 text-5xl mb-4 animate-pulse">📭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Data Found
          </h2>
          <p className="text-gray-600">Role details are not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:underline"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 border border-gray-100 hover:shadow-2xl transition-shadow">
        {/* Avatar */}
        <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-4">
          <img
            src={userDetail.profileImage}
            alt={`${userDetail.name}'s avatar`}
            className="w-28 h-28 rounded-full object-cover shadow-lg border-2 border-gray-200 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setIsImageModalOpen(true)}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-wide capitalize">
            {userDetail.role?.replace(/-/g, ' ')}  <span className=' text-blue-600'> {userDetail.name}  </span> Details
          </h2>

          <div className="space-y-3 text-gray-600 text-sm sm:text-base leading-relaxed">
             <p className="flex items-center gap-2">
              <FaUsersCog className="text-blue-500" />
              <span className="font-semibold text-gray-700">Role:</span>{' '}
              {userDetail.role || 'N/A'}
            </p>
            <p className="flex items-center gap-2">
              <FaUser className="text-purple-500" />
              <span className="font-semibold text-gray-700">Name:</span>{' '}
              {userDetail.name || 'N/A'}
            </p>
            <p className="flex items-center gap-2">
              <FaPhoneAlt className="text-blue-500" />
              <span className="font-semibold text-gray-700">Phone:</span>{' '}
              {userDetail.phone || 'N/A'}
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-red-500" />
              <span className="font-semibold text-gray-700">Email:</span>{' '}
              {userDetail.email || 'N/A'}
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-500" />
              <span className="font-semibold text-gray-700">
                Location:
              </span>{' '}
              {userDetail.location || 'N/A'}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <button
              onClick={() => printSalesPDF([userDetail])}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition shadow-sm w-full sm:w-auto"
            >
              Print
            </button>
            <button
              onClick={() => exportSalesPDF([userDetail])}
              className="px-6 py-3 rounded-lg bg-red-500 text-white text-sm font-medium flex items-center justify-center gap-2 shadow-md hover:bg-red-600 transition w-full sm:w-auto"
            >
              <FaFilePdf /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="relative mt-8">
            <button
              className="absolute top-2 right-1 bg-gray text-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-200 transition"
              onClick={() => setIsImageModalOpen(false)}
            >
              <FaTimes />
            </button>
            <img
              src={userDetail.profileImage}
              alt="Full Size"
              className="max-h-[80vh] max-w-full rounded-2xl shadow-2xl object-contain"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500?text=No+Image';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleDetailsViewPage;
