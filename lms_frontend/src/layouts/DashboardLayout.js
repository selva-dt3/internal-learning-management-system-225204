import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './dashboard-layout.css';

/**
 * PUBLIC_INTERFACE
 * DashboardLayout
 * Shared dashboard shell with header and sidebar; includes logout.
 */
export default function DashboardLayout() {
  /** This is a public function. */
  const { currentUser, logout } = useAuth();

  return (
    <div className="layout-root">
      <header className="topbar">
        <div className="brand">
          <Link to="/dashboard" className="brand-link">LMS</Link>
        </div>
        <div className="spacer" />
        <div className="user-info">
          <span className="user-email">{currentUser?.email}</span>
          <span className="user-role">{currentUser?.role?.toUpperCase()}</span>
          <button className="logout-btn" onClick={logout} aria-label="Logout">Logout</button>
        </div>
      </header>
      <div className="content-wrap">
        <aside className="sidebar">
          <nav className="nav">
            <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Overview
            </NavLink>
            <NavLink to="/dashboard/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Admin
            </NavLink>
            <NavLink to="/dashboard/hr" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              HR
            </NavLink>
            <NavLink to="/dashboard/employee" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Employee
            </NavLink>
          </nav>
        </aside>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
