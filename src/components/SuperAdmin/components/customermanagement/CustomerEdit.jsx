import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../../../api/auth.service';
import { useAuth } from '../../../../Context/AuthContext';
import Loader from '../../../../common/Loader';

const CustomerEdit = () => {
  const { state } = useLocation();
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    salesPerson: '',
    country: '',
    city: '',
    state: '',
    pincode: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: formData.customer_name,
      email: formData.email,
      phone: formData.phone,
      location: [
        {
          address: formData.address,
          country: formData.country,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      ],
      salesPersonId: formData.salesPerson,
    };

    try {
      setLoading(true)
      const res = await authService.EditCustomer(user.accessToken, id, data);
      console.log(res, 'tred');
      toast.success(res.data?.message || 'Updated ');

      console.log('hi');
      navigate('/customer-management');
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally{
      setLoading(false)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const { id } = useParams();
  const { user } = useAuth();
  const [customer, setCustomer] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data } = await authService.getUsers(user.accessToken);
        console.log('customer', data);

        setCustomer(data.data);
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally{
        setLoading(false)
      }
    };
    fetchData();
  }, [user.accessToken]);

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await authService.getCustomerById(user.accessToken, id);
        console.log(' details', res.data);
        const location = res.data.data.location[0] || {};

        setFormData({
          customer_name: res.data.data.name,
          email: res.data.data.email,
          phone: res.data.data.phone,
          salesPerson: res.data.data.salesPersonId?._id || '',
          country: location.country || '',
          city: location.city || '',
          state: location.state || '',
          pincode: location.pincode || '',
          address: location.address || '',
        });
      } catch (error) {
        toast.error(error.response?.data?.message)
      } finally{
        setLoading(false)
      }
    })();
  }, []);

    if(loading) return <Loader/>


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Edit Customer</h2>
      </div>

      {/* Form Inputs */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Customer Name</label>
            <input
              name="customer_name"
              onChange={handleChange}
              type="text"
              placeholder="Enter Customer Name"
              value={formData.customer_name}
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              onChange={handleChange}
              type="email"
              placeholder="Enter Email"
              value={formData.email}
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              type="text"
              onChange={handleChange}
              name="phone"
              placeholder="Enter Phone Number"
              value={formData.phone}
              className="border px-4 py-2 rounded-md text-sm w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Sales Person</label>
            <select
              onChange={handleChange}
              name="salesPerson"
              value={formData.salesPerson}
              className="border px-4 py-2 rounded-md text-sm w-full"
            >
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
              value={formData.country}
              onChange={handleChange}
              name="country"
              className="border px-4 py-2 rounded-md text-sm w-full"
            ></input>
          </div>

          <div>
            <label className="text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              onChange={handleChange}
              value={formData.city}
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
              onChange={handleChange}
              value={formData.state}
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
              onChange={handleChange}
              value={formData.pincode}
              placeholder="Enter Pincode"
              className="border px-4 py-2 rounded-md text-sm w-full"
              required
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-sm font-medium">Address</label>
            <textarea
              name="address"
              onChange={handleChange}
              value={formData.address}
              placeholder="Enter Address"
              className="border px-4 py-2 rounded-md text-sm w-full"
              rows={3}
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerEdit;
