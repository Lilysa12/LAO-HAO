import React, { useState, forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios'; // Import Axios untuk koneksi ke API
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './LaporanPenjualanPusat.css';

import logoLaoban from '../../assets/Icons/icons-customer/logoLaoban.png';
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconManajemen from '../../assets/Icons/icons-admin/manajemen.svg';
import iconPengaturan from '../../assets/Icons/icons-admin/pengaturan.svg';
import iconKasir from '../../assets/Icons/icons-admin/kasir.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';
import iconPromosi from '../../assets/Icons/icons-admin/promosi.svg'; 
import iconPanahBawah from '../../assets/Icons/icons-admin/panahbawah.svg';
import iconKalender from '../../assets/Icons/icons-admin/kalender.svg';
import iconDownload from '../../assets/Icons/icons-admin/download.svg';
import iconTotal from '../../assets/Icons/icons-admin/total.svg';
import iconQr from '../../assets/Icons/icons-admin/qr.svg';
import iconList from '../../assets/Icons/icons-admin/list.svg';

const LaporanPenjualanPusat = () => {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // STATE UNTUK DATA DARI DATABASE (SUPABASE)
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // MENGAMBIL DATA TRANSAKSI DARI BACKEND LARAVEL
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/admin/transactions')
      .then(response => {
        setTransactions(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Gagal mengambil data transaksi:", error);
        setIsLoading(false);
      });
  }, []);

  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <button className="filter-btn" onClick={onClick} ref={ref}>
      <img src={iconKalender} alt="Kalender" className="btn-icon-svg icon-gray" /> 
      {value}
      <img src={iconPanahBawah} alt="Panah" className="btn-icon-svg icon-gray" style={{ width: '12px' }} />
    </button>
  ));

  const dataPenjualan = [
    { name: 'Sen', kasir: 4000, qr: 2500 },
    { name: 'Sel', kasir: 1500, qr: 3000 },
    { name: 'Rab', kasir: 9800, qr: 2000 },
    { name: 'Kam', kasir: 3900, qr: 2800 },
    { name: 'Jum', kasir: 4800, qr: 1800 },
    { name: 'Sab', kasir: 3800, qr: 2400 },
    { name: 'Min', kasir: 4300, qr: 3500 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-data text-red">Kasir : {payload[0].value}</p>
          <p className="tooltip-data text-yellow">QR Code : {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

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
          <Link to="/admin" className="menu-item">
            <img src={iconDashboard} alt="Dashboard" className="menu-icon-svg icon-white" />
            Overview Cabang
          </Link>
          <Link to="/admin/laporan-penjualan-pusat" className="menu-item active">
            <img src={iconLaporan} alt="Laporan" className="menu-icon-svg" />
            Laporan Penjualan Pusat
          </Link>
          <Link to="/admin/manajemen-promo" className="menu-item">
            <img src={iconPromosi} alt="Promo" className="menu-icon-svg icon-white" />
            Manajemen Promo
          </Link>
          <Link to="/admin/manajemen-akun-staf" className="menu-item">
            <img src={iconManajemen} alt="Manajemen Staf" className="menu-icon-svg icon-white" />
            Manajemen Akun Staf
          </Link>
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

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="text-gray">Super Admin / </span>
            <span className="text-black font-bold">Reports</span>
          </div>
          <div className="user-profile">
            <div className="user-info">
              <span className="user-role">Super Admin</span>
              <span className="user-status">Online</span>
            </div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="dashboard-page">
            
            <div className="dashboard-header">
              <div>
                <h1 className="page-title">Laporan Penjualan</h1>
                <p className="page-subtitle">Ringkasan pendapatan dan detail transaksi restoran</p>
              </div>
              <div className="action-buttons">
                <div className="date-picker-wrapper">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd MMMM yyyy"
                    customInput={<CustomDateInput />}
                  />
                </div>
                <button className="export-btn">
                  <img src={iconDownload} alt="Export" className="btn-icon-svg icon-white" /> 
                  Export Laporan
                </button>
              </div>
            </div>

            <div className="summary-cards reports-cards">
              <div className="card">
                <div className="card-header">
                  <div className="icon-wrapper text-red"><img src={iconTotal} className="card-icon-svg icon-red" alt="Total" /></div>
                  <span className="trend positive">+15.2%</span>
                </div>
                <span className="card-label">Total Pendapatan</span>
                <h2 className="card-value">Rp 24.500.000</h2>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="icon-wrapper text-red"><img src={iconKasir} className="card-icon-svg icon-red" alt="Kasir" /></div>
                  <span className="trend positive">+5.4%</span>
                </div>
                <span className="card-label">Pendapatan Kasir</span>
                <h2 className="card-value">Rp 15.200.000</h2>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="icon-wrapper text-red"><img src={iconQr} className="card-icon-svg icon-red" alt="QR" /></div>
                  <span className="trend positive">+24.1%</span>
                </div>
                <span className="card-label">Pendapatan QR Code</span>
                <h2 className="card-value">Rp 9.300.000</h2>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="icon-wrapper text-red"><img src={iconList} className="card-icon-svg icon-red" alt="List" /></div>
                  <span className="trend positive">+12%</span>
                </div>
                <span className="card-label">Total Transaksi</span>
                <h2 className="card-value">1,245</h2>
              </div>
            </div>

            <div className="chart-container card mb-6">
              <h3 className="section-title">Grafik Penjualan (Minggu Ini)</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataPenjualan} margin={{ top: 20, right: 30, left: -20, bottom: 5 }} barGap={0}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="kasir" fill="#a00000" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="qr" fill="#ffcc00" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="transaction-container card">
              <div className="table-header-row">
                <h3 className="section-title">Detail Transaksi Terakhir</h3>
                <button className="view-all-btn">Lihat Semua</button>
              </div>
              
              {/* RENDER DATA DARI DATABASE */}
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Memuat data transaksi dari Supabase...</div>
              ) : (
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>NO. INVOICE</th>
                      <th>WAKTU</th>
                      <th>PELANGGAN</th>
                      <th>METODE</th>
                      <th>TOTAL</th>
                      <th className="text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((row) => (
                      <tr key={row.id}>
                        <td className="font-bold text-black">{row.inv}</td>
                        <td>{row.time}</td>
                        <td>{row.user}</td>
                        <td>{row.method}</td>
                        <td className="font-bold text-red">{row.total}</td>
                        <td className="text-center">
                          <span className={`badge ${row.status === 'BERHASIL' ? 'badge-success' : 'badge-danger'}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LaporanPenjualanPusat;