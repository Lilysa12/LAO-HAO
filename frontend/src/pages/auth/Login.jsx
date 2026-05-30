import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

import logoLaoban from '../../assets/Icons/icons-customer/logoLaoban.png';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // --- SIMULASI PENGECEKAN ROLE (Bisa diganti fetch API Backend nanti) ---
    const userRoleLower = username.toLowerCase();

    if (userRoleLower === 'admin') {
      // SET SESI SUPER ADMIN
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'SUPER ADMIN');
      navigate('/admin'); // Arahkan ke halaman Admin
      
    } else if (userRoleLower === 'kasir') {
      // SET SESI KASIR
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'KASIR');
      navigate('/kasir'); // Arahkan ke halaman Kasir
      
    } else {
      // GAGAL LOGIN
      alert('Username tidak ditemukan! Coba gunakan "admin" atau "kasir".');
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
            <img src={logoLaoban} alt="Laoban Logo" className="login-logo" />
            <h2>Selamat Datang Kembali</h2>
            <p>Masuk ke akun Lao-Hao Anda untuk melanjutkan</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>USERNAME</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input 
                  type="text" 
                  placeholder="Ketik 'admin' atau 'kasir'" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label>PASSWORD</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input 
                  type="password" 
                  placeholder="Masukkan password bebas" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="login-btn">Login</button>
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