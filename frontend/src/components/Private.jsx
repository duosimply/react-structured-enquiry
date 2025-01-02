// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../utils/useAuthStore';

const PrivateRoute = ({ element }) => {
  const { token } = useAuthStore();

  if (!token) {
    // If user is not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  return element; // Allow access to the route if user is logged in
};

export default PrivateRoute;
