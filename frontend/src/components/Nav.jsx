import { Link } from 'react-router-dom'
import { useAuth } from '../store/authContext'
import { useState } from 'react'

export default function Nav(){
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">Student Portal</Link>

        {user ? (
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-1 rounded bg-gray-900 text-white"
              onClick={()=>setOpen(o=>!o)}
            >
              <span className="text-sm">{user.full_name}</span>
              <span className="text-xs opacity-80">({user.role})</span>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M5.25 7.5 10 12.25 14.75 7.5H5.25Z"/></svg>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow z-20 overflow-hidden">
                <div className="px-3 py-2 text-xs text-gray-600 border-b">Quick Actions</div>

                {user.role === 'ADMIN' && (
                  <div className="py-1">
                    <Link className="block px-3 py-2 hover:bg-gray-50" to="/admin/users" onClick={()=>setOpen(false)}>Manage Users</Link>
                    <Link className="block px-3 py-2 hover:bg-gray-50" to="/admin/courses" onClick={()=>setOpen(false)}>Manage Courses</Link>
                    <Link className="block px-3 py-2 hover:bg-gray-50" to="/attendance/viewer" onClick={()=>setOpen(false)}>View Attendance</Link>
                    <Link className="block px-3 py-2 hover:bg-gray-50" to="/marks/viewer" onClick={()=>setOpen(false)}>View Marks</Link>
                    <Link className="block px-3 py-2 hover:bg-gray-50" to="/reports" onClick={()=>setOpen(false)}>Reports</Link>
                  </div>
                )}

                {user.role === 'FACULTY' && (
                  <div className="py-1">
                    <Link className="block px-3 py-2 hover:bg-gray-50" to="/faculty/take-attendance" onClick={()=>setOpen(false)}>Take Attendance</Link>
                    <Link className="block px-3 py-2 hover:bg-gray-50" to="/attendance/viewer" onClick={()=>setOpen(false)}>View Attendance</Link>
                    <Link className="block px-3 py-2 hover:bg-gray-50" to="/faculty/add-marks" onClick={()=>setOpen(false)}>Add Marks</Link>
                    <Link className="block px-3 py-2 hover:bg-gray-50" to="/marks/viewer" onClick={()=>setOpen(false)}>View Marks</Link>
                    <Link className="block px-3 py-2 hover:bg-gray-50" to="/reports" onClick={()=>setOpen(false)}>Reports</Link>
                  </div>
                )}

                {user.role === 'PARENT' && (
                  <div className="py-1">
                    <Link className="block px-3 py-2 hover:bg-gray-50" to="/parent" onClick={()=>setOpen(false)}>Parent Portal</Link>
                  </div>
                )}

                {user.role === 'STUDENT' && (
                  <div className="py-1">
                    <Link className="block px-3 py-2 hover:bg-gray-50" to="/" onClick={()=>setOpen(false)}>My Dashboard</Link>
                  </div>
                )}

                <div className="border-t">
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={logout}>Logout</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link className="px-3 py-1 bg-gray-900 text-white rounded" to="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}
