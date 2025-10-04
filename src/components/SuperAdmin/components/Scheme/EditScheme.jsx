'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import schemesService from '../../../../api/schemes.service';
import { useAuth } from '../../../../Context/AuthContext';
import Loader from '../../../../common/Loader';

export default function EditScheme({ scheme, onSubmit, onCancel }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    type: '',
    description: '',
    quantity: '',
  });

    const[loading,setLoading] = useState(false)


  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        console.log('scheme', scheme);

        const res = await schemesService.getSchemeById(
          user.accessToken,
          scheme,
        );
        console.log('response', res.data);
        const data = res.data;
        setFormData({
          date: data.date,
          description: data.schemesDescription,
          name: data.schemesName,
          type: data.schemesType,
          quantity: data.schemesQuantity,
        });
      } catch (error) {
        toast.error(error.response?.message);
      } finally{
        setLoading(false)
      }
    })();
  }, [scheme]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date.trim()) {
      toast.error('Date is required');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    if (!formData.type.trim()) {
      toast.error('Description is required');
      return;
    }
    setLoading(true)
    try {
      const payload = {
        schemesName: formData.name,
        schemesType: formData.type,
        schemesQuantity: formData.quantity,
        schemesDescription: formData.description,
      };

      console.log('payload', payload);

      const res = await schemesService.EditSchemeById(
        user.accessToken,
        scheme,
        payload,
      );

      console.log('update res ', res.data);
      toast.success(res.data?.message || 'Updated Successfully');

      console.log('announcement', scheme);

      if (scheme && onSubmit) {
        onSubmit({
          id: scheme,
          ...formData,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally{
      setLoading(false)
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

    if(loading) return <Loader/>


  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm max-w-4xl mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Edit schemes</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Field */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date
              </label>
              <input
                type="text"
                id="date"
                placeholder="dd/mm/yyyy"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Scheme Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter Scheme Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Quantity Included In Scheme
              </label>
              <input
                type="number"
                id="quantity"
                placeholder="5664"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
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
}
