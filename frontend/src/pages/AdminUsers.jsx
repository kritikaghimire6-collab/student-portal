import React, { useEffect, useState } from "react";
import API from "../api";
import PageHeader from "../components/PageHeader";

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "STUDENT",
    full_name: "",
  });
  const [msg, setMsg] = useState("");

  const load = async () => {
    const { data } = await API.get("/users");
    setRows(data);
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await API.post("/auth/register", form);
      setForm({ email: "", password: "", role: "STUDENT", full_name: "" });
      await load();
      setMsg("User created");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader
        title="Manage Users"
        subtitle="Create and list system users."
      />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-3">Create User</h3>
            <form className="space-y-3" onSubmit={onSubmit}>
              <input
                className="w-full border rounded p-2"
                placeholder="Full name"
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
              />
              <input
                className="w-full border rounded p-2"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="w-full border rounded p-2"
                type="password"
                placeholder="Password (min 8)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <select
                className="w-full border rounded p-2"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option>ADMIN</option>
                <option>FACULTY</option>
                <option>STUDENT</option>
                <option>PARENT</option>
              </select>
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
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-2">{u.id}</td>
                    <td className="p-2">{u.full_name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan={4}>
                      No users.
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
