import React, { useState } from 'react';

function AddArticleList() {
  const [form, setForm] = useState({
    articleName: '',
    quantity: '01',
    size: '',
    color: 'BK',
    softHard: '',
    category: '',
    warehouse: 'Warehouse 01',
    stockAlert: '0',
    hasVariants: false,
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4">
      <h1 className="text-xl font-medium mb-4">Add New Article</h1>
      <form onSubmit={handleSubmit} className="flex gap-4">
        {/* Left Form Fields */}
        <div className="w-2/3 grid grid-cols-2 gap-4">
          {/* Article Name */}
          <input
            type="text"
            name="articleName"
            placeholder="Enter Article Name"
            value={form.articleName}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          />

          {/* Quantity */}
          <input
            type="text"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          />

          {/* Size */}
          <select
            name="size"
            value={form.size}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          >
            <option value="">Choose Size (6X10)</option>
            <option value="6X10">6X10</option>
            <option value="8X12">8X12</option>
          </select>

          {/* Color */}
          <input
            type="text"
            name="color"
            value={form.color}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          />

          {/* Soft/Hard */}
          <select
            name="softHard"
            value={form.softHard}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          >
            <option value="">Choose S/H</option>
            <option value="Soft">Soft</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Category */}
          <input
            type="text"
            name="category"
            placeholder="Choose Category"
            value={form.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          />

          {/* Warehouse */}
          <select
            name="warehouse"
            value={form.warehouse}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          >
            <option value="Warehouse 01">Warehouse 01</option>
            <option value="Warehouse 02">Warehouse 02</option>
          </select>

          {/* Stock Alert */}
          <input
            type="number"
            name="stockAlert"
            value={form.stockAlert}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          />
        </div>

        {/* Right Panel */}
        <div className="w-1/3 flex flex-col items-start">
          {/* Image Upload Box */}
          <label className="w-full border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-center text-sm text-gray-500 h-40 cursor-pointer">
            <span>Drag image here</span>
            <span className="text-blue-600 mt-1">
              or <strong>Browse image</strong>
            </span>
            <input
              type="file"
              multiple
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          {/* Thumbnail Preview (First image only as in screenshot) */}
          {form.images[0] && (
            <div className="mt-2 w-12 h-12">
              <img
                src={URL.createObjectURL(form.images[0])}
                alt="preview"
                className="rounded-md w-full h-full object-cover"
              />
            </div>
          )}

          {/* Checkbox */}
          <label className="flex items-center text-sm mt-2">
            <input
              type="checkbox"
              name="hasVariants"
              checked={form.hasVariants}
              onChange={handleChange}
              className="mr-2"
            />
            Article Has Multi Variants
          </label>
        </div>
      </form>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default AddArticleList;



