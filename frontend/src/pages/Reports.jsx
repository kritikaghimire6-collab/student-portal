import { useEffect, useState } from "react";
import API from "../api";
import PageHeader from "../components/PageHeader";

export default function Reports() {
  const [atRisk, setAtRisk] = useState([]);
  const [grades, setGrades] = useState([]);
  const [trend, setTrend] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [r1, r2, r3] = await Promise.all([
          API.get("/reports/at-risk"),
          API.get("/reports/grades-summary"),
          API.get("/reports/attendance-trend"),
        ]);
        setAtRisk(r1.data || []);
        setGrades(r2.data || []);
        setTrend(r3.data || []);
      } catch (e) {
        setErr(e.response?.data?.message || "Failed to load reports");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Reports" subtitle="Quick summaries & analytics" />
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {err && <p className="text-sm text-red-600">{err}</p>}

        <section>
          <h3 className="font-semibold mb-2">At-risk Students</h3>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Roll No</th>
                  <th className="text-left p-2">Course</th>
                  <th className="text-left p-2">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {atRisk.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{r.roll_no}</td>
                    <td className="p-2">{r.course_code}</td>
                    <td className="p-2">{r.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Grades Summary</h3>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Course</th>
                  <th className="text-left p-2">Avg</th>
                  <th className="text-left p-2">Max</th>
                  <th className="text-left p-2">Min</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{g.course_code}</td>
                    <td className="p-2">{g.avg}</td>
                    <td className="p-2">{g.max}</td>
                    <td className="p-2">{g.min}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Attendance Trend</h3>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Present Sessions</th>
                  <th className="text-left p-2">Total Sessions</th>
                </tr>
              </thead>
              <tbody>
                {trend.map((t, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">Week {t.yearweek}</td>
                    <td className="p-2">{t.presents}</td>
                    <td className="p-2">{t.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
