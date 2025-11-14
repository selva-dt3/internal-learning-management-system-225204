import React, { useEffect, useMemo, useState } from "react";
import { ApiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * QuizzesManagement
 * Admin/HR page to manage quizzes with simple CRUD.
 */
export default function QuizzesManagement() {
  /** This is a public function. */
  const client = useMemo(() => new ApiClient(), []);
  const { currentUser } = useAuth();
  const canEdit = ["admin", "hr"].includes(currentUser?.role);

  const [quizzes, setQuizzes] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    // very simple quiz: array of questions with options and correctIndex
    questions: [
      { text: "", options: ["", "", "", ""], correctIndex: 0 }
    ],
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await client.listQuizzes();
      const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setQuizzes(items);
      setCount(typeof data?.count === "number" ? data.count : items.length);
    } catch {
      setErr("Failed to load quizzes");
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
      await client.createQuiz(form);
      setForm({
        title: "",
        description: "",
        questions: [{ text: "", options: ["", "", "", ""], correctIndex: 0 }],
      });
      await load();
    } catch {
      setErr("Failed to create quiz");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!canEdit) return;
    if (!window.confirm("Delete quiz?")) return;
    try {
      await client.deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
      setCount((c) => Math.max(0, c - 1));
    } catch {
      setErr("Failed to delete quiz");
    }
  };

  const onQuickEdit = async (q) => {
    if (!canEdit) return;
    const title = window.prompt("New title", q.title);
    if (title == null) return;
    try {
      const updated = await client.updateQuiz(q.id, { title });
      setQuizzes((prev) => prev.map((x) => (x.id === q.id ? updated : x)));
    } catch {
      setErr("Failed to update quiz");
    }
  };

  if (loading) return <div>Loading quizzes…</div>;

  return (
    <div>
      <h1>Quizzes</h1>
      {err && <div className="error">{err}</div>}

      <div style={{ marginBottom: 12, color: "#6B7280" }}>Total: {count}</div>

      {canEdit && (
        <form onSubmit={onCreate} style={{ display: "grid", gap: 8, marginBottom: 16, maxWidth: 640 }}>
          <input
            type="text"
            placeholder="Quiz title"
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
          <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Questions</div>
            {form.questions.map((qq, idx) => (
              <div key={idx} style={{ borderTop: idx ? "1px solid #E5E7EB" : "none", paddingTop: 8, marginTop: 8 }}>
                <input
                  type="text"
                  placeholder={`Question ${idx + 1}`}
                  required
                  value={qq.text}
                  onChange={(e) =>
                    setForm((f) => {
                      const qs = [...f.questions];
                      qs[idx] = { ...qs[idx], text: e.target.value };
                      return { ...f, questions: qs };
                    })
                  }
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 6 }}>
                  {qq.options.map((opt, oIdx) => (
                    <input
                      key={oIdx}
                      type="text"
                      placeholder={`Option ${oIdx + 1}`}
                      required
                      value={opt}
                      onChange={(e) =>
                        setForm((f) => {
                          const qs = [...f.questions];
                          const opts = [...qs[idx].options];
                          opts[oIdx] = e.target.value;
                          qs[idx] = { ...qs[idx], options: opts };
                          return { ...f, questions: qs };
                        })
                      }
                    />
                  ))}
                </div>
                <div style={{ marginTop: 6 }}>
                  <label htmlFor={`correct-${idx}`} style={{ marginRight: 8 }}>Correct option index</label>
                  <select
                    id={`correct-${idx}`}
                    value={qq.correctIndex}
                    onChange={(e) =>
                      setForm((f) => {
                        const qs = [...f.questions];
                        qs[idx] = { ...qs[idx], correctIndex: Number(e.target.value) };
                        return { ...f, questions: qs };
                      })
                    }
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    questions: [...f.questions, { text: "", options: ["", "", "", ""], correctIndex: 0 }],
                  }))
                }
              >
                Add Question
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    questions: f.questions.length > 1 ? f.questions.slice(0, -1) : f.questions,
                  }))
                }
              >
                Remove Last Question
              </button>
            </div>
          </div>
          <button type="submit" disabled={saving}>{saving ? "Saving…" : "Create Quiz"}</button>
        </form>
      )}

      {quizzes.length === 0 ? (
        <div>No quizzes found.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {quizzes.map((q) => (
            <li
              key={q.id}
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: 12,
                marginBottom: 10,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 600 }}>{q.title}</div>
              <div style={{ color: "#6B7280", fontSize: 14 }}>{q.description || "-"}</div>
              {canEdit && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => onQuickEdit(q)}>Quick Edit</button>
                  <button onClick={() => onDelete(q.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
