import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import { useAuth } from '../../../Context/AuthContext';
import authService from '../../../api/auth.service';
import factoryService from '../../../api/factory.service';
import productionService from '../../../api/production.service';
import Loader from '../../../common/Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 20;
const DEBOUNCE_MS = 300;

const Add_Production = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [factoryData, setFactoryData] = useState([]);

  // Articles pagination & search
  const [articleData, setArticleData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);

  const [search, setSearch] = useState('');
  const [debounceValue, setDebounceValue] = useState('');
  const debounceTimerRef = useRef(null);

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    factory: '',
    article: '',
    categoryCode: '',
    size: '',
    color: '',
    type: '',
    quality: '',
    production: '',
  });

  const [selectedArticle, setSelectedArticle] = useState(null);

  // Load factories once
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await factoryService.getAllFactories(user.accessToken);
        setFactoryData(res.data.data.factories || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load factories');
      } finally {
        setLoading(false);
      }
    })();
  }, [user.accessToken]);

  // Debounce search -> setDebounceValue
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebounceValue(search);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [search]);

  // Fetch articles function (pageNo, searchTerm)
  const fetchArticles = async (pageNo = 1, searchTerm = '') => {
    if (fetching) return;
    setFetching(true);
    try {
      // Adjust signature if your getCategories differs.
      // Here assumed: getCategories(token, page, pageSize, search)
      const res = await authService.getCategories(
        user.accessToken,
        pageNo,
        PAGE_SIZE,
        searchTerm
      );

      const items = res?.data?.data || [];
      const pagination = res?.data?.pagination;

      if (pageNo === 1) {
        setArticleData(items);
      } else {
        setArticleData((prev) => [...prev, ...items]);
      }

      if (pagination && typeof pagination.totalPages === 'number') {
        setHasMore(pageNo < pagination.totalPages);
      } else {
        // fallback: if returned items < page size, no more
        setHasMore(items.length === PAGE_SIZE);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch articles');
    } finally {
      setFetching(false);
    }
  };

  // When menu opens or debounceValue changes, fetch page 1 (only if menu open)
  useEffect(() => {
    if (!open) return; 
    // Call API only if debounced value length is 0 or >= 2 (same logic as your reference)
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      setPage(1);
      fetchArticles(1, debounceValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue, open]);

  // When page increments (>1) fetch that page
  useEffect(() => {
    if (page > 1) {
      fetchArticles(page, debounceValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Handle article selection
  const handleArticleSelect = (selected) => {
    if (!selected) {
      setSelectedArticle(null);
      setFormData({
        ...formData,
        article: '',
        categoryCode: '',
        size: '',
        color: '',
        type: '',
        quality: '',
      });
      return;
    }
    // find full article object from loaded articleData (matching by article property)
    const articleObj = articleData.find((a) => a.article === selected.value);
    setSelectedArticle(articleObj || null);

    setFormData({
      ...formData,
      article: selected.value,
      categoryCode: '',
      size: '',
      color: '',
      type: '',
      quality: '',
    });

    // close menu after selection (like your reference)
    setOpen(false);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.article) return toast.error('Article required');
    if (!formData.date) return toast.error('Date required');
    if (!formData.factory) return toast.error('Factory required');
    if (!formData.production) return toast.error('Production Number required');
    if (!formData.type) return toast.error('Type required');
    if (!formData.quality) return toast.error('Quality required');
    if (!formData.categoryCode) return toast.error('Category required');
    if (!formData.color) return toast.error('Color required');
    if (!formData.size) return toast.error('Size required');

    setLoading(true);
    try {
      const payload = {
        factory: formData.factory,
        article: formData.article,
        productionDate: formData.date,
        productionQuantity: formData.production,
        size: formData.size,
        color: formData.color,
        type: formData.type,
        quality: formData.quality,
        categoryCode: formData.categoryCode,
      };

      const res = await productionService.addProduction(
        user.accessToken,
        payload
      );
      toast.success(res.data?.message || 'Production Added Successfully');

      setFormData({
        date: '',
        factory: '',
        article: '',
        categoryCode: '',
        size: '',
        color: '',
        type: '',
        quality: '',
        production: '',
      });
      setSelectedArticle(null);
      navigate('/production-manager/management');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add production');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  // react-select options
  const articleOptions = articleData.map((a) => ({
    label: a.article,
    value: a.article,
  }));

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-lg font-semibold text-gray-800">Add Production</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Date */}
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            min={new Date().toISOString().split('T')[0]}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="border px-4 py-2 rounded-md text-sm w-full"
          />
        </div>

        {/* Factory */}
        <div>
          <label className="block text-sm font-medium">Factory</label>
          <select
            name="factory"
            value={formData.factory}
            onChange={(e) =>
              setFormData({ ...formData, factory: e.target.value })
            }
            className="border px-4 py-2 rounded-md text-sm w-full"
          >
            <option value="">Select Factory</option>
            {factoryData.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Article (react-select with search + infinite scroll) */}
        <div>
          <label className="block text-sm font-medium">Article</label>
          <Select
            name="article"
            value={
              formData.article
                ? { label: formData.article, value: formData.article }
                : null
            }
            onChange={handleArticleSelect}
            options={articleOptions}
            placeholder="Select Article"
            isClearable
            onMenuOpen={() => setOpen(true)}
            onMenuClose={() => setOpen(false)}
            onInputChange={(inputValue, { action }) => {
              if (action === 'input-change') setSearch(inputValue);
            }}
            onMenuScrollToBottom={() => {
              if (hasMore && !fetching) {
                setPage((p) => p + 1);
              }
            }}
            isLoading={fetching && page === 1}
            noOptionsMessage={() =>
              fetching ? 'Loading...' : 'No results found'
            }
            // keep menu open on select false (default is true => menu closes). We close manually in handleArticleSelect
          />
        </div>

        {/* Category */}
        {selectedArticle && selectedArticle.category?.length > 0 && (
          <div>
            <label className="block text-sm font-medium">Category</label>
            <Select
              name="category"
              value={
                formData.categoryCode
                  ? {
                      label: formData.categoryCode,
                      value: formData.categoryCode,
                    }
                  : null
              }
              onChange={(selected) =>
                setFormData({
                  ...formData,
                  categoryCode: selected?.value || '',
                })
              }
              options={selectedArticle.category.map((c) => ({
                label: c.categoryCode,
                value: c.categoryCode,
              }))}
              placeholder="Select Category"
            />
          </div>
        )}

        {/* Size */}
        {selectedArticle && selectedArticle.category?.length > 0 && (
          <div>
            <label className="block text-sm font-medium">Size</label>
            <Select
              name="size"
              value={
                formData.size
                  ? { label: formData.size, value: formData.size }
                  : null
              }
              onChange={(selected) =>
                setFormData({ ...formData, size: selected?.value || '' })
              }
              options={[
                ...new Set(selectedArticle.category.map((c) => c.size)),
              ].map((s) => ({ label: s, value: s }))}
              placeholder="Select Size"
            />
          </div>
        )}

        {/* Color */}
        {selectedArticle && selectedArticle.category?.length > 0 && (
          <div>
            <label className="block text-sm font-medium">Color</label>
            <Select
              name="color"
              value={
                formData.color
                  ? { label: formData.color, value: formData.color }
                  : null
              }
              onChange={(selected) =>
                setFormData({ ...formData, color: selected?.value || '' })
              }
              options={[
                ...new Set(selectedArticle.category.map((c) => c.color)),
              ].map((c) => ({ label: c, value: c }))}
              placeholder="Select Color"
            />
          </div>
        )}

        {/* Type */}
        {selectedArticle && selectedArticle.category?.length > 0 && (
          <div>
            <label className="block text-sm font-medium">Type</label>
            <Select
              name="type"
              value={
                formData.type
                  ? { label: formData.type, value: formData.type }
                  : null
              }
              onChange={(selected) =>
                setFormData({ ...formData, type: selected?.value || '' })
              }
              options={[
                ...new Set(selectedArticle.category.flatMap((c) => c.type)),
              ].map((t) => ({ label: t, value: t }))}
              placeholder="Select Type"
            />
          </div>
        )}

        {/* Quality */}
        {selectedArticle && selectedArticle.category?.length > 0 && (
          <div>
            <label className="block text-sm font-medium">Quality</label>
            <Select
              name="quality"
              value={
                formData.quality
                  ? { label: formData.quality, value: formData.quality }
                  : null
              }
              onChange={(selected) =>
                setFormData({ ...formData, quality: selected?.value || '' })
              }
              options={[
                ...new Set(selectedArticle.category.flatMap((c) => c.quality)),
              ].map((q) => ({ label: q, value: q }))}
              placeholder="Select Quality"
            />
          </div>
        )}

        {/* Production */}
        <div>
          <label className="block text-sm font-medium">
            Production Quantity
          </label>
          <input
            type="number"
            value={formData.production}
            onChange={(e) =>
              setFormData({ ...formData, production: e.target.value })
            }
            className="border px-4 py-2 rounded-md w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 mt-4 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add_Production;
