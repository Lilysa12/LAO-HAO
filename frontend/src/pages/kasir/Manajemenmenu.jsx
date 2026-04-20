import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Manajemenmenu.css';

// --- IMPORT ASSETS ---
import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg'; 
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';

const Manajemenmenu = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Deteksi rute aktif
  const [activeCategory, setActiveCategory] = useState('Semua');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // Helper Fungsi Sidebar (Menghindari Pengulangan Kode)
  const getMenuClass = (path) => location.pathname === path ? "menu-item active" : "menu-item";
  const getIconClass = (path) => location.pathname === path ? "menu-icon-svg" : "menu-icon-svg icon-white";

  // Data dummy
  const menuItems = [
    { id: 1, name: 'Mie Sapi Spesial', price: 'Rp 28.000', category: 'Makanan', status: 'Tersedia', img: '🍜' },
    { id: 2, name: 'Kopi Tarik', price: 'Rp 15.000', category: 'Minuman', status: 'Habis', img: '☕' },
    { id: 3, name: 'Dimsum Ayam', price: 'Rp 18.000', category: 'Snack', status: 'Tersedia', img: '🥟' },
  ];

  return (
    <div className="admin-container">
      {/* --- SIDEBAR (8 MENU LENGKAP & DINAMIS) --- */}
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {/* Wadah Logo Konsisten 160px */}
          <div className="sidebar-logo-container" style={{ width: '100%', padding: '35px 20px 20px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
            <img 
              src={logoLaobanSvg} 
              alt="Logo" 
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

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Cashier Mode / <span className="text-black font-bold">Menu</span></div>
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
              <h1 className="page-title">Manajemen Menu</h1>
              <p className="page-subtitle">Atur ketersediaan menu, harga, dan kategori</p>
            </div>
            <button className="btn-add-menu">+ Tambah Menu Baru</button>
          </div>

          <div className="filter-container">
            {['Semua', 'Makanan', 'Minuman', 'Snack'].map((cat) => (
              <button 
                key={cat} 
                className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="menu-table-container">
            <table className="menu-table">
              <thead>
                <tr>
                  <th>Info Menu</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="menu-info-cell">
                        <div className="menu-img-placeholder">{item.img}</div>
                        <div className="menu-text">
                          <span className="menu-name">{item.name}</span>
                          <span className="menu-id">ID: #{item.id}0023</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="cat-badge">{item.category}</span></td>
                    <td className="price-text">{item.price}</td>
                    <td>
                      <span className={`status-pill ${item.status === 'Habis' ? 'out' : 'available'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit">Edit</button>
                        <button className="btn-delete">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Manajemenmenu;