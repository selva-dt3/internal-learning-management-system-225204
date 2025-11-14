/**
 * HR dashboard
 */
import React from "react";
import { Link } from "react-router-dom";

export default function HRDashboard() {
  return (
    <div>
      <h1>HR Dashboard</h1>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <Link to="/analytics">View Analytics</Link>
        <Link to="/dashboard/hr/lessons">Manage Lessons</Link>
        <Link to="/dashboard/hr/quizzes">Manage Quizzes</Link>
      </nav>
      <div className="content">
        <p>Onboarding and employee insights.</p>
      </div>
    </div>
  );
}
