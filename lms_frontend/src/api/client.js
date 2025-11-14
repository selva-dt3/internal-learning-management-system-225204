/**
 * Simple API client to interact with LMS backend.
 * PUBLIC_INTERFACE
 */
export class ApiClient {
  /** Create client */
  constructor(baseUrl) {
    /** Base API URL (e.g., http://localhost:3001) */
    this.baseUrl = baseUrl || process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
  }

  setToken(token) {
    this.token = token;
  }

  headers() {
    const h = { "Content-Type": "application/json" };
    if (this.token) h["Authorization"] = `Bearer ${this.token}`;
    return h;
    }

  /** Login with email and password. Returns access_token. PUBLIC_INTERFACE */
  async login(email, password) {
    const res = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  }

  /** Get current user profile. PUBLIC_INTERFACE */
  async me() {
    const res = await fetch(`${this.baseUrl}/api/auth/me`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  }

  /** Get onboarding status for current user. PUBLIC_INTERFACE */
  async getOnboardingStatus() {
    const res = await fetch(`${this.baseUrl}/api/onboarding/status`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error("Failed to get status");
    return res.json();
  }

  /** Acknowledge a document ('nda' | 'coc'). PUBLIC_INTERFACE */
  async acknowledge(document) {
    const res = await fetch(`${this.baseUrl}/api/onboarding/acknowledgements`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ document }),
    });
    if (!res.ok) throw new Error("Failed to acknowledge");
    return res.json();
  }

  /** Get analytics summary (admin/hr only). PUBLIC_INTERFACE */
  async getAnalyticsSummary() {
    const res = await fetch(`${this.baseUrl}/api/analytics/summary`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error("Failed to get analytics");
    return res.json();
  }
}
