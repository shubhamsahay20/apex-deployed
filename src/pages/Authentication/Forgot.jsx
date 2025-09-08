import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';
import authService from '../../api/auth.service';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
// import authService from "../../api/auth.service"; // 🔑 Uncomment when API ready

const ForgotPassword = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate()

  const handleSendOTP = async () => {
    if (!mobile) {
      alert('Please enter your mobile number');
      return;
    }
    try {
      const res = await authService.otpvalidation(user.accessToken, {
        phone: mobile,
      });
      console.log('response', res);

      console.log('Sending OTP to:', mobile);
      setStep(2); // move to OTP step
    } catch (err) {
      console.error('Error sending OTP', err);
      alert('Failed to send OTP. Try again.');
    }
  };

  // ✅ Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) {
      alert('Please enter the OTP');
      return;
    }
    try {
      const payload = {
        phone: mobile,
        otp: otp,
      };
      const res = await authService.forgetOtp(user.accessToken, payload);
      console.log('res otp', res);

      console.log('Verifying OTP:', otp, 'for mobile:', mobile);
      setStep(3); // ✅ move to reset password step instead of navigate
    } catch (err) {
      console.error('OTP verification failed', err);
      alert('Invalid OTP. Please try again.');
    }
  };

  // ✅ Handle password update
  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert('Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const payload = {
        phone: mobile,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      };
      const res = await authService.newPassword(user.accessToken, payload);
      console.log("after change password ", res);
      
      console.log('Password updated:', newPassword);
      alert('Password updated successfully!');

      navigate("/login")
      
    } catch (error) {}
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md text-center">
        {/* Step 1: Mobile number */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-blue-600 mb-6">
              Forgot password?
            </h2>
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-4 rounded-full">
                <FaLock className="text-white text-2xl" />
              </div>
            </div>

            <p className="text-lg font-semibold text-blue-600 ">
              Enter your registered mobile number
            </p>
            <p className="text-gray-500 text-sm mb-6">
              We'll send you an OTP to verify your identity
            </p>

            <div className="flex items-center border rounded-lg overflow-hidden mb-6">
              {/* <span className="flex items-center px-3 bg-gray-100 text-gray-700">
                🇮🇳 +91
              </span> */}
              <input
                type="text"
                placeholder="Enter mobile number"
                className="flex-1 p-3 outline-none"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>

            <button
              onClick={handleSendOTP}
              className="w-full bg-gradient-to-r from-blue-600 to-pink-500 text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition"
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 2: OTP verification */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-blue-600  mb-6">
              Verify OTP
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              We've sent a code to <span className="font-medium">{mobile}</span>
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border p-3 rounded-lg mb-6 outline-none text-center tracking-widest text-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOTP}
              className="w-full bg-gradient-to-r from-blue-600 to-pink-500 text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition"
            >
              Verify OTP
            </button>

            <button
              onClick={() => setStep(1)}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Change mobile number
            </button>
          </>
        )}

        {/* Step 3: Reset password */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold text-blue-600  mb-6">
              Forgot password?
            </h2>
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-full">
                <FaKey className="text-blue-600 text-2xl" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-blue-600  mb-2">
              Create New Password
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Choose a strong password to secure your account
            </p>

            {/* New Password */}
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New password"
                className="w-full border p-3 rounded-lg outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative mb-6">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm password"
                className="w-full border p-3 rounded-lg outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Password rules */}
            {/* <div className="bg-gray-50 p-4 rounded-lg text-left text-sm mb-6">
              <p className="font-medium mb-2">Password must contain:</p>
              <ul className="grid grid-cols-2 gap-2 text-gray-600 text-sm">
                <li>• 8+ characters</li>
                <li>• Uppercase</li>
                <li>• Lowercase</li>
                <li>• Number</li>
                <li>• Special char</li>
              </ul>
            </div> */}

            <button
              onClick={handleUpdatePassword}
              className="w-full bg-gradient-to-r from-blue-600 to-pink-500 text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition"
            >
              Update Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
