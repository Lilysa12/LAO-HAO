import React, { useState, forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './LaporanPenjualanPusat.css';

// --- IMPORT ASSETS (SESUAI STANDAR LOGO FIX) ---
import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg'; 
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
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({ totalPendapatan: 0, pendapatanKasir: 0, pendapatanQr: 0, totalTransaksi: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://127.0.0.1:8000/api/admin/transactions?_t=${new Date().getTime()}`)
      .then(response => {
        setAllTransactions(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Gagal mengambil data transaksi:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (allTransactions.length === 0) return;
    const monthsMap = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5, 'Jul': 6, 'Agt': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11 };
    const dayIndexMap = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };
    const targetMonth = selectedDate.getMonth();
    const targetYear = selectedDate.getFullYear();

    const filteredTrx = allTransactions.filter(trx => {
      const parts = trx.time.split(' ');
      if (parts.length >= 3) {
        const trxMonth = monthsMap[parts[1]];
        const trxYear = parseInt(parts[2].replace(',', ''), 10);
        return trxMonth === targetMonth && trxYear === targetYear;
      }
      return false;
    });

    setFilteredTransactions(filteredTrx);

    let tPendapatan = 0, pKasir = 0, pQr = 0, tTransaksi = filteredTrx.length;
    const newChartData = [
      { name: 'Sen', kasir: 0, qr: 0 }, { name: 'Sel', kasir: 0, qr: 0 }, { name: 'Rab', kasir: 0, qr: 0 },
      { name: 'Kam', kasir: 0, qr: 0 }, { name: 'Jum', kasir: 0, qr: 0 }, { name: 'Sab', kasir: 0, qr: 0 },
      { name: 'Min', kasir: 0, qr: 0 }
    ];

    filteredTrx.forEach(trx => {
      if (trx.status === 'BERHASIL') {
        const amount = parseInt(trx.total.replace(/[^0-9]/g, ''), 10) || 0;
        tPendapatan += amount;
        if (trx.method === 'QRIS') { pQr += amount; } else { pKasir += amount; }
        const parts = trx.time.split(' '); 
        const day = parts[0].padStart(2, '0'); 
        const monthStr = monthsMap[parts[1]] + 1;
        const monthPad = monthStr.toString().padStart(2, '0');
        const year = parts[2].replace(',', '');
        const dateObj = new Date(`${year}-${monthPad}-${day}`);
        if(!isNaN(dateObj)) {
          const jsDay = dateObj.getDay();
          const targetIndex = dayIndexMap[jsDay];
          if (trx.method === 'QRIS') { newChartData[targetIndex].qr += amount; } 
          else { newChartData[targetIndex].kasir += amount; }
        }
      }
    });

    setSummary({ totalPendapatan: tPendapatan, pendapatanKasir: pKasir, pendapatanQr: pQr, totalTransaksi: tTransaksi });
    setChartData(newChartData);
  }, [allTransactions, selectedDate]);

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) { alert("Tidak ada data untuk diexport."); return; }
    let csvContent = "NO. INVOICE,WAKTU,PELANGGAN,METODE,TOTAL,STATUS\n";
    filteredTransactions.forEach(row => {
      const cleanTotal = row.total.replace(/,/g, '');
      csvContent += `${row.inv},"${row.time}","${row.user}",${row.method},${cleanTotal},${row.status}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const monthName = selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Penjualan_Laoban_${monthName.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <button className="filter-btn" onClick={onClick} ref={ref}>
      <img src={iconKalender} alt="Kalender" className="btn-icon-svg icon-gray" /> 
      {value}
      <img src={iconPanahBawah} alt="Panah" className="btn-icon-svg icon-gray" style={{ width: '12px' }} />
    </button>
  ));

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-data text-red">Kasir : {formatRupiah(payload[0].value)}</p>
          <p className="tooltip-data text-yellow">QR Code : {formatRupiah(payload[1].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="admin-container">
      {/* --- SIDEBAR REVISI (KONSISTEN) --- */}
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {/* LOGO LAOBAN FIXED STANDAR 160PX */}
          <div style={{ 
            width: '100%', 
            padding: '35px 20px 20px 20px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            boxSizing: 'border-box'
          }}>
            <img 
              src={logoLaobanSvg} 
              alt="Logo Laoban" 
              style={{ width: '100%', maxWidth: '160px', height: 'auto', display: 'block' }} 
            />
          </div>

          <nav className="sidebar-menu" style={{ marginTop: '0px', paddingTop: '10px' }}>
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
              <img src={iconManajemen} alt="Staf" className="menu-icon-svg icon-white" />
              Manajemen Akun Staf
            </Link>
            <Link to="/admin/pengaturan" className="menu-item">
              <img src={iconPengaturan} alt="Pengaturan" className="menu-icon-svg icon-white" />
              Pengaturan
            </Link>
            <div className="divider" style={{ margin: '15px 16px' }}></div>
            <Link to="/kasir" className="menu-item">
              <img src={iconKasir} alt="Kasir" className="menu-icon-svg icon-white" />
              Kasir / POS Mode
            </Link>
          </nav>
        </div>
        
        {/* --- FIX: TOMBOL LOGOUT SEKARANG PAKAI LINK --- */}
        <div className="sidebar-footer">
          <Link to="/logout" className="logout-btn" style={{ textDecoration: 'none' }}>
            <img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" />
            Logout
          </Link>
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
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    customInput={<CustomDateInput />}
                  />
                </div>
                <button className="export-btn" onClick={handleExportCSV}>
                  <img src={iconDownload} alt="Export" className="btn-icon-svg icon-white" /> 
                  Export Laporan
                </button>
              </div>
            </div>

            <div className="summary-cards reports-cards">
              <div className="card">
                <div className="card-header">
                  <div className="icon-wrapper text-red"><img src={iconTotal} className="card-icon-svg icon-red" alt="Total" /></div>
                  <span className="trend positive">Bulan Ini</span>
                </div>
                <span className="card-label">Total Pendapatan</span>
                <h2 className="card-value">{formatRupiah(summary.totalPendapatan)}</h2>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="icon-wrapper text-red"><img src={iconKasir} className="card-icon-svg icon-red" alt="Kasir" /></div>
                  <span className="trend positive">Bulan Ini</span>
                </div>
                <span className="card-label">Pendapatan Kasir</span>
                <h2 className="card-value">{formatRupiah(summary.pendapatanKasir)}</h2>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="icon-wrapper text-red"><img src={iconQr} className="card-icon-svg icon-red" alt="QR" /></div>
                  <span className="trend positive">Bulan Ini</span>
                </div>
                <span className="card-label">Pendapatan QR Code</span>
                <h2 className="card-value">{formatRupiah(summary.pendapatanQr)}</h2>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="icon-wrapper text-red"><img src={iconList} className="card-icon-svg icon-red" alt="List" /></div>
                  <span className="trend positive">Bulan Ini</span>
                </div>
                <span className="card-label">Total Transaksi</span>
                <h2 className="card-value">{summary.totalTransaksi} Trx</h2>
              </div>
            </div>

            <div className="chart-container card mb-6">
              <h3 className="section-title">Grafik Penjualan ({selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })})</h3>
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Memuat grafik...</div>
              ) : (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }} barGap={0}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                      <Bar dataKey="kasir" fill="#a00000" radius={[4, 4, 0, 0]} barSize={40} />
                      <Bar dataKey="qr" fill="#ffcc00" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="transaction-container card">
              <div className="table-header-row">
                <h3 className="section-title">Detail Transaksi ({selectedDate.toLocaleDateString('id-ID', { month: 'long' })})</h3>
              </div>
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Memuat data transaksi...</div>
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
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((row) => (
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-gray" style={{ padding: '20px' }}>
                          Tidak ada transaksi pada bulan ini.
                        </td>
                      </tr>
                    )}
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