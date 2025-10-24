import { useState } from 'react'
import API from '../api'

export default function FacultyAddMarks(){
  const [studentId, setStudentId] = useState('1')
  const [courseCode, setCourseCode] = useState('CS201')
  const [assessment, setAssessment] = useState('Midterm')
  const [score, setScore] = useState('50')
  const [maxScore, setMaxScore] = useState('100')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setMsg(''); setErr('')
    try {
      const { data: res } = await API.get('/enrollments/resolve', { params: { student_id: studentId, course_code: courseCode } })
      const eid = res.enrollment_id
      await API.post('/marks', { enrollment_id: eid, assessment, score: Number(score), max_score: Number(maxScore) })
      setMsg('Saved')
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to save')
    }
  }

  return (
    <div className="max-w-md p-4 bg-white rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-3">Add Marks</h1>
      <form className="space-y-3" onSubmit={submit}>
        <input className="w-full border rounded p-2" value={studentId} onChange={e=>setStudentId(e.target.value)} placeholder="Student ID"/>
        <input className="w-full border rounded p-2" value={courseCode} onChange={e=>setCourseCode(e.target.value)} placeholder="Course Code"/>
        <input className="w-full border rounded p-2" value={assessment} onChange={e=>setAssessment(e.target.value)} placeholder="Assessment"/>
        <input className="w-full border rounded p-2" value={score} onChange={e=>setScore(e.target.value)} placeholder="Score"/>
        <input className="w-full border rounded p-2" value={maxScore} onChange={e=>setMaxScore(e.target.value)} placeholder="Max Score"/>
        <button className="w-full bg-gray-900 text-white rounded p-2">Save</button>
        {msg && <div className="text-green-700">{msg}</div>}
        {err && <div className="text-red-700">{err}</div>}
      </form>
    </div>
  )
}
