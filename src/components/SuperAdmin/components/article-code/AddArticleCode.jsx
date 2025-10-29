'use client';

import { useEffect, useState, useRef } from 'react';
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
  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef(null);

  const [formData, setFormData] = useState({
    articleName: '',
  });

  // 🔹 Fetch articles
  const fetchArticles = async (pageNum = 1, searchTerm = '') => {
    if (fetching) return;
    setFetching(true);
    try {
      const res = await authService.getCategories(
        user.accessToken,
        pageNum,
        searchTerm,
      );
      const newData = res?.data?.data || [];

      if (pageNum === 1) setArticle(newData);
      else setArticle((prev) => [...prev, ...newData]);

      setHasMore(newData.length > 0);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch articles');
    } finally {
      setFetching(false);
    }
  };

  // 🔹 Infinite scroll
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (hasMore && scrollTop + clientHeight >= scrollHeight - 5 && !fetching) {
      setPage((prev) => prev + 1);
    }
  };

  // 🔹 Select article
  const handleSelect = (item) => {
    setArticleData(item);
    setOpen(false);

    const cat = item.category && item.category[0] ? item.category[0] : {};
    setFormData({
      articleName: item.article ? String(item.article) : '',
      categoryName: cat.categoryCode ? String(cat.categoryCode) : '',
      size: cat.size ? String(cat.size) : '',
      color: cat.color ? String(cat.color) : '',
      soft_hard: cat.type ? String(cat.type) : '',
      A_B: cat.quality ? String(cat.quality) : '',
    });
  };

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchArticles(page, search);
  }, [page, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        article: articleData.article,
        articleCode: addArticleCode,
      };
      const res = await authService.addArticleCode(user.accessToken, payload);
      toast.success(res?.data?.message || 'Article Code Added');
      navigate('/article-codes');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to add article code',
      );
    }
  };

  return (
    <div className=" w-full h-full">
      <div className="w-full h-[600px] bg-white rounded-lg shadow-sm mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Add Article</h1>
        </div>

        {/* Form */}
        <form className="p-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Article Number */}
            <div ref={wrapperRef}>
              <label
                htmlFor="articleName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Article Number
              </label>

              <div className="relative text-left">
                <div
                  onClick={() => setOpen((prev) => !prev)}
                  className="w-full px-3 py-2 border rounded-md bg-white text-gray-700 cursor-pointer focus:ring-2 focus:ring-blue-500"
                >
                  {articleData.article || '-- Select Article --'}
                </div>

                {open && (
                  <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
                    {/* Search box */}
                    <input
                      type="text"
                      placeholder="Search article..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                        setArticle([]);
                      }}
                      className="w-full px-3 py-2 border-b outline-none"
                    />

                    {/* List */}
                    <div
                      onScroll={handleScroll}
                      className="max-h-48 overflow-y-auto"
                    >
                      {article.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => handleSelect(item)}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        >
                          {item.article}
                        </div>
                      ))}

                      {fetching && (
                        <p className="px-4 py-2 text-sm text-gray-500">
                          Loading...
                        </p>
                      )}

                      {!fetching && article.length === 0 && (
                        <p className="px-4 py-2 text-sm text-gray-500">
                          No results found
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Article Code */}
            <div>
              <label
                htmlFor="Article-code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Article Code
              </label>
              <input
                type="text"
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
