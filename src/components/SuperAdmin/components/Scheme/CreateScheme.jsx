'use client';

import { useState } from 'react';
import schemesService from '../../../../api/schemes.service';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';

export default function CreateScheme({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    type: '',
    description: '',
    quantity: '',
    expireDate:''
  });
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date.trim()) {
      toast.error('Date is required');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!formData.type.trim()) {
      toast.error('Type is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.quantity.trim()) {
      toast.error('Quantity is required');
      return;
    }
    if (!formData.date.trim()) {
      toast.error('Expire Date is Required');
      return;
    }
   
    try {
      const payload = {
        schemesName: formData.name,
        schemesDescription: formData.description,
        schemesType: formData.type,
        schemesQuantity: formData.quantity,
        expireDate:formData.expireDate
      };
      console.log('hello', payload);

      const res = await schemesService.addSchemes(user.accessToken, payload);
      toast.success(res.data.message || "Scheme Created Successfully")
      console.log('hello1234', res);
      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (error) {}
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className=" w-full h-full">
      <div className="w-full h-[600px] bg-white rounded-lg shadow-sm  mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Scheme</h1>
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
              Starting  Date
              </label>
              <input
                type="date"
                id="date"
                placeholder="dd/mm/yyyy"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>


            <div>
              <label
                htmlFor="expireDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ending Date
              </label>
              <input
                type="date"
                id="expireDate"
                placeholder="dd/mm/yyyy"
                value={formData.expireDate}
                onChange={(e) => handleChange('expireDate', e.target.value)}
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
