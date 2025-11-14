/**
 * Employee login page
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiClient } from "../api/client";

const client = new ApiClient();

export default function LoginEmployee() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { access_token } = await client.login(email, password);
      client.setToken(access_token);
      localStorage.setItem("token", access_token);
      const me = await client.me();
      const role = me.role || (me.user_metadata && me.user_metadata.role);
      if (role !== "employee") {
        setErr("Please use the Admin/HR login page.");
        return;
      }
      nav("/dashboard/employee");
    } catch (e) {
      setErr("Login failed");
    }
  };

  return (
    <div className="login-container">
      <h1>Employee Login</h1>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        <button type="submit">Login</button>
        {err && <div className="error">{err}</div>}
      </form>
    </div>
  );
}
