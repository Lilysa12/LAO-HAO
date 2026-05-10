import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './LaporanRiwayat.css';

// --- IMPORT ASSETS (Logo & Sidebar Icons) ---
import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg'; 
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
  const location = useLocation();

  // STATE DATA & FILTER
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // STATE FILTER FIGMA
  const [activeTab, setActiveTab] = useState('Hari Ini');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);

  const [summary, setSummary] = useState({
    dailyTotal: 0,
    dailyCount: 0,
    monthlyTotal: 0,
    monthName: ''
  });

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  // MENGAMBIL DATA DARI BACKEND
  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://127.0.0.1:8000/api/kasir/history?_t=${new Date().getTime()}`)
      .then(response => {
        setAllData(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Gagal mengambil riwayat:", error);
        setIsLoading(false);
      });
  }, []);

  // LOGIKA FILTERING WAKTU SUPER AKURAT
  useEffect(() => {
    if (allData.length === 0) return;

    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];
    const currentMonthPrefix = todayISO.substring(0, 7); // YYYY-MM
    
    const currentDay = today.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - distanceToMonday);
    const startOfWeekISO = startOfWeek.toISOString().split('T')[0];

    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const threeMonthsAgoISO = threeMonthsAgo.toISOString().split('T')[0];

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const mName = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;

    let dTotal = 0;
    let dCount = 0;
    let mTotal = 0;
    let tempFiltered = [];

    allData.forEach(trx => {
      if (trx.status === 'LUNAS' && trx.date_iso && trx.date_iso.startsWith(currentMonthPrefix)) {
        mTotal += parseInt(trx.total.replace(/[^0-9]/g, ''), 10) || 0;
      }
    });

    if (activeTab === 'Hari Ini') {
      tempFiltered = allData.filter(trx => trx.date_iso === todayISO);
    } else if (activeTab === 'Minggu Ini') {
      tempFiltered = allData.filter(trx => trx.date_iso >= startOfWeekISO && trx.date_iso <= todayISO);
    } else if (activeTab === 'Bulan Ini') {
      tempFiltered = allData.filter(trx => trx.date_iso && trx.date_iso.startsWith(currentMonthPrefix));
    } else if (activeTab === '3 Bulan Terakhir') {
      tempFiltered = allData.filter(trx => trx.date_iso >= threeMonthsAgoISO && trx.date_iso <= todayISO);
    } else if (activeTab === 'Custom Date') {
      tempFiltered = allData.filter(trx => trx.date_iso === customDate);
    } else {
      tempFiltered = allData;
    }

    tempFiltered.forEach(trx => {
      if (trx.status === 'LUNAS') {
        dTotal += parseInt(trx.total.replace(/[^0-9]/g, ''), 10) || 0;
        dCount++;
      }
    });

    setFilteredData(tempFiltered);
    setSummary({ dailyTotal: dTotal, dailyCount: dCount, monthlyTotal: mTotal, monthName: mName });

  }, [allData, activeTab, customDate]);

  const handleDownloadReport = () => {
    if (filteredData.length === 0) return alert("Tidak ada transaksi untuk diunduh.");
    let csvContent = "NO. INVOICE,WAKTU,KASIR,MEJA,PELANGGAN,METODE,TOTAL,STATUS\n";
    filteredData.forEach(row => {
      const cleanTotal = row.total.replace(/,/g, '');
      const cleanTime = row.time.replace(/,/g, '');
      csvContent += `${row.inv},${cleanTime},${row.cashier},${row.table},${row.customer},${row.method},${cleanTotal},${row.status}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `Laporan_Kasir_${activeTab === 'Custom Date' ? customDate : activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReceipt = (item) => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk ${item.inv}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; font-size: 14px; padding: 20px; max-width: 300px; margin: 0 auto; color: #000; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 12px 0; }
            .flex-between { display: flex; justify-content: space-between; margin-bottom: 6px; }
            .brand { font-size: 22px; font-weight: bold; text-align: center; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <div class="brand">LAO-HAO</div>
          <div class="text-center">By Uncle Oeh</div>
          <div class="text-center" style="font-size: 12px; margin-bottom: 10px;">Cabang Pusat</div>
          <div class="divider"></div>
          <div class="flex-between"><span>No. Invoice:</span><span>${item.inv}</span></div>
          <div class="flex-between"><span>Waktu:</span><span>${item.time}</span></div>
          <div class="flex-between"><span>Kasir:</span><span>${item.cashier}</span></div>
          <div class="divider"></div>
          <div class="flex-between"><span>Pelanggan:</span><span>${item.customer}</span></div>
          <div class="flex-between"><span>Meja:</span><span>${item.table}</span></div>
          <div class="divider"></div>
          <div class="flex-between font-bold" style="font-size: 16px;"><span>TOTAL</span><span>${item.total}</span></div>
          <div class="flex-between"><span>Metode Bayar:</span><span>${item.method}</span></div>
          <div class="flex-between"><span>Status:</span><span>${item.status}</span></div>
          <div class="divider"></div>
          <div class="text-center" style="margin-top: 20px;">Terima Kasih</div>
          <div class="text-center" style="font-size: 12px;">Selamat Menikmati Hidangan Kami</div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  // --- FIX: FUNGSI LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const getMenuClass = (path) => location.pathname === path ? "menu-item active" : "menu-item";
  const getIconClass = (path) => location.pathname === path ? "menu-icon-svg" : "menu-icon-svg icon-white";

  return (
    <div className="admin-container">
      {/* SIDEBAR STANDAR */}
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div className="sidebar-logo-container" style={{ width: '100%', padding: '35px 20px 20px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
            <img src={logoLaobanSvg} alt="Logo" style={{ width: '100%', maxWidth: '160px', height: 'auto', display: 'block' }} />
          </div>
          <nav className="sidebar-menu" style={{ marginTop: '0px', paddingTop: '10px' }}>
            <Link to="/kasir" className={getMenuClass('/kasir')}><img src={iconDashboard} alt="Denah" className={getIconClass('/kasir')} /> Denah Meja</Link>
            <Link to="/kasir/pos" className={getMenuClass('/kasir/pos')}><img src={iconPos} alt="POS" className={getIconClass('/kasir/pos')} /> Kasir / POS</Link>
            <Link to="/kasir/pesanan" className={getMenuClass('/kasir/pesanan')}><img src={iconPesananDapur} alt="Pesanan" className={getIconClass('/kasir/pesanan')} /> Pesanan Dapur</Link>
            <Link to="/kasir/manajemen-menu" className={getMenuClass('/kasir/manajemen-menu')}><img src={iconStok} alt="Menu" className={getIconClass('/kasir/manajemen-menu')} /> Manajemen Menu</Link>
            <Link to="/kasir/stok" className={getMenuClass('/kasir/stok')}><img src={iconStok} alt="Stok" className={getIconClass('/kasir/stok')} /> Stok Bahan Baku</Link>
            <Link to="/kasir/laporan" className={getMenuClass('/kasir/laporan')}><img src={iconLaporan} alt="Laporan" className={getIconClass('/kasir/laporan')} /> Laporan & Riwayat</Link>
            <Link to="/kasir/qr-meja" className={getMenuClass('/kasir/qr-meja')}><img src={iconQrMeja} alt="QR" className={getIconClass('/kasir/qr-meja')} /> QR Code Meja</Link>
            <div className="divider" style={{ margin: '15px 16px', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
            
            {/* --- FIX: TOMBOL KEMBALI KE PUSAT SEKARANG MEMICU LOGOUT --- */}
            <button onClick={handleLogout} className="menu-item" style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', fontFamily: 'inherit', color: 'white', display: 'flex', alignItems: 'center', fontSize: '13px', gap: '12px', padding: '10px 16px' }}>
              <img src={iconDashboard} alt="Admin" className="menu-icon-svg icon-white" /> Kembali ke Pusat
            </button>

          </nav>
        </div>
        <div className="sidebar-footer" style={{ padding: '20px' }}>
          <button className="logout-btn" onClick={handleLogout} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: 'white' }}>
            <img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span className="text-gray">Cashier Mode / </span><span className="text-black font-bold">History</span></div>
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
            
            {/* HEADER & FILTER FIX: ANTI MABOK BERAS */}
            <div className="history-header">
              <div className="header-titles">
                <h1 className="page-title">Laporan & Riwayat</h1>
                <p className="page-subtitle">Laporan penjualan cabang dan riwayat transaksi POS</p>
              </div>
              
              <div className="header-actions">
                <div className="filter-pills-container">
                  {['Hari Ini', 'Minggu Ini', 'Bulan Ini', '3 Bulan Terakhir', 'Custom Date'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`filter-pill ${activeTab === tab ? 'active' : ''}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeTab === 'Custom Date' && (
                  <div className="date-picker-wrapper">
                    <img src={iconKalender} alt="Kalender" className="calendar-overlay-icon" />
                    <input type="date" className="date-input-active" value={customDate} onChange={(e) => setCustomDate(e.target.value)} />
                  </div>
                )}
                
                <button className="btn-unduh-laporan" onClick={handleDownloadReport}>
                  <img src={iconDownload} alt="Download" className="btn-icon-svg" /> Unduh Laporan
                </button>
              </div>
            </div>

            {/* SUMMARY CARDS FIGMA STYLE (LEBIH KALEM) */}
            <div className="summary-cards-row">
              <div className="card stat-card">
                <span className="stat-label">Total Pendapatan Harian</span>
                <h2 className="stat-value text-red">{formatRupiah(summary.dailyTotal)}</h2>
                <span className="stat-desc text-green">+15% dari hari kemarin</span>
              </div>
              <div className="card stat-card">
                <span className="stat-label">Total Transaksi</span>
                <h2 className="stat-value text-black">{summary.dailyCount}</h2>
                <span className="stat-desc">Shift 1 (Budi Santoso)</span>
              </div>
              <div className="card stat-card">
                <span className="stat-label">Total Pendapatan Bulanan</span>
                <h2 className="stat-value text-black">{formatRupiah(summary.monthlyTotal)}</h2>
                <span className="stat-desc">Bulan {summary.monthName}</span>
              </div>
            </div>

            <h2 className="section-heading">Riwayat Transaksi</h2>
            
            <div className="card table-container">
              {/* CUSTOM TABLE HEADER */}
              <div className="table-header-custom">
                <div className="header-left">
                  <img src={iconLaporanKasir} alt="Doc" className="doc-icon icon-yellow" />
                  <span className="date-text">{activeTab === 'Custom Date' ? customDate : activeTab}</span>
                </div>
                <div className="header-right">
                  <span className="total-label">Total Pemasukan:</span>
                  <span className="total-amount text-red">{formatRupiah(summary.dailyTotal)}</span>
                </div>
              </div>

              {isLoading ? (
                  <div className="loading-state">Menarik data dari Supabase...</div>
              ) : (
                <>
                  <table className="history-table">
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
                                <span className="font-medium text-black">{item.customer}</span>
                              </div>
                            </td>
                            <td><span className="badge-metode">{item.method}</span></td>
                            <td><span className="font-bold text-black">{item.total}</span></td>
                            <td>
                              <span className={`status-badge ${item.status === 'LUNAS' ? 'badge-lunas' : 'badge-batal'}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="text-center">
                              {item.status !== 'BATAL' && (
                                <button className="btn-print" onClick={() => handlePrintReceipt(item)}>
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
                            Belum ada transaksi pada periode ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  
                  {/* FOOTER TEXT FIGMA STYLE */}
                  <div className="table-footer-text">
                    Menampilkan {filteredData.length} transaksi terakhir
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