import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../../../../api/auth.service';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';

const EditArticleCode = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articleData, setArticleData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await authService.getCategoryById(user.accessToken, id);
        if (res?.data?.data) {
          setArticleData(res.data.data);
        } else {
          toast.error('Category not found');
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || 'Failed to fetch category',
        );
      }
    })();
  }, [user.accessToken, id]);

  console.log('data', articleData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = articleData.articleCode;
      console.log(data);

      await authService.editCategory(user.accessToken, id, {
        articleCode: data,
      });
      toast.success('Article Code Updated Successfully');
      navigate('/article-codes');
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Error updating article code',
      );
    }
  };

  return (
    <div className=" w-full h-full">
      <div className="w-full h-[600px] bg-white rounded-lg shadow-sm  mx-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            Edit Article Code{' '}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Field */}

            <div>
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Article Name
              </label>
              <input
                disabled
                type="number"
                value={articleData.article}
                id="categoryName"
                placeholder="Enter  Category Name"
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
                disabled
                value={
                  articleData.category &&
                  articleData.category[0] &&
                  articleData.category[0].categoryCode !== undefined
                    ? String(articleData.category[0].categoryCode)
                    : ''
                }
                // value={articleData?.category[0]?.categoryCode}
                type="text"
                id="categoryName"
                placeholder="Enter Category Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Article code
              </label>
              <input
                required
                value={articleData?.articleCode}
                onChange={(e) =>
                  setArticleData((prev) => ({
                    ...prev,
                    articleCode: e.target.value,
                  }))
                }
                type="number"
                id="Article code"
                placeholder="Enter Article Code"
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
};

export default EditArticleCode;
