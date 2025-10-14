'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../../Context/AuthContext';
import authService from '../../../../api/auth.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChevronDown, X } from 'lucide-react';

// Multi-Select Dropdown Component
function MultiSelectDropdown({
  label,
  options,
  value,
  onChange,
  placeholder,
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
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

export default function AddCategory({ onSubmit, onCancel }) {
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
    if (formData.soft_hard.length === 0) {
      toast.error('Soft/Hard type is required');
      return false;
    }
    if (formData.A_B.length === 0) {
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
    payload.append('article', formData.articleName);
    payload.append(
      'category',
      JSON.stringify([
        {
          categoryCode: formData.categoryName,
          color: formData.color.trim(),
          size: formData.size.trim(),
          type: formData.soft_hard,
          quality: formData.A_B,
        },
      ]),
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

            {/* Soft/Hard - Multi Select */}
            <MultiSelectDropdown
              id="soft_hard"
              label="Soft/Hard"
              options={['Soft', 'Hard']}
              value={formData.soft_hard}
              onChange={(value) => handleChange('soft_hard', value)}
              placeholder="Choose Soft/Hard"
            />

            {/* A/B - Multi Select */}
            <MultiSelectDropdown
              id="A_B"
              label="A/B"
              options={['A', 'B']}
              value={formData.A_B}
              onChange={(value) => handleChange('A_B', value)}
              placeholder="Choose A/B"
            />
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
