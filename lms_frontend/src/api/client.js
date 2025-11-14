import axios from 'axios';

/**
 * Resolve backend base URL from environment.
 * CRA uses REACT_APP_ prefix; prefer REACT_APP_BACKEND_API_URL. If not set, fallback to VITE_BACKEND_API_URL for Vite-like envs.
 * Default to http://localhost:3001 if none provided.
 */
const envBackend =
  process.env.REACT_APP_BACKEND_API_URL ||
  process.env.VITE_BACKEND_API_URL ||
  process.env.BACKEND_API_URL ||
  'http://localhost:3001';

export const api = axios.create({
  baseURL: envBackend,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token holder in module scope; updated by AuthContext.
let accessToken = null;

/**
 * PUBLIC_INTERFACE
 * setAccessToken
 * Sets the in-memory access token for API requests.
 * This avoids reading localStorage on every request for performance and security.
 */
export function setAccessToken(token) {
  /** This is a public function. */
  accessToken = token || null;
}

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  if (accessToken) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor to surface 401 for logout handling externally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
