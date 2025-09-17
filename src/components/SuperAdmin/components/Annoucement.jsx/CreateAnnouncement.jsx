'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import announcementService from '../../../../api/announcement.service';
import { useAuth } from '../../../../Context/AuthContext';

export default function CreateAnnouncement({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    role: '',
  });

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    if (!formData.role.trim()) {
      toast.error('Role is required');
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        role: formData.role.trim(),
      };

      console.log('payload of announcement', payload);

      const res = await announcementService.addAnnouncement(
        user.accessToken,
        payload,
      );

      console.log('res is saved', res.data);

      if (onSubmit) {
        onSubmit(formData);
      }
      toast.success(res.data.message || 'Announcement Added Successfully');
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-[600px] bg-white rounded-lg shadow-sm mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            Create Announcements
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Title Field */}
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

            {/* Role Dropdown */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Role
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Role</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Production Manager">Production Manager</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Accounting Manager">Accounting Manager</option>
                <option value="Sales Person">Sales Person</option>
                <option value="Warehouse Manager">Warehouse Manager</option>
                <option value="All">All</option>
              </select>
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
