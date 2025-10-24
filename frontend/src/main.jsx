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
import FacultyAddMarks from "./pages/FacultyAddMarks.jsx";
import AttendanceViewer from "./pages/AttendanceViewer.jsx";
import MarksViewer from "./pages/MarksViewer.jsx";
import Reports from "./pages/Reports.jsx";
import ParentPortal from "./pages/ParentPortal.jsx";
import RootErrorBoundary from "./routes/RootErrorBoundary.jsx";

import "./styles/index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Protected>
          <Dashboard />
        </Protected>
      </Layout>
    ),
    errorElement: <RootErrorBoundary />,
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
    path: "/faculty/take-attendance",
    element: (
      <Layout>
        <Protected allow={["FACULTY"]}>
          <FacultyTakeAttendance />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/faculty/add-marks",
    element: (
      <Layout>
        <Protected allow={["FACULTY"]}>
          <FacultyAddMarks />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/attendance/viewer",
    element: (
      <Layout>
        <Protected allow={["ADMIN", "FACULTY"]}>
          <AttendanceViewer />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/marks/viewer",
    element: (
      <Layout>
        <Protected allow={["ADMIN", "FACULTY"]}>
          <MarksViewer />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/reports",
    element: (
      <Layout>
        <Protected allow={["ADMIN", "FACULTY"]}>
          <Reports />
        </Protected>
      </Layout>
    ),
  },
  {
    path: "/parent",
    element: (
      <Layout>
        <Protected allow={["PARENT"]}>
          <ParentPortal />
        </Protected>
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
