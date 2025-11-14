import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * LoginPage
 * Email/password login screen that calls AuthContext.login and redirects to /dashboard on success.
 * Note: This page is used for /login, /login/admin, and /login/employee; role redirect happens post-login.
 */
export default function LoginPage() {
  /** This is a public function. */
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);
    const ok = await login(email.trim(), password);
    setLoading(false);
    if (ok) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      setLocalError('Invalid credentials or unable to login.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#F3F4F6' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: 360,
          background: '#FFFFFF',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
          border: '1px solid #E5E7EB'
        }}
      >
        <h1 style={{ marginTop: 0, color: '#1E3A8A' }}>Sign in</h1>
        <p style={{ color: '#6B7280', marginTop: 4 }}>Enter your credentials to access the LMS.</p>
        {(localError || error) && (
          <div style={{ background: '#FEF2F2', color: '#DC2626', padding: 10, borderRadius: 8, marginTop: 12 }}>
            {localError || error}
          </div>
        )}
        <div style={{ marginTop: 16 }}>
          <label htmlFor="email" style={{ display: 'block', fontSize: 12, color: '#6B7280', marginBottom: 6 }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              outline: 'none'
            }}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <label htmlFor="password" style={{ display: 'block', fontSize: 12, color: '#6B7280', marginBottom: 6 }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              outline: 'none'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 18,
            width: '100%',
            background: '#1E3A8A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            padding: '10px 12px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
