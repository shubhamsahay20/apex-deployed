'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../../../../api/auth.service';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';


const EditCategory = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    articleName: '',
    categoryName: '',
    size: '',
    color: '',
    soft_hard: [],
    A_B: [],
    image: null,
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  console.log('previously', preview);

  // Fetch category by ID
  useEffect(() => {
    (async () => {
      try {
        const response = await authService.getCategoryByIdForSingle(
          user.accessToken,
          id,
        );
        const data = response.data.data;

        setFormData({
          articleName: data.article || '',
          categoryName: data.category.categoryCode || '',
          size: data.category.size || '',
          color: data.category.color || '',
          soft_hard: data.category.type || [],
          A_B: data.category.quality || [],
          image: null,
        });

        if (data.category?.image?.[0]) {
          setPreview(data.category.image[0]);
          console.log('Preview URL:', data.category.image[0]);
        }

        if (data.category?.image?.[0]) {
          console.log('IMAGE URL FROM BACKEND:', data.category.image[0]);
          setPreview(data.category.image[0]);
        }

        console.log('img', data.category.image[0]);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || 'Failed to fetch category data',
        );
      }
    })();
  }, [id, user.accessToken]);

  //  Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.articleName ||
      !formData.categoryName ||
      !formData.size ||
      !formData.color ||
      formData.soft_hard.length === 0 ||
      formData.A_B.length === 0
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = new FormData();
    payload.append('article', formData.articleName);
    payload.append('size', formData.size);
    payload.append('color', formData.color);
    if (formData.image) payload.append('image', formData.image);

    try {
      const res = await authService.editCategory(user.accessToken, id, payload);
      toast.success(res?.data?.message || 'Article updated successfully');
      navigate('/categories');
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          'Failed to Edit Article May be the image size is large',
      );
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-[700px] bg-white rounded-lg shadow-sm mx-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Edit Category</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Name
              </label>
              <input
                type="text"
                readOnly
                value={formData.articleName}
                onChange={(e) => handleChange('articleName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                readOnly
                value={formData.categoryName}
                onChange={(e) => handleChange('categoryName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/*  Modified Size input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => handleChange('size', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); 
                    document.getElementById('colorInput')?.focus(); 
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Color input with ID for focus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                id="colorInput"
                type="text"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 w-32 h-32 object-cover rounded-md border"
              />
            )}
          </div>

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
};

export default EditCategory;
