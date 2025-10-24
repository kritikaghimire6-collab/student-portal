import { useEffect, useState } from "react";
import API from "../api";

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await API.get("/users");
      setRows(data);
    })();
  }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">All Users</h1>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
