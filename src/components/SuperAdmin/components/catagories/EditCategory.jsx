'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../../../../api/auth.service';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';
import { ChevronDown, X } from 'lucide-react';

// ✅ Multi-Select Dropdown
function MultiSelectDropdown({
  label,
  options,
  value,
  onChange,
  placeholder,
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const handleRemove = (option, e) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== option));
  };

  const clearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer flex items-center flex-wrap gap-2"
      >
        {value.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
            >
              {item}
              <button
                type="button"
                onClick={(e) => handleRemove(item, e)}
                className="hover:bg-blue-200 rounded p-0.5"
              >
                <X size={14} />
              </button>
            </span>
          ))
        )}
        <div className="ml-auto flex items-center gap-1">
          {value.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="hover:bg-gray-100 rounded p-1"
            >
              <X size={16} className="text-gray-500" />
            </button>
          )}
          <ChevronDown
            size={20}
            className={`text-gray-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-3 py-2 cursor-pointer transition-colors ${
                value.includes(option)
                  ? 'bg-blue-50 text-blue-800'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

  // ✅ Fetch category by ID
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
          setPreview(data.category.image[0]); // for remote URL
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

  // ✅ Submit handler
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

            {/* ✅ Modified Size input */}
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
                    e.preventDefault(); // prevent form submission
                    document.getElementById('colorInput')?.focus(); // move focus to next input
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* ✅ Color input with ID for focus */}
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
