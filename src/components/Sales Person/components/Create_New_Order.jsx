import React, { useState, useEffect, useRef } from 'react';
import { User, Package, Plus, Trash2 } from 'lucide-react';
import { FiShoppingCart } from 'react-icons/fi';
import { AsyncPaginate } from 'react-select-async-paginate';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import authService from '../../../api/auth.service';
import schemesService from '../../../api/schemes.service';
import cartService from '../../../api/cart.service';
import Cart_WishList from '../../../utils/Cart_WishList_Modal';
import { useDebounce } from '../../../hooks/useDebounce';

const CategoryDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [scheme, setScheme] = useState({ id: '', type: '', quantity: '' });
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
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState('');
  const debounceValue = useDebounce(search, 500);

  const [openIndex, setOpenIndex] = useState(null);
  const wrapperRef = useRef(null);

  // Fetch products
  const fetchProducts = async (pageNo = 1, debounceValue = '') => {
    if (fetching) return;
    setFetching(true);
    try {
      const res = await authService.getCategories(
        user.accessToken,
        pageNo,
        20,
        debounceValue,
      );
      const data = res.data?.data || [];
      const pagination = res.data?.pagination;
      if (pageNo === 1) setProducts(data);
      else setProducts((prev) => [...prev, ...data]);
      setHasMore(pageNo < (pagination?.totalPages || 1));
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setFetching(false);
    }
  };

  // Fetch schemes
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await schemesService.getAllSchemes(user.accessToken);
        setSchemes(res.data?.schemes || []);
      } catch {
        toast.error('Failed to load schemes');
      }
    };
    fetchSchemes();
  }, [user.accessToken]);

  // Customer loader
  const loadCustomers = async (search, loadedOptions, { page }) => {
    try {
      const res = await authService.getCustomersBySalesPerson(
        user.accessToken,
        page,
        10,
      );
      const customers = res.data?.customers || [];
      return {
        options: customers.map((c) => ({
          label: c.name,
          value: c._id,
          location: c.location,
        })),
        hasMore: customers.length === 10,
        additional: { page: page + 1 },
      };
    } catch {
      toast.error('Failed to load customers');
      return { options: [], hasMore: false, additional: { page } };
    }
  };

  const handleCustomerChange = (selected) => {
    setSelectedCustomer(selected);
    if (selected?.location?.length) {
      setFormData((prev) => ({ ...prev, location: [selected.location[0]] }));
    }
  };

  const updateLocation = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: prev.location.map((loc, i) =>
        i === index ? { ...loc, [field]: value } : loc,
      ),
    }));
  };

  const addItem = () => {
    const last = formData.items[formData.items.length - 1];
    if (Object.values(last).some((val) => !val)) {
      toast.error('Fill all fields before adding a new carton');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
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
    }));
  };

  const removeItem = (index) =>
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));

  const changeScheme = (e) => {
    const id = e.target.value;
    const selected = schemes.find((s) => s._id === id) || {};
    setScheme({
      id,
      type: selected.schemesType || '',
      quantity: selected.schemesQuantity || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return toast.error('Select a customer');
    const validItems = formData.items.filter((it) =>
      Object.values(it).every((v) => v && v !== ''),
    );
    if (!validItems.length) return toast.error('Fill all item fields');

    const payload = {
      customer: selectedCustomer.label,
      schemesId: scheme.id,
      location: formData.location,
      items: validItems.map((it) => ({
        ...it,
        quantity: parseInt(it.quantity),
      })),
    };

    try {
      const res = await cartService.createOrder(user.accessToken, payload);
      toast.success(res.message || 'Order added to cart');

      setFormData({
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
      setSelectedCustomer(null);
      setScheme({ id: '', type: '', quantity: '' });

      if (res.data?.items?.length && res.data?.WishList?.length)
        setShowChoiceModal(true);
      else if (res.data?.items?.length) navigate('/salesPerson/cart');
      else if (res.data?.WishList?.length) navigate('/salesPerson/Wishlist');
    } catch {
      toast.error('Checkout failed');
    }
  };

  useEffect(() => {
    if (openIndex !== null) {
      if (debounceValue.length === 0 || debounceValue.length >= 2) {
        setPage(1);
        fetchProducts(1, debounceValue);
      }
    }
  }, [openIndex, debounceValue]);

  useEffect(() => {
    if (page > 1) fetchProducts(page, search);
  }, [page]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !fetching) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setOpenIndex(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get unique colors for selected article
  const getUniqueColors = (articleId) => {
    const product = products.find((p) => p._id === articleId);
    if (!product) return [];
    const colors = new Set(product.category.map((cat) => cat.color));
    return Array.from(colors);
  };

  // Get sizes for selected article and color
  const getSizesForColor = (articleId, selectedColor) => {
    const product = products.find((p) => p._id === articleId);
    if (!product || !selectedColor) return [];
    const sizes = product.category
      .filter((cat) => cat.color === selectedColor)
      .map((cat) => cat.size);
    return Array.from(new Set(sizes));
  };

  // Get types for selected article, color, and size
  const getTypesForColorSize = (articleId, selectedColor, selectedSize) => {
    const product = products.find((p) => p._id === articleId);
    if (!product || !selectedColor || !selectedSize) return [];
    const types = product.category
      .filter((cat) => cat.color === selectedColor && cat.size === selectedSize)
      .flatMap((cat) => cat.type || []);
    return Array.from(new Set(types));
  };

  // Get qualities for selected article, color, size, and type
  const getQualitiesForColorSizeType = (
    articleId,
    selectedColor,
    selectedSize,
    selectedType
  ) => {
    const product = products.find((p) => p._id === articleId);
    if (!product || !selectedColor || !selectedSize || !selectedType)
      return [];
    const qualities = product.category
      .filter(
        (cat) =>
          cat.color === selectedColor &&
          cat.size === selectedSize &&
          cat.type?.includes(selectedType)
      )
      .flatMap((cat) => cat.quality || []);
    return Array.from(new Set(qualities));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center flex-1">
            Customer Order Form
          </h1>
          <FiShoppingCart
            onClick={() => navigate('/salesPerson/cart')}
            className="text-2xl cursor-pointer"
          />
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold">Customer</span>
            </div>
            <AsyncPaginate
              value={selectedCustomer}
              loadOptions={loadCustomers}
              onChange={handleCustomerChange}
              additional={{ page: 1 }}
              placeholder="Select Customer..."
            />
          </div>

          <div className="bg-green-50 p-4 rounded-lg space-y-4">
            {formData.location.map((loc, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg border border-green-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Location {idx + 1}</span>
                  {formData.location.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          location: prev.location.filter((_, i) => i !== idx),
                        }))
                      }
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    placeholder="Address"
                    value={loc.address}
                    onChange={(e) =>
                      updateLocation(idx, 'address', e.target.value)
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    placeholder="City"
                    value={loc.city}
                    onChange={(e) =>
                      updateLocation(idx, 'city', e.target.value)
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    placeholder="State"
                    value={loc.state}
                    onChange={(e) =>
                      updateLocation(idx, 'state', e.target.value)
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    placeholder="Pincode"
                    value={loc.pincode}
                    onChange={(e) =>
                      updateLocation(idx, 'pincode', e.target.value)
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-semibold">Order</span>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Carton
              </button>
            </div>

            {formData.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg border border-purple-200 mb-3"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className='font-bold'>Order Item {idx + 1}</span>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div ref={wrapperRef} className="relative col-span-3">
                    <div
                      onClick={() =>
                        setOpenIndex(openIndex === idx ? null : idx)
                      }
                      className="cursor-pointer border px-3 py-2 rounded"
                    >
                      {item.article || 'Select Article'}
                    </div>

                    {openIndex === idx && (
                      <div
                        className="absolute mt-1 w-full bg-white border rounded shadow max-h-48 overflow-y-auto z-10"
                        onScroll={handleScroll}
                      >
                        <input
                          type="text"
                          placeholder="Search..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full px-3 py-2 border-b"
                        />
                        {products.map((p) => (
                          <div
                            key={p._id}
                            onClick={() => {
                              const category = p.category?.[0] || {};
                              const updated = [...formData.items];
                              updated[idx] = {
                                ...updated[idx],
                                articleId: p._id,
                                article: p.article,
                                categoryCode: category.categoryCode || '',
                                color: '',
                                size: '',
                                type: '',
                                quality: '',
                                quantity: updated[idx].quantity || '',
                              };
                              setFormData((prev) => ({
                                ...prev,
                                items: updated,
                              }));
                              setOpenIndex(null);
                            }}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                          >
                            {p.article}
                          </div>
                        ))}
                        {fetching && (
                          <p className="px-3 py-2 text-sm text-gray-500">
                            Loading...
                          </p>
                        )}
                        {!fetching && products.length === 0 && (
                          <p className="px-3 py-2 text-sm text-gray-500">
                            No results found
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <input
                    placeholder="Category Code"
                    value={item.categoryCode}
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                  />

                  {/* Color Select */}
                  <select
                    value={item.color}
                    onChange={(e) => {
                      const updated = [...formData.items];
                      updated[idx].color = e.target.value;
                      updated[idx].size = '';
                      updated[idx].type = '';
                      updated[idx].quality = '';
                      setFormData((prev) => ({ ...prev, items: updated }));
                    }}
                    className="w-full border rounded px-3 py-2"
                    disabled={!item.article}
                  >
                    <option value="">Select Color</option>
                    {getUniqueColors(item.articleId).map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>

                  {/* Size Select */}
                  <select
                    value={item.size}
                    onChange={(e) => {
                      const updated = [...formData.items];
                      updated[idx].size = e.target.value;
                      updated[idx].type = '';
                      updated[idx].quality = '';
                      setFormData((prev) => ({ ...prev, items: updated }));
                    }}
                    className="w-full border rounded px-3 py-2"
                    disabled={!item.color}
                  >
                    <option value="">Select Size</option>
                    {getSizesForColor(item.articleId, item.color).map(
                      (size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      )
                    )}
                  </select>

                  {/* Type Select */}
                  <select
                    value={item.type}
                    onChange={(e) => {
                      const updated = [...formData.items];
                      updated[idx].type = e.target.value;
                      updated[idx].quality = '';
                      setFormData((prev) => ({ ...prev, items: updated }));
                    }}
                    className="w-full border rounded px-3 py-2"
                    disabled={!item.size}
                  >
                    <option value="">Select Type</option>
                    {getTypesForColorSize(
                      item.articleId,
                      item.color,
                      item.size
                    ).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  {/* Quality Select */}
                  <select
                    value={item.quality}
                    onChange={(e) => {
                      const updated = [...formData.items];
                      updated[idx].quality = e.target.value;
                      setFormData((prev) => ({ ...prev, items: updated }));
                    }}
                    className="w-full border rounded px-3 py-2"
                    disabled={!item.type}
                  >
                    <option value="">Select Quality</option>
                    {getQualitiesForColorSizeType(
                      item.articleId,
                      item.color,
                      item.size,
                      item.type
                    ).map((quality) => (
                      <option key={quality} value={quality}>
                        {quality}
                      </option>
                    ))}
                  </select>

                  <input
                    placeholder="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const updated = [...formData.items];
                      updated[idx].quantity = e.target.value;
                      setFormData((prev) => ({ ...prev, items: updated }));
                    }}
                    className="w-full border rounded px-3 py-2 col-span-3"
                  />
                </div>
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <select
                value={scheme.id}
                onChange={changeScheme}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Scheme</option>
                {schemes.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.schemesName}
                  </option>
                ))}
              </select>
              <input
                placeholder="Scheme Type"
                value={scheme.type}
                readOnly
                className="w-full border rounded px-3 py-2"
              />
              <input
                placeholder="Quantity Included"
                value={scheme.quantity}
                readOnly
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:bg-gray-400"
            disabled={!selectedCustomer || !formData.items.length}
          >
            Add to Cart
          </button>
        </form>

        {showChoiceModal && (
          <Cart_WishList
            title="Choose Destination"
            message="Items exist in both Cart and Wishlist. Where to go?"
            onConfirm={() => {
              navigate('/salesPerson/cart');
              setShowChoiceModal(false);
            }}
            onCancel={() => {
              navigate('/salesPerson/Wishlist');
              setShowChoiceModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryDashboard;