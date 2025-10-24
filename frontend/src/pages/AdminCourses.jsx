import { useEffect, useState } from "react";
import API from "../api";

export default function AdminCourses() {
  const [form, setForm] = useState({
    code: "",
    title: "",
    credit: 3,
    faculty_id: "",
  });
  const [courses, setCourses] = useState([]);

  const load = async () => {
    const { data } = await API.get("/courses");
    setCourses(data);
  };
  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await API.post("/courses", { ...form, credit: Number(form.credit) });
    setForm({ code: "", title: "", credit: 3, faculty_id: "" });
    load();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-4 bg-white rounded-xl shadow">
        <h2 className="font-semibold mb-3">Create Course</h2>
        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            className="w-full border rounded p-2"
            placeholder="Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />

          <input
            className="w-full border rounded p-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="w-full border rounded p-2"
            placeholder="Credit"
            value={form.credit}
            onChange={(e) => setForm({ ...form, credit: e.target.value })}
          />

          <input
            className="w-full border rounded p-2"
            placeholder="Faculty ID"
            value={form.faculty_id}
            onChange={(e) => setForm({ ...form, faculty_id: e.target.value })}
          />

          <button className="w-full bg-gray-900 text-white rounded p-2">
            Create
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Courses</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2">Code</th>
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Credit</th>
                <th className="text-left p-2">Faculty</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-2">{c.code}</td>
                  <td className="p-2">{c.title}</td>
                  <td className="p-2">{c.credit}</td>
                  <td className="p-2">{c.faculty_name || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
