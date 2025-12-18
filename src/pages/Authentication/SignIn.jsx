import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../api/auth.service';
import { useAuth } from '../../Context/AuthContext';
import OtpModal from '../../utils/OtpModal';

const SignIn = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [showOtp, setShowOtp] = useState(false);
  const [loginPayload, setLoginPayload] = useState(null);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // role: '',
    // phone: '',
    twoFA: false,
  });

 

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      setError('Please fill all required fields.');
      return;
    }

    console.log('Sending to ... backend:', formData);

    try {
      const res = await authService.login({
        email: formData.email,
        password: formData.password,
        isdoubleVerifiedchecked: formData.twoFA,
      });

      if (formData.twoFA) {
        setLoginPayload(res);
        console.log('payload', res.phone);
        setPhoneNumber(res?.phone);
        setShowOtp(true); // Open OTP modal
      } else {
        login(res); // Set user in context
        navigate('/dashboard');
      }

      // login(res); // Set user in context
      // navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Login failed. Please check credentials.');
    }
  };

  const handleOtpVerify = async (otp) => {
    try {
      if (!loginPayload?.phone) {
        console.error('Phone number missing for OTP verification.');
        setError('Phone number is missing. Please log in again.');
        return;
      }

      console.log('Sending OTP verification request with:', {
        phone: loginPayload.phone,
        otp,
      });

      const res = await authService.verifyOtp({
        phone: loginPayload.phone,
        otp,
      });

      if (res?.accessToken) {
        login(res); // Save to context/localStorage
        setShowOtp(false);

        const role = res?.user?.role;

        if (role === 'Admin') return navigate('/dashboard');

        if (role === 'Account Section')
          return navigate('/accounting-manager/dashboard');

        if (role === 'Administrator')
          return navigate('/administrator/AdministratorDashboard');

        if (role === 'Sales Person') return navigate('/salesPerson/dashboard');

        if (role === 'Production Manager')
          return navigate('/production-manager/dashboard');

        if (role === 'Inventory Manager')
          return navigate('/inventory-management/dashboard');

        if (role === 'Warehouse Manager')
          return navigate('/warehouse-management/dashboard');
        
        navigate('/unauthorized'); // Redirect

        // /production-manager/
      } else {
        setError('OTP verification failed. Please try again.');
        console.error('Missing accessToken in OTP response:', res);
      }
      // login(res);
      // setShowOtp(false);
      // navigate('/dashboard');
    } catch (err) {
      console.error('OTP verification failed', err);

      const serverMessage =
        err?.response?.data?.message || 'Invalid OTP. Try again.';
      setError(serverMessage);
    }
  };

  console.log(
  "%c WORKING ",
  "background: #ff0000; color: #fff; font-size: 20px; font-weight: bold; padding: 6px 12px; border-radius: 4px;"
);


  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-semibold text-center text-blue-600">
          Welcome to Apex
        </h2>
        
        

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johnmathew@gmail.com"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <Link to="/forgotpassword" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>

          {/* Two-Factor Auth Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              id="twoFA"
              type="checkbox"
              checked={formData.twoFA}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="twoFA" className="text-sm text-gray-700">
              Two-factor Authentication
            </label>
          </div>

          {/* Role Dropdown */}
          {/* <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Select Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a role</option>
              <option value="Admin">Admin</option>
              <option value="Administrator">Administrator</option>
              <option value="Production Manager">Production Manager</option>
              <option value="Warehouse Manager">Warehouse Manager</option>
              <option value="Inventory Manager">Inventory Manager</option>
              <option value="Sales Person">Sales Person</option>
              <option value="Account Section">Account Section</option>
            </select>
          </div> */}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
           {/* <Link to="/forgotpassword" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link> */}

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600">
            You don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
      <OtpModal
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        onVerify={handleOtpVerify}
        phone={phoneNumber}
      />
    </div>
  );
};

export default SignIn;
