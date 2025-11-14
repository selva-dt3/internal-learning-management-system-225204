# Project Repository

This repository contains the LMS frontend and backend workspaces.

Quick links:
- lms_frontend: React app with auth and role-based dashboards (Admin/HR/Employee). See lms_frontend/README.md for setup.
  - Copy lms_frontend/.env.example to lms_frontend/.env and set REACT_APP_BACKEND_API_URL
  - Features: distinct login, onboarding modal, analytics (admin/hr), users & lessons CRUD, quizzes (admin/hr) and quiz taking (employees)
- lms_backend: FastAPI backend (work in progress for extended endpoints).