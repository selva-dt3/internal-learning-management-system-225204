/**
 * Simple API client (axios) to interact with LMS backend with auth header support.
 * PUBLIC_INTERFACE
 */
import axios from "axios";

/** Resolve backend base URL from environment fallbacks */
const BASE_URL =
  process.env.REACT_APP_BACKEND_API_URL ||
  process.env.VITE_BACKEND_API_URL ||
  process.env.BACKEND_API_URL ||
  "http://localhost:3001";

/** Shared axios instance with baseURL and auth interceptor */
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/** Token setter used by AuthContext */
let accessToken = null;

/** Simple in-memory subscribers to auth errors */
const listeners = new Set();

/** PUBLIC_INTERFACE */
export function onAuthError(cb) {
  /** Subscribe to 401/403 centralized handling */
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** PUBLIC_INTERFACE */
export function setAccessToken(token) {
  /** Set or clear bearer token for the api client. */
  accessToken = token || null;
}

/** Attach Authorization header if token is set */
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/** Centralized response error handling for 401/403 */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      // notify subscribers (e.g., AuthContext) to logout or redirect
      listeners.forEach((cb) => {
        try {
          cb(status, error?.response?.data);
        } catch (_e) { /* no-op */ }
      });
    }
    return Promise.reject(error);
  }
);

/**
 * PUBLIC_INTERFACE
 * ApiClient - thin wrapper for convenience methods
 */
export class ApiClient {
  /** Create client */
  constructor(baseUrl) {
    /** Base API URL (e.g., http://localhost:3001) */
    this.baseUrl = baseUrl || BASE_URL;
  }

  /** PUBLIC_INTERFACE */
  setToken(token) {
    setAccessToken(token);
  }

  /** PUBLIC_INTERFACE
   * Login with email and password. Returns { token, user }
   */
  async login(email, password) {
    const res = await api.post(`/api/auth/login`, { email, password });
    return res.data;
  }

  /** PUBLIC_INTERFACE - Get current user */
  async me() {
    const res = await api.get(`/api/auth/me`);
    return res.data;
  }

  /** PUBLIC_INTERFACE - Onboarding status */
  async getOnboardingStatus() {
    const res = await api.get(`/api/onboarding/status`);
    return res.data;
  }

  /** PUBLIC_INTERFACE - Acknowledge onboarding document: 'nda' | 'coc' */
  async acknowledge(document) {
    const res = await api.post(`/api/onboarding/acknowledgements`, { document });
    return res.data;
  }

  /** PUBLIC_INTERFACE - Analytics summary */
  async getAnalyticsSummary() {
    const res = await api.get(`/api/analytics/summary`);
    return res.data;
  }

  /** PUBLIC_INTERFACE - Users CRUD (admin only) */
  async listUsers(params = {}) {
    const res = await api.get(`/api/users`, { params });
    return res.data; // expected { items, count }
  }
  /** PUBLIC_INTERFACE */
  async createUser(payload) {
    const res = await api.post(`/api/users`, payload);
    return res.data;
  }
  /** PUBLIC_INTERFACE */
  async updateUser(id, payload) {
    const res = await api.put(`/api/users/${id}`, payload);
    return res.data;
  }
  /** PUBLIC_INTERFACE */
  async deleteUser(id) {
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
  }

  /** PUBLIC_INTERFACE - Lessons CRUD */
  async listLessons(params = {}) {
    const res = await api.get(`/api/lessons`, { params });
    return res.data; // expected { items, count }
  }
  /** PUBLIC_INTERFACE */
  async createLesson(payload) {
    const res = await api.post(`/api/lessons`, payload);
    return res.data;
  }
  /** PUBLIC_INTERFACE */
  async updateLesson(id, payload) {
    const res = await api.put(`/api/lessons/${id}`, payload);
    return res.data;
  }
  /** PUBLIC_INTERFACE */
  async deleteLesson(id) {
    const res = await api.delete(`/api/lessons/${id}`);
    return res.data;
  }

  /** PUBLIC_INTERFACE - Quizzes CRUD and submissions */
  async listQuizzes(params = {}) {
    const res = await api.get(`/api/quizzes`, { params });
    return res.data; // { items, count }
  }
  /** PUBLIC_INTERFACE */
  async createQuiz(payload) {
    const res = await api.post(`/api/quizzes`, payload);
    return res.data;
  }
  /** PUBLIC_INTERFACE */
  async updateQuiz(id, payload) {
    const res = await api.put(`/api/quizzes/${id}`, payload);
    return res.data;
  }
  /** PUBLIC_INTERFACE */
  async deleteQuiz(id) {
    const res = await api.delete(`/api/quizzes/${id}`);
    return res.data;
  }
  /** PUBLIC_INTERFACE */
  async getQuiz(id) {
    const res = await api.get(`/api/quizzes/${id}`);
    return res.data;
  }
  /** PUBLIC_INTERFACE */
  async submitQuiz(id, answers) {
    const res = await api.post(`/api/quizzes/${id}/submit`, { answers });
    return res.data; // e.g., { score, passed, feedback }
  }
}
