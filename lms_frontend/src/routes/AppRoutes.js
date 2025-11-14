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
import UsersManagement from '../pages/UsersManagement';
import LessonsManagement from '../pages/LessonsManagement';
import Analytics from '../pages/Analytics';

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

      {/* Distinct login routes as requested */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/admin" element={<LoginPage />} />
      <Route path="/login/employee" element={<LoginPage />} />

      {/* Public analytics route was previously at /analytics; protect and restrict to admin/hr */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowed={['admin', 'hr']} />}>
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Route>

      {/* Protected dashboard routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />

          <Route element={<RoleRoute allowed={['admin']} />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/users" element={<UsersManagement />} />
            <Route path="admin/lessons" element={<LessonsManagement />} />
          </Route>

          <Route element={<RoleRoute allowed={['hr']} />}>
            <Route path="hr" element={<HRDashboard />} />
            <Route path="hr/lessons" element={<LessonsManagement />} />
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
