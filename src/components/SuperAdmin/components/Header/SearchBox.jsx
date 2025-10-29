import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../../Context/AuthContext'; 

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
        
        </div>
      )}
    </>
  );
};

export default SearchBox;
