import { Navigate } from "react-router-dom";
import { useAuth } from "../store/authContext";

export default function Protected({ children, allow }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
