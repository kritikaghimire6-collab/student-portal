import React, { useEffect, useState } from "react";
import API from "../api";
import PageHeader from "../components/PageHeader";

export default function AdminCourses() {
  const [form, setForm] = useState({
    code: "",
    title: "",
    credit: 3,
    faculty_id: "",
  });
  const [courses, setCourses] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const { data } = await API.get("/courses");
    setCourses(data);
  };
  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await API.post("/courses", { ...form, credit: Number(form.credit) });
      setForm({ code: "", title: "", credit: 3, faculty_id: "" });
      await load();
      setMsg("Course created");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to create course");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader title="Manage Courses" subtitle="Create and view courses." />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-6">
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
                onChange={(e) =>
                  setForm({ ...form, faculty_id: e.target.value })
                }
              />
              <button className="w-full bg-gray-900 text-white rounded p-2">
                Create
              </button>
              {msg && (
                <div
                  className={`text-sm ${
                    /created/i.test(msg) ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {msg}
                </div>
              )}
            </form>
          </div>

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
                {courses.length === 0 && (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan={4}>
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
