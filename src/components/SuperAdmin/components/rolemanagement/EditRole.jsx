import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select'; // ✅ needed for warehouses dropdown
import roleService from '../../../../api/role.service';
import warehouseService from '../../../../api/warehouse.service'; 
import { useAuth } from '../../../../Context/AuthContext';

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [warehouses, setWarehouses] = useState([]); // ✅ store warehouses

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: '',
    location: '',
    profileImage: '',
    warehouses: [], // ✅ store selected warehouses
  });

  // Fetch warehouses list
  useEffect(() => {
    (async () => {
      try {
        const res = await warehouseService.getAllWarehouse(user.accessToken);
        setWarehouses(res.data.data || []);
      } catch (error) {
        console.error('Failed to load warehouses', error);
      }
    })();
  }, [user.accessToken]);

  // Fetch user details
  useEffect(() => {
    (async () => {
      try {
        const res = await roleService.getRoleByID(user.accessToken, id); // replace with correct API
        setFormData({
          name: res?.data?.name || '',
          phone: res?.data?.phone || '',
          email: res?.data?.email || '',
          password: '', // leave blank so user can set new if needed
          role: res?.data?.role || '',
          location: res?.data?.location || '',
          profileImage: res?.data?.profileImage || '',
          warehouses: res?.data?.warehouses || [], // ✅ prefill warehouses
        });
      } catch (error) {
        toast.error('Failed to load user details');
      }
    })();
  }, [id, user.accessToken]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'profileImage' ? files[0] : value,
    });
  };

  const handleWarehouseChange = (selectedOptions) => {
    setFormData({
      ...formData,
      warehouses: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'warehouses') {
          formData.warehouses.forEach((id) => payload.append('warehouses', id)); // ✅ send warehouses array
        } else {
          payload.append(key, formData[key]);
        }
      });

      await roleService.updateRoleByID(user.accessToken, id, payload); 
      toast.success('User details updated successfully');
      navigate('/role-management');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-6"> {formData.role}</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            className="border border-gray-300 p-2 rounded w-full"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            className="border border-gray-300 p-2 rounded w-full"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="border border-gray-300 p-2 rounded w-full"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            className="border border-gray-300 p-2 rounded w-full"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            name="role"
            className="border border-gray-300 p-2 rounded w-full"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Production Manager">Production Manager</option>
            <option value="Inventory Manager">Inventory Manager</option>
            <option value="Accounting Manager">Accounting Manager</option>
            <option value="Sales Person">Sales Person</option>
            <option value="Warehouse Manager">Warehouse Manager</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            className="border border-gray-300 p-2 rounded w-full"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        {/* ✅ Warehouse(s) field (only if role is Warehouse Manager) */}
        {formData.role === 'Warehouse Manager' && (
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">Warehouse(s)</label>
            <Select
              isMulti
              name="warehouses"
              options={warehouses.map((val) => ({ value: val._id, label: val.name }))}
              value={warehouses
                .filter((w) => formData.warehouses.includes(w._id))
                .map((w) => ({ value: w._id, label: w.name }))}
              onChange={handleWarehouseChange}
              classNamePrefix="react-select"
              placeholder="Select warehouse(s)"
            />
          </div>
        )}

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Profile Image</label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          {formData.profileImage && typeof formData.profileImage === 'string' && (
            <img
              src={formData.profileImage}
              alt="Profile"
              className="mt-2 w-20 h-20 object-cover rounded"
            />
          )}
        </div>

        {/* Actions */}
        <div className="col-span-1 md:col-span-2 flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 px-5 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRole;
