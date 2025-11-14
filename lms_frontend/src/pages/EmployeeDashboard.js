/**
 * Employee dashboard with onboarding modal flow (NDA/CoC)
 */
import React, { useEffect, useMemo, useState } from "react";
import { ApiClient } from "../api/client";

function OnboardingModal({ status, onAcknowledge, onClose }) {
  const needsNDA = !status?.nda_acknowledged;
  const needsCoC = !status?.coc_acknowledged;
  const outstanding = [];
  if (needsNDA) outstanding.push("nda");
  if (needsCoC) outstanding.push("coc");

  if (!outstanding.length) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Complete Onboarding</h2>
        {needsNDA && (
          <div className="onboarding-item">
            <h3>NDA</h3>
            <p>Please review the NDA and click acknowledge.</p>
            <button onClick={() => onAcknowledge("nda")}>Acknowledge NDA</button>
          </div>
        )}
        {needsCoC && (
          <div className="onboarding-item">
            <h3>Code of Conduct</h3>
            <p>Please review the Code of Conduct and click acknowledge.</p>
            <button onClick={() => onAcknowledge("coc")}>Acknowledge CoC</button>
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function EmployeeDashboard() {
  const client = useMemo(() => new ApiClient(), []);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    client
      .getOnboardingStatus()
      .then(setStatus)
      .catch(() => setErr("Failed to load onboarding status"))
      .finally(() => setLoading(false));
  }, [client]);

  const onAcknowledge = async (doc) => {
    try {
      const updated = await client.acknowledge(doc);
      setStatus(updated);
    } catch {
      setErr("Failed to save acknowledgement");
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h1>Employee Dashboard</h1>
      {err && <div className="error">{err}</div>}
      <OnboardingModal status={status} onAcknowledge={onAcknowledge} onClose={() => {}} />
      <div className="content">
        <p>Welcome to your dashboard.</p>
      </div>
    </div>
  );
}
