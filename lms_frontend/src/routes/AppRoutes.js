import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleRoute from '../components/RoleRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardHome from '../pages/DashboardHome';
import AdminDashboard from '../pages/AdminDashboard';
import HRDashboard from '../pages/HRDashboard';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import App from '../App';

/**
 * PUBLIC_INTERFACE
 * AppRoutes
 * Defines application routes including auth, dashboards, and guards.
 */
export default function AppRoutes() {
  /** This is a public function. */
  return (
    <Routes>
      {/* Keep template at root for demo; redirect root to login for UX */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/template" element={<App />} />

      <Route path="/login" element={<LoginPage />} />

      {/* Protected dashboard routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />

          <Route element={<RoleRoute allowed={['admin']} />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<RoleRoute allowed={['hr']} />}>
            <Route path="hr" element={<HRDashboard />} />
          </Route>

          <Route element={<RoleRoute allowed={['employee', 'admin', 'hr']} />}>
            <Route path="employee" element={<EmployeeDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
