import React from 'react';

/**
 * PUBLIC_INTERFACE
 * HRDashboard
 * Basic HR dashboard placeholder.
 */
export default function HRDashboard() {
  /** This is a public function. */
  return (
    <div>
      <h2 style={{ color: '#1E3A8A', marginTop: 0 }}>HR Dashboard</h2>
      <p>Welcome, HR. Manage onboarding and compliance here.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginTop: 12 }}>
        <Card title="Onboarding Pending" value="12" />
        <Card title="Policies Updated" value="3" />
        <Card title="Expiring Certificates" value="5" />
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
