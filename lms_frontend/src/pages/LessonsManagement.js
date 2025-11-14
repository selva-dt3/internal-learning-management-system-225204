import React, { useEffect, useMemo, useState } from "react";
import { ApiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * LessonsManagement
 * Admin/HR page to manage lessons (CRUD).
 */
export default function LessonsManagement() {
  /** This is a public function. */
  const client = useMemo(() => new ApiClient(), []);
  const { currentUser } = useAuth();

  const canEdit = ["admin", "hr"].includes(currentUser?.role);

  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ title: "", description: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await client.listLessons();
      const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setItems(items);
    } catch {
      setErr("Failed to load lessons");
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
      await client.createLesson(form);
      setForm({ title: "", description: "" });
      await load();
    } catch {
      setErr("Failed to create lesson");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!canEdit) return;
    if (!window.confirm("Delete lesson?")) return;
    try {
      await client.deleteLesson(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch {
      setErr("Failed to delete lesson");
    }
  };

  const onQuickEdit = async (item) => {
    if (!canEdit) return;
    const title = window.prompt("New title", item.title);
    if (title == null) return;
    try {
      const updated = await client.updateLesson(item.id, { title });
      setItems((prev) => prev.map((x) => (x.id === item.id ? updated : x)));
    } catch {
      setErr("Failed to update lesson");
    }
  };

  if (loading) return <div>Loading lessons…</div>;

  return (
    <div>
      <h1>Lessons</h1>
      {err && <div className="error">{err}</div>}

      {canEdit && (
        <form onSubmit={onCreate} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Lesson title"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Short description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Add"}
          </button>
        </form>
      )}

      {items.length === 0 ? (
        <div>No lessons found.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((l) => (
            <li
              key={l.id}
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: 12,
                marginBottom: 10,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 600 }}>{l.title}</div>
              <div style={{ color: "#6B7280", fontSize: 14 }}>{l.description || "-"}</div>
              {canEdit && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => onQuickEdit(l)}>Quick Edit</button>
                  <button onClick={() => onDelete(l.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
