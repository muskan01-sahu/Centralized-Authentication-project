import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./styles.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    // Validation
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter valid email");
      return;
    }

    try {
      setLoading(true);

      await login(email, password);

      navigate("/orders");

    } catch (err) {
      setError(err.message || "Login failed");

    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-page">

      <div className="bg-grid"></div>

      <div className="login-card">

        <h1>
          Welcome <span>Back</span>
        </h1>

        <p className="subtitle">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>

        {/* Error */}
        {error && (
          <div className="error-box">
            ⚠ {error}
          </div>
        )}

        {/* Email */}
        <div className="field">
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Password */}
        <div className="field">
          <label>Password</label>

          <input
            type="text"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Button */}
        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

      </div>
    </div>
  );
}