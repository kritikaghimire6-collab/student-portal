// frontend/src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Student Attendance & Result Management System
          </h1>
          <p className="text-gray-600 mt-1">
            The page you’re looking for was not found.
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-lg w-full text-center">
          <div className="text-6xl font-bold text-gray-900">404</div>
          <p className="mt-2 text-gray-600">
            Oops—this route doesn’t exist or you don’t have permission.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
