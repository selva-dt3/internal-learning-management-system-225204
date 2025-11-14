import React from 'react';

/**
 * PUBLIC_INTERFACE
 * AdminDashboard
 * Basic admin dashboard placeholder.
 */
export default function AdminDashboard() {
  /** This is a public function. */
  return (
    <div>
      <h2 style={{ color: '#1E3A8A', marginTop: 0 }}>Admin Dashboard</h2>
      <p>Welcome, Admin. Here are your high-level controls and stats.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginTop: 12 }}>
        <Card title="Total Users" value="128" />
        <Card title="Active Lessons" value="24" />
        <Card title="Pending Approvals" value="7" />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10, padding: 16 }}>
      <div style={{ color: '#6B7280', fontSize: 12 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{value}</div>
    </div>
  );
}
