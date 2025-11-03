import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../../api/auth.service';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';

const AddNewCustomer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    salesPersonId: '',
    address: '',
    country: '',
    city: '',
    state: '',
    pincode: '',
    note: '',
  });

  // handle input changes with restrictions for phone & pincode
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      if (/^\d{0,10}$/.test(value)) {
        setFormData((prev) => ({ ...prev, phone: value }));
      }
      return;
    }

    if (name === 'pincode') {
      if (/^\d{0,6}$/.test(value)) {
        setFormData((prev) => ({ ...prev, pincode: value }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // validate fields and show toast messages
  const validateForm = (data) => {
    if (!data.name.trim()) {
      toast.error('Customer name is required');
      return false;
    }
    if (!data.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      toast.error('Enter a valid email address');
      return false;
    }
    if (!data.phone.trim()) {
      toast.error('Phone number is required');
      return false;
    }
    if (!/^\d{10}$/.test(data.phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return false;
    }
    if (!data.salesPersonId.trim()) {
      toast.error('Please select a sales person');
      return false;
    }
    if (!data.country.trim()) {
      toast.error('Country is required');
      return false;
    }
    if (!data.city.trim()) {
      toast.error('City is required');
      return false;
    }
    if (!data.state.trim()) {
      toast.error('State is required');
      return false;
    }
    if (!data.pincode.trim()) {
      toast.error('Pincode is required');
      return false;
    }
    if (!/^\d{6}$/.test(data.pincode)) {
      toast.error('Pincode must be exactly 6 digits');
      return false;
    }
    if (!data.address.trim()) {
      toast.error('Address is required');
      return false;
    }
    if (data.address.trim().length < 5) {
      toast.error('Address is too short');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(formData)) return;

    const payload = {
      name: formData.name.trim(),
      phone: Number(formData.phone),
      email: formData.email.trim(),
      salesPersonId: formData.salesPersonId,
      location: [
        {
          address: formData.address.trim(),
          country: formData.country.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: Number(formData.pincode),
        },
      ],
      note: formData.note?.trim() || '',
      isDeleted: false,
    };

    try {
      const res = await authService.addCustomer(user.accessToken, payload);
      toast.success(res?.message || 'Customer added successfully');
      navigate('/customer-management');
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error(error?.response?.data?.message || 'Error adding customer');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await authService.getUsers(user.accessToken);
        setCustomer(data.data);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to load users');
      }
    };
    fetchData();
  }, [user.accessToken]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Create Customer</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Customer Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Customer Name"
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              placeholder="Enter Phone Number"
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Sales Person</label>
            <select
              name="salesPersonId"
              value={formData.salesPersonId}
              onChange={handleChange}
              className="border px-4 py-2 rounded-md text-sm w-full"
            >
              <option value="">Select Sales Person</option>
              {customer.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter Country"
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter City"
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter State"
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Pincode</label>
            <input
              type="text"
              name="pincode"
              maxLength={6}
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter Pincode"
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-sm font-medium">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Address"
              className="border px-4 py-2 rounded-md text-sm w-full"
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium">Notes</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Enter any notes here..."
            className="border px-4 py-2 rounded-md text-sm w-full"
            rows={4}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Add Customer
          </button>
          <button
            type="button"
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-100"
          >
            Print
          </button>
          <button
            type="button"
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-100"
          >
            PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewCustomer;
