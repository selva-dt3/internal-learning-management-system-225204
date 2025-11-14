/**
 * HR dashboard
 */
import React from "react";
import { Link } from "react-router-dom";

export default function HRDashboard() {
  return (
    <div>
      <h1>HR Dashboard</h1>
      <nav>
        <Link to="/analytics">View Analytics</Link>
      </nav>
      <div className="content">
        <p>Onboarding and employee insights.</p>
      </div>
    </div>
  );
}
