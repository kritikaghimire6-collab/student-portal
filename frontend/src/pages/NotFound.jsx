// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow text-center space-y-3">
      <h1 className="text-2xl font-bold">404 – Page Not Found</h1>
      <p className="text-gray-600">
        The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="inline-block px-4 py-2 rounded bg-gray-900 text-white"
      >
        Go Home
      </Link>
    </div>
  );
}
