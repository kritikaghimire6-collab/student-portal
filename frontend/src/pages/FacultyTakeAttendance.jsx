import { useEffect, useState } from "react";
import API from "../api";

export default function FacultyTakeAttendance() {
  // demo defaults that match your seed data
  const [studentId, setStudentId] = useState("1");
  const [courseCode, setCourseCode] = useState("CS201");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("PRESENT");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await API.get("/courses"); // any authed user
        if (!alive) return;
        setCourses(data);
        // if current courseCode isn't in the list, pick the first
        if (data.length && !data.some((c) => c.code === courseCode)) {
          setCourseCode(data[0].code);
        }
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load courses");
      }
    })();
    return () => {
      alive = false;
    };
  }, []); // load once

  const resetMessages = () => {
    setErr("");
    setOk("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!studentId.trim() || !courseCode.trim() || !date.trim()) {
      setErr("Please fill all fields.");
      return;
    }
    const sid = Number(studentId);
    if (Number.isNaN(sid) || sid <= 0) {
      setErr("Student ID must be a positive number.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/attendance/composite", {
        student_id: sid,
        course_code: courseCode.trim(),
        date,
        status,
      });
      setOk(data?.message || "Attendance recorded");
    } catch (e) {
      setErr(e?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">Take Attendance</h1>

      <form className="space-y-4" onSubmit={onSubmit} onChange={resetMessages}>
        <label className="block">
          <span className="text-sm text-gray-700">Student ID</span>
          <input
            className="mt-1 w-full border rounded p-2"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g., 1"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">Course</span>
          <select
            className="mt-1 w-full border rounded p-2"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          >
            {courses.length === 0 && <option value="">Loading…</option>}
            {courses.map((c) => (
              <option key={c.id} value={c.code}>
                {c.code} · {c.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">Date</span>
          <input
            className="mt-1 w-full border rounded p-2"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">Status</span>
          <select
            className="mt-1 w-full border rounded p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PRESENT">PRESENT</option>
            <option value="ABSENT">ABSENT</option>
          </select>
        </label>

        <button
          className="w-full bg-gray-900 text-white rounded p-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Saving…" : "Save"}
        </button>

        {ok && <div className="text-green-700 text-sm">{ok}</div>}
        {err && <div className="text-red-700 text-sm">{err}</div>}

        <p className="text-xs text-gray-500">
          Tip: Seeded student is <b>ID 1</b>. Seeded courses include{" "}
          <b>CS201</b> and <b>CS202</b>.
        </p>
      </form>
    </div>
  );
}
