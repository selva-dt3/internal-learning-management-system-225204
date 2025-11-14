/**
 * HR dashboard
 */
import React from "react";
import { Link } from "react-router-dom";

export default function HRDashboard() {
  return (
    <div>
      <h1>HR Dashboard</h1>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/analytics">View Analytics</Link>
        <Link to="/dashboard/hr/lessons">Manage Lessons</Link>
      </nav>
      <div className="content">
        <p>Onboarding and employee insights.</p>
      </div>
    </div>
  );
}
