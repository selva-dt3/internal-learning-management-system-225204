import React from 'react';

/**
 * PUBLIC_INTERFACE
 * EmployeeDashboard
 * Basic employee dashboard placeholder.
 */
export default function EmployeeDashboard() {
  /** This is a public function. */
  return (
    <div>
      <h2 style={{ color: '#1E3A8A', marginTop: 0 }}>Employee Dashboard</h2>
      <p>Welcome! View your courses and progress.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginTop: 12 }}>
        <Card title="Assigned Courses" value="6" />
        <Card title="Completed" value="3" />
        <Card title="Due This Week" value="2" />
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
