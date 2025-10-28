import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../store/authContext";

export default function Nav() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="font-semibold hover:opacity-80">
          Student Attendance & Result Management
        </Link>

        {user ? (
          <div className="flex items-center gap-2 flex-wrap">
            {user.role === "ADMIN" && (
              <>
                <Link
                  to="/admin/users"
                  className={`px-3 py-1.5 rounded ${
                    pathname.startsWith("/admin/users")
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Users
                </Link>
                <Link
                  to="/admin/courses"
                  className={`px-3 py-1.5 rounded ${
                    pathname.startsWith("/admin/courses")
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Courses
                </Link>
                <Link
                  to="/reports"
                  className={`px-3 py-1.5 rounded ${
                    pathname.startsWith("/reports")
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Reports
                </Link>
              </>
            )}

            {user.role === "FACULTY" && (
              <>
                <Link
                  to="/faculty/take-attendance"
                  className={`px-3 py-1.5 rounded ${
                    pathname.startsWith("/faculty/take-attendance")
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Take Attendance
                </Link>
                <Link
                  to="/attendance/viewer"
                  className={`px-3 py-1.5 rounded ${
                    pathname.startsWith("/attendance/viewer")
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  View Attendance
                </Link>
                <Link
                  to="/faculty/add-marks"
                  className={`px-3 py-1.5 rounded ${
                    pathname.startsWith("/faculty/add-marks")
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Add Marks
                </Link>
              </>
            )}

            {user.role === "PARENT" && (
              <Link
                to="/parent"
                className={`px-3 py-1.5 rounded ${
                  pathname.startsWith("/parent")
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Parent Portal
              </Link>
            )}

            <span className="text-xs text-gray-500 ml-2">
              {user.full_name} · {user.role}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded bg-gray-900 text-white hover:bg-black"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className={`px-3 py-1.5 rounded ${
              pathname === "/login"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
