import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { PiPencilSimpleLineBold } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import roleService from '../../../../api/role.service';
import warehouseService from '../../../../api/warehouse.service';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../../../../common/Loader';
import { ImCross } from "react-icons/im";

const roles = [
  'Sales Person',
  'Inventory Manager',
  'Account Section',
  'Production Manager',
  'Warehouse Manager',
  'Administrator',
];

const columnHeadings = {
  'Sales Person': {
    name: 'Sales Person',
    phone: 'Sales Phone',
    email: 'Sales Email',
    location: 'Sales Location',
  },
  'Inventory Manager': {
    name: 'Inventory Manager',
    phone: 'Inventory Phone',
    email: 'Inventory Email',
    location: 'Inventory Location',
  },
  'Account Section': {
    name: 'Account Section',
    phone: 'Accounting Phone',
    email: 'Accounting Email',
    location: 'Accounting Location',
  },
  'Production Manager': {
    name: 'Production Manager',
    phone: 'Production Phone',
    email: 'Production Email',
    location: 'Production Location',
  },
  'Warehouse Manager': {
    name: 'Warehouse Manager',
    phone: 'Warehouse Phone',
    email: 'Warehouse Email',
    location: 'Warehouse Location',
  },
  Administrator: {
    name: 'Administrator',
    phone: 'Admin Phone',
    email: 'Admin Email',
    location: 'Admin Location',
  },
};

