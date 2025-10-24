import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api";

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
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        Marks · {enrollment?.code} {enrollment?.title}
      </h1>
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
            {rows.map((r, i) => (
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
    </div>
  );
}
