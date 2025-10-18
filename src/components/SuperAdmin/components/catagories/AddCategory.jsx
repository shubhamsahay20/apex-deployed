'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../../Context/AuthContext';
import authService from '../../../../api/auth.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChevronDown, X } from 'lucide-react';
import { RxCross2 } from "react-icons/rx";

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

// Multi-Input Field Component
function MultiInputField({ label, value, onChange, placeholder, id }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleRemove = (item, e) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== item));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.focus()}
        className="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-text flex items-center flex-wrap gap-2"
      >
        {value.map((item) => (
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
        ))}
        <input
          ref={inputRef}
          type="text"
          id={id}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="hover:bg-gray-100 rounded p-1"
          >
            <X size={16} className="text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function AddCategory({ onSubmit, onCancel }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    articleName: '',
    categoryName: '',
    size: [],
    color: [],
    soft_hard: [],
    A_B: [],
    image: [], // changed to array
  });

  const [preview, setPreview] = useState([]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      image: [...prev.image, ...files],
    }));
    setPreview((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
    setPreview((prev) => prev.filter((_, i) => i !== index));
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
    if (formData.size.length === 0) {
      toast.error('Size is required');
      return false;
    }
    if (formData.color.length === 0) {
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
    if (formData.image.length === 0) {
      toast.error('At least one image is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = new FormData();
    payload.append('article', formData.articleName);
    payload.append('categoryCode', formData.categoryName);
    payload.append('colors', JSON.stringify(formData.color));
    payload.append('sizes', JSON.stringify(formData.size));
    payload.append('type', JSON.stringify(formData.soft_hard));
    payload.append('quality', JSON.stringify(formData.A_B));
    formData.image.forEach((file) => payload.append('image', file));

    try {
      const res = await authService.addCategoryForMultipleArticle(
        user.accessToken,
        payload
      );

      

      console.log("response which i am geting ",res);
      
      toast.success(res?.data?.message || 'Article Added Successfully');
      navigate('/categories');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add Article May be image size is large');
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-[650px] bg-white rounded-lg shadow-sm mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            Create Article
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
            <MultiInputField
              id="size"
              label="Size"
              value={formData.size}
              onChange={(value) => handleChange('size', value)}
              placeholder="Type and press Enter"
            />

            {/* Color */}
            <MultiInputField
              id="color"
              label="Color"
              value={formData.color}
              onChange={(value) => handleChange('color', value)}
              placeholder="Type and press Enter"
            />

            {/* Soft/Hard */}
            <MultiSelectDropdown
              id="soft_hard"
              label="Soft/Hard"
              options={['Soft', 'Hard']}
              value={formData.soft_hard}
              onChange={(value) => handleChange('soft_hard', value)}
              placeholder="Choose Soft/Hard"
            />

            {/* A/B */}
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
            {preview.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {preview.map((img, index) => (
                  <div key={index} className="relative w-32 h-32">
                    <img
                      src={img}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 text-red rounded-full p-1 hover:bg-red-600"
                    >
                    <RxCross2 />
                    </button>
                  </div>
                ))}
              </div>
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
