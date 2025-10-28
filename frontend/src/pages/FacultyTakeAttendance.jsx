// frontend/src/pages/FacultyTakeAttendance.jsx
import { useEffect, useState } from "react";
import API from "../api";
import Toast from "../components/Toast";

export default function FacultyTakeAttendance() {
  const [studentId, setStudentId] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("PRESENT");

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const showToast = (type, message) => setToast({ show: true, type, message });

  useEffect(
    () => setToast((t) => ({ ...t, show: false })),
    [studentId, courseCode, date, status]
  );

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/attendance/composite", {
        student_id: Number(studentId),
        course_code: courseCode.trim(),
        date,
        status,
      });

      // If backend added emailAttempt -> toast that we notified parent
      if (data?.emailAttempt?.id) {
        showToast(
          "success",
          "Attendance saved. Parent was notified (below 75%)."
        );
      } else {
        showToast("success", "Attendance saved.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save attendance";
      showToast("error", msg);
    }
  };

  return (
    <div className="max-w-md p-4 bg-white rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-3">Take Attendance</h1>
      <p className="text-sm text-gray-600 mb-4">
        Note: If a student's attendance drops below 75% in a course, an email
        alert is automatically sent to the parent and logged in{" "}
        <code>notifications</code>.
      </p>

      <form className="space-y-3" onSubmit={submit}>
        <input
          className="w-full border rounded p-2"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Student ID (e.g., 2)"
          required
        />
        <input
          className="w-full border rounded p-2"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          placeholder="Course Code (e.g., BIM101)"
          required
        />
        <input
          className="w-full border rounded p-2"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select
          className="w-full border rounded p-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="PRESENT">PRESENT</option>
          <option value="ABSENT">ABSENT</option>
        </select>

        <button className="w-full bg-gray-900 text-white rounded p-2">
          Save
        </button>
      </form>

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  );
}
