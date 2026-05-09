import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const roleColors = {
  admin: "admin",
  manager: "manager",
  user: "user",
};

export default function Navbar() {
  const { user, permissions, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const role = user?.roles?.[0] || "user";

  return (
    <nav className="navbar">

      {/* Left */}
      <div className="navbar-logo">
        <div className="logo-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span className="logo-text">
          Auth<span>RBAC</span>
        </span>
      </div>

      {/* Center */}
      {/* <div className="permissions-row">
        <span className="permissions-label">
          Your permissions:
        </span>

        {permissions.map((p) => (
          <span key={p} className="permission-tag">
            {p}
          </span>
        ))}

        {permissions.length === 0 && (
          <span className="no-permission">
            none
          </span>
        )}
      </div> */}
      <div>
        
      </div>

      {/* Right */}
      <div className="navbar-right">

        <div className="user-info">
          <span className="user-email">
            {user?.email}
          </span>

          <span className={`role-badge ${roleColors[role]}`}>
            {role}
          </span>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}