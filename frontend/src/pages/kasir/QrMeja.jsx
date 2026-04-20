import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './QrMeja.css';

// --- IMPORT ASSETS ---
import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg'; 
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';

const QrMeja = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Deteksi rute aktif
  const [activeTab, setActiveTab] = useState('Semua Meja');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputMeja, setInputMeja] = useState('');

  // FIX: Mengunci scroll layar belakang saat modal terbuka
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Helper Sidebar Class
  const getMenuClass = (path) => location.pathname === path ? "menu-item active" : "menu-item";
  const getIconClass = (path) => location.pathname === path ? "menu-icon-svg" : "menu-icon-svg icon-white";

  const tables = [
    { id: '01', capacity: '2 Orang', status: 'AKTIF' },
    { id: '02', capacity: '2 Orang', status: 'AKTIF' },
    { id: '03', capacity: '4 Orang', status: 'AKTIF' },
    { id: '04', capacity: '4 Orang', status: 'NONAKTIF' },
    { id: '05', capacity: '6 Orang', status: 'AKTIF' },
    { id: 'VIP-1', capacity: '8 Orang', status: 'AKTIF' },
  ];

  return (
    <div className="admin-container">
      {/* --- SIDEBAR KONSISTEN (8 MENU LENGKAP) --- */}
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {/* Wadah Logo Konsisten 160px */}
          <div className="sidebar-logo-container" style={{ width: '100%', padding: '35px 20px 20px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
            <img 
              src={logoLaobanSvg} 
              alt="Logo Laoban" 
              style={{ width: '100%', maxWidth: '160px', height: 'auto', display: 'block' }} 
            />
          </div>

          <nav className="sidebar-menu" style={{ marginTop: '0px', paddingTop: '10px' }}>
            <Link to="/kasir" className={getMenuClass('/kasir')}>
              <img src={iconDashboard} alt="Denah" className={getIconClass('/kasir')} /> Denah Meja
            </Link>
            <Link to="/kasir/pos" className={getMenuClass('/kasir/pos')}>
              <img src={iconPos} alt="POS" className={getIconClass('/kasir/pos')} /> Kasir / POS
            </Link>
            <Link to="/kasir/pesanan" className={getMenuClass('/kasir/pesanan')}>
              <img src={iconPesananDapur} alt="Pesanan" className={getIconClass('/kasir/pesanan')} /> Pesanan Dapur
            </Link>
            <Link to="/kasir/manajemen-menu" className={getMenuClass('/kasir/manajemen-menu')}>
              <img src={iconStok} alt="Menu" className={getIconClass('/kasir/manajemen-menu')} /> Manajemen Menu
            </Link>
            <Link to="/kasir/stok" className={getMenuClass('/kasir/stok')}>
              <img src={iconStok} alt="Stok" className={getIconClass('/kasir/stok')} /> Stok Bahan Baku
            </Link>
            <Link to="/kasir/laporan" className={getMenuClass('/kasir/laporan')}>
              <img src={iconLaporan} alt="Laporan" className={getIconClass('/kasir/laporan')} /> Laporan & Riwayat
            </Link>
            <Link to="/kasir/qr-meja" className={getMenuClass('/kasir/qr-meja')}>
              <img src={iconQrMeja} alt="QR" className={getIconClass('/kasir/qr-meja')} /> QR Code Meja
            </Link>

            <div className="divider" style={{ margin: '15px 16px', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>

            <Link to="/admin" className="menu-item">
              <img src={iconDashboard} alt="Admin" className="menu-icon-svg icon-white" /> Kembali ke Pusat
            </Link>
          </nav>
        </div>

        <div className="sidebar-footer" style={{ padding: '20px' }}>
          <button className="logout-btn" onClick={handleLogout} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: 'white' }}>
            <img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Cashier Mode / <span className="text-black font-bold">Qr Meja</span></div>
          <div className="user-profile">
            <div className="user-info">
                <span className="user-role">Cashier 01</span>
                <span className="user-status">Online</span>
            </div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">QR Code Meja</h1>
              <p className="page-subtitle">Kelola meja dan cetak QR Code untuk self-ordering</p>
            </div>
            <button className="btn-generate-main" onClick={() => setIsModalOpen(true)}>
              + Generate QR Baru
            </button>
          </div>

          <div className="qr-filter-container">
            <button className={`filter-tab ${activeTab === 'Semua Meja' ? 'active' : ''}`} onClick={() => setActiveTab('Semua Meja')}>Semua Meja</button>
            <button className={`filter-tab ${activeTab === 'Aktif' ? 'active' : ''}`} onClick={() => setActiveTab('Aktif')}>Aktif</button>
            <button className={`filter-tab ${activeTab === 'Nonaktif' ? 'active' : ''}`} onClick={() => setActiveTab('Nonaktif')}>Nonaktif</button>
          </div>

          <div className="qr-grid">
            {tables.map((table) => (
              <div key={table.id} className={`qr-card ${table.status === 'NONAKTIF' ? 'nonaktif' : ''}`}>
                <div className="qr-card-header">
                  <span className="status-label">{table.status}</span>
                  <span className="cap-info">👥 {table.capacity}</span>
                </div>
                <div className="qr-frame-box">
                  <svg className="qr-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M7 7h3v3H7V7zm7 0h3v3h-3V7zm0 7h3v3h-3v-3zM7 14h3v3H7v-3z"/>
                  </svg>
                  {table.status === 'NONAKTIF' && <div className="badge-nonaktif">NONAKTIF</div>}
                </div>
                <div className="qr-card-footer">
                  <h3 className="qr-table-num">MEJA {table.id}</h3>
                  <p className="qr-table-link">laohao.com/order/t/{table.id.toLowerCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="qr-modal">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            <div className="modal-scroll-area">
              <div className="modal-body text-center">
                <p className="modal-desc">QR Code ini dapat digunakan pelanggan untuk memindai dan memesan langsung.</p>
                <div className="qr-preview-box">
                   <svg viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="1" width="80">
                     <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M7 7h3v3H7V7zm7 0h3v3h-3V7zm0 7h3v3h-3v-3zM7 14h3v3H7v-3z"/>
                   </svg>
                   <span className="preview-label">PREVIEW</span>
                </div>
                <h2 className="preview-name">{inputMeja || 'NAMA MEJA'}</h2>
                <div className="input-group-left">
                  <label>NOMOR / NAMA MEJA</label>
                  <input 
                    type="text" 
                    className="modal-input" 
                    placeholder="EX: MEJA 14 OUTDOOR" 
                    value={inputMeja}
                    onChange={(e) => setInputMeja(e.target.value.toUpperCase())}
                  />
                </div>
              </div>
              <div className="modal-footer-centered">
                <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button className="btn-generate-pdf">Generate & Unduh PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrMeja;