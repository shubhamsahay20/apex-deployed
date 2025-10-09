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
    image: null, // new field
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
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
    if (!formData.image) {
      toast.error('Image is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = new FormData();
    payload.append('article',(formData.articleName));
    payload.append(
      'category',
      JSON.stringify([
        {
          categoryCode: parseInt(formData.categoryName),
          color: formData.color.trim(),
          size: formData.size.trim(),
          type: formData.soft_hard.trim(),
          quality: formData.A_B.trim(),
        },
      ])
    );
    payload.append('image', formData.image);

    try {
      const res = await authService.addCategory(user.accessToken, payload);
      toast.success(res?.data?.message || 'Category Added Successfully');
      navigate('/categories');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add category');
    }
  };

  return (
    <div className=" w-full h-full">
      <div className="w-full h-[650px] bg-white rounded-lg shadow-sm  mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            Create Category{' '}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Article */}
            <div>
              <label
                htmlFor="articleName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Article
              </label>
              <input
                type="text"
                id="articleName"
                placeholder="Enter Article"
                value={formData.articleName}
                onChange={(e) => handleChange('articleName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <input
                type="text"
                id="categoryName"
                placeholder="Enter Category"
                value={formData.categoryName}
                onChange={(e) => handleChange('categoryName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Size */}
            <div>
              <label
                htmlFor="size"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Color */}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Soft/Hard */}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
              >
                <option value="">Choose Soft/Hard</option>
                <option value="Soft">Soft</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* A/B */}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
              >
                <option value="">Choose A/B</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mt-6">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 w-32 h-32 object-cover rounded-md border"
              />
            )}
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
