/**
 * Admin dashboard
 */
import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <nav>
        <Link to="/analytics">View Analytics</Link>
      </nav>
      <div className="content">
        <p>Manage users, lessons, and quizzes here.</p>
      </div>
    </div>
  );
}
