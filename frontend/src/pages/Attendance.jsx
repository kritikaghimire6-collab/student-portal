import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import API from "../api"
import { useAuth } from "../store/authContext"

function TranscriptButton({ studentId }) {
  const download = () => {
    const url = `${API.defaults.baseURL}/reports/transcript?student_id=${studentId}`
    window.open(url, "_blank")
  }
  return (
    <button
      onClick={download}
      className="ml-3 text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Download Transcript (PDF)
    </button>
  )
}

export default function Attendance() {
  const { state } = useLocation()
  const { user } = useAuth()
  const enrollment = state?.enrollment
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState(null)
  const [meId, setMeId] = useState(null)

  useEffect(() => {
    const run = async () => {
      if (!enrollment) return
      const { data } = await API.get(`/attendance/enrollment/${enrollment.enrollment_id}`)
      setRows(data)
      if (user.role === "STUDENT") {
        const me = await API.get("/students/me")
        setMeId(me.data.id)
        const s = await API.get(`/attendance/summary`, {
          params: { student_id: me.data.id, course_code: enrollment.code }
        })
        setSummary(s.data)
      }
    }
    run()
  }, [])

  const pct = summary && summary.total > 0
    ? Math.round((summary.presents / summary.total) * 100)
    : null

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold flex items-center">
        Attendance · {enrollment?.code} {enrollment?.title}
        {meId && <TranscriptButton studentId={meId} />}
      </h1>

      {pct !== null && (
        <div className={`p-3 rounded ${pct < 75 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          Overall Attendance: <strong>{pct}%</strong>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
                <td className="p-2">{r.status}</td>
              </tr>
            )) : (
              <tr><td className="p-2" colSpan={2}>No attendance recorded yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
