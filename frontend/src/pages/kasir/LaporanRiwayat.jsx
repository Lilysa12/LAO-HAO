import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LaporanRiwayat.css';

import logoLaoban from '../../assets/Icons/icons-customer/logoLaoban.png';
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';

import iconKalender from '../../assets/Icons/icons-admin/kalender.svg';
import iconDownload from '../../assets/Icons/icons-admin/download.svg';
import iconPrinter from '../../assets/Icons/icons-admin/printer.svg'; 
import iconLaporanKasir from '../../assets/Icons/icons-admin/laporankasir.svg'; 

const LaporanRiwayat = () => {
  const navigate = useNavigate();

  // STATE UNTUK DATA & FILTER
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default hari ini: YYYY-MM-DD
  const [isLoading, setIsLoading] = useState(true);

  // STATE UNTUK KARTU RINGKASAN
  const [summary, setSummary] = useState({
    dailyTotal: 0,
    dailyCount: 0,
    monthlyTotal: 0,
    monthName: ''
  });

  // FUNGSI HELPER: Mengubah tanggal dari database "12 Okt 2026, 14:30" menjadi "2026-10-12"
  const parseDateToYYYYMMDD = (timeString) => {
    const months = { 'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'Mei': '05', 'Jun': '06', 'Jul': '07', 'Agt': '08', 'Sep': '09', 'Okt': '10', 'Nov': '11', 'Des': '12' };
    const parts = timeString.split(' '); 
    if (parts.length >= 3) {
      const day = parts[0].padStart(2, '0');
      const month = months[parts[1]];
      const year = parts[2].replace(',', '');
      return `${year}-${month}-${day}`;
    }
    return null;
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  // MENGAMBIL DATA DARI SUPABASE
  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://127.0.0.1:8000/api/kasir/history?_t=${new Date().getTime()}`)
      .then(response => {
        setAllData(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Gagal mengambil riwayat transaksi:", error);
        setIsLoading(false);
      });
  }, []);

  // EFEK FILTERING: Berjalan setiap kali selectedDate atau allData berubah
  useEffect(() => {
    if (allData.length === 0) return;

    let dTotal = 0;
    let dCount = 0;
    let mTotal = 0;
    
    // Ambil YYYY-MM dari selectedDate untuk filter bulanan
    const selectedYearMonth = selectedDate.substring(0, 7); 
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const monthIndex = parseInt(selectedDate.split('-')[1]) - 1;
    const mName = `${monthNames[monthIndex]} ${selectedDate.split('-')[0]}`;

    // 1. Hitung Kartu Bulanan (Semua data di bulan yang sama)
    allData.forEach(trx => {
      const trxDateStr = parseDateToYYYYMMDD(trx.time);
      if (trxDateStr && (trx.status === 'LUNAS')) {
        const amount = parseInt(trx.total.replace(/[^0-9]/g, ''), 10) || 0;
        if (trxDateStr.startsWith(selectedYearMonth)) {
          mTotal += amount;
        }
      }
    });

    // 2. Saring Data Harian (Tabel dan Kartu Harian)
    const dailyData = allData.filter(trx => {
      const trxDateStr = parseDateToYYYYMMDD(trx.time);
      if (trxDateStr === selectedDate) {
        if (trx.status === 'LUNAS') {
          const amount = parseInt(trx.total.replace(/[^0-9]/g, ''), 10) || 0;
          dTotal += amount;
          dCount++;
        }
        return true;
      }
      return false;
    });

    setFilteredData(dailyData);
    setSummary({
      dailyTotal: dTotal,
      dailyCount: dCount,
      monthlyTotal: mTotal,
      monthName: mName
    });

  }, [allData, selectedDate]);

  // FUNGSI UNDUH LAPORAN KE EXCEL/CSV
  const handleDownloadReport = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada transaksi pada tanggal ini untuk diunduh.");
      return;
    }

    let csvContent = "NO. INVOICE,WAKTU,KASIR,MEJA,PELANGGAN,METODE,TOTAL,STATUS\n";
    
    filteredData.forEach(row => {
      const cleanTotal = row.total.replace(/,/g, ''); // Hapus koma agar format Excel tidak rusak
      const cleanTime = row.time.replace(/,/g, '');
      csvContent += `${row.inv},${cleanTime},${row.cashier},${row.table},${row.customer},${row.method},${cleanTotal},${row.status}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Kasir_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
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
          <Link to="/kasir" className="menu-item">
            <img src={iconDashboard} alt="Denah" className="menu-icon-svg icon-white" />
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
          <Link to="/kasir/laporan" className="menu-item active">
            <img src={iconLaporan} alt="Laporan" className="menu-icon-svg" />
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
            <span className="text-black font-bold">History</span>
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
                <h1 className="page-title">Laporan & Riwayat</h1>
                <p className="page-subtitle">Laporan penjualan cabang dan riwayat transaksi POS</p>
              </div>
              <div className="action-buttons">
                {/* INPUT DATE YANG TERHUBUNG KE STATE */}
                <div className="date-picker-wrapper">
                  <img src={iconKalender} alt="Kalender" className="calendar-overlay-icon icon-red" />
                  <input 
                    type="date" 
                    className="date-input-active" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                  />
                </div>
                
                {/* TOMBOL UNDUH LAPORAN AKTIF */}
                <button className="btn-primary flex-btn" onClick={handleDownloadReport}>
                  <img src={iconDownload} alt="Download" className="btn-icon-svg icon-white" />
                  Unduh Laporan
                </button>
              </div>
            </div>

            <div className="summary-cards-row">
              <div className="card stat-card">
                <span className="stat-label">Total Pendapatan Harian</span>
                <h2 className="stat-value text-red">{formatRupiah(summary.dailyTotal)}</h2>
                <span className="stat-desc text-green">Berdasarkan tanggal yang dipilih</span>
              </div>
              <div className="card stat-card">
                <span className="stat-label">Total Transaksi</span>
                <h2 className="stat-value">{summary.dailyCount}</h2>
                <span className="stat-desc">Transaksi Lunas hari ini</span>
              </div>
              <div className="card stat-card">
                <span className="stat-label">Total Pendapatan Bulanan</span>
                <h2 className="stat-value">{formatRupiah(summary.monthlyTotal)}</h2>
                <span className="stat-desc">Bulan {summary.monthName}</span>
              </div>
            </div>

            <h2 className="section-heading">Riwayat Transaksi</h2>
            <div className="card table-container">
              <div className="table-header-custom">
                <div className="header-left">
                  <img src={iconLaporanKasir} alt="Doc" className="doc-icon icon-yellow" />
                  <span className="date-text">{selectedDate}</span>
                </div>
                <div className="header-right">
                  <span className="total-label">Total Pemasukan:</span>
                  <span className="total-amount text-red">{formatRupiah(summary.dailyTotal)}</span>
                </div>
              </div>

              {isLoading ? (
                 <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Menarik data dari Supabase...</div>
              ) : (
                <>
                  <table className="transaction-table history-table">
                    <thead>
                      <tr>
                        <th>NO. INVOICE & WAKTU</th>
                        <th>MEJA & PELANGGAN</th>
                        <th>METODE</th>
                        <th>TOTAL TRANSAKSI</th>
                        <th>STATUS</th>
                        <th className="text-center">TINDAKAN KASIR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="flex-col">
                                <span className="font-bold text-black">{item.inv}</span>
                                <span className="text-small text-gray">{item.time} | Oleh: {item.cashier}</span>
                              </div>
                            </td>
                            <td>
                              <div className="flex-align-center gap-8">
                                <span className="badge-meja">{item.table}</span>
                                <span className="font-bold text-black">{item.customer}</span>
                              </div>
                            </td>
                            <td>
                              <span className="badge-metode">{item.method}</span>
                            </td>
                            <td>
                              <span className="font-bold text-black">{item.total}</span>
                            </td>
                            <td>
                              <span className={`badge ${item.status === 'LUNAS' ? 'badge-lunas' : 'badge-batal'}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="text-center">
                              {item.status !== 'BATAL' && (
                                <button className="btn-print" onClick={() => alert(`Struk ${item.inv} sedang dicetak...`)}>
                                  <img src={iconPrinter} alt="Print" className="btn-icon-svg icon-gray" />
                                  Cetak Ulang Struk
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center text-gray" style={{ padding: '30px' }}>
                            Tidak ada transaksi pada tanggal ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  
                  <div className="table-footer-text">
                    <p>Menampilkan riwayat transaksi harian</p>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default LaporanRiwayat;