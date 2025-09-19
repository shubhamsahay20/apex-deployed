import React, { useEffect, useState } from 'react';
import { User, Package, Plus, Trash2 } from 'lucide-react';
import authService from '../../../api/auth.service';
import { toast } from 'react-toastify';
import { useAuth } from '../../../Context/AuthContext';
import { AsyncPaginate } from 'react-select-async-paginate';
import cartService from '../../../api/cart.service';
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import schemesService from '../../../api/schemes.service';

const CategoryDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [product, setProduct] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [schemeId, setSchemeId] = useState(null);
  const [schemeType, setSchemeType] = useState('');
  const [schemeQuantity, setSchemeQuantity] = useState('');

  const [locationFields, setLocationFields] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [formData, setFormData] = useState({
    customer: '',
    location: [
      {
        address: '',
        country: 'India',
        city: '',
        state: '',
        pincode: '',
      },
    ],
    items: [
      {
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

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        let allProducts = [];
        let currentPage = 1;
        let totalPages = 1;

        while (currentPage <= totalPages) {
          const res = await authService.getCategories(
            user.accessToken,
            currentPage,
          );

          allProducts = [...allProducts, ...res.data.data];
          totalPages = res.data.pagination.totalPages; // backend tells how many pages exist
          currentPage++;
        }

        setProduct(allProducts);

        console.log('All Products:', allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchAllProducts();
  }, [user.accessToken]);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const response = await schemesService.getAllSchemes(user.accessToken);
        console.log('scheme data', response.data?.schemes);

        setSchemes(response.data?.schemes);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    };
    fetchScheme();
  }, []);

  const loadOptions = async (search, loadedOptions, { page }) => {
    try {
      const limit = 10;
      const res = await authService.getAllCustomers(
        user.accessToken,
        page,
        limit,
      );
      const customers = res?.data?.data || [];

      return {
        options: customers.map((c) => ({
          label: c.name,
          value: c._id,
          location: c.location, // keep location for later
        })),
        hasMore: customers.length === limit,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error loading customers');
      return {
        options: [],
        hasMore: false,
        additional: {
          page,
        },
      };
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

  const handleCustomerChange = (selected) => {
    setSelectedCustomer(selected);
    setFormData((prev) => ({ ...prev, customer: selected?.value }));
    if (selected?.location?.length) {
      setLocationFields({
        address: selected.location[0]?.address || '',
        city: selected.location[0]?.city || '',
        state: selected.location[0]?.state || '',
        pincode: selected.location[0]?.pincode || '',
      });
    }
  };

  const removeLocation = (index) => {
    if (formData.location.length > 1) {
      setFormData((prev) => ({
        ...prev,
        location: prev.location.filter((_, i) => i !== index),
      }));
    }
  };

  const addItem = () => {
    const lastItem = formData.items[formData.items.length - 1];

    // Check if the last carton is filled
    if (
      !lastItem.article ||
      !lastItem.categoryCode ||
      !lastItem.color ||
      !lastItem.size ||
      !lastItem.type ||
      !lastItem.quality ||
      !lastItem.quantity
    ) {
      toast.error(
        'Please fill all fields of the current carton before adding a new one.',
      );
      return;
    }
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
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

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const changeScheme = (e) => {
    const id = e.target.value;
    console.log('idd will be', id);
    setSchemeId(id);
    const getOneScheme = schemes.find((item) => item._id === id);
    console.log('getOneScheme,', getOneScheme);

    setSchemeType(getOneScheme.schemesType);
    setSchemeQuantity(getOneScheme.schemesQuantity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerId = selectedCustomer?.value || '';
    const customerName = selectedCustomer?.label || '';

    if (!customerId && !customerName) {
      toast.error('Please select a customer before adding items.');
      return;
    }

    if (!formData?.items || formData.items.length === 0) {
      toast.error('Please add at least one item to the cart.');
      return;
    }

    const validItems = formData.items.filter(
      (it) =>
        it.article &&
        it.categoryCode &&
        it.color &&
        it.size &&
        it.type &&
        it.quality &&
        it.quantity > 0,
    );

    if (validItems.length === 0) {
      toast.error('Please fill all item fields before adding to cart.');
      return;
    }

    try {
      const payload = {
        customer: customerName,
        schemesId: schemeId,
        location: [
          {
            address: locationFields.address || ' ',
            country: locationFields.country || 'India',
            city: locationFields.city || ' ',
            state: locationFields.state || ' ',
            pincode: locationFields.pincode || '000000',
          },
        ],

        items: validItems.map((it) => ({
          article: it.article,
          categoryCode: it.categoryCode,
          color: it.color,
          size: it.size,
          type: it.type,
          quality: it.quality,
          quantity: parseInt(it.quantity),
        })),
      };

      console.log('🚀 Sending Payload:', payload);

      const res = await cartService.createOrder(user.accessToken, payload);
      console.log('✅ Backend Response:', res);

      toast.success(res.message || 'Order add to cart successful!');

      // reset form after submit
      setFormData({
        customer: '',
        location: [
          {
            address: '',
            country: 'India',
            city: '',
            state: '',
            pincode: '',
          },
        ],
        items: [
          {
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
      setLocationFields({
        address: '',
        city: '',
        state: '',
        pincode: '',
      });

      navigate('/salesPerson/cart');
    } catch (error) {
      console.error('❌ Checkout error:', error);
      toast.error(error.response?.data?.message || 'Checkout failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Customer Order Form
            </h1>
            <FiShoppingCart
              onClick={() => navigate('/salesPerson/cart')}
              className="text-2xl"
            />
          </div>

          <div className="space-y-8">
            {/* Customer Section */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <User className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Customer Information
                </h2>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name
              </label>

              <AsyncPaginate
                value={selectedCustomer}
                loadOptions={loadOptions}
                onChange={handleCustomerChange}
                additional={{ page: 1 }}
                placeholder="Select Customer..."
              />
            </div>

            {/* Location Section */}
            <div className="bg-green-50 rounded-lg p-6">
              {formData.location.map((location, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 mb-4 border border-green-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-800">Location</h3>
                    {formData.location.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLocation(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={locationFields.address}
                        readOnly
                        onChange={(e) =>
                          updateLocation(index, 'address', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows="2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={locationFields.city}
                        onChange={(e) =>
                          updateLocation(index, 'city', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={locationFields.state}
                        onChange={(e) =>
                          updateLocation(index, 'state', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        pincode
                      </label>
                      <input
                        type="text"
                        value={locationFields.pincode}
                        onChange={(e) =>
                          updateLocation(index, 'pincode', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Items Section */}
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Package className="w-6 h-6 text-purple-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Carton
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  disabled={
                    !formData.items.length ||
                    Object.values(
                      formData.items[formData.items.length - 1],
                    ).some((val) => !val)
                  }
                  className={`flex items-center px-3 py-1 rounded-lg transition-colors ${
                    !formData.items.length ||
                    Object.values(
                      formData.items[formData.items.length - 1],
                    ).some((val) => !val)
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Carton
                </button>
              </div>

              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 mb-4 border border-purple-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-800">
                      Cartan {index + 1}
                    </h3>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Article Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Article
                      </label>
                      <select
                        value={item.articleId || ''}
                        onChange={(e) => {
                          const selected = product.find(
                            (p) => p._id === e.target.value,
                          );
                          const updatedItems = [...formData.items];
                          updatedItems[index] = {
                            ...updatedItems[index],
                            articleId: selected._id,
                            article: selected.article,
                            categoryCode:
                              selected.category[0]?.categoryCode || '',
                            color: selected.category[0]?.color || '',
                            size: selected.category[0]?.size || '',
                            type: selected.category[0]?.type || '',
                            quality: selected.category[0]?.quality || '',
                          };
                          setFormData({ ...formData, items: updatedItems });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Article</option>
                        {product.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.article}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category Code
                      </label>
                      <input
                        type="text"
                        value={item.categoryCode || ''}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <input
                        type="text"
                        value={item.color || ''}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size
                      </label>
                      <input
                        type="text"
                        value={item.size || ''}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <input
                        type="text"
                        value={item.type || ''}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Quality */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quality
                      </label>
                      <input
                        type="text"
                        value={item.quality || ''}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={item.quantity || ''}
                        onChange={(e) => {
                          const updatedItems = [...formData.items];
                          updatedItems[index].quantity = e.target.value;
                          setFormData({ ...formData, items: updatedItems });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Scheme Name
                  </label>
                  <select
                    type="text"
                    id="type"
                    value={schemeId}
                    onChange={changeScheme}
                    placeholder="Enter Scheme Type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">select scheme</option>
                    {schemes.map((val) => (
                      <option key={val._id} value={val._id}>
                        {' '}
                        {val.schemesName}{' '}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Scheme Type
                  </label>
                  <input
                    type="text"
                    id="type"
                    placeholder="Enter Scheme Type"
                    value={schemeType}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Quantity Included
                  </label>
                  <input
                    type="text"
                    value={schemeQuantity}
                    id="type"
                    placeholder="Enter Scheme Type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={
                  !selectedCustomer ||
                  !formData?.items ||
                  formData.items.length === 0
                }
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors
    ${
      !selectedCustomer || !formData?.items || formData.items.length === 0
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700'
    }`}
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* JSON Preview */}
        </div>
      </div>
    </div>
  );
};

export default CategoryDashboard;
