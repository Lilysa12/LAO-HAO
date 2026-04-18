import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DenahMeja.css';

import logoLaoban from '../../assets/Icons/icons-customer/logoLaoban.png';
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';

const DenahMeja = () => {
  const navigate = useNavigate();
  const [activeArea, setActiveArea] = useState('indoor');
  
  // STATE UNTUK DATA ASLI DARI SUPABASE
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // MENGAMBIL DATA MEJA
  const fetchTables = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/kasir/tables?_t=${new Date().getTime()}`);
      setTables(response.data);
    } catch (error) {
      console.error("Gagal mengambil data meja:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // MEMISAHKAN DATA BERDASARKAN AREA
  const tablesIndoor = tables.filter(t => t.area === 'indoor');
  const tablesOutdoor = tables.filter(t => t.area === 'outdoor');
  
  const currentTables = activeArea === 'indoor' ? tablesIndoor : tablesOutdoor;

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logoLaoban} alt="Laoban Logo" className="logo-circle" />
          <div className="brand-text">
            <h2>LAOBAN</h2>
            <p>BY UNCLE OEH</p>
          </div>
        </div>

        <nav className="sidebar-menu">
          <Link to="/kasir" className="menu-item active">
            <img src={iconDashboard} alt="Denah" className="menu-icon-svg" />
            Denah Meja
          </Link>
          <Link to="/kasir/pos" className="menu-item">
            <img src={iconPos} alt="POS" className="menu-icon-svg icon-white" />
            Kasir / POS
          </Link>
          <Link to="/kasir/pesanan" className="menu-item">
            <img src={iconPesananDapur} alt="Pesanan" className="menu-icon-svg icon-white" />
            Pesanan Dapur
          </Link>
          <Link to="/kasir/stok" className="menu-item">
            <img src={iconStok} alt="Stok" className="menu-icon-svg icon-white" />
            Stok & Menu
          </Link>
          <Link to="/kasir/laporan" className="menu-item">
            <img src={iconLaporan} alt="Laporan" className="menu-icon-svg icon-white" />
            Laporan & Riwayat
          </Link>
          <Link to="/kasir/qr" className="menu-item">
            <img src={iconQrMeja} alt="QR" className="menu-icon-svg icon-white" />
            QR Code Meja
          </Link>

          <div className="divider"></div>

          <Link to="/admin" className="menu-item">
            <img src={iconDashboard} alt="Admin" className="menu-icon-svg icon-white" />
            Kembali ke Pusat
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="text-gray">Cashier Mode / </span>
            <span className="text-black font-bold">Tables</span>
          </div>
          <div className="user-profile">
            <div className="user-info">
              <span className="user-role">Cashier 01</span>
              <span className="user-status">Online</span>
            </div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="dashboard-page">
            <div className="dashboard-header">
              <div>
                <h1 className="page-title">Denah Meja</h1>
                <p className="page-subtitle">Manajemen ketersediaan meja cabang</p>
              </div>
            </div>

            <div className="area-tabs">
              <button 
                className={`tab-btn ${activeArea === 'indoor' ? 'active' : ''}`}
                onClick={() => setActiveArea('indoor')}
              >
                Area Indoor
              </button>
              <button 
                className={`tab-btn ${activeArea === 'outdoor' ? 'active' : ''}`}
                onClick={() => setActiveArea('outdoor')}
              >
                Area Outdoor
              </button>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Memuat status meja dari Supabase...</div>
            ) : (
              <div className="tables-grid">
                {currentTables.length > 0 ? (
                  currentTables.map((table) => (
                    <div key={table.id} className={`table-card ${table.status}`}>
                      <div className="table-card-top">
                        <span className="table-status-label">
                          {table.status === 'tersedia' && 'Tersedia'}
                          {table.status === 'lunas' && 'Dine-in (Lunas)'}
                          {table.status === 'pending' && 'Open Table (Belum Bayar)'}
                        </span>
                        <div className="table-capacity">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          {table.capacity}
                        </div>
                      </div>
                      <h1 className="table-number">{table.table_number}</h1>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', color: '#64748b' }}>Belum ada meja di area ini.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DenahMeja;