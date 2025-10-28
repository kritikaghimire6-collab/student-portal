import { useEffect, useState } from "react";
import API from "../api";
import PageHeader from "../components/PageHeader";

export default function AdminNotifications() {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({ student_id: "", course_code: "" });

  const load = async () => {
    const params = {};
    if (filters.student_id) params.student_id = filters.student_id;
    if (filters.course_code) params.course_code = filters.course_code;

    const { data } = await API.get("/notifications", { params });
    setRows(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <PageHeader title="Notifications" subtitle="Parent alert history" />

      <div className="bg-white p-3 rounded shadow mb-4 flex gap-2">
        <input
          className="border p-2 rounded w-40"
          placeholder="Student ID"
          value={filters.student_id}
          onChange={(e) =>
            setFilters({ ...filters, student_id: e.target.value })
          }
        />
        <input
          className="border p-2 rounded w-40"
          placeholder="Course Code"
          value={filters.course_code}
          onChange={(e) =>
            setFilters({ ...filters, course_code: e.target.value })
          }
        />
        <button
          className="bg-gray-900 text-white px-4 py-2 rounded"
          onClick={load}
        >
          Search
        </button>
      </div>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Student</th>
            <th className="p-2">Course</th>
            <th className="p-2">Parent Email</th>
            <th className="p-2">% Attendance</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((n) => (
            <tr key={n.id} className="border-t">
              <td className="p-2">{n.id}</td>
              <td className="p-2">
                {n.student_id} ({n.roll_no})
              </td>
              <td className="p-2">{n.course_code}</td>
              <td className="p-2">{n.parent_email}</td>
              <td className="p-2">{n.percentage}%</td>
              <td
                className={`p-2 ${
                  n.status === "FAILED" ? "text-red-600" : "text-green-600"
                }`}
              >
                {n.status}
              </td>
              <td className="p-2">{new Date(n.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
