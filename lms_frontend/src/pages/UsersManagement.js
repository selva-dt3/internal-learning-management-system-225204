import React, { useEffect, useMemo, useState } from "react";
import { ApiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * UsersManagement
 * Admin-only page to list/create/update/delete users.
 */
export default function UsersManagement() {
  /** This is a public function. */
  const client = useMemo(() => new ApiClient(), []);
  const { currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [form, setForm] = useState({ email: "", role: "employee", name: "" });
  const [saving, setSaving] = useState(false);

  const canEdit = currentUser?.role === "admin";

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await client.listUsers();
      const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setUsers(items);
    } catch (e) {
      setErr("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!canEdit) return;
    setSaving(true);
    setErr(null);
    try {
      await client.createUser(form);
      setForm({ email: "", role: "employee", name: "" });
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!canEdit) return;
    if (!window.confirm("Delete user?")) return;
    try {
      await client.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setErr("Failed to delete user");
    }
  };

  const onToggleRole = async (u) => {
    if (!canEdit) return;
    const nextRole = u.role === "employee" ? "hr" : u.role === "hr" ? "admin" : "employee";
    try {
      const updated = await client.updateUser(u.id, { role: nextRole });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
    } catch {
      setErr("Failed to update role");
    }
  };

  if (loading) return <div>Loading users…</div>;

  return (
    <div>
      <h1>Users</h1>
      {err && <div className="error">{err}</div>}

      {canEdit && (
        <form onSubmit={onCreate} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="email@company.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          >
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" disabled={saving}>
            {saving ? "Creating…" : "Create"}
          </button>
        </form>
      )}

      <div>
        {users.length === 0 ? (
          <div>No users found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Name</th>
                <th style={{ textAlign: "left" }}>Email</th>
                <th style={{ textAlign: "left" }}>Role</th>
                <th style={{ textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderTop: "1px solid #E5E7EB" }}>
                  <td>{u.name || "-"}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td style={{ display: "flex", gap: 8, padding: "6px 0" }}>
                    {canEdit && (
                      <>
                        <button type="button" onClick={() => onToggleRole(u)}>
                          Cycle Role
                        </button>
                        <button type="button" onClick={() => onDelete(u.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
