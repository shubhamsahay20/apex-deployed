import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../../api/auth.service';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';

const AddNewCustomer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState([]); // Sales Person list
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      salesPersonId: formData.salesPersonId,
      location: [
        {
          address: formData.address,
          country: formData.country,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      ],
      note: formData.note,
      isDeleted: false,
    };
    try {
      const res = await authService.addCustomer(user.accessToken, payload);
      console.log('res add customer', res);

      toast.success(res?.message || 'Customer added successfully');
      navigate('/customer-management');
    } catch (error) {
      console.log("error add customer---------->", error);
      
      toast.error(error?.response?.data?.message || 'Error adding customer');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await authService.getUsers(user.accessToken);
        setCustomer(data.data);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    };
    fetchData();
  }, [user.accessToken]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Create Customer</h2>
      </div>

      {/* Form Inputs */}

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
              required
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
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              className="border px-4 py-2 rounded-md text-sm w-full"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Sales Person</label>
            <select
              name="salesPersonId"
              value={formData.salesPersonId}
              onChange={handleChange}
              className="border px-4 py-2 rounded-md text-sm w-full"
              required
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
              required
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
              required
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
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter Pincode"
              className="border px-4 py-2 rounded-md text-sm w-full"
              required
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
              required
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
