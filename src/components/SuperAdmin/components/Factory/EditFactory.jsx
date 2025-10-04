import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';
import factoryService from '../../../../api/factory.service';
import Loader from '../../../../common/Loader';

const EditFactory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    city: '',
    state: '',
    pincode: '',
    address: '',
  });

  const validateFactoryForm = (data) => {
    const errors = {};

    if (!data.name?.trim()) errors.name = 'Factory name is required';
    if (!data.country?.trim()) errors.country = 'Country is required';
    if (!data.city?.trim()) errors.city = 'City is required';
    if (!data.state?.trim()) errors.state = 'State is required';
    if (!data.pincode?.toString().trim())
      errors.pincode = 'Pincode is required';
    if (!data.address?.trim()) errors.address = 'Address is required';

    return errors;
  };

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await factoryService.getFactoryById(user.accessToken, id);
        console.log(res.data.data);
        setFormData({
          name: res.data?.data?.name,
          address: res.data?.data?.location?.address || '',
          country: res.data?.data?.location?.country || '',
          city: res.data?.data?.location?.country || '',
          state: res.data?.data?.location?.state || '',
          pincode: res.data?.data?.location?.pincode | '',
        });
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally{
        setLoading(false)
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateFactoryForm(formData);
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((msg) => toast.error(msg));
      return;
    }
    const payload = {
      name: formData.name,

      location: {
        address: formData.address,
        country: formData.country,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
    };

    try {
      setLoading(true)
      const res = await factoryService.EditFactoryById(
        user.accessToken,
        id,
        payload,
      );
      console.log('its res', res);

      toast.success(res.data?.message || 'Factory Updated successfully');
      navigate('/factory-management');
    } catch (error) {
      toast.error(error?.response?.message || 'Error creating warehouse');
    } finally{
      setLoading(false)
    }
  };

    if(loading) return <Loader/>


  return (
    <div className="p-6 bg-white rounded shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Edit Factory</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-[#333333] text-sm font-medium mb-1">
              Factory Name
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Factory Name"
              className="border px-4 py-2 rounded-md text-sm w-full"
              required
            />
          </div>

          <div>
            <div className="text-[#333333] text-sm font-medium mb-1">
              Country
            </div>
            <input
              name="country"
              type="text"
              placeholder="Enter Country "
              value={formData.country}
              onChange={handleChange}
              className="border px-4 py-2 rounded-md text-sm w-full"
              required
              //   readOnly
            ></input>
          </div>
          <div>
            <div className="text-[#333333] text-sm font-medium mb-1">City</div>
            <input
              name="city"
              type="text"
              placeholder="Enter City"
              value={formData.city}
              onChange={handleChange}
              className="border px-4 py-2 rounded-md text-sm w-full"
              required
            ></input>
          </div>
          <div>
            <div className="text-[#333333] text-sm font-medium mb-1">State</div>
            <input
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              className="border px-4 py-2 rounded-md text-sm w-full"
              placeholder="Enter State "
              required
            ></input>
          </div>
          <div>
            <div className="text-[#333333] text-sm font-medium mb-1">
              Pincode
            </div>
            <input
              type="number"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter Pincode"
              className="border px-4 py-2 rounded-md text-sm w-full"
              required
            />
          </div>
          <div className="md:col-span-2">
            <div className="text-[#333333] text-sm font-medium mb-1">
              Address
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Address"
              className="border px-4 py-2 rounded-md text-sm w-full"
              required
            />
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

export default EditFactory;
