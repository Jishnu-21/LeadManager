import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.role) {
    const role = user.role.toLowerCase();
    
    switch (role) {
      case 'sales':
        return <Navigate to="/" replace />;
      case 'operational':
        return <Navigate to="/operational/profile" replace />;
      case 'Management':
        return <Navigate to="/internal-user" replace />;
      default:
        console.warn('Unknown user role:', user.role);
        // If the role is unknown, we might want to log the user out or redirect to a default page
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }
  }

  // If the user is not logged in, allow access to the public route (like login or signup)
  return children;
};

export default PublicRoute;