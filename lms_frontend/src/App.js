/**
 * App template used only for /template demo route.
 * PUBLIC_INTERFACE
 */
import React from "react";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      <h1>Internal LMS</h1>
      <nav>
        <Link to="/login">Login</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <p>This is a template page. Use the main app at /login and /dashboard.</p>
    </div>
  );
}
