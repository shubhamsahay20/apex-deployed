import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios' // ✅ added
import { useAuth } from '../Context/AuthContext'

const OtpModal = ({ isOpen, onClose, onVerify, onResend, phone }) => {
  const [otp, setOtp] = useState(new Array(6).fill(''))
  const inputRefs = useRef([])
  const { user } = useAuth()
  console.log('user in otp', phone)

  // ⏱ 5-minute OTP expiry timer (300 seconds)
  const [otpTimer, setOtpTimer] = useState(300)

  // 🔁 Resend timer (30 sec)
  const [resendTimer, setResendTimer] = useState(60)

  // 📍 Location state
  

  //  data sending
  //   const getLocationAndSend = async () => {
  //   if (!window.navigator.geolocation) return;

  //   window.navigator.geolocation.getCurrentPosition(
  //     async ({ coords }) => {
  //       await axios.post('http://localhost:9000/api/location', {
  //         latitude: coords.latitude,
  //         longitude: coords.longitude,
  //         phone,
  //       });
  //     },
  //     () => {
  //       console.warn('Location unavailable');
  //     },
  //     {
  //       enableHighAccuracy: false,
  //       timeout: 30000,
  //       maximumAge: 60000,
  //     }
  //   );
  // };

 useEffect(() => {
  if (!isOpen) {
    console.log('OtpModal closed, skipping location');
    return;
  }

  if (typeof window === 'undefined') {
    console.log('Not in browser');
    return;
  }

  if (!window.navigator.geolocation) {
    console.log('Geolocation NOT supported');
    return;
  }

  console.log('Requesting location permission...');

  window.navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log('✅ Location success');
      console.log('Latitude:', position.coords.latitude);
      console.log('Longitude:', position.coords.longitude);
    },
    (error) => {
      console.error('❌ Location failed');
      console.error('Code:', error.code);
      console.error('Message:', error.message);
    },
    {
      enableHighAccuracy: false,
      timeout: 30000,
      maximumAge: 60000,
    }
  );
}, [isOpen]);


  useEffect(() => {
    if (!isOpen) return
    if (otpTimer > 0) {
      const otpInterval = setInterval(() => {
        setOtpTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(otpInterval)
    }
  }, [otpTimer, isOpen])

  useEffect(() => {
    if (!isOpen) return
    if (resendTimer > 0) {
      const resendInterval = setInterval(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(resendInterval)
    }
  }, [resendTimer, isOpen])

  const handleChange = (element, index) => {
    const val = element.value
    if (/^\d?$/.test(val)) {
      const newOtp = [...otp]
      newOtp[index] = val
      setOtp(newOtp)
      if (val && index < 5) {
        inputRefs.current[index + 1].focus()
      }
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleSubmit = () => {
    if (otpTimer === 0) return
    onVerify(otp.join(''))
  }

  // 🔁 UPDATED: Resend OTP API integration
  const handleResend = async () => {
    try {
      console.log('helloooo------>>>>', phone)

      const res = await axios.post(
        'http://localhost:9000/api/auth/resend-otp',
        { phone, latitude, longitude }
      )
      console.log('hi-------------->', res)

      setOtp(new Array(6).fill(''))
      setOtpTimer(300)
      setResendTimer(30)
      onResend?.()
      inputRefs.current[0]?.focus()
    } catch (error) {
      console.error('Resend OTP failed:', error.response?.data || error.message)
    }
  }

  const formatTime = seconds => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0')
    const sec = String(seconds % 60).padStart(2, '0')
    return `${min}:${sec}`
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center'>
        <h2 className='text-3xl font-bold text-blue-600 mb-4'>Verify OTP</h2>

        <p className='text-sm text-gray-600 mb-6'>
          Enter OTP with in{' '}
          <span className='font-semibold text-red-500'>
            {formatTime(otpTimer)}
          </span>
        </p>

        <div className='flex justify-center gap-3 mb-6'>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => (inputRefs.current[index] = el)}
              type='text'
              maxLength='1'
              value={digit}
              disabled={otpTimer === 0}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              className='w-12 h-16 text-2xl text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={otpTimer === 0}
          className={`w-full py-2 rounded-md text-sm font-semibold transition mb-3
            ${
              otpTimer === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          Verify OTP
        </button>

        <div className='mb-4 text-sm'>
          {resendTimer > 0 ? (
            <p className='text-gray-500'>
              Resend OTP in{' '}
              <span className='font-semibold'>{resendTimer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className='text-blue-600 font-medium hover:underline'
            >
              Resend OTP
            </button>
          )}
        </div>

        {otpTimer === 0 && (
          <p className='text-red-500 text-sm mb-2'>
            OTP expired. Please resend OTP.
          </p>
        )}

        <button
          onClick={onClose}
          className='text-blue-600 text-sm font-medium hover:underline'
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default OtpModal
