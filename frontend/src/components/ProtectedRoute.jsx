import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('User from localStorage:', user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRoleLowerCase = user.role.toLowerCase();
  const allowedRolesLowerCase = allowedRoles.map(role => role.toLowerCase());

  if (!allowedRolesLowerCase.includes(userRoleLowerCase)) {
    // User doesn't have the required role, redirect to homepage or unauthorized page
    return <Navigate to="/" replace />;
  }

  // User is logged in and has the required role, render the protected component
  return children;
};

export default ProtectedRoute;