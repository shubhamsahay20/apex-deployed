import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';
import warehouseService from '../../../../api/warehouse.service';

const EditWarehouse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    (async () => {
      const res = await warehouseService.getWarehouseById(user.accessToken, id);
      console.log('res data', res);
      setFormData({
        name: res?.name,
        country: res.location?.country,
        city: res.location?.city,
        state: res.location?.state,
        pincode: res.location?.pincode,
        type: res.type,
        address: res.location?.address,
      });
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,

      location: {
        address: formData.address,
        country: formData.country,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },

      type: formData.type,
    };

    try {
      const res = await warehouseService.EditWarehouse(
        user.accessToken,
        id,
        payload,
      );
      console.log('its res', res);

      toast.success(res.data?.message ||'Warehouse Edit successfully');
      navigate('/warehouse-management');
    } catch (error) {
      toast.error(error?.response?.message || 'Error Edit warehouse');
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Edit Warehouse
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-[#333333] text-sm font-medium mb-1">
              Warehouse Name
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Warehouse Name"
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

          <div>
            <div className="text-[#333333] text-sm font-medium mb-1">Type</div>
            <input
              type="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Enter Type"
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

export default EditWarehouse;
