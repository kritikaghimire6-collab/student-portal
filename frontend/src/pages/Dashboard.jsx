import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'
import { useAuth } from '../store/authContext'

export default function Dashboard(){
  const { user } = useAuth()
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const run = async () => {
      if (!user || user.role !== 'STUDENT') return
      try {
        const { data: me } = await API.get('/students/me')
        const { data } = await API.get(`/enrollments/student/${me.id}`)
        setCourses(data)
      } catch (e) {
        console.error(e?.response?.data || e.message)
      }
    }
    run()
  }, [user])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome, {user?.full_name}</h1>

      {user?.role==='STUDENT' && (
        <div>
          <h2 className="font-medium mb-2">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {courses.map(c => (
              <div key={c.enrollment_id} className="p-4 bg-white rounded-xl shadow">
                <div className="font-semibold">{c.code} · {c.title}</div>
                <div className="text-sm text-gray-600">{c.credit} credits</div>
                <div className="mt-2 flex gap-2">
                  <Link to="/attendance" state={{ enrollment: c }} className="text-sm px-3 py-1 bg-gray-900 text-white rounded">Attendance</Link>
                  <Link to="/marks" state={{ enrollment: c }} className="text-sm px-3 py-1 bg-gray-200 rounded">Marks</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {user?.role==='ADMIN' && (
        <div className="flex gap-3 flex-wrap">
          <Link to="/admin/users" className="px-4 py-2 rounded bg-gray-900 text-white">Manage Users</Link>
          <Link to="/admin/courses" className="px-4 py-2 rounded bg-gray-200">Manage Courses</Link>
          <Link to="/attendance/viewer" className="px-4 py-2 rounded bg-gray-200">View Attendance</Link>
          <Link to="/marks/viewer" className="px-4 py-2 rounded bg-gray-200">View Marks</Link>
          <Link to="/reports" className="px-4 py-2 rounded bg-gray-200">Reports</Link>
        </div>
      )}

      {user?.role==='FACULTY' && (
        <div className="flex gap-3 flex-wrap">
          <Link to="/faculty/take-attendance" className="px-4 py-2 rounded bg-gray-900 text-white">Take Attendance</Link>
          <Link to="/attendance/viewer" className="px-4 py-2 rounded bg-gray-200">View Attendance</Link>
          <Link to="/faculty/add-marks" className="px-4 py-2 rounded bg-gray-200">Add Marks</Link>
          <Link to="/marks/viewer" className="px-4 py-2 rounded bg-gray-200">View Marks</Link>
          <Link to="/reports" className="px-4 py-2 rounded bg-gray-200">Reports</Link>
        </div>
      )}

      {user?.role==='PARENT' && (
        <div className="flex gap-3 flex-wrap">
          <Link to="/parent" className="px-4 py-2 rounded bg-gray-900 text-white">Parent Portal</Link>
        </div>
      )}
    </div>
  )
}
