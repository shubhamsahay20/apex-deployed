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
    soft_hard: '',
    A_B: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await authService.getCategoryById(
          user.accessToken,
          id,
        );
        console.log(response?.data?.data, 'got');

        setFormData({
          articleName: response.data.data.article,
          categoryName: response.data.data.category[0].categoryCode,
          size: response.data.data.category[0].size,
          color: response.data.data.category[0].color,
          soft_hard: response.data.data.category[0].type,
          A_B: response.data.data.category[0].quality,
        });
      } catch (error) {
        toast.error(
          error?.response?.data?.message || 'Failed to fatch category',
        );
        // console.error('Error fetching category:', error);
      }
    })();
  }, [id, user.accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.articleName ||
      !formData.categoryName ||
      !formData.size ||
      !formData.color ||
      !formData.soft_hard ||
      !formData.A_B
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      article: Number(formData.articleName),
      category: [
        {
          categoryCode: Number(formData.categoryName),
          size: formData.size,
          color: formData.color,
          type: formData.soft_hard,
          quality: formData.A_B,
        },
      ],
    };

    console.log(payload, 'payload');

    try {
      const res = await authService.editCategory(user.accessToken, id, payload);
      toast.success(res?.data?.message || 'Category updated successfully');
      console.log('Category updated successfully:', res);
      navigate('/categories');
      return res;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error('Error updating category:', error.response?.data.message);
    }
  };
  return (
    <div className=" w-full h-full">
      <div className="w-full h-[600px] bg-white rounded-lg shadow-sm  mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            Edit Category{' '}
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
                Article Name
              </label>
              <input
                type="number"
                id="articleName"
                placeholder="Enter Article Name"
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
                Category Name
              </label>
              <input
                type="number"
                id="categoryName"
                placeholder="Enter  Category Name"
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
};

export default EditCategory;
