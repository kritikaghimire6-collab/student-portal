import { useState } from "react";
import API from "../api";
import { useAuth } from "../store/authContext";
import { useNavigate } from "react-router-dom";

function Toast({ kind = "error", children }) {
  const styles =
    kind === "error"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-green-50 text-green-700 border-green-200";
  return (
    <div className={`border rounded p-2 text-sm ${styles}`}>{children}</div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data);
      nav("/");
    } catch (e2) {
      setErr(e2.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const roleHint = email.includes("admin")
    ? "ADMIN account detected — you’ll see Users/Courses/Reports after login."
    : email.includes("faculty")
    ? "FACULTY account detected — you’ll see Take/View Attendance and Add/View Marks."
    : email.includes("parent")
    ? "PARENT account — use Parent Portal to monitor your child."
    : email.includes("student")
    ? "STUDENT account — you’ll see your courses, attendance and marks."
    : "";

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>

      {roleHint && <div className="mb-3 text-sm text-gray-600">{roleHint}</div>}

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="username"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <div className="flex gap-2">
            <input
              className="w-full border rounded p-2"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="px-3 rounded border"
              onClick={() => setShowPwd((s) => !s)}
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {err && <Toast>{err}</Toast>}

        <button
          className="w-full bg-gray-900 text-white rounded p-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <div>
          Tip: try <span className="font-mono">student@example.com</span> /{" "}
          <span className="font-mono"></span>
        </div>
        <div>
          Or <span className="font-mono">admin@example.com</span>,{" "}
          <span className="font-mono">faculty@example.com</span>, etc.
        </div>
      </div>
    </div>
  );
}
