import { useEffect, useState } from 'react'
import API from '../api'

export default function ParentPortal(){
  const [children, setChildren] = useState([])
  const [selected, setSelected] = useState('')
  const [attendance, setAttendance] = useState([])
  const [marks, setMarks] = useState([])

  useEffect(()=>{ (async ()=>{
    const { data } = await API.get('/parents/children')
    setChildren(data)
    if (data.length) setSelected(String(data[0].id))
  })() }, [])

  useEffect(()=>{ (async ()=>{
    if (!selected) return
    const [a, m] = await Promise.all([
      API.get(`/parents/children/${selected}/attendance-summary`),
      API.get(`/parents/children/${selected}/marks`)
    ])
    setAttendance(a.data); setMarks(m.data)
  })() }, [selected])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Parent Portal</h1>

      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <label>
          <span className="text-sm text-gray-700">Child</span>
          <select className="ml-2 border rounded p-2" value={selected} onChange={e=>setSelected(e.target.value)}>
            {children.map(c=> <option key={c.id} value={c.id}>{c.roll_no} · {c.program}</option>)}
          </select>
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-4 py-2 font-medium border-b">Attendance Summary</div>
          <table className="w-full">
            <thead className="bg-gray-100"><tr><th className="p-2 text-left">Course</th><th className="p-2 text-left">Presents/Total</th></tr></thead>
            <tbody>
              {attendance.map((r,i)=>(
                <tr key={i} className="border-t">
                  <td className="p-2">{r.course_code}</td>
                  <td className="p-2">{r.presents ?? 0} / {r.total ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-4 py-2 font-medium border-b">Marks</div>
          <table className="w-full">
            <thead className="bg-gray-100"><tr><th className="p-2 text-left">Course</th><th className="p-2 text-left">Assessment</th><th className="p-2 text-left">Score</th><th className="p-2 text-left">Date</th></tr></thead>
            <tbody>
              {marks.map((m,i)=>(
                <tr key={i} className="border-t">
                  <td className="p-2">{m.code}</td>
                  <td className="p-2">{m.assessment}</td>
                  <td className="p-2">{m.score}/{m.max_score}</td>
                  <td className="p-2">{new Date(m.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
