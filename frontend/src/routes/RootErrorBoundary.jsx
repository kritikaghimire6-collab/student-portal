import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export default function RootErrorBoundary(){
  const error = useRouteError()
  const msg = isRouteErrorResponse(error) ? (error.status + ' ' + error.statusText) : (error?.message || 'Something went wrong')
  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-white rounded-xl shadow text-center space-y-4">
      <h1 className="text-2xl font-semibold">Unexpected Application Error</h1>
      <div className="text-gray-700">{msg}</div>
      <Link to="/" className="inline-block px-4 py-2 rounded bg-gray-900 text-white">Go Home</Link>
    </div>
  )
}
