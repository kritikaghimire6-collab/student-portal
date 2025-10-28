import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api";
import PageHeader from "../components/PageHeader";

function gradeFromPercent(p) {
  if (p >= 85) return "A";
  if (p >= 75) return "B";
  if (p >= 65) return "C";
  if (p >= 50) return "D";
  return "F";
}

export default function Marks() {
  const { state } = useLocation();
  const enrollment = state?.enrollment;
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const run = async () => {
      if (!enrollment) return;
      const { data } = await API.get(
        `/marks/enrollment/${enrollment.enrollment_id}`
      );
      setRows(data);
    };
    run();
  }, [enrollment]);

  const overall = useMemo(() => {
    if (rows.length === 0) return null;
    const total = rows.reduce((acc, r) => acc + Number(r.max_score), 0);
    const got = rows.reduce((acc, r) => acc + Number(r.score), 0);
    const pct = total > 0 ? Math.round((got / total) * 100) : null;
    return {
      total,
      got,
      pct,
      grade: pct !== null ? gradeFromPercent(pct) : "-",
    };
  }, [rows]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader
        title={`Marks · ${enrollment?.code || ""} ${enrollment?.title || ""}`}
        subtitle="Your assessments and scores for this course."
      />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto p-4 space-y-4">
          {overall && overall.pct !== null && (
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-white shadow border">
                <div className="text-sm text-gray-600">Overall</div>
                <div className="text-xl font-semibold">{overall.pct}%</div>
              </div>
              <div className="p-3 rounded-lg bg-white shadow border">
                <div className="text-sm text-gray-600">Grade</div>
                <div className="text-xl font-semibold">{overall.grade}</div>
              </div>
              <div className="p-3 rounded-lg bg-white shadow border">
                <div className="text-sm text-gray-600">Points</div>
                <div className="text-xl font-semibold">
                  {overall.got} / {overall.total}
                </div>
              </div>
            </div>
          )}

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
                {rows.length === 0 ? (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan={4}>
                      No marks yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{r.assessment}</td>
                      <td className="p-2">{r.score}</td>
                      <td className="p-2">{r.max_score}</td>
                      <td className="p-2">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
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
