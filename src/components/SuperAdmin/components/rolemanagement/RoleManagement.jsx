import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { FaTrash, FaEye, FaEdit } from 'react-icons/fa';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { PiPencilSimpleLineBold } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import roleService from '../../../../api/role.service';
import { useAuth } from '../../../../Context/AuthContext';
import { toast } from 'react-toastify';
import warehouseService from '../../../../api/warehouse.service';
import Loader from '../../../../common/Loader';  // ✅ Import Loader

const roles = [
  'Sales Person',
  'Inventory Manager',
  'Account Section',
  'Production Manager',
  'Warehouse Manager',
  'Administrator',
];

const dummyData = {
  'Sales Person': [
    {
      id: 1,
      name: 'John Mathew',
      phone: '990 32 64 970',
      email: 'sales1@example.com',
      location: 'Los Angeles',
      status: 'Active',
      image: 'https://randomuser.me/api/portraits/men/11.jpg',
    },
  ],
  'Inventory Manager': [],
  'Account Section': [],
  'Production Manager': [],
  'Warehouse Manager': [],
  Administrator: [],
};

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [salesPersonData, setSalesPersonData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // ✅ Loading states
  const [loading, setLoading] = useState(false);           // For main data fetching
  const [deleteLoading, setDeleteLoading] = useState(false); // For delete operations
  const [warehouseLoading, setWarehouseLoading] = useState(false); // For warehouse data
  const [submitLoading, setSubmitLoading] = useState(false); // For form submission

  const getRoleApiMap = {
    'Sales Person': roleService.getSalesPerson,
    'Inventory Manager': roleService.getInventoryManager,
    'Account Section': roleService.getAccountSection,
    'Warehouse Manager': roleService.getWarehouseManager,
    'Production Manager': roleService.getProductionManager,
    Administrator: roleService.getAdministrator,
  };

  useEffect(() => {
    (async () => {
      setWarehouseLoading(true); // ✅ Start warehouse loader
      try {
        const res = await warehouseService.getAllWarehouse(user.accessToken);
        setWarehouses(res.data.data.warehouses || []);
      } catch (error) {
        toast.error('Failed to load warehouses');
      } finally {
        setWarehouseLoading(false); // ✅ Stop warehouse loader
      }
    })();
  }, [user.accessToken]);

  const fetchRoleUsers = async () => {
    setLoading(true); // ✅ Start main loader
    try {
      const apiFunc = getRoleApiMap[activeRole];
      if (apiFunc) {
        const res = await apiFunc(user.accessToken);
        setUsersByRole((prev) => ({ ...prev, [activeRole]: res.data.data }));
      }
    } catch (error) {
      console.error(`Error fetching users for ${activeRole}:`, error);
      toast.error(`Failed to load ${activeRole} data`);
    } finally {
      setLoading(false); // ✅ Stop main loader
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
    setDeleteLoading(true); // ✅ Start delete loader
    try {
      const res = await roleService.deleteRoleByID(user.accessToken, deleteId);
      console.log('message', res.message);

      setUsersByRole((prev) => ({
        ...prev,
        [activeRole]: prev[activeRole].filter((user) => user._id !== deleteId),
      }));
      toast.success(res?.message || 'User deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(false); // ✅ Stop delete loader
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

  // AddSalesPerson form as internal component
  const AddSalesPerson = ({ onSubmit }) => {
    const [form, setForm] = useState({
      name: ' ',
      email: '',
      phone: '',
      password: '',
      role: activeRole,
      location: '',
      warehouses: [], // array of warehouse IDs
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
        setSubmitLoading(true); // ✅ Start submit loader
        const payload = {
          name: form.name,
          phone: form.phone,
          email: form.email,
          location: form.location,
          password: form.password,
          role: form.role,
          warehouses: form.warehouses,
        };

        try {
          const res = await roleService.AddRole(user.accessToken, payload);
          console.log('submit', res.data);
          toast.success(res?.message || 'Role added successfully');

          await fetchRoleUsers();
          setShowAddModal(false);
          
          // Reset form
          setForm({
            name: '',
            phone: '',
            email: '',
            location: '',
            password: '',
            role: activeRole,
            warehouses: [],
          });
        } catch (error) {
          console.log(error);
          toast.error(error.response?.data?.message || 'Failed to add role');
        } finally {
          setSubmitLoading(false); // ✅ Stop submit loader
        }
      }
    };

    return (
      <div className="p-6 bg-white rounded-lg shadow max-w-5xl h-auto mx-auto mt-6 relative">
        <button
          className="absolute top-3 right-4 text-gray-500 text-2xl hover:text-gray-700"
          onClick={() => setShowAddModal(false)}
          disabled={submitLoading} // ✅ Disable while loading
        >
          &times;
        </button>
        <div className="mb-10 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Add {activeRole}
          </h2>
        </div>
        
        {/* ✅ Show loader for warehouse data if still loading */}
        {warehouseLoading && activeRole === 'Warehouse Manager' ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-8"
          >
            <div className="flex-shrink-0 flex justify-center items-start md:items-center">
              <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-28 h-28 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="8" r="6" />
                  <path d="M2 22c0-5.52 4.48-10 10-10s10 4.48 10 10" />
                </svg>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  disabled={submitLoading} // ✅ Disable while loading
                />
                {errors.name && (
                  <div className="text-xs text-red-500 mt-1">{errors.name}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Phone
                </label>
                <input
                  name="phone"
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Enter Phone no."
                  type="number"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={submitLoading} // ✅ Disable while loading
                />
                {errors.phone && (
                  <div className="text-xs text-red-500 mt-1">{errors.phone}</div>
                )}
              </div>
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
                  disabled={submitLoading} // ✅ Disable while loading
                />
                {errors.email && (
                  <div className="text-xs text-red-500 mt-1">{errors.email}</div>
                )}
              </div>
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
                  disabled={submitLoading} // ✅ Disable while loading
                />
                {errors.location && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.location}
                  </div>
                )}
              </div>
              {activeRole === 'Warehouse Manager' && (
                <div>
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
                    isDisabled={submitLoading} // ✅ Disable while loading
                  />
                </div>
              )}

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
                  disabled={submitLoading} // ✅ Disable while loading
                />
                {errors.password && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.password}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Role
                </label>
                <input
                  name="role"
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Enter Role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={submitLoading} // ✅ Disable while loading
                />
              </div>
              <button
                className="bg-blue-600 text-center text-white px-2 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                type="submit"
                disabled={submitLoading} // ✅ Disable while loading
              >
                {submitLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };

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

      {/* ✅ Show loader when fetching role data */}
      {loading ? (
        <div className="bg-white rounded shadow p-8 flex justify-center">
          <Loader />
        </div>
      ) : (
        /* Table Section */
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
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {roleUsers
                ?.filter((item) => item.isActive)
                .map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap flex items-center gap-2">
                      <img
                        src={user.image}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      {user.name}
                    </td>
                    <td className="px-3 py-2">{user.phone}</td>
                    <td className="px-3 py-2">{user.email}</td>
                    <td className="px-3 py-2">{user.location}</td>
                    <td
                      className={`px-3 py-2 ${
                        user.status === 'Active'
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      {user.status}
                    </td>
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
                disabled={deleteLoading} // ✅ Disable while loading
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="w-full py-2 rounded bg-red-500 text-white text-sm hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed"
                disabled={deleteLoading} // ✅ Disable while loading
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