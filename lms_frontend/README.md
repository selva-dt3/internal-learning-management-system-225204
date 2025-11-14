# LMS Frontend (React) - Auth & Dashboards

This frontend implements login and role-based dashboards (Admin, HR, Employee) with protected routing.

## Quick Start

1. Install dependencies
   - npm install

2. Configure environment
   - Create a .env file using .env.example
   - For CRA, set REACT_APP_BACKEND_API_URL
   - Example:
     REACT_APP_BACKEND_API_URL=http://localhost:3001

3. Run the app
   - npm start
   - Visit http://localhost:3000

## Environment Variables

- REACT_APP_BACKEND_API_URL
  - Base URL for backend (e.g., http://localhost:3001)
- Fallbacks supported (if present):
  - VITE_BACKEND_API_URL
  - BACKEND_API_URL

Note: Do not commit real environment values. Use .env and .env.local.

## Auth Behavior

- POST /api/auth/login with email/password
- Stores returned JWT token (temporarily in localStorage for this iteration)
- Calls GET /api/auth/me after login to confirm current user and role
- Adds Authorization: Bearer <token> header automatically via axios interceptor

Security note:
- TODO: Move to httpOnly cookies and CSRF protection on backend; avoid localStorage for tokens in production.

## Routing

- /login: Login page
- /dashboard: Role-based redirect to /dashboard/{admin|hr|employee}
- /dashboard/admin: Admin dashboard (requires role=admin)
- /dashboard/hr: HR dashboard (requires role=hr)
- /dashboard/employee: Employee dashboard (requires any authenticated user; visible to employee/admin/hr)

Unauthorized behavior:
- If unauthenticated, /dashboard* redirects to /login
- If authenticated but role mismatch, user is redirected to their own dashboard

## Code Structure

- src/api/client.js — Axios client with interceptors
- src/context/AuthContext.js — Auth state, login/logout
- src/components/ProtectedRoute.js — Auth guard
- src/components/RoleRoute.js — Role-based guard
- src/layouts/DashboardLayout.js — Header/sidebar shell (+ CSS)
- src/pages/LoginPage.js — Login screen
- src/pages/AdminDashboard.js — Admin dashboard
- src/pages/HRDashboard.js — HR dashboard
- src/pages/EmployeeDashboard.js — Employee dashboard
- src/pages/DashboardHome.js — Redirects to correct role dashboard
- src/routes/AppRoutes.js — Route definitions

## Theming

Ocean Professional palette:
- primary #1E3A8A
- secondary #F59E0B
- surface #FFFFFF
- background #F3F4F6
- text #111827

Minimal CSS used; no heavy UI frameworks.

## Testing

- App.test.js exists from template. Add tests for auth and routing as features mature.

## Notes

- Ensure backend CORS is enabled for the frontend origin.
- Backend endpoints expected:
  - POST /api/auth/login → { token, user: { id, email, role } }
  - GET /api/auth/me → { id, email, role }
