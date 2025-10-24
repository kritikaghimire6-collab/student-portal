import { useState } from 'react'
import API from '../api'

export default function AttendanceViewer() {
  const [studentId, setStudentId] = useState('1')
  const [courseCode, setCourseCode] = useState('CS201')
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  const load = async (e) => {
    e?.preventDefault?.()
    setError(''); setRows([]); setSummary(null)
    try {
      const { data: res } = await API.get('/enrollments/resolve', { params: { student_id: studentId, course_code: courseCode } })
      const eid = res.enrollment_id
      const { data } = await API.get(`/attendance/enrollment/${eid}`)
      setRows(data)
      // also compute summary via /attendance/summary
      const sum = await API.get('/attendance/summary', { params: { student_id: studentId, course_code: courseCode } })
      setSummary(sum.data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load')
    }
  }

  const pct = summary && summary.total>0 ? Math.round((summary.presents/summary.total)*100) : null

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Attendance Viewer</h1>
      <form className="flex gap-2" onSubmit={load}>
        <input className="border rounded p-2" value={studentId} onChange={e=>setStudentId(e.target.value)} placeholder="Student ID"/>
        <input className="border rounded p-2" value={courseCode} onChange={e=>setCourseCode(e.target.value)} placeholder="Course Code"/>
        <button className="px-3 py-2 bg-gray-900 text-white rounded">Load</button>
      </form>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {pct!==null && <div className={pct<75?'text-red-700':'text-green-700'}>Overall: {pct}%</div>}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100"><tr><th className="text-left p-2">Date</th><th className="text-left p-2">Status</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} className="border-t">
              <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
              <td className="p-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  )
}
