import { useState } from "react";
import API from "../api";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../store/authContext";

export default function AttendanceViewer() {
  const { user } = useAuth();
  const [studentId, setStudentId] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchIt = async (e) => {
    e.preventDefault();
    setErr("");
    setSummary(null);
    setRows([]);
    setLoading(true);
    try {
      if (!studentId || !courseCode) {
        setErr("Student ID and Course Code are required");
        return;
      }
      // 1) resolve enrollment id
      const { data: resolved } = await API.get("/enrollments/resolve", {
        params: {
          student_id: studentId,
          course_code: courseCode.toUpperCase(),
        },
      });
      const enrollmentId = resolved.enrollment_id;

      // 2) attendance rows
      const { data: list } = await API.get(
        `/attendance/enrollment/${enrollmentId}`
      );
      setRows(list);

      // 3) summary
      const { data: sum } = await API.get(`/attendance/summary`, {
        params: {
          student_id: studentId,
          course_code: courseCode.toUpperCase(),
        },
      });
      setSummary(sum);
    } catch (e2) {
      setErr(e2.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const pct =
    summary && summary.total > 0
      ? Math.round((summary.presents / summary.total) * 100)
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Attendance Viewer"
        subtitle="Search by student & course"
      />
      <main className="max-w-3xl mx-auto p-4 space-y-4">
        {user?.role !== "FACULTY" && (
          <div className="p-3 rounded bg-yellow-50 text-yellow-700 text-sm">
            This page is intended for faculty.
          </div>
        )}

        <form
          onSubmit={fetchIt}
          className="p-4 bg-white rounded-xl shadow space-y-3"
        >
          <div className="grid md:grid-cols-3 gap-3">
            <input
              className="border rounded p-2"
              placeholder="Student ID (e.g., 2)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <input
              className="border rounded p-2"
              placeholder="Course Code (e.g., BIM101)"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
            <button
              className="bg-gray-900 text-white rounded p-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Loading..." : "Fetch"}
            </button>
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </form>

        {summary && (
          <div
            className={`p-3 rounded ${
              pct < 75 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}
          >
            <div className="font-medium">Overall: {pct ?? 0}%</div>
            <div className="text-sm">
              Present: {summary.presents} / Total: {summary.total}
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
