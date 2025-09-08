'use client';

import { useState } from 'react';
import { useAuth } from '../../../../Context/AuthContext';
import authService from '../../../../api/auth.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddCategory({ onSubmit, onCancel }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    articleName: '',
    categoryName: '',
    size: '',
    color: '',
    soft_hard: '',
    A_B: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.articleName.trim()) {
      toast.error('Article name is required');
      return false;
    }
    if (!formData.categoryName.trim()) {
      toast.error('Category name is required');
      return false;
    }
    if (!formData.size.trim()) {
      toast.error('Size is required');
      return false;
    }
    if (!formData.color.trim()) {
      toast.error('Color is required');
      return false;
    }
    if (!formData.soft_hard.trim()) {
      toast.error('Soft/Hard type is required');
      return false;
    }
    if (!formData.A_B.trim()) {
      toast.error('Quality (A/B) is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!validateForm()) return 

    const payload = {
      article: parseInt(formData.articleName),
      category: [
        {
          categoryCode: parseInt(formData.categoryName),
          color: formData.color.trim(),
          size: formData.size.trim(),
          type: formData.soft_hard.trim(),
          quality: formData.A_B.trim(),
        },
      ],
    };

    console.log(payload);

    try {
      const res = await authService.addCategory(user.accessToken, payload);
      toast.success(res?.data?.message || 'Category Added Successfully');
      console.log('Category added successfully');

      navigate('/categories');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add category');
    }
  };

  return (
    <div className=" w-full h-full">
      <div className="w-full h-[600px] bg-white rounded-lg shadow-sm  mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            Create Category{' '}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Field */}
            <div>
              <label
                htmlFor="articleName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Article 
              </label>
              <input
                type="number"
                id="articleName"
                placeholder="Enter Article "
                value={formData.articleName}
                onChange={(e) => handleChange('articleName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category 
              </label>
              <input
                type="number"
                id="categoryName"
                placeholder="Enter  Category "
                value={formData.categoryName}
                onChange={(e) => handleChange('categoryName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="Size"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Size
              </label>
              <input
                type="text"
                id="size"
                placeholder="Enter Size"
                value={formData.size}
                onChange={(e) => handleChange('size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Color
              </label>
              <input
                type="text"
                id="color"
                placeholder="Enter Color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="soft_hard"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Soft/Hard
              </label>
              <select
                id="soft_hard"
                value={formData.soft_hard}
                onChange={(e) => handleChange('soft_hard', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value=""> Choose Soft/Hard</option>
                <option value="Soft">Soft</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="A/B"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                A/B
              </label>
              <select
                id="A/B"
                value={formData.A_B}
                onChange={(e) => handleChange('A_B', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose A/B</option>
                <option value="A"> A</option>
                <option value="B">B</option>
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
