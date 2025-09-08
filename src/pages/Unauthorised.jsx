import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
          <FaLock className="text-red-500 text-6xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have the necessary permissions to view this page.
          Please contact your administrator if you think this is a mistake.
        </p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition"
        >
          Go to login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
