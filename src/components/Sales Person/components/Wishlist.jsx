import React, { useEffect, useRef, useState } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../Context/AuthContext';
import cartService from '../../../api/cart.service';
import salesService from '../../../api/sales.service';
import { useDebounce } from '../../../hooks/useDebounce';
import Loader from '../../../common/Loader';

const emptyItem = {
  articleId: '',
  article: '',
  categoryCode: '',
  color: '',
  size: '',
  type: '',
  quality: '',
  quantity: '',
};

const Wishlist = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [products, setProducts] = useState([]);
  const [schemes, setSchemes] = useState([]);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [openIndex, setOpenIndex] = useState(null);
  const wrapperRef = useRef(null);

  const [scheme, setScheme] = useState({
    id: '',
    type: '',
    quantity: '',
  });

  const [formData, setFormData] = useState({
    items: [{ ...emptyItem }],
  });

  /* ---------------- FETCH ARTICLES ---------------- */
  useEffect(() => {
    if (!debouncedSearch) {
      setProducts([]);
      return;
    }

    const fetchArticles = async () => {
      setFetching(true);
      try {
        const res = await cartService.searchArticles(
          user.accessToken,
          debouncedSearch
        );
        setProducts(res?.data || []);
      } catch {
        toast.error('Failed to load articles');
      } finally {
        setFetching(false);
      }
    };

    fetchArticles();
  }, [debouncedSearch, user.accessToken]);

  /* ---------------- FETCH SCHEMES ---------------- */
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await salesService.getSchemes(user.accessToken);
        setSchemes(res?.data || []);
      } catch {
        toast.error('Failed to load schemes');
      }
    };
    fetchSchemes();
  }, [user.accessToken]);

  /* ---------------- CARTON HANDLERS ---------------- */
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...emptyItem }],
    }));
  };

  const removeItem = (idx) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const updateItem = (idx, key, value) => {
    const updated = [...formData.items];
    updated[idx][key] = value;
    setFormData((prev) => ({ ...prev, items: updated }));
  };

  /* ---------------- DEPENDENCY HELPERS ---------------- */
  const getUniqueColors = (articleId) => {
    const article = products.find((p) => p._id === articleId);
    return [...new Set(article?.variants?.map((v) => v.color))] || [];
  };

  const getSizes = (articleId, color) => {
    const article = products.find((p) => p._id === articleId);
    return [
      ...new Set(
        article?.variants
          ?.filter((v) => v.color === color)
          .map((v) => v.size)
      ),
    ];
  };

  const getTypes = (articleId, color, size) => {
    const article = products.find((p) => p._id === articleId);
    return [
      ...new Set(
        article?.variants
          ?.filter((v) => v.color === color && v.size === size)
          .map((v) => v.type)
      ),
    ];
  };

  const getQualities = (articleId, color, size, type) => {
    const article = products.find((p) => p._id === articleId);
    return [
      ...new Set(
        article?.variants
          ?.filter(
            (v) =>
              v.color === color && v.size === size && v.type === type
          )
          .map((v) => v.quality)
      ),
    ];
  };

  const changeScheme = (e) => {
    const s = schemes.find((x) => x._id === e.target.value);
    setScheme({
      id: s?._id || '',
      type: s?.type || '',
      quantity: s?.quantity || '',
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-white border rounded shadow-sm min-h-screen">
      <h2 className="text-lg font-semibold mb-4">Wishlist</h2>

      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Package className="w-5 h-5 text-purple-600 mr-2" />
            <span className="font-semibold">wishlist</span>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Article
          </button>
        </div>

        {formData.items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-lg border border-purple-200 mb-4"
          >
            <div className="flex justify-between mb-3">
              <span className="font-bold">Order Item {idx + 1}</span>
              {formData.items.length > 1 && (
                <button onClick={() => removeItem(idx)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* ARTICLE */}
              <div ref={wrapperRef} className="relative col-span-3">
                <div
                  onClick={() =>
                    setOpenIndex(openIndex === idx ? null : idx)
                  }
                  className="border px-3 py-2 rounded cursor-pointer"
                >
                  {item.article || 'Select Article'}
                </div>

                {openIndex === idx && (
                  <div className="absolute w-full bg-white border mt-1 rounded shadow z-10 max-h-56 overflow-auto">
                    <input
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full px-3 py-2 border-b"
                    />
                    {products.map((p) => (
                      <div
                        key={p._id}
                        onClick={() => {
                          updateItem(idx, 'articleId', p._id);
                          updateItem(idx, 'article', p.article);
                          updateItem(
                            idx,
                            'categoryCode',
                            p.category?.[0]?.categoryCode || ''
                          );
                          setOpenIndex(null);
                        }}
                        className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
                      >
                        {p.article}
                      </div>
                    ))}
                    {fetching && (
                      <p className="p-2 text-sm text-gray-500">
                        Loading...
                      </p>
                    )}
                  </div>
                )}
              </div>

              <input
                readOnly
                value={item.categoryCode}
                placeholder="Category Code"
                className="bg-gray-100 border rounded px-3 py-2"
              />

              <select
                value={item.color}
                onChange={(e) => updateItem(idx, 'color', e.target.value)}
                disabled={!item.articleId}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Color</option>
                {getUniqueColors(item.articleId).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                value={item.size}
                onChange={(e) => updateItem(idx, 'size', e.target.value)}
                disabled={!item.color}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Size</option>
                {getSizes(item.articleId, item.color).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <select
                value={item.type}
                onChange={(e) => updateItem(idx, 'type', e.target.value)}
                disabled={!item.size}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Type</option>
                {getTypes(item.articleId, item.color, item.size).map(
                  (t) => (
                    <option key={t}>{t}</option>
                  )
                )}
              </select>

              <select
                value={item.quality}
                onChange={(e) =>
                  updateItem(idx, 'quality', e.target.value)
                }
                disabled={!item.type}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Quality</option>
                {getQualities(
                  item.articleId,
                  item.color,
                  item.size,
                  item.type
                ).map((q) => (
                  <option key={q}>{q}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(idx, 'quantity', e.target.value)
                }
                className="border rounded px-3 py-2 col-span-3"
              />
            </div>
          </div>
        ))}

        {/* SCHEME */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <select
            value={scheme.id}
            onChange={changeScheme}
            className="border rounded px-3 py-2"
          >
            <option value="">Select Scheme</option>
            {schemes.map((s) => (
              <option key={s._id} value={s._id}>
                {s.schemesName}
              </option>
            ))}
          </select>
          <input
            readOnly
            value={scheme.type}
            placeholder="Scheme Type"
            className="border rounded px-3 py-2"
          />
          <input
            readOnly
            value={scheme.quantity}
            placeholder="Quantity Included"
            className="border rounded px-3 py-2"
          />
        </div> */}
      </div>
    </div>
  );
};

export default Wishlist;
