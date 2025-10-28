// frontend/src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Protected from "./components/Protected.jsx";
import AuthProvider from "./store/authContext.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Attendance from "./pages/Attendance.jsx";
import Marks from "./pages/Marks.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminCourses from "./pages/AdminCourses.jsx";
import FacultyTakeAttendance from "./pages/FacultyTakeAttendance.jsx";

// Use the pages we actually have:
import AttendanceViewer from "./pages/AttendanceViewer.jsx";
import AddMarks from "./pages/AddMarks.jsx";
import Reports from "./pages/Reports.jsx";
import ParentPortal from "./pages/ParentPortal.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminNotifications from "./pages/AdminNotifications.jsx";

import "./styles/index.css";

// If you DO have a RootErrorBoundary component, uncomment the next line
// import RootErrorBoundary from "./routes/RootErrorBoundary.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    // errorElement: <RootErrorBoundary />, // uncomment if the file exists
    element: (
      <Layout>
        <Protected>
          <Dashboard />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: "/attendance",
    element: (
      <Layout>
        <Protected allow={["STUDENT", "ADMIN", "FACULTY"]}>
          <Attendance />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/marks",
    element: (
      <Layout>
        <Protected allow={["STUDENT", "ADMIN", "FACULTY"]}>
          <Marks />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <Layout>
        <Protected allow={["ADMIN"]}>
          <AdminUsers />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/admin/courses",
    element: (
      <Layout>
        <Protected allow={["ADMIN"]}>
          <AdminCourses />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/admin/notifications",
    element: (
      <Layout>
        <Protected allow={["ADMIN"]}>
          <AdminNotifications />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/faculty/take-attendance",
    element: (
      <Layout>
        <Protected allow={["FACULTY", "ADMIN"]}>
          <FacultyTakeAttendance />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/faculty/add-marks",
    element: (
      <Layout>
        <Protected allow={["FACULTY", "ADMIN"]}>
          <AddMarks />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/attendance/viewer",
    element: (
      <Layout>
        <Protected allow={["FACULTY", "ADMIN"]}>
          <AttendanceViewer />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/reports",
    element: (
      <Layout>
        <Protected allow={["FACULTY", "ADMIN"]}>
          <Reports />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/parent",
    element: (
      <Layout>
        <Protected allow={["PARENT", "ADMIN"]}>
          <ParentPortal />
        </Protected>
      </Layout>
    ),
  },
  // Catch-all 404
  {
    path: "*",
    element: (
      <Layout>
        <NotFound />
      </Layout>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
