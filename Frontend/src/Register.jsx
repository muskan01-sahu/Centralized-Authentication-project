import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API } from "./api";
import "./styles.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {

    // Empty fields validation
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      alert("Please enter valid email");
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{6,}$/;

    if (!passwordRegex.test(form.password)) {
      alert(
        "Password must contain:\n" +
        "• Minimum 6 or more characters\n" +
        "• One uppercase letter\n" +
        "• One lowercase letter\n" +
        "• One number\n" +
        "• One special character"
      );
      return;
    }

    // Confirm password validation
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // API call using centralized API
      const data = await API.register(
        form.email,
        form.password,
        form.role
      );

      alert("Registration Successful");
      navigate("/login");

    } catch (error) {
      console.log("Registration Error:", error);
      alert(error.message || "Registration failed");
    }
  };

  return (
    <div className="auth-root">
      <div className="bg-grid"></div>

      <div className="card">
        <h1>
          Create <em>Account</em>
        </h1>

        <p className="subtitle">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

        {/* Name */}
        <div className="field">
          <label>Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="field">
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* Password + Confirm Password */}
        <div className="row2">
          <div className="field">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Role */}
        <div className="role-section">
          <div className="rlabel">Assign Role</div>

          <div className="roles">
            <div
              className={`role-btn ${form.role === "admin" ? "active" : ""
                }`}
              onClick={() =>
                setForm({ ...form, role: "admin" })
              }
            >
              <span className="rname">Admin</span>
              <span className="rdesc">Full access</span>
            </div>

            <div
              className={`role-btn ${form.role === "manager" ? "active" : ""
                }`}
              onClick={() =>
                setForm({ ...form, role: "manager" })
              }
            >
              <span className="rname">Manager</span>
              <span className="rdesc">Read & Write</span>
            </div>

            <div
              className={`role-btn ${form.role === "user" ? "active" : ""
                }`}
              onClick={() =>
                setForm({ ...form, role: "user" })
              }
            >
              <span className="rname">User</span>
              <span className="rdesc">Read Only</span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <label className="terms">
          <input type="checkbox" />

          <span>
            I agree to Terms and Privacy Policy
          </span>
        </label>

        {/* Button */}
        <button className="btn" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;