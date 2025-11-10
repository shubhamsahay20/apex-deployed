import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';
import warehouseService from '../../../../api/warehouse.service';

const CreateWarehouse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    country: '',
    city: '',
    state: '',
    pincode: '',
    type: '',
    address: '',
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Warehouse name is required.';
        break;
      case 'country':
        if (!value.trim()) error = 'Country is required.';
        break;
      case 'city':
        if (!value.trim()) error = 'City is required.';
        break;
      case 'state':
        if (!value.trim()) error = 'State is required.';
        break;
      case 'pincode':
        if (!/^\d{6}$/.test(value)) error = 'Pincode must be 6 digits.';
        break;
      case 'type':
        if (!value.trim()) error = 'Type is required.';
        break;
      case 'address':
        if (!value.trim()) error = 'Address is required.';
        break;
      case 'email':
        if (value && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          error = 'Invalid email address.';
        break;
      case 'phone':
        if (value && !/^[0-9]{10}$/.test(value))
          error = 'Phone must be 10 digits.';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation check
    let isValid = true;
    Object.keys(formData).forEach((field) => {
      const valid = validateField(field, formData[field]);
      if (!valid) isValid = false;
    });

    if (!isValid) {
      toast.error('Please fill all fields correctly before submitting.');
      return;
    }

    const payload = {
      name: formData.name,
      location: {
        address: formData.address.trim(),
        country: formData.country,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      type: formData.type,
      email: formData.email,
      phone: formData.phone,
    };

    try {
      const res = await warehouseService.addWarehouse(user.accessToken, payload);
      toast.success(res.data?.message || 'Warehouse created successfully');
      navigate('/warehouse-management');
    } catch (error) {
      toast.error(error?.response?.message || 'Error creating warehouse');
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Create Warehouse
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Name */}
          <div>
            <label className="text-[#333333] text-sm font-medium mb-1 block">
              Warehouse Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Warehouse Name"
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          {/* Country */}
          <div>
            <label className="text-[#333333] text-sm font-medium mb-1 block">
              Country
            </label>
            <input
              name="country"
              type="text"
              placeholder="Enter Country"
              value={formData.country}
              onChange={handleChange}
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
            {errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
          </div>

          {/* City */}
          <div>
            <label className="text-[#333333] text-sm font-medium mb-1 block">
              City
            </label>
            <input
              name="city"
              type="text"
              placeholder="Enter City"
              value={formData.city}
              onChange={handleChange}
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
            {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
          </div>

          {/* State */}
          <div>
            <label className="text-[#333333] text-sm font-medium mb-1 block">
              State
            </label>
            <input
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              className="border px-4 py-2 rounded-md text-sm w-full"
              placeholder="Enter State"
            />
            {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
          </div>

          {/* Pincode */}
          <div>
            <label className="text-[#333333] text-sm font-medium mb-1 block">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              maxLength={6}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,6}$/.test(value)) handleChange(e);
              }}
              placeholder="Enter Pincode"
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
            {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="text-[#333333] text-sm font-medium mb-1 block">
              Type
            </label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Enter Type"
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
            {errors.type && <p className="text-red-500 text-xs">{errors.type}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-[#333333] text-sm font-medium mb-1 block">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="text-[#333333] text-sm font-medium mb-1 block">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="text-[#333333] text-sm font-medium mb-1 block">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Address"
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded text-sm hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateWarehouse;
