import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api";
import { useAuth } from "../store/authContext";
import PageHeader from "../components/PageHeader";

export default function Attendance() {
  const { state } = useLocation();
  const { user } = useAuth();
  const enrollment = state?.enrollment;

  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!enrollment) return;
      try {
        setLoading(true);
        const { data } = await API.get(
          `/attendance/enrollment/${enrollment.enrollment_id}`
        );
        setRows(data);

        if (user.role === "STUDENT") {
          const s = await API.get(`/attendance/summary`, {
            params: { student_id: user.id, course_code: enrollment.code },
          });
          setSummary(s.data);
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [enrollment, user.role]);

  const pct = useMemo(() => {
    if (!summary || summary.total === 0) return null;
    return Math.round((summary.presents / summary.total) * 100);
  }, [summary]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader
        title={`Attendance · ${enrollment?.code || ""} ${
          enrollment?.title || ""
        }`}
        subtitle={
          user.role === "STUDENT"
            ? "Your attendance record for this course."
            : ""
        }
      />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto p-4 space-y-4">
          {pct !== null && (
            <div
              className={`p-3 rounded ${
                pct < 75
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              Overall: {pct}% ({summary?.presents || 0} / {summary?.total || 0})
            </div>
          )}

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan={2}>
                      Loading…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan={2}>
                      No records.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td className="p-2">{r.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
