import { useEffect, useState } from "react";
import API from "../api";
import PageHeader from "../components/PageHeader";

export default function ParentPortal() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [summary, setSummary] = useState(null);
  const [marks, setMarks] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/parents/children");
        setChildren(data.children || []);
      } catch (e) {
        setErr(e.response?.data?.message || "Failed to load children");
      }
    })();
  }, []);

  const fetchData = async (e) => {
    e.preventDefault();
    setErr("");
    setSummary(null);
    setMarks([]);
    if (!selectedChild || !courseCode) {
      setErr("Please select a child and enter a course code");
      return;
    }
    try {
      const cc = courseCode.toUpperCase();
      const { data: s } = await API.get(
        `/parents/children/${selectedChild}/attendance-summary`,
        {
          params: { course_code: cc },
        }
      );
      const { data: m } = await API.get(
        `/parents/children/${selectedChild}/marks`,
        {
          params: { course_code: cc },
        }
      );
      setSummary(s);
      setMarks(m.marks || []);
    } catch (e2) {
      setErr(e2.response?.data?.message || "Failed to fetch data");
    }
  };

  const pct =
    summary && summary.total_classes > 0
      ? Math.round((summary.present / summary.total_classes) * 100)
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Parent Portal" subtitle="Monitor attendance & marks" />
      <main className="max-w-4xl mx-auto p-4 space-y-4">
        <form
          onSubmit={fetchData}
          className="p-4 bg-white rounded-xl shadow space-y-3"
        >
          <div className="grid md:grid-cols-3 gap-3">
            <select
              className="border rounded p-2"
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
            >
              <option value="">Select Child</option>
              {children.map((c) => (
                <option key={c.student_id} value={c.student_id}>
                  {c.roll_no} · Sem {c.semester} · {c.program}
                </option>
              ))}
            </select>
            <input
              className="border rounded p-2"
              placeholder="Course Code (e.g., BIM101)"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
            <button className="bg-gray-900 text-white rounded p-2">View</button>
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </form>

        {summary && (
          <div
            className={`p-3 rounded ${
              pct < 75 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}
          >
            <div className="font-medium">Attendance: {pct ?? 0}%</div>
            <div className="text-sm">
              Present {summary.present} of {summary.total_classes}
            </div>
          </div>
        )}

        {marks.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Assessment</th>
                  <th className="text-left p-2">Score</th>
                  <th className="text-left p-2">Max</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{r.assessment}</td>
                    <td className="p-2">{r.score}</td>
                    <td className="p-2">{r.max_score}</td>
                    <td className="p-2">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
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
