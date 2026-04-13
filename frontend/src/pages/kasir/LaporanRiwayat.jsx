import React from 'react';
import { Link } from 'react-router-dom';
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
  const historyData = [
    { id: '#INV-0012', time: '14:30', cashier: 'Budi Santoso', table: 'M-12', customer: 'Budi S.', method: 'QRIS', total: 'Rp 125.000', status: 'LUNAS' },
    { id: '#INV-0013', time: '14:45', cashier: 'Budi Santoso', table: 'M-05', customer: 'Andi M.', method: 'CASH', total: 'Rp 45.000', status: 'LUNAS' },
    { id: '#INV-0014', time: '15:10', cashier: 'Budi Santoso', table: 'M-Takeaway', customer: 'Siti K.', method: 'DEBIT', total: 'Rp 210.000', status: 'LUNAS' },
    { id: '#INV-0015', time: '15:30', cashier: 'Ahmad Syahroni', table: 'M-02', customer: 'Guest', method: 'CASH', total: 'Rp 35.000', status: 'BATAL' },
    { id: '#INV-0016', time: '16:00', cashier: 'Budi Santoso', table: 'M-08', customer: 'Joko P.', method: 'QRIS', total: 'Rp 85.000', status: 'LUNAS' },
    { id: '#INV-0017', time: '16:20', cashier: 'Budi Santoso', table: 'M-VIP-1', customer: 'Dina', method: 'KREDIT', total: 'Rp 450.000', status: 'LUNAS' },
  ];

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
          <button className="logout-btn">
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
                {/* PERBAIKAN 2: Kalender Aktif menggunakan input type="date" */}
                <div className="date-picker-wrapper">
                  <img src={iconKalender} alt="Kalender" className="calendar-overlay-icon icon-red" />
                  <input type="date" className="date-input-active" defaultValue="2026-10-12" />
                </div>
                
                <button className="btn-primary flex-btn">
                  <img src={iconDownload} alt="Download" className="btn-icon-svg icon-white" />
                  Unduh Laporan
                </button>
              </div>
            </div>

            <div className="summary-cards-row">
              <div className="card stat-card">
                <span className="stat-label">Total Pendapatan Harian</span>
                <h2 className="stat-value text-red">Rp 3.450.000</h2>
                <span className="stat-desc text-green">+15% dari hari kemarin</span>
              </div>
              <div className="card stat-card">
                <span className="stat-label">Total Transaksi</span>
                <h2 className="stat-value">42</h2>
                <span className="stat-desc">Shift 1 (Budi Santoso)</span>
              </div>
              <div className="card stat-card">
                <span className="stat-label">Total Pendapatan Bulanan</span>
                <h2 className="stat-value">Rp 45.000.000</h2>
                <span className="stat-desc">Bulan Oktober 2026</span>
              </div>
            </div>

            <h2 className="section-heading">Riwayat Transaksi</h2>
            <div className="card table-container">
              <div className="table-header-custom">
                <div className="header-left">
                  {/* PERBAIKAN 1: Menggunakan iconLaporanKasir */}
                  <img src={iconLaporanKasir} alt="Doc" className="doc-icon icon-yellow" />
                  <span className="date-text">12 Okt 2026 (Shift 1)</span>
                </div>
                <div className="header-right">
                  <span className="total-label">Total Pemasukan:</span>
                  <span className="total-amount text-red">Rp 3.450.000</span>
                </div>
              </div>

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
                  {historyData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="flex-col">
                          <span className="font-bold text-black">{item.id}</span>
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
                        {/* PERBAIKAN 3: Tombol cetak hilang jika status BATAL */}
                        {item.status !== 'BATAL' && (
                          <button className="btn-print">
                            <img src={iconPrinter} alt="Print" className="btn-icon-svg icon-gray" />
                            Cetak Ulang Struk
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="table-footer-text">
                <p>Menampilkan 6 transaksi terakhir</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default LaporanRiwayat;