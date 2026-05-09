import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./styles.css";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="protected-loading">
        <div className="protected-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in
  return children;
}