const RoleManagement = () => {
  const [activeRole, setActiveRole] = useState('Sales Person');
  const [usersByRole, setUsersByRole] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  const getRoleApiMap = {
    'Sales Person': roleService.getSalesPerson,
    'Inventory Manager': roleService.getInventoryManager,
    'Account Section': roleService.getAccountSection,
    'Warehouse Manager': roleService.getWarehouseManager,
    'Production Manager': roleService.getProductionManager,
    Administrator: roleService.getAdministrator,
  };

  // Fetch warehouses
  useEffect(() => {
    (async () => {
      setWarehouseLoading(true);
      try {
        const res = await warehouseService.getAllWarehouse(user.accessToken);
        setWarehouses(res.data?.data || []);
      } catch (error) {
        toast.error('Failed to load warehouses');
      } finally {
        setWarehouseLoading(false);
      }
    })();
  }, [user.accessToken]);

  // Fetch users for the active role
  const fetchRoleUsers = async () => {
    setLoading(true);
    try {
      const apiFunc = getRoleApiMap[activeRole];
      if (apiFunc) {
        const res = await apiFunc(user.accessToken);
        setUsersByRole((prev) => ({ ...prev, [activeRole]: res.data.data }));
      }
    } catch (error) {
      toast.error(`Failed to load ${activeRole} data`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleUsers();
  }, [activeRole]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await roleService.deleteRoleByID(user.accessToken, deleteId);
      setUsersByRole((prev) => ({
        ...prev,
        [activeRole]: prev[activeRole].filter((user) => user._id !== deleteId),
      }));
      toast.success(res?.message || 'User deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(false);
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const handleViewClick = (userid) => {
    navigate(
      `/view-details/${activeRole
        .replace(/\s+/g, '-')
        .toLowerCase()}/${userid}`,
    );
  };

  const roleUsers = usersByRole[activeRole] || [];
  const headings = columnHeadings[activeRole];

  const AddSalesPerson = ({ onSubmit }) => {
    const [form, setForm] = useState({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: activeRole,
      location: '',
      warehouses: [],
      image: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    };

    const handleWarehouseChange = (selectedOptions) => {
      setForm({
        ...form,
        warehouses: selectedOptions
          ? selectedOptions.map((opt) => opt.value)
          : [],
      });
    };

    const validate = () => {
      const newErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;

      if (!form.name.trim()) newErrors.name = 'Name is required';
      if (!form.phone.trim() || !phoneRegex.test(form.phone))
        newErrors.phone = 'Valid phone is required';
      if (!form.email.trim() || !emailRegex.test(form.email))
        newErrors.email = 'Valid email is required';
      if (!form.location) newErrors.location = 'Choose a location';
      if (!form.password.trim() || form.password.length < 6)
        newErrors.password = 'Password must be at least 6 characters';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validate()) {
        setSubmitLoading(true);
        const payload = new FormData();

        payload.append('name', form.name);
        payload.append('phone', form.phone);
        payload.append('email', form.email);
        payload.append('location', form.location);
        payload.append('password', form.password);
        payload.append('role', form.role);

        // If warehouses is an array, append each item
        form.warehouses.forEach((w, i) => {
          payload.append(`warehouses[${i}]`, w);
        });

        // Append the image file
        if (form.image) {
          payload.append('profilePic', form.image); // must be a File object
        }

        // Log FormData contents
        for (let pair of payload.entries()) {
          console.log(' payload which i am logging ', pair[0], pair[1]);
        }

        try {
          const res = await roleService.AddRole(user.accessToken, payload);
          toast.success(res?.message || 'Role added successfully');
          await fetchRoleUsers();
          setShowAddModal(false);

          setForm({
            name: '',
            phone: '',
            email: '',
            location: '',
            password: '',
            role: activeRole,
            warehouses: [],
            image: '',
          });
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to add role');
        } finally {
          setSubmitLoading(false);
        }
      }
    };

    return (
      <div className="p-6 bg-white rounded-lg shadow max-w-5xl h-auto mx-auto mt-6 relative">
        <button
          className="absolute top-3 right-4 text-gray-500 text-xl hover:text-gray-700"
          onClick={() => setShowAddModal(false)}
          disabled={submitLoading}
        >
          <ImCross />
        </button>

        <div className="mb-10 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Add {activeRole}
          </h2>
        </div>

        {warehouseLoading && activeRole === 'Warehouse Manager' ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-8"
          >
            {/* Image Upload */}
            <div className="flex flex-col items-center mb-6 md:mb-0 md:flex-shrink-0">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Upload Image
              </label>

              <div className="relative w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {/* If image is uploaded, show preview */}
                {form.image ? (
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  // Default upload area
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 5v14m7-7H5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span className="text-gray-500 text-sm mt-2">
                      Choose Image
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setForm({ ...form, image: file });
                        }
                      }}
                    />
                  </label>
                )}

                {/* Remove button */}
                {form.image && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: null })}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    &times;
                  </button>
                )}
              </div>

              {errors.image && (
                <div className="text-xs text-red-500 mt-1">{errors.image}</div>
              )}
            </div>

            {/* Inputs + Submit */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Name
                  </label>
                  <input
                    name="name"
                    className="border px-4 py-2 rounded w-full"
                    placeholder="Enter Name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={submitLoading}
                  />
                  {errors.name && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Phone
                  </label>
                  <input
                    name="phone"
                    className="border px-4 py-2 rounded w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance:textfield]"
                    placeholder="Enter Phone no."
                    type="text"
                    value={form.phone}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,10}$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    disabled={submitLoading}
                    required
                  />
                  {errors.phone && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.phone}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="border px-4 py-2 rounded w-full"
                    placeholder="Enter Email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={submitLoading}
                  />
                  {errors.email && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Location
                  </label>
                  <input
                    name="location"
                    className="border px-4 py-2 rounded w-full"
                    placeholder="Enter Location"
                    value={form.location}
                    onChange={handleChange}
                    disabled={submitLoading}
                  />
                  {errors.location && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.location}
                    </div>
                  )}
                </div>

                {/* Warehouses */}
                {activeRole === 'Warehouse Manager' && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Warehouse(s)
                    </label>
                    <Select
                      isMulti
                      name="warehouses"
                      options={warehouses.map((val) => ({
                        value: val._id,
                        label: val.name,
                      }))}
                      value={warehouses
                        .filter((w) => form.warehouses.includes(w._id))
                        .map((w) => ({ value: w._id, label: w.name }))}
                      onChange={handleWarehouseChange}
                      classNamePrefix="react-select"
                      placeholder="Select warehouse(s)"
                      isDisabled={submitLoading}
                    />
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    className="border px-4 py-2 rounded w-full"
                    placeholder="Enter Password"
                    value={form.password}
                    onChange={handleChange}
                    disabled={submitLoading}
                  />
                  {errors.password && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Role
                  </label>
                  <input
                    name="role"
                    className="border px-4 py-2 rounded w-full"
                    placeholder="Enter Role"
                    readOnly
                    value={form.role}
                    disabled={submitLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    );
  };

  // -------------------------------
  // Return JSX
  // -------------------------------
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Role Tabs */}
      <div className="flex flex-wrap gap-3">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`py-2 px-4 rounded-lg text-sm font-semibold shadow ${
              activeRole === role
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white text-gray-700'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Loader / Table */}
      {loading ? (
        <div className="bg-white rounded shadow p-8 flex justify-center">
          <Loader />
        </div>
      ) : (
        <div className="bg-white rounded shadow p-4 overflow-x-auto">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {activeRole} Table
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-700"
            >
              Add Role
            </button>
          </div>

          <table className="w-full text-sm border min-w-[700px]">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-3 py-2 text-left">{headings.name}</th>
                <th className="px-3 py-2 text-left">{headings.phone}</th>
                <th className="px-3 py-2 text-left">{headings.email}</th>
                <th className="px-3 py-2 text-left">{headings.location}</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {roleUsers
                ?.filter((item) => item.isActive)
                .map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap flex items-center gap-2">
                      {user.name}
                    </td>
                    <td className="px-3 py-2">{user.phone}</td>
                    <td className="px-3 py-2">{user.email}</td>
                    <td className="px-3 py-2">{user.location}</td>
                    <td className="px-3 py-2 text-center flex justify-center gap-3">
                      <FiEye
                        className="text-green-600 cursor-pointer"
                        onClick={() => handleViewClick(user._id)}
                      />
                      <PiPencilSimpleLineBold
                        className="text-blue-600 cursor-pointer"
                        onClick={() => navigate(`/edit-role/${user._id}`)}
                      />
                      <FiTrash2
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteClick(user._id)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-start z-50 px-4 py-8 overflow-auto">
          <AddSalesPerson
            onSubmit={async () => {
              await fetchRoleUsers();
              setShowAddModal(false);
            }}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-md w-full max-w-sm text-center">
            <div className="text-red-500 mb-4">
              <FiTrash2
                size={32}
                className="mx-auto bg-red-100 p-2 rounded-full"
              />
            </div>
            <h4 className="text-lg font-semibold mb-2">Delete Role</h4>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this role?
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-2 rounded border border-gray-300 text-sm disabled:opacity-50"
                disabled={deleteLoading}
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="w-full py-2 rounded bg-red-500 text-white text-sm hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Yes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
