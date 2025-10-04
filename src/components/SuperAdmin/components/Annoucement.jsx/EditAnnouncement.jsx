'use client';

import { useState, useEffect } from 'react';
import announcementService from '../../../../api/announcement.service';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../../../../common/Loader';

export default function EditAnnouncement({ announcement, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
  });
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
     try {
       const res = await announcementService.getAnnouncementById(
         user.accessToken,
         announcement,
       );
       console.log('its my res', res.data);
       setFormData({
         date: res.data?.date,
         title: res.data?.title,
         description: res.data?.description,
       });
     } catch (error) {
      toast.error(error?.response?.data?.message) 
     } finally{
      setLoading(false)
     }
    })();
  }, [announcement]);

  const handleSubmit = async (e) => {
    if (!formData.date.trim()) {
      toast.error('Date is required');
      return;
    }
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    e.preventDefault();
    setLoading(true)
    try {
      const payload = {
        description: formData.description,
        title: formData.title,
        date: formData.date,
      };

      console.log('payload', payload);

      const res = await announcementService.updateAnnouncementById(
        user.accessToken,
        announcement,
        payload,
      );

      console.log('update res ', res.data);
      toast.success(res.data?.message || 'Updated Successfully');

      console.log('announcement', announcement);

      if (announcement && onSubmit) {
        onSubmit({
          id: announcement,
          ...formData,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally{
      setLoading(false)
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  if(loading) return <Loader/>

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm max-w-4xl mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            Edit Announcements
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Field */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                placeholder="dd/mm/yyyy"
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Announcement Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Announcement Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter Announcement Title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
