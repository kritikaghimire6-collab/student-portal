import { useState } from 'react'
import API from '../api'

export default function MarksViewer() {
  const [studentId, setStudentId] = useState('1')
  const [courseCode, setCourseCode] = useState('CS201')
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  const load = async (e) => {
    e?.preventDefault?.()
    setError(''); setRows([])
    try {
      const { data: res } = await API.get('/enrollments/resolve', { params: { student_id: studentId, course_code: courseCode } })
      const eid = res.enrollment_id
      const { data } = await API.get(`/marks/enrollment/${eid}`)
      setRows(data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load')
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Marks Viewer</h1>
      <form className="flex gap-2" onSubmit={load}>
        <input className="border rounded p-2" value={studentId} onChange={e=>setStudentId(e.target.value)} placeholder="Student ID"/>
        <input className="border rounded p-2" value={courseCode} onChange={e=>setCourseCode(e.target.value)} placeholder="Course Code"/>
        <button className="px-3 py-2 bg-gray-900 text-white rounded">Load</button>
      </form>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr><th className="text-left p-2">Assessment</th><th className="text-left p-2">Score</th><th className="text-left p-2">Max</th><th className="text-left p-2">Date</th></tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} className="border-t">
                <td className="p-2">{r.assessment}</td>
                <td className="p-2">{r.score}</td>
                <td className="p-2">{r.max_score}</td>
                <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
