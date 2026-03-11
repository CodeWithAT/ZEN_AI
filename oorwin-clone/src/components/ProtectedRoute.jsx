import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  
  // If the user is not logged in, send them back to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If they are logged in, show the Dashboard!
  return children;
}