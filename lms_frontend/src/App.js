/**
 * App entry with routes for Admin/HR vs Employee login and dashboards.
 * PUBLIC_INTERFACE
 */
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginAdmin from "./pages/LoginAdmin";
import LoginEmployee from "./pages/LoginEmployee";
import AdminDashboard from "./pages/AdminDashboard";
import HRDashboard from "./pages/HRDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Analytics from "./pages/Analytics";

function Home() {
  return (
    <div>
      <h1>Internal LMS</h1>
      <nav>
        <Link to="/login/admin">Admin/HR Login</Link> |{" "}
        <Link to="/login/employee">Employee Login</Link>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/login/employee" element={<LoginEmployee />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/hr" element={<HRDashboard />} />
        <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}
