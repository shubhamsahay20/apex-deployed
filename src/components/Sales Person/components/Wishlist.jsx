import React, { useState, useEffect, useRef } from 'react';
import { Package, Trash2 } from 'lucide-react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import authService from '../../../api/auth.service';
import schemesService from '../../../api/schemes.service';
import wishlistService from '../../../api/wishlist.service';
import { useDebounce } from '../../../hooks/useDebounce';

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [formData, setFormData] = useState({
    location: [
      { address: '', city: '', state: '', pincode: '', country: 'India' },
    ],
    items: [
      {
        articleId: '',
        article: '',
        categoryCode: '',
        color: '',
        size: '',
        type: '',
        quality: '',
        quantity: '',
      },
    ],
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState('');
  const debounceValue = useDebounce(search, 500);
  const [openIndex, setOpenIndex] = useState(null);
  const wrapperRef = useRef(null);

  /* =========================
     FETCH PRODUCTS
  ========================= */
  const fetchProducts = async (pageNo = 1, searchText = '') => {
    if (fetching) return;
    setFetching(true);
    try {
      const res = await authService.getCategories(
        user.accessToken,
        pageNo,
        20,
        searchText
      );

      const data = res.data?.data || [];
      const pagination = res.data?.pagination;

      if (pageNo === 1) setProducts(data);
      else setProducts(prev => [...prev, ...data]);

      setHasMore(pageNo < (pagination?.totalPages || 1));
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (openIndex !== null) {
      setPage(1);
      fetchProducts(1, debounceValue);
    }
  }, [openIndex, debounceValue]);

  useEffect(() => {
    if (page > 1) fetchProducts(page, search);
  }, [page]);

  /* =========================
     CUSTOMER LOADER
  ========================= */
  const loadCustomers = async (search, loaded, { page }) => {
    try {
      const res = await authService.getCustomersBySalesPerson(
        user.accessToken,
        page,
        10
      );

      const customers = res.data?.customers || [];

      return {
        options: customers.map(c => ({
          label: c.name,
          value: c._id,
          location: c.location,
        })),
        hasMore: customers.length === 10,
        additional: { page: page + 1 },
      };
    } catch {
      return { options: [], hasMore: false };
    }
  };

  const handleCustomerChange = selected => {
    setSelectedCustomer(selected);
    if (selected?.location?.length) {
      setFormData(prev => ({
        ...prev,
        location: [selected.location[0]],
      }));
    }
  };

  /* =========================
     HELPERS
  ========================= */
  const removeItem = index => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const getUniqueColors = articleId => {
    const product = products.find(p => p._id === articleId);
    if (!product) return [];
    return [...new Set(product.category.map(c => c.color))];
  };

  const getSizesForColor = (articleId, color) => {
    const product = products.find(p => p._id === articleId);
    if (!product) return [];
    return [
      ...new Set(
        product.category
          .filter(c => c.color === color)
          .map(c => c.size)
      ),
    ];
  };

  const getTypesForColorSize = (articleId, color, size) => {
    const product = products.find(p => p._id === articleId);
    if (!product) return [];
    return [
      ...new Set(
        product.category
          .filter(c => c.color === color && c.size === size)
          .flatMap(c => c.type || [])
      ),
    ];
  };

  const getQualitiesForColorSizeType = (
    articleId,
    color,
    size,
    type
  ) => {
    const product = products.find(p => p._id === articleId);
    if (!product) return [];
    return [
      ...new Set(
        product.category
          .filter(
            c =>
              c.color === color &&
              c.size === size &&
              c.type?.includes(type)
          )
          .flatMap(c => c.quality || [])
      ),
    ];
  };

  /* =========================
     SUBMIT
  ========================= */
 const handleSubmit = async e => {
  e.preventDefault();

  const validItems = formData.items.filter(item =>
    item.article &&
    item.categoryCode &&
    item.color &&
    item.size &&
    item.type &&
    item.quality
  );

  if (!validItems.length) {
    toast.error('Fill required item fields');
    return;
  }

  const payload = {
    customer: selectedCustomer?.label || '',
    // location: formData.location,
    items: validItems.map(it => ({
      article: it.article,
      categoryCode: it.categoryCode,
      color: it.color,
      size: it.size,
      type: it.type,
      quality: it.quality,
      ...(it.quantity && { quantity: Number(it.quantity) }),
    })),
    description: 'Wishlist for upcoming summer collection',
  };

  try {
    await wishlistService.addWishlist(user.accessToken, payload);
    toast.success('Added to Wishlist');
    navigate('/salesPerson/Wishlist');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Wishlist failed');
  }
};


  /* =========================
     UI
  ========================= */
return (
  <div className="min-h-screen bg-slate-100 p-4">
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Customer Wishlist
      </h1>

      {/* CUSTOMER */}
        {/* <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Select Customer
          </label>
          <AsyncPaginate
            loadOptions={loadCustomers}
            onChange={handleCustomerChange}
            additional={{ page: 1 }}
            placeholder="Search customer..."
          />
        </div> */}

      <form onSubmit={handleSubmit}>
        {formData.items.map((item, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-5 mb-6 bg-slate-50"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">
                Item {idx + 1}
              </h2>

              {formData.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            {/* ARTICLE SELECT */}
            <div className="relative mb-4" ref={wrapperRef}>
              <label className="block text-sm font-medium mb-1">
                Article
              </label>

              <div
                className="border rounded px-3 py-2 bg-white cursor-pointer hover:border-blue-500"
                onClick={() => setOpenIndex(idx)}
              >
                {item.article || 'Select Article'}
              </div>

              {openIndex === idx && (
                <div className="absolute bg-white border rounded shadow-md w-full z-20 max-h-60 overflow-y-auto">
                  <input
                    className="w-full p-2 border-b outline-none"
                    placeholder="Search article..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {products.map(p => (
                    <div
                      key={p._id}
                      className="p-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() => {
                        const updated = [...formData.items];
                        updated[idx] = {
                          ...updated[idx],
                          articleId: p._id,
                          article: p.article,
                          categoryCode:
                            p.category?.[0]?.categoryCode || '',
                        };
                        setFormData(prev => ({
                          ...prev,
                          items: updated,
                        }));
                        setOpenIndex(null);
                      }}
                    >
                      {p.article}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CATEGORY CODE */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Category Code
              </label>
              <input
                className="border rounded px-3 py-2 w-full bg-gray-100"
                value={item.categoryCode}
                readOnly
              />
            </div>

            {/* DROPDOWNS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Color</label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={item.color}
                  onChange={e => {
                    const updated = [...formData.items];
                    updated[idx].color = e.target.value;
                    updated[idx].size = '';
                    updated[idx].type = '';
                    updated[idx].quality = '';
                    setFormData(prev => ({
                      ...prev,
                      items: updated,
                    }));
                  }}
                >
                  <option value="">Select Color</option>
                  {getUniqueColors(item.articleId).map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Size</label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={item.size}
                  onChange={e => {
                    const updated = [...formData.items];
                    updated[idx].size = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      items: updated,
                    }));
                  }}
                >
                  <option value="">Select Size</option>
                  {getSizesForColor(item.articleId, item.color).map(
                    s => (
                      <option key={s}>{s}</option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Type</label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={item.type}
                  onChange={e => {
                    const updated = [...formData.items];
                    updated[idx].type = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      items: updated,
                    }));
                  }}
                >
                  <option value="">Select Type</option>
                  {getTypesForColorSize(
                    item.articleId,
                    item.color,
                    item.size
                  ).map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Quality</label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={item.quality}
                  onChange={e => {
                    const updated = [...formData.items];
                    updated[idx].quality = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      items: updated,
                    }));
                  }}
                >
                  <option value="">Select Quality</option>
                  {getQualitiesForColorSizeType(
                    item.articleId,
                    item.color,
                    item.size,
                    item.type
                  ).map(q => (
                    <option key={q}>{q}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="mt-4">
              <label className="block text-sm mb-1">Quantity</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={item.quantity}
                onChange={e => {
                  const updated = [...formData.items];
                  updated[idx].quantity = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    items: updated,
                  }));
                }}
              />
            </div>
          </div>
        ))}

        {/* SUBMIT */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-medium transition"
          >
            Add to Wishlist
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

export default Wishlist;
