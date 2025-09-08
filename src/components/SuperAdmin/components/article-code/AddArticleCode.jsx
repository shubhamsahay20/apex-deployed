'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../Context/AuthContext';
import authService from '../../../../api/auth.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddArticleCode() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState([]);
  const [articleData, setArticleData] = useState({});
  const [addArticleCode, setAddArticleCode] = useState();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = async (pageNum) => {
    try {
      const res = await authService.getCategories(user.accessToken, pageNum);
      const newData = res?.data?.data || [];

      if (newData.length === 0) {
        setHasMore(false);
        return;
      }

      setArticle((prev) => [...prev, ...newData]);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to fetch categories',
      );
    }
  };

  useEffect(() => {
    fetchArticles(page);
  }, [page]);

  const handleScroll = (e) => {
    const target = e.target;
    console.log('scrollTop:', target.scrollTop); // how far user scrolled
    console.log('clientHeight:', target.clientHeight); // visible height of box
    console.log('scrollHeight:', target.scrollHeight);
    if (
      hasMore &&
      target.scrollTop + target.clientHeight >= target.scrollHeight - 10
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSelectChange = (e) => {
    const selectedArticle = article.find(
      (item) => item.article === parseInt(e.target.value),
    );
    if (!selectedArticle) {
      setArticleData({});
      setFormData((prev) => ({ ...prev, articleName: e.target.value }));
      return;
    }
    setArticleData(selectedArticle);
    const cat =
      selectedArticle.category && selectedArticle.category[0]
        ? selectedArticle.category[0]
        : {};
    setFormData((prev) => ({
      ...prev,
      articleName: selectedArticle.article
        ? String(selectedArticle.article)
        : '',
      categoryName:
        cat.categoryCode !== undefined && cat.categoryCode !== null
          ? String(cat.categoryCode)
          : '',
      size: cat.size !== undefined && cat.size !== null ? String(cat.size) : '',
      color:
        cat.color !== undefined && cat.color !== null ? String(cat.color) : '',
      soft_hard:
        cat.type !== undefined && cat.type !== null ? String(cat.type) : '',
      A_B:
        cat.quality !== undefined && cat.quality !== null
          ? String(cat.quality)
          : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        article: articleData.article,
        categoryCode: articleData.category[0].categoryCode,
        articleCode: addArticleCode,
      };
      const res = await authService.addArticleCode(user.accessToken, payload);
      console.log('response', res);
      toast.success(res?.data?.message || 'Article Code Added');
      navigate('/article-codes');
    } catch (error) {
      toast.error(
        error.resopnse?.data?.message || 'Failed to add article code',
      );
    }
  };

  return (
    <div className=" w-full h-full">
      <div className="w-full h-[600px] bg-white rounded-lg shadow-sm  mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Add Article </h1>
        </div>

        {/* Form */}
        <form className="p-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Article Name */}
            <div>
              <label
                htmlFor="articleName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Article Number
              </label>
              {!articleData.article ? (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-blue-500 h-10 overflow-hidden 
                 focus:h-auto focus:overflow-auto transition-all duration-200"
                  id="articlename"
                  onChange={handleSelectChange}
                  onScroll={handleScroll}
                  size={6}
                  required
                >
                  <option value="">Select an Article</option>
                  <br />
                  {article.map((item) => (
                    <option key={item._id} value={item.article}>
                      {item.article}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-2 border rounded bg-gray-100 flex justify-between items-center">
                  <span>
                    Selected:{' '}
                    <span className="font-semibold">{articleData.article}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setArticleData({});
                      setFormData((prev) => ({ ...prev, articleName: '' }));
                    }}
                    className="ml-2 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            {/* Category Name */}
            <div>
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category Number
              </label>
              <input
                type="number"
                id="categoryName"
                placeholder="Enter Category Name"
                value={
                  articleData.category &&
                  articleData.category[0] &&
                  articleData.category[0].categoryCode !== undefined
                    ? String(articleData.category[0].categoryCode)
                    : ''
                }
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                required
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
                value={
                  articleData.category &&
                  articleData.category[0] &&
                  articleData.category[0].size !== undefined
                    ? String(articleData.category[0].size)
                    : ''
                }
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                required
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
                value={
                  articleData.category &&
                  articleData.category[0] &&
                  articleData.category[0].color !== undefined
                    ? String(articleData.category[0].color)
                    : ''
                }
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                required
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
              <input
                id="soft_hard"
                value={
                  articleData.category &&
                  articleData.category[0] &&
                  articleData.category[0].type !== undefined
                    ? String(articleData.category[0].type)
                    : ''
                }
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              ></input>
            </div>

            {/* A/B */}
            <div>
              <label
                htmlFor="A_B"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                A/B
              </label>
              <input
                id="A_B"
                value={
                  articleData.category &&
                  articleData.category[0] &&
                  articleData.category[0].quality !== undefined
                    ? String(articleData.category[0].quality)
                    : ''
                }
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="A_B"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Article code
              </label>
              <input
                type="number"
                id="Article-code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                onChange={(e) => setAddArticleCode(e.target.value)}
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
}
