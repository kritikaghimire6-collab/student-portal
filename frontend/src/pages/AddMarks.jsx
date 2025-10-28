import React, { useState } from "react";
import API from "../api";
import PageHeader from "../components/PageHeader";

export default function AddMarks() {
  const [studentId, setStudentId] = useState("");
  const [courseCode, setCourseCode] = useState("CS201");
  const [assessment, setAssessment] = useState("Midterm");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const { data } = await API.post("/marks/composite", {
        student_id: Number(studentId),
        course_code: courseCode,
        assessment,
        score: Number(score),
        max_score: Number(maxScore),
      });
      setMsg("Saved");
    } catch (e) {
      setMsg(e?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader
        title="Add Marks"
        subtitle="Create assessment scores by student and course."
      />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto p-4">
          <div className="max-w-lg p-6 bg-white rounded-xl shadow">
            <form className="space-y-3" onSubmit={submit}>
              <input
                className="w-full border rounded p-2"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Student ID (e.g., 1)"
              />
              <input
                className="w-full border rounded p-2"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="Course Code (e.g., CS201)"
              />
              <input
                className="w-full border rounded p-2"
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="Assessment (e.g., Midterm)"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full border rounded p-2"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="Score (e.g., 78)"
                />
                <input
                  className="w-full border rounded p-2"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                  placeholder="Max Score (e.g., 100)"
                />
              </div>
              <button className="w-full bg-gray-900 text-white rounded p-2">
                Save
              </button>
              {msg && (
                <div
                  className={`text-sm ${
                    /Saved/i.test(msg) ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {msg}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
