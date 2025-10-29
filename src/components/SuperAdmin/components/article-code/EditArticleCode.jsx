import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../../../../api/auth.service';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';

const EditArticleCode = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articleData, setArticleData] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await authService.getCategoryById(user.accessToken, id);
        console.log('data', res.data.data);
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

  console.log('article details', articleData.article);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!articleData.articleCode.trim()){
       toast.error("Article Code can not be empty")
       return
    }

    try {
      const data = {
        article:articleData.article,
        articleCode: articleData.articleCode,
      };
      console.log("data as payload",data);

      await authService.editArticleCode(user.accessToken, id, data);
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
                type="text"
                readOnly
                value={articleData?.article}
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
                readOnly
                value={
                  articleData.category &&
                  articleData.category[0] &&
                  articleData.category[0].categoryCode !== undefined
                    ? String(articleData.category[0].categoryCode)
                    : ''
                }
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
                type="text"
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
