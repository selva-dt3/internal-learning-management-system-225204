import axios from 'axios';

/**
 * Simple API client that centralizes the backend base URL selection.
 *
 * Order of resolution:
 * 1) process.env.REACT_APP_BACKEND_API_URL
 * 2) window.__APP_API_BASE__ (if injected at runtime)
 *
 * PUBLIC_INTERFACE
 */
// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the configured backend API base URL. */
  const fromEnv = process.env.REACT_APP_BACKEND_API_URL;
  if (fromEnv && typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }
  if (typeof window !== 'undefined' && window.__APP_API_BASE__) {
    return String(window.__APP_API_BASE__).trim();
  }
  // No default to localhost to avoid cross-origin issues in preview; require explicit env
  // Callers should handle the absence gracefully.
  return '';
}

/**
 * PUBLIC_INTERFACE
 * Create a full URL for an API path.
 * @param {string} path - path beginning with '/'
 * @returns {string} absolute URL
 */
// PUBLIC_INTERFACE
export function apiUrl(path) {
  /** Builds absolute API URL using configured base. */
  const base = getApiBaseUrl();
  if (!base) return path;
  return `${base.replace(/\/+$/, '')}${path}`;
}

/**
 * Axios instance used across the app. We add:
 * - Base URL resolution
 * - Authorization header injection via setAccessToken
 * - Response interceptor to notify subscribers on 401/403
 */
const api = axios.create({
  baseURL: getApiBaseUrl() || undefined,
});

// In-memory token holder; do NOT log the token.
let ACCESS_TOKEN = null;

// Subscribers for auth errors (401/403)
const authErrorSubscribers = [];

// Attach Authorization header if token is set
api.interceptors.request.use((config) => {
  const cfg = { ...config };
  if (ACCESS_TOKEN) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
  }
  return cfg;
});

// Notify on 401/403 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      // Minimal runtime test/log
      // eslint-disable-next-line no-console
      console.warn('[api] Auth error detected:', status);
      authErrorSubscribers.forEach((fn) => {
        try { fn(status); } catch (_e) {}
      });
    }
    return Promise.reject(error);
  }
);

/**
 * PUBLIC_INTERFACE
 * Set or clear the access token used by the API client.
 * @param {string|null} token - bearer token; if null/empty, clears it.
 */
// PUBLIC_INTERFACE
export function setAccessToken(token) {
  /** Sets the in-memory token for Authorization header. */
  ACCESS_TOKEN = token || null;
}

/**
 * PUBLIC_INTERFACE
 * Register a handler to be called when a 401/403 auth error occurs on any request.
 * Returns an unsubscribe function to remove the handler.
 * @param {(status:number) => void} handler
 * @returns {() => void} unsubscribe function
 */
// PUBLIC_INTERFACE
export function onAuthError(handler) {
  /** Subscribe to global auth errors (401/403). */
  if (typeof handler !== 'function') return () => {};
  authErrorSubscribers.push(handler);
  return () => {
    const idx = authErrorSubscribers.indexOf(handler);
    if (idx >= 0) authErrorSubscribers.splice(idx, 1);
  };
}

/**
 * PUBLIC_INTERFACE
 * Export the configured axios instance for direct HTTP usage.
 */
// PUBLIC_INTERFACE
export { api };

/**
 * PUBLIC_INTERFACE
 * High-level API client wrapper with convenience methods used by pages.
 * This uses the shared axios instance above.
 */
export class ApiClient {
  /** This is a public class. Provides typed convenience methods for backend endpoints. */
  async getAnalyticsSummary() {
    const res = await api.get(apiUrl('/api/analytics/summary'));
    return res.data;
  }

  async getOnboardingStatus() {
    const res = await api.get(apiUrl('/api/onboarding/status'));
    return res.data;
  }

  async acknowledge(doc) {
    const res = await api.post(apiUrl('/api/onboarding/acknowledge'), { document: doc });
    return res.data;
  }

  async listLessons() {
    const res = await api.get(apiUrl('/api/lessons'));
    return res.data;
  }

  async createLesson(payload) {
    const res = await api.post(apiUrl('/api/lessons'), payload);
    return res.data;
  }

  async updateLesson(id, payload) {
    const res = await api.patch(apiUrl(`/api/lessons/${id}`), payload);
    return res.data;
  }

  async deleteLesson(id) {
    const res = await api.delete(apiUrl(`/api/lessons/${id}`));
    return res.data;
  }

  async listQuizzes() {
    const res = await api.get(apiUrl('/api/quizzes'));
    return res.data;
  }

  async createQuiz(payload) {
    const res = await api.post(apiUrl('/api/quizzes'), payload);
    return res.data;
  }

  async updateQuiz(id, payload) {
    const res = await api.patch(apiUrl(`/api/quizzes/${id}`), payload);
    return res.data;
  }

  async deleteQuiz(id) {
    const res = await api.delete(apiUrl(`/api/quizzes/${id}`));
    return res.data;
  }

  async getQuiz(id) {
    const res = await api.get(apiUrl(`/api/quizzes/${id}`));
    return res.data;
  }

  async submitQuiz(id, answers) {
    const res = await api.post(apiUrl(`/api/quizzes/${id}/submit`), { answers });
    return res.data;
  }

  async listUsers() {
    const res = await api.get(apiUrl('/api/users'));
    return res.data;
  }

  async createUser(payload) {
    const res = await api.post(apiUrl('/api/users'), payload);
    return res.data;
  }

  async updateUser(id, payload) {
    const res = await api.patch(apiUrl(`/api/users/${id}`), payload);
    return res.data;
  }

  async deleteUser(id) {
    const res = await api.delete(apiUrl(`/api/users/${id}`));
    return res.data;
  }
}
