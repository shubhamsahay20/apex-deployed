import React from 'react';
import { useAuth } from '../Context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ role: allowedRoles, children }) => {
  const { user } = useAuth();
  console.log(user);

  if (!user?.user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default ProtectedRoutes;
