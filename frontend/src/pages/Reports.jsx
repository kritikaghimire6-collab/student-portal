import { useEffect, useState } from 'react'
import API from '../api'

export default function Reports(){
  const [threshold, setThreshold] = useState(75)
  const [courseCode, setCourseCode] = useState('')
  const [courses, setCourses] = useState([])
  const [atRisk, setAtRisk] = useState([])
  const [trend, setTrend] = useState([])

  useEffect(() => { (async()=>{
    const { data } = await API.get('/courses')
    setCourses(data)
  })() }, [])

  const loadAtRisk = async () => {
    const { data } = await API.get('/reports/at-risk', { params: { threshold, course_code: courseCode || undefined } })
    setAtRisk(data)
  }

  const loadTrend = async () => {
    if (!courseCode) return setTrend([])
    const { data } = await API.get('/reports/attendance-trend', { params: { course_code: courseCode, weeks: 8 } })
    setTrend(data)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div className="grid gap-3 md:grid-cols-4 bg-white p-4 rounded-xl shadow">
        <label className="block">
          <span className="text-sm text-gray-700">Threshold (%)</span>
          <input className="mt-1 w-full border rounded p-2" type="number" value={threshold} onChange={e=>setThreshold(e.target.value)} />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm text-gray-700">Course (optional)</span>
          <select className="mt-1 w-full border rounded p-2" value={courseCode} onChange={e=>setCourseCode(e.target.value)}>
            <option value="">All courses</option>
            {courses.map(c=> <option key={c.id} value={c.code}>{c.code} · {c.title}</option>)}
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-900 text-white" onClick={loadAtRisk}>At-Risk</button>
          <button className="px-4 py-2 rounded bg-gray-200" onClick={loadTrend}>Trend</button>
        </div>
      </div>

      {atRisk.length>0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-4 py-2 font-medium border-b">At-Risk Students (attendance &lt; {threshold}%)</div>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr><th className="p-2 text-left">Roll No</th><th className="p-2 text-left">Course</th><th className="p-2 text-left">Presents</th><th className="p-2 text-left">Total</th><th className="p-2 text-left">%</th></tr>
            </thead>
            <tbody>{atRisk.map((r,i)=>(
              <tr key={i} className="border-t">
                <td className="p-2">{r.roll_no}</td>
                <td className="p-2">{r.course_code}</td>
                <td className="p-2">{r.presents}</td>
                <td className="p-2">{r.total}</td>
                <td className="p-2">{r.pct}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {trend.length>0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-4 py-2 font-medium border-b">Attendance Trend · {courseCode}</div>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr><th className="p-2 text-left">YearWeek</th><th className="p-2 text-left">Presents</th><th className="p-2 text-left">Total</th></tr>
            </thead>
            <tbody>{trend.map((t,i)=>(
              <tr key={i} className="border-t">
                <td className="p-2">{t.yearweek}</td>
                <td className="p-2">{t.presents}</td>
                <td className="p-2">{t.total}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
