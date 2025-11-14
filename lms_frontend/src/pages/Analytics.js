/**
 * Analytics summary for Admin/HR
 */
import React, { useEffect, useState } from "react";
import { ApiClient } from "../api/client";

const client = new ApiClient();

export default function Analytics() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) client.setToken(token);
    client
      .getAnalyticsSummary()
      .then(setData)
      .catch(() => setErr("Failed to load analytics"));
  }, []);

  if (err) return <div className="error">{err}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Analytics</h1>
      <div className="cards">
        <div className="card">
          <h3>Total Users</h3>
          <div className="value">{data.total_users}</div>
        </div>
        <div className="card">
          <h3>Admins</h3>
          <div className="value">{data.total_admins}</div>
        </div>
        <div className="card">
          <h3>HR</h3>
          <div className="value">{data.total_hr}</div>
        </div>
        <div className="card">
          <h3>Employees</h3>
          <div className="value">{data.total_employees}</div>
        </div>
        <div className="card">
          <h3>Lessons Completed</h3>
          <div className="value">{data.lessons_completed}</div>
        </div>
        <div className="card">
          <h3>Quiz Pass Rate</h3>
          <div className="value">{data.quiz_pass_rate}%</div>
        </div>
      </div>
    </div>
  );
}
