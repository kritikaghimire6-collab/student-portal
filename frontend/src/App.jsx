import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Marks from "./pages/Marks";
import AdminUsers from "./pages/AdminUsers";
import AdminCourses from "./pages/AdminCourses";
import FacultyTakeAttendance from "./pages/FacultyTakeAttendance";
import Protected from "./components/Protected";
import AttendanceViewer from "./pages/AttendanceViewer";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/attendance/viewer"
          element={
            <Protected allow={["ADMIN", "FACULTY"]}>
              <AttendanceViewer />
            </Protected>
          }
        />
        <Route
          path="/attendance"
          element={
            <Protected allow={["STUDENT", "ADMIN", "FACULTY"]}>
              <Attendance />
            </Protected>
          }
        />
        <Route
          path="/marks"
          element={
            <Protected allow={["STUDENT", "ADMIN", "FACULTY"]}>
              <Marks />
            </Protected>
          }
        />
        <Route
          path="/admin/users"
          element={
            <Protected allow={["ADMIN"]}>
              <AdminUsers />
            </Protected>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <Protected allow={["ADMIN"]}>
              <AdminCourses />
            </Protected>
          }
        />
        <Route
          path="/faculty/take-attendance"
          element={
            <Protected allow={["FACULTY"]}>
              <FacultyTakeAttendance />
            </Protected>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
