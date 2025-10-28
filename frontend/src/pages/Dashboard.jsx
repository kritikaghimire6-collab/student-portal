// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../store/authContext";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (user.role !== "STUDENT") return;

    (async () => {
      try {
        // ✅ Fetch logged-in student's profile
        const { data: me } = await API.get("/students/me");
        // ✅ Fetch enrollments by student_id
        const { data } = await API.get(`/enrollments/me`);
        setCourses(data);
      } catch (e) {
        setErr(e.response?.data?.message || "Failed to load courses");
      }
    })();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader
        title="Dashboard"
        subtitle={
          user.role === "STUDENT"
            ? "Your courses, attendance and marks at a glance."
            : user.role === "FACULTY"
            ? "Manage attendance and marks."
            : user.role === "ADMIN"
            ? "System management and reports."
            : "Monitor your child’s progress."
        }
      />

      {/* Body */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto p-4 space-y-6">
          <h2 className="text-xl font-semibold">
            Welcome, {user.full_name}{" "}
            <span className="text-gray-500">· {user.role}</span>
          </h2>

          {/* STUDENT VIEW */}
          {user.role === "STUDENT" && (
            <div>
              <h3 className="font-medium mb-2">My Courses</h3>
              {err && <p className="text-red-600">{err}</p>}
              {!err && courses.length === 0 && (
                <p className="text-gray-600">No courses found.</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courses.map((c) => (
                  <div
                    key={c.enrollment_id}
                    className="p-4 bg-white rounded-xl shadow"
                  >
                    <div className="font-semibold">
                      {c.code} · {c.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {c.credit} credits
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Link
                        to="/attendance"
                        state={{ enrollment: c }}
                        className="text-sm px-3 py-1 bg-gray-900 text-white rounded"
                      >
                        Attendance
                      </Link>
                      <Link
                        to="/marks"
                        state={{ enrollment: c }}
                        className="text-sm px-3 py-1 bg-gray-200 rounded"
                      >
                        Marks
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FACULTY VIEW */}
          {user.role === "FACULTY" && (
            <div className="flex flex-wrap gap-3">
              <Link
                to="/faculty/take-attendance"
                className="px-4 py-2 rounded bg-gray-900 text-white"
              >
                Take Attendance
              </Link>
              <Link
                to="/attendance/viewer"
                className="px-4 py-2 rounded bg-gray-200"
              >
                View Attendance
              </Link>
              <Link
                to="/faculty/add-marks"
                className="px-4 py-2 rounded bg-gray-200"
              >
                Add Marks
              </Link>
              <Link
                to="/marks/viewer"
                className="px-4 py-2 rounded bg-gray-200"
              >
                View Marks
              </Link>
            </div>
          )}

          {/* ADMIN VIEW */}
          {user.role === "ADMIN" && (
            <div className="flex justify-between items-center flex-wrap gap-3">
              {/* Left side buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/admin/users"
                  className="px-4 py-2 rounded bg-gray-900 text-white"
                >
                  Manage Users
                </Link>
                <Link
                  to="/admin/courses"
                  className="px-4 py-2 rounded bg-gray-200"
                >
                  Manage Courses
                </Link>
                <Link to="/reports" className="px-4 py-2 rounded bg-gray-200">
                  Reports
                </Link>
              </div>

              {/* Notifications on RIGHT */}
              <Link
                to="/admin/notifications"
                className="px-4 py-2 rounded bg-indigo-600 text-white shadow hover:bg-indigo-700"
              >
                Notifications
              </Link>
            </div>
          )}

          {/* PARENT VIEW */}
          {user.role === "PARENT" && (
            <div className="flex flex-wrap gap-3">
              <Link
                to="/parent"
                className="px-4 py-2 rounded bg-gray-900 text-white"
              >
                Parent Portal
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
