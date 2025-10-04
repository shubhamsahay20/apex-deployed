import React, { useEffect, useState } from 'react';
import { TiPinOutline } from 'react-icons/ti';
import ReactApexChart from 'react-apexcharts';
import { CiCalendarDate } from 'react-icons/ci';
import { IoFilter } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import announcementService from '../../../../api/announcement.service';
import { useAuth } from '../../../../Context/AuthContext';
import Loader from '../../../../common/Loader';

const Salespersondashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [annoucementData, setAnnoucementData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await announcementService.getAnnouncement(
          user.accessToken,
          currentPage,
          4,
        );
        console.log('response', res.data);
        setAnnoucementData(res.data?.announcement);
        setTotalPages(res?.data?.pagination?.totalpages);
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, currentPage]);

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-xl flex items-center gap-2 text-gray-800">
            <span className="text-blue-600">●</span> Announcements & Daily
            Updates
          </h2>
          <button
            onClick={() => navigate('/salesPerson/create_New_Order')}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm px-5 py-2 rounded-lg shadow-md transition"
          >
            + Create New Order
          </button>
        </div>

        <div className="space-y-4">
          {annoucementData.map((item) => {
            return (
              <div
                key={item._id}
                className="border-l-4 border-gray-200 pl-4 pr-6 py-3 bg-gray-50 rounded-md relative hover:shadow-sm transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      {item.date} — {item.time}
                    </div>
                    <div className="text-blue-900 font-bold">{item.title}</div>
                    <p className="text-gray-600 text-sm mt-1">
                      {item.description}
                    </p>
                  </div>
                  {item.isActive && (
                    <TiPinOutline className="text-gray-400 mt-1" size={20} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

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
    </div>
  );
};

export default Salespersondashboard;
