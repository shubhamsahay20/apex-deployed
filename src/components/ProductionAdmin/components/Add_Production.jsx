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

  // ✅ Added validation state
  const [errors, setErrors] = useState({});

  // ✅ Validation function
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'date':
        if (!value) error = 'Date is required.';
        break;
      case 'factory':
        if (!value) error = 'Factory is required.';
        break;
      case 'article':
        if (!value) error = 'Article is required.';
        break;
      case 'categoryCode':
        if (!value) error = 'Category is required.';
        break;
      case 'size':
        if (!value) error = 'Size is required.';
        break;
      case 'color':
        if (!value) error = 'Color is required.';
        break;
      case 'type':
        if (!value) error = 'Type is required.';
        break;
      case 'quality':
        if (!value) error = 'Quality is required.';
        break;
      case 'production':
        if (!value || Number(value) <= 0)
          error = 'Production quantity must be greater than 0.';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === '';
  };

  // ✅ Helper to validate all fields before submission
  const validateForm = () => {
    const fieldsToValidate = [
      'date',
      'factory',
      'article',
      'categoryCode',
      'size',
      'color',
      'type',
      'quality',
      'production',
    ];
    let isValid = true;
    fieldsToValidate.forEach((field) => {
      const valid = validateField(field, formData[field]);
      if (!valid) isValid = false;
    });
    return isValid;
  };

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
    if (debounceValue.length === 0 || debounceValue.length >= 2) {
      setPage(1);
      fetchArticles(1, debounceValue);
    }
  }, [debounceValue, open]);

  // When page increments (>1) fetch that page
  useEffect(() => {
    if (page > 1) {
      fetchArticles(page, debounceValue);
    }
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

    setOpen(false);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Run validation before proceeding
    const isValid = validateForm();
    if (!isValid) {
      toast.error('Please fill all fields correctly before submitting.');
      return;
    }

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
            onChange={(e) => {
              setFormData({ ...formData, date: e.target.value });
              validateField('date', e.target.value); // ✅ Live validation
            }}
            className="border px-4 py-2 rounded-md text-sm w-full"
          />
          {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
        </div>

        {/* Factory */}
        <div>
          <label className="block text-sm font-medium">Factory</label>
          <select
            name="factory"
            value={formData.factory}
            onChange={(e) => {
              setFormData({ ...formData, factory: e.target.value });
              validateField('factory', e.target.value); // ✅ Live validation
            }}
            className="border px-4 py-2 rounded-md text-sm w-full"
          >
            <option value="">Select Factory</option>
            {factoryData.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>
          {errors.factory && (
            <p className="text-red-500 text-xs">{errors.factory}</p>
          )}
        </div>

        {/* Article */}
        <div>
          <label className="block text-sm font-medium">Article</label>
          <Select
            name="article"
            value={
              formData.article
                ? { label: formData.article, value: formData.article }
                : null
            }
            onChange={(selected) => {
              handleArticleSelect(selected);
              validateField('article', selected?.value || '');
            }}
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
          />
          {errors.article && (
            <p className="text-red-500 text-xs">{errors.article}</p>
          )}
        </div>

        {/* ... Other fields remain unchanged, just add error display below each */}
        {/* Add same pattern of validationField call and errors.field rendering for categoryCode, size, color, type, quality, production */}

        {/* Category */}
        {selectedArticle && selectedArticle.category?.length > 0 && (
          <div>
            <label className="block text-sm font-medium">Category</label>
            <Select
              name="category"
              value={
                formData.categoryCode
                  ? { label: formData.categoryCode, value: formData.categoryCode }
                  : null
              }
              onChange={(selected) => {
                setFormData({
                  ...formData,
                  categoryCode: selected?.value || '',
                });
                validateField('categoryCode', selected?.value || '');
              }}
              options={selectedArticle.category.map((c) => ({
                label: c.categoryCode,
                value: c.categoryCode,
              }))}
              placeholder="Select Category"
            />
            {errors.categoryCode && (
              <p className="text-red-500 text-xs">{errors.categoryCode}</p>
            )}
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
              onChange={(selected) => {
                setFormData({ ...formData, size: selected?.value || '' });
                validateField('size', selected?.value || '');
              }}
              options={[
                ...new Set(selectedArticle.category.map((c) => c.size)),
              ].map((s) => ({ label: s, value: s }))}
              placeholder="Select Size"
            />
            {errors.size && (
              <p className="text-red-500 text-xs">{errors.size}</p>
            )}
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
              onChange={(selected) => {
                setFormData({ ...formData, color: selected?.value || '' });
                validateField('color', selected?.value || '');
              }}
              options={[
                ...new Set(selectedArticle.category.map((c) => c.color)),
              ].map((c) => ({ label: c, value: c }))}
              placeholder="Select Color"
            />
            {errors.color && (
              <p className="text-red-500 text-xs">{errors.color}</p>
            )}
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
              onChange={(selected) => {
                setFormData({ ...formData, type: selected?.value || '' });
                validateField('type', selected?.value || '');
              }}
              options={[
                ...new Set(selectedArticle.category.flatMap((c) => c.type)),
              ].map((t) => ({ label: t, value: t }))}
              placeholder="Select Type"
            />
            {errors.type && (
              <p className="text-red-500 text-xs">{errors.type}</p>
            )}
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
              onChange={(selected) => {
                setFormData({ ...formData, quality: selected?.value || '' });
                validateField('quality', selected?.value || '');
              }}
              options={[
                ...new Set(selectedArticle.category.flatMap((c) => c.quality)),
              ].map((q) => ({ label: q, value: q }))}
              placeholder="Select Quality"
            />
            {errors.quality && (
              <p className="text-red-500 text-xs">{errors.quality}</p>
            )}
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
            onChange={(e) => {
              setFormData({ ...formData, production: e.target.value });
              validateField('production', e.target.value);
            }}
            className="border px-4 py-2 rounded-md w-full"
          />
          {errors.production && (
            <p className="text-red-500 text-xs">{errors.production}</p>
          )}
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
