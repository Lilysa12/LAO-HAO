import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './StokMenu.css';

import logoLaoban from '../../assets/Icons/icons-customer/logoLaoban.png';
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';

import iconTambahBarang from '../../assets/Icons/icons-admin/tambahbarang.svg';
import iconUpdateStok from '../../assets/Icons/icons-admin/updatestok.svg';
import iconPerluRestock from '../../assets/Icons/icons-admin/perlurestock.svg';

const StokMenu = () => {
  const [filterKategori, setFilterKategori] = useState('Semua Kategori');

  const stokData = [
    { id: 1, nama: 'Beras Pandan Wangi', kategori: 'Bahan Pokok', sisa: '45', unit: 'kg', min: '20', minUnit: 'kg', status: 'AMAN', update: 'Hari ini, 08:00' },
    { id: 2, nama: 'Minyak Goreng', kategori: 'Bahan Pokok', sisa: '12', unit: 'liter', min: '15', minUnit: 'liter', status: 'STOK MENIPIS', update: 'Kemarin, 15:30' },
    { id: 3, nama: 'Biji Kopi Robusta', kategori: 'Minuman', sisa: '5', unit: 'kg', min: '10', minUnit: 'kg', status: 'STOK MENIPIS', update: '2 Hari lalu' },
    { id: 4, nama: 'Telur Ayam', kategori: 'Bahan Pokok', sisa: '150', unit: 'butir', min: '50', minUnit: 'butir', status: 'AMAN', update: 'Hari ini, 06:00' },
    { id: 5, nama: 'Roti Tawar', kategori: 'Cemilan', sisa: '8', unit: 'bungkus', min: '20', minUnit: 'bungkus', status: 'STOK MENIPIS', update: 'Kemarin, 14:00' },
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
          <Link to="/kasir/stok" className="menu-item active">
            <img src={iconStok} alt="Stok" className="menu-icon-svg" />
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
            <span className="text-black font-bold">Inventory</span>
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
                <h1 className="page-title">Stok Bahan (Inventory)</h1>
                <p className="page-subtitle">Pantau persediaan bahan baku dan minimal stok</p>
              </div>
              <div className="action-buttons">
                <button className="btn-secondary flex-btn">
                  <img src={iconUpdateStok} alt="Update" className="btn-icon-svg icon-dark" />
                  Update Stok
                </button>
                <button className="btn-primary flex-btn">
                  <img src={iconTambahBarang} alt="Tambah" className="btn-icon-svg icon-white" />
                  Tambah Bahan
                </button>
              </div>
            </div>

            <div className="inventory-summary-cards">
              <div className="card summary-card">
                <span className="card-label">Total Item Bahan</span>
                <h2 className="card-value">124</h2>
              </div>
              <div className="card summary-card card-warning">
                <span className="card-label text-red flex-align-center">
                  <img src={iconPerluRestock} alt="Warning" className="warning-icon icon-red" />
                  Perlu Restock
                </span>
                <div className="value-with-desc">
                  <h2 className="card-value">12</h2>
                  <span className="value-desc">item menipis</span>
                </div>
              </div>
              <div className="card summary-card">
                <span className="card-label">Nilai Estimasi Stok</span>
                <h2 className="card-value">Rp 14.500K</h2>
              </div>
            </div>

            <div className="card table-container">
              <div className="table-toolbar">
                <div className="search-wrapper">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input type="text" placeholder="Cari bahan baku..." className="search-input" />
                </div>
                
                <div className="filter-dropdown-wrapper">
                  <select 
                    className="form-input select-filter"
                    value={filterKategori}
                    onChange={(e) => setFilterKategori(e.target.value)}
                  >
                    <option value="Semua Kategori">Semua Kategori</option>
                    <option value="Bahan Pokok">Bahan Pokok</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Cemilan">Cemilan</option>
                  </select>
                </div>
              </div>

              <table className="transaction-table inventory-table">
                <thead>
                  <tr>
                    <th>NAMA BAHAN</th>
                    <th>KATEGORI</th>
                    <th>SISA STOK</th>
                    <th>MIN. STOK</th>
                    <th>STATUS</th>
                    <th className="text-right">UPDATE TERAKHIR</th>
                  </tr>
                </thead>
                <tbody>
                  {stokData.map((item) => (
                    <tr key={item.id}>
                      <td className="font-bold text-black">{item.nama}</td>
                      <td className="text-gray">{item.kategori}</td>
                      <td>
                        <span className="font-bold text-black">{item.sisa}</span> <span className="text-gray text-small">{item.unit}</span>
                      </td>
                      <td className="text-gray">
                        {item.min} <span className="text-small">{item.minUnit}</span>
                      </td>
                      <td>
                        <span className={`badge ${item.status === 'AMAN' ? 'badge-aman' : 'badge-warning-stok'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="text-right text-gray text-small">
                        {item.update}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default StokMenu;