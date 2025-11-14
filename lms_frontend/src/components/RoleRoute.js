import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * RoleRoute
 * Ensures the current user has one of the allowed roles. If not, redirects to /dashboard or shows 403.
 */
export default function RoleRoute({ allowed }) {
  /** This is a public function. */
  const { currentUser, initializing, isAuthenticated } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowed?.includes(currentUser?.role)) {
    // redirect to own dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
