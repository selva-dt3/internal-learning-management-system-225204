# LMS Frontend (React)

This is the React frontend for the Internal LMS.

## Environment configuration

Set the backend API base URL using the environment variable `REACT_APP_BACKEND_API_URL`. The app will use this value at runtime to call the backend.

- Local development example:
  REACT_APP_BACKEND_API_URL=http://localhost:3001

- Preview environment example (recommended):
  REACT_APP_BACKEND_API_URL=https://vscode-internal-34912-beta.beta01.cloud.kavia.ai:3001

Ensure this origin is included in the backend's ALLOWED_ORIGINS CORS list.

## Start

- Install dependencies and start:
  npm install
  npm start

The application will be served on port 3000 by default.
