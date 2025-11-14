# LMS Frontend (React) - Auth & Dashboards

This frontend implements login and role-based dashboards (Admin, HR, Employee) with protected routing, onboarding, analytics, and simple users/lessons/quizzes management plus a quiz-taking experience.

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
- Centralized 401/403 handling via axios interceptor triggers logout

Security note:
- TODO: Move to httpOnly cookies and CSRF protection on backend; avoid localStorage for tokens in production.

## Routing

- Distinct login routes:
  - /login (generic), /login/admin (Admin/HR), /login/employee (Employee)
- /dashboard: Role-based redirect to /dashboard/{admin|hr|employee}
- /dashboard/admin: Admin dashboard (requires role=admin)
  - /dashboard/admin/users: Users management (admin-only)
  - /dashboard/admin/lessons: Lessons management (admin-only)
  - /dashboard/admin/quizzes: Quizzes management (admin/hr)
- /dashboard/hr: HR dashboard (requires role=hr)
  - /dashboard/hr/lessons: Lessons management (hr/admin)
  - /dashboard/hr/quizzes: Quizzes management (hr/admin)
- /dashboard/employee: Employee dashboard (requires any authenticated user; visible to employee/admin/hr)
- /analytics: Analytics summary (admin/hr only)
- /quizzes/:id/take: Quiz taking for employees/admin/hr
- Global ErrorBoundary wraps the app

Unauthorized behavior:
- If unauthenticated, protected routes redirect to /login
- If authenticated but role mismatch, user is redirected to their own dashboard

## Code Structure

- src/api/client.js — Axios client with interceptors and helper methods (users/lessons/quizzes/analytics/onboarding)
- src/context/AuthContext.js — Auth state, login/logout using api client with 401/403 handling
- src/components/ErrorBoundary.js — Global runtime error fallback
- src/components/ProtectedRoute.js — Auth guard
- src/components/RoleRoute.js — Role-based guard
- src/layouts/DashboardLayout.js — Header/sidebar shell (+ CSS)
- src/pages/LoginPage.js — Login screen (used for distinct login routes)
- src/pages/AdminDashboard.js — Admin dashboard with links to management pages
- src/pages/HRDashboard.js — HR dashboard with links to lessons/quizzes
- src/pages/EmployeeDashboard.js — Employee dashboard with onboarding modal (NDA / CoC)
- src/pages/UsersManagement.js — Admin-only users CRUD (list endpoints expect {items, count})
- src/pages/LessonsManagement.js — Admin/HR lessons CRUD (list endpoints expect {items, count})
- src/pages/QuizzesManagement.js — Admin/HR quizzes CRUD (list endpoints expect {items, count})
- src/pages/QuizTaking.js — Take a quiz and submit answers
- src/pages/Analytics.js — Admin/HR analytics summary
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
  - GET /api/onboarding/status → { nda_acknowledged, coc_acknowledged }
  - POST /api/onboarding/acknowledgements { document } → updated status
  - GET /api/analytics/summary → analytics numbers
  - /api/users CRUD (admin only) — GET returns { items, count }
  - /api/lessons CRUD (admin/hr) — GET returns { items, count }
  - /api/quizzes CRUD (admin/hr) — GET returns { items, count }, POST /api/quizzes/:id/submit to submit answers
