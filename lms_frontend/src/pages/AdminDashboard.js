/**
 * Admin dashboard
 */
import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <Link to="/analytics">View Analytics</Link>
        <Link to="/dashboard/admin/users">Manage Users</Link>
        <Link to="/dashboard/admin/lessons">Manage Lessons</Link>
        <Link to="/dashboard/admin/quizzes">Manage Quizzes</Link>
      </nav>
      <div className="content">
        <p>Manage users, lessons, and quizzes here.</p>
      </div>
    </div>
  );
}
