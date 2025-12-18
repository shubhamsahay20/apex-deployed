import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    token: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    // if (!formData.email.trim()) {
    //   newErrors.email = 'Email is required';
    // } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //   newErrors.email = 'Invalid email format';
    // }

      // if (!formData.phone.trim()) {
      //   newErrors.phone = 'Phone number is required';
      // } else if (!/^\d{10}$/.test(formData.phone)) {
      //   newErrors.phone = 'Phone must be 10 digits';
      // }

    if (!formData.token.trim()) {
      newErrors.token = 'Token is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    try {
      setLoading(true);

      const response = await axios.post(
        'http://localhost:9000/api/admin-auth/token',
        {
          email: formData.email,
          phone: formData.phone,
          token: formData.token,
        }
      );

      if (response.data?.success) {
        navigate('/Adminreset', {
          state: {
            email: response.data.data.email,
              userId: response.data.data.userId,
            phone: response.data.data.phone,
          },
        });
      } else {
        setApiError(response.data?.message || 'Something went wrong');
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || 'Failed to verify token'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-semibold text-center text-blue-600">
          Verify Details
        </h2>

        {apiError && (
          <p className="text-red-600 text-center text-sm">{apiError}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-2 border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* Token */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Token
            </label>
            <input
              id="token"
              type="text"
              value={formData.token}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-2 border ${
                errors.token ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
            />
            {errors.token && (
              <p className="text-red-500 text-sm">{errors.token}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-md ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Verifying...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
