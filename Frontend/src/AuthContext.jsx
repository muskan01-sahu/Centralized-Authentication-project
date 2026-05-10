import { createContext, useContext, useState, useEffect } from "react";
import { API, decodeToken } from "./api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [token, setToken]             = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading]         = useState(true); // checking stored token

  // On app load: restore session from localStorage 
  useEffect(() => {
    const stored = localStorage.getItem("accessToken");
    if (stored) {
      const decoded = decodeToken(stored);
      // Check token hasn't expired
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setToken(stored);
        setUser({
          id:          decoded.sub,
          email:       decoded.email,
          permissions: decoded.permissions || [],
        });
        setPermissions(decoded.permissions || []);
      } else {
        // Token expired — clear it
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    const result = await API.login(email, password);
    // result = { accessToken, user: { id, email, roles, permissions } }

    localStorage.setItem("accessToken",  result.accessToken);
    if (result.refreshToken) {
      localStorage.setItem("refreshToken", result.refreshToken);
    }

    const decoded = decodeToken(result.accessToken);
    setToken(result.accessToken);
    setUser(result.user);
    setPermissions(decoded?.permissions || result.user.permissions || []);

    return result;
  };

  // Logout
  const logout = async () => {
    try { await API.logout(); } catch { 
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setUser(null);
    setPermissions([]);
  };

  // Permission check helper
  const can = (permission) => permissions.includes(permission);

  return (
    <AuthContext.Provider value={{ user, token, permissions, loading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};