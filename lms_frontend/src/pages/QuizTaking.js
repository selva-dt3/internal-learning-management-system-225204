import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiClient } from "../api/client";

/**
 * PUBLIC_INTERFACE
 * QuizTaking
 * Employee page to take a quiz and submit answers.
 */
export default function QuizTaking() {
  /** This is a public function. */
  const { id } = useParams();
  const client = useMemo(() => new ApiClient(), []);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const q = await client.getQuiz(id);
        setQuiz(q);
        const initial = {};
        (q?.questions || []).forEach((_, idx) => { initial[idx] = null; });
        setAnswers(initial);
      } catch {
        setErr("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [client, id]);

  const onSelect = (qIdx, optIdx) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = Object.keys(answers).map((k) => answers[k]);
      const res = await client.submitQuiz(id, payload);
      setResult(res);
    } catch {
      setErr("Failed to submit quiz");
    }
  };

  if (loading) return <div>Loading quiz…</div>;
  if (err) return <div className="error">{err}</div>;
  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div>
      <h1>{quiz.title}</h1>
      <p style={{ color: "#6B7280" }}>{quiz.description || "-"}</p>

      {result ? (
        <div style={{ padding: 12, border: "1px solid #E5E7EB", borderRadius: 8, background: "#fff" }}>
          <h3>Result</h3>
          <div>Score: {result.score}</div>
          <div>Passed: {result.passed ? "Yes" : "No"}</div>
          {result.feedback && <pre style={{ whiteSpace: "pre-wrap" }}>{result.feedback}</pre>}
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          {(quiz.questions || []).map((q, qIdx) => (
            <div key={qIdx} style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: 12, background: "#fff" }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{qIdx + 1}. {q.text}</div>
              <div style={{ display: "grid", gap: 6 }}>
                {(q.options || []).map((opt, oIdx) => (
                  <label key={oIdx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="radio"
                      name={`q-${qIdx}`}
                      checked={answers[qIdx] === oIdx}
                      onChange={() => onSelect(qIdx, oIdx)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type="submit">Submit Quiz</button>
        </form>
      )}
    </div>
  );
}
