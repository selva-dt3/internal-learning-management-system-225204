/**
 * Simple API client that centralizes the backend base URL selection.
 *
 * Order of resolution:
 * 1) process.env.REACT_APP_BACKEND_API_URL
 * 2) window.__APP_API_BASE__ (if injected at runtime)
 *
 * PUBLIC_INTERFACE
 */
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
export function apiUrl(path) {
  /** Builds absolute API URL using configured base. */
  const base = getApiBaseUrl();
  if (!base) return path;
  return `${base.replace(/\/+$/, '')}${path}`;
}
