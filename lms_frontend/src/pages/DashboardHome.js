import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * DashboardHome
 * Redirects to the appropriate role-based dashboard based on current user role.
 */
export default function DashboardHome() {
  /** This is a public function. */
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const role = currentUser?.role;
    if (role === 'admin') navigate('/dashboard/admin', { replace: true });
    else if (role === 'hr') navigate('/dashboard/hr', { replace: true });
    else navigate('/dashboard/employee', { replace: true });
  }, [currentUser, navigate]);

  return <div>Redirecting...</div>;
}
