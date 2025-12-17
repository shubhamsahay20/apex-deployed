import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Adminreset = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, email, phone } = location.state || {};

const [formData, setFormData] = useState({
  email: email || '',
  phone: phone ? String(phone) : '', // ✅ FIX HERE
  password: '',
});


  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // 🔒 Prevent direct access
  if (!userId) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    console.log("12345667799");
    
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    try {
      setLoading(true);

      await axios.put(
        `http://localhost:9000/api/admin-auth/${userId}`,
        {
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      navigate('/login');
    } catch (error) {
      setApiError(
        error.response?.data?.message || 'Failed to update details'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-semibold text-center text-blue-600">
          Complete Signup
        </h2>

        {apiError && (
          <p className="text-red-600 text-center text-sm">{apiError}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              id="phone"
              type="text"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-md font-bold ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Updating...' : 'Update Details'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Adminreset;
