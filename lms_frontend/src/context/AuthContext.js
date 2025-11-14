import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAccessToken } from '../api/client';

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} role  - One of 'admin' | 'hr' | 'employee'
 */

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * useAuth
 * Hook to access authentication state and actions.
 */
export function useAuth() {
  /** This is a public function. */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

const STORAGE_KEY = 'lms_auth';

/**
 * PUBLIC_INTERFACE
 * AuthProvider
 * Provides authentication state (token, currentUser) and actions (login, logout).
 * NOTE: For this iteration we persist token in localStorage; TODO: move to httpOnly cookies in backend.
 */
export function AuthProvider({ children }) {
  /** This is a public function. */
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from storage on first load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token) {
          setToken(parsed.token);
          setAccessToken(parsed.token);
        }
        if (parsed?.user) {
          setCurrentUser(parsed.user);
        }
      }
    } catch (_e) {
      // ignore parsing issues
    } finally {
      setInitializing(false);
    }
  }, []);

  // Keep storage in sync
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: currentUser }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (_e) {
      // ignore storage write failures
    }
  }, [token, currentUser]);

  // PUBLIC_INTERFACE
  const login = useCallback(async (email, password) => {
    /** Attempts login, stores token, and fetches current user via /api/auth/me. */
    setError(null);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token: t, user } = res.data || {};
      if (!t) {
        throw new Error('Invalid login response');
      }
      setToken(t);
      setAccessToken(t);

      // Prefer using /api/auth/me to confirm role and freshness
      try {
        const meRes = await api.get('/api/auth/me');
        setCurrentUser(meRes.data || user || null);
      } catch (_e) {
        setCurrentUser(user || null);
      }
      return true;
    } catch (e) {
      setToken(null);
      setAccessToken(null);
      setCurrentUser(null);
      setError(e?.response?.data?.message || e?.message || 'Login failed');
      return false;
    }
  }, []);

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    /** Clears token and user state. */
    setToken(null);
    setAccessToken(null);
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      token,
      currentUser,
      initializing,
      error,
      login,
      logout,
      isAuthenticated: Boolean(token),
      hasRole: (role) => currentUser?.role === role,
    }),
    [token, currentUser, initializing, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
