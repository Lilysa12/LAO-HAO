import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

import logoLaoban from "../../assets/Icons/icons-customer/logoLaoban.png";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.post(
        "/api/login",
        {
          email: username,
          password: password,
        }
      );

      const user = response.data.user;

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("branchId", user.branch_id ?? "");
      localStorage.setItem("branchName", user.branch_name ?? "");

      switch (user.role) {
  case "SUPER ADMIN":
    navigate("/admin");
    break;

  case "KASIR":
    navigate("/kasir");
    break;

  default:
    navigate("/login");
}
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login gagal. Periksa email dan password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-left-content">
          <h1>Lao-Hao Management System</h1>
          <p>Streamlined F&B Operations.</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <div className="login-header">
            <img
              src={logoLaoban}
              alt="Laoban Logo"
              className="login-logo"
            />
            <h2>Selamat Datang Kembali</h2>
            <p>Masuk ke akun Lao-Hao Anda untuk melanjutkan</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>EMAIL</label>

              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>

                <input
                  type="email"
                  placeholder="Masukkan email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>PASSWORD</label>

              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>

                <input
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Login"}
            </button>
          </form>

          <div className="login-footer">
            <p>© 2026 Lao-Hao. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;