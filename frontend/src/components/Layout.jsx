// src/components/Layout.jsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    try {
      logout?.();
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto h-14 px-4 flex items-center justify-between gap-3">
          {/* App title - simple Link (no nesting) */}
          <Link
            to="/"
            className="text-sm sm:text-base font-semibold text-gray-900"
          >
            Student Attendance & Result Management
          </Link>

          {/* Right side actions */}
          <nav className="flex items-center gap-2">
            {/* Admin-only Notifications button */}
            {user?.role === "ADMIN" && (
              <Link
                to="/admin/notifications"
                className="px-3 py-1.5 rounded bg-indigo-600 text-white shadow hover:bg-indigo-700"
              >
                Notifications
              </Link>
            )}

            {/* User identity */}
            {user && (
              <span className="hidden sm:inline text-gray-600 mr-1">
                {user.full_name} · {user.role}
              </span>
            )}

            {/* Auth button */}
            {user ? (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded bg-gray-900 text-white hover:bg-black"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded bg-gray-900 text-white hover:bg-black"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        {/* Use children if provided; otherwise render nested routes */}
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
