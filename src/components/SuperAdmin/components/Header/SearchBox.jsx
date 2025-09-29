import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../../Context/AuthContext'; // import from react-router

const SearchBox = () => {
  const { user } = useAuth();
  const location = useLocation();

  const dashboardPaths = [
    '/dashboard',
    '/administrator/AdministratorDashboard',
    '/accounting-manager/dashboard',
    '/production-manager/dashboard',
    '/warehouse-management/dashboard',
    '/inventory-management/dashboard',
    '/salesPerson/dashboard',
    
  ];

  return (
    <>
      {dashboardPaths.includes(location.pathname) ? (
        <div>
          <h1 className="text-sm md:text-2xl  font-bold text-[#333333] dark:text-[#c7c5c5]">
            Welcome Back,{' '}
            <span className="text-blue-600">{user.user.name}</span>
          </h1>
          <p className="text-[10px] truncate sm:text-sm text-gray-500">
            Here are your daily updates.
          </p>
        </div>
      ) 
      
      : (
        <div className="relative w-64">
          {/* <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search product, order"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark  focus:outline-none focus:ring-2 focus:ring-blue-500"
          /> */}
        </div>
      )}
    </>
  );
};

export default SearchBox;
