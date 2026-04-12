import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './OverviewCabang.css';

// --- IMPORT ASSETS (LOGO) ---
import logoLaoban from '../../assets/Icons/icons-customer/logoLaoban.png';

// --- IMPORT ASSETS (SIDEBAR & FILTER ICONS) ---
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconManajemen from '../../assets/Icons/icons-admin/manajemen.svg';
import iconPengaturan from '../../assets/Icons/icons-admin/pengaturan.svg';
import iconKasir from '../../assets/Icons/icons-admin/kasir.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';
import iconPanahBawah from '../../assets/Icons/icons-admin/panahbawah.svg';

// --- IMPORT ASSETS (CARD ICONS) ---
import iconTotal from '../../assets/Icons/icons-admin/total.svg';
import iconCabang from '../../assets/Icons/icons-admin/cabang.svg';
import iconPromosi from '../../assets/Icons/icons-admin/promosi.svg'; 

const OverviewCabang = () => {
  const location = useLocation();
  
  // State untuk mengontrol buka/tutup dropdown filter
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Semua Cabang');

  // Fungsi untuk menangani saat opsi filter dipilih
  const handleSelectFilter = (opsi) => {
    setSelectedFilter(opsi);
    setIsFilterOpen(false); // Tutup dropdown setelah memilih
  };

  // Data Dummy untuk Grafik Recharts
  const dataGrafik = [
    { name: 'Mon', pendapatan: 4000 },
    { name: 'Tue', pendapatan: 3000 },
    { name: 'Wed', pendapatan: 5000 },
    { name: 'Thu', pendapatan: 2780 },
    { name: 'Fri', pendapatan: 6890 },
    { name: 'Sat', pendapatan: 8390 },
    { name: 'Sun', pendapatan: 9490 },
  ];

  // Komponen Custom Tooltip untuk Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px 15px', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#64748b' }}>{label}</p>
          <p style={{ margin: 0, fontSize: '14px', color: '#aa0000', fontWeight: 'bold' }}>
            Pendapatan : Rp {payload[0].value.toLocaleString('id-ID')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="admin-container">
      {/* Sidebar - Merah Marun */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logoLaoban} alt="Laoban Logo" className="logo-circle" />
          <div className="brand-text">
            <h2>LAOBAN</h2>
            <p>BY UNCLE OEH</p>
          </div>
        </div>

        <nav className="sidebar-menu">
          <Link to="/admin" className="menu-item active">
            <img src={iconDashboard} alt="Dashboard" className="menu-icon-svg" />
            Overview Cabang
          </Link>
          <Link to="/admin/laporan-penjualan-pusat" className="menu-item">
            <img src={iconLaporan} alt="Laporan" className="menu-icon-svg icon-white" />
            Laporan Penjualan Pusat
          </Link>
          <Link to="/admin/manajemen-promo" className="menu-item">
            <img src={iconPromosi} alt="Promo" className="menu-icon-svg icon-white" />
            Manajemen Promo
          </Link>
          {/* Ikon Manajemen Staf menggunakan class icon-white agar menjadi putih */}
          <Link to="/admin/manajemen-akun-staf" className="menu-item">
            <img src={iconManajemen} alt="Manajemen Staf" className="menu-icon-svg icon-white" />
            Manajemen Akun Staf
          </Link>
          {/* Ikon Pengaturan menggunakan class icon-white agar menjadi putih */}
          <Link to="/admin/pengaturan" className="menu-item">
            <img src={iconPengaturan} alt="Pengaturan" className="menu-icon-svg icon-white" />
            Pengaturan
          </Link>

          <div className="divider"></div>

          <Link to="/kasir" className="menu-item">
            <img src={iconKasir} alt="Kasir" className="menu-icon-svg icon-white" />
            Kasir / POS Mode
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn">
            <img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" />
            Logout
          </button>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="breadcrumb">
            <span className="text-gray">Super Admin / </span>
            <span className="text-black font-bold">Dashboard</span>
          </div>
          <div className="user-profile">
            <div className="user-info">
              <span className="user-role">Super Admin</span>
              <span className="user-status">Online</span>
            </div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        {/* Isi Konten Overview Cabang */}
        <div className="content-wrapper">
          <div className="dashboard-page">
            <div className="dashboard-header">
              <div>
                <h1 className="page-title">Overview Cabang</h1>
                <p className="page-subtitle">Laporan performa dan pendapatan seluruh cabang Lao-Hao</p>
              </div>
              
              {/* Dropdown Filter Interaktif dengan SVG Panah */}
              <div className="filter-container">
                <button 
                  className="filter-btn" 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  Filter: {selectedFilter} 
                  <img 
                    src={iconPanahBawah} 
                    alt="Panah" 
                    className="filter-icon-svg"
                    style={{ transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} 
                  />
                </button>
                
                {/* Munculkan menu list hanya jika isFilterOpen true */}
                {isFilterOpen && (
                  <div className="filter-dropdown">
                    <div className="filter-option" onClick={() => handleSelectFilter('Semua Cabang')}>
                      Semua Cabang
                    </div>
                    <div className="filter-option" onClick={() => handleSelectFilter('Cabang Tebet')}>
                      Cabang Tebet
                    </div>
                    <div className="filter-option" onClick={() => handleSelectFilter('Cabang Sudirman')}>
                      Cabang Sudirman
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Cards dengan Icon SVG */}
            <div className="summary-cards">
              <div className="card">
                <div className="card-header">
                  <span className="card-label">Total Pendapatan (Bulan Ini)</span>
                  <div className="icon-wrapper">
                    <img src={iconTotal} alt="Total Pendapatan" className="card-icon-svg" />
                  </div>
                </div>
                <h2 className="card-value">Rp 174.000.000</h2>
                <p className="card-desc">Dari 4 Cabang Aktif</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-label">Total Cabang</span>
                  <div className="icon-wrapper">
                    <img src={iconCabang} alt="Total Cabang" className="card-icon-svg" />
                  </div>
                </div>
                <h2 className="card-value">4</h2>
                <p className="card-desc">2 Dalam Pembangunan</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-label">Promo Aktif</span>
                  <div className="icon-wrapper">
                    <img src={iconPromosi} alt="Promo Aktif" className="card-icon-svg" />
                  </div>
                </div>
                <h2 className="card-value">3</h2>
                <p className="card-desc">Berakhir dalam 7 hari</p>
              </div>
            </div>

            {/* Charts & Lists Area */}
            <div className="bottom-section">
              
              {/* Grafik dengan Recharts */}
              <div className="chart-container card">
                <h3 className="section-title">Grafik Pendapatan Gabungan</h3>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dataGrafik}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
                        dy={10} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickFormatter={(value) => `Rp ${value / 1000}k`} 
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
                      <Line 
                        type="monotone" // Membuat garis melengkung (smooth curve)
                        dataKey="pendapatan" 
                        stroke="#aa0000" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#aa0000', strokeWidth: 0 }} 
                        activeDot={{ r: 6, fill: '#ffcc00', stroke: '#aa0000', strokeWidth: 2 }} // Titik kuning saat di hover
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Perbandingan Cabang */}
              <div className="comparison-container card">
                <h3 className="section-title">Perbandingan Cabang</h3>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>CABANG</th>
                      <th className="text-right">PENDAPATAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="cabang-name">Cabang Tebet</div>
                        <div className="cabang-trend positive">+12%</div>
                      </td>
                      <td className="text-right font-bold text-red">Rp 45.000.000</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="cabang-name">Cabang Sudirman</div>
                        <div className="cabang-trend positive">+18%</div>
                      </td>
                      <td className="text-right font-bold text-red">Rp 68.500.000</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="cabang-name">Cabang Kelapa Gading</div>
                        <div className="cabang-trend negative">-5%</div>
                      </td>
                      <td className="text-right font-bold text-red">Rp 32.100.000</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="cabang-name">Cabang Bintaro</div>
                        <div className="cabang-trend positive">+2%</div>
                      </td>
                      <td className="text-right font-bold text-red">Rp 28.400.000</td>
                    </tr>
                  </tbody>
                </table>
                <button className="detail-btn">Lihat Detail {'>'}</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OverviewCabang;