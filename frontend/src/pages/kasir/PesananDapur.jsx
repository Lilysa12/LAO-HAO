import React from 'react';
import { Link } from 'react-router-dom';
import './PesananDapur.css';

import logoLaoban from '../../assets/Icons/icons-customer/logoLaoban.png';
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';
import iconCeklis from '../../assets/Icons/icons-admin/ceklis.svg';
import iconJam from '../../assets/Icons/icons-admin/jam.svg';

const PesananDapur = () => {
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
          <Link to="/kasir/pesanan" className="menu-item active">
            <img src={iconPesananDapur} alt="Pesanan" className="menu-icon-svg" />
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
            <span className="text-black font-bold">Orders</span>
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
                <h1 className="page-title">Live Orders</h1>
                <p className="page-subtitle">Kelola pesanan dapur dan status penyajian</p>
              </div>
            </div>

            <div className="orders-grid">
              <div className="order-column column-processing">
                <div className="column-header">
                  <h2>Sedang Diproses</h2>
                  <span className="count-badge">1</span>
                </div>
                
                <div className="order-card">
                  <div className="order-card-header">
                    <div className="table-info-box">
                      <span className="label">MEJA</span>
                      <span className="number">15</span>
                    </div>
                    <div className="customer-info">
                      <div className="customer-name">Andi</div>
                      <div className="order-time">
                        <img src={iconJam} alt="Jam" className="jam-icon" />
                        10:20 AM
                      </div>
                    </div>
                    <span className="status-badge lunas">LUNAS</span>
                  </div>
                  
                  <div className="order-items">
                    <div className="order-item">
                      <span className="item-qty">3x</span>
                      <span className="item-name">Kopi Susu Lao-Hao</span>
                    </div>
                    <div className="order-item">
                      <span className="item-qty">2x</span>
                      <span className="item-name">Roti Bakar Kaya</span>
                    </div>
                  </div>
                  
                  <div className="order-card-footer">
                    <span className="order-id">ID: ORD-003</span>
                    <button className="btn-action">
                      <img src={iconCeklis} alt="Check" className="icon-white ceklis-icon" />
                      Sajikan / Selesai
                    </button>
                  </div>
                </div>
              </div>

              <div className="order-column column-ready">
                <div className="column-header">
                  <h2>Siap Disajikan</h2>
                  <span className="count-badge">1</span>
                </div>
                
                <div className="order-card">
                  <div className="order-card-header">
                    <div className="table-info-box">
                      <span className="label">MEJA</span>
                      <span className="number">04</span>
                    </div>
                    <div className="customer-info">
                      <div className="customer-name">Joko</div>
                      <div className="order-time">
                        <img src={iconJam} alt="Jam" className="jam-icon" />
                        10:15 AM
                      </div>
                    </div>
                    <span className="status-badge lunas">LUNAS</span>
                  </div>
                  
                  <div className="order-items">
                    <div className="order-item">
                      <span className="item-qty">1x</span>
                      <span className="item-name">Nasi Lemak</span>
                    </div>
                    <div className="order-item">
                      <span className="item-qty">1x</span>
                      <span className="item-name">Kopi Hitam</span>
                    </div>
                  </div>
                  
                  <div className="order-card-footer">
                    <span className="order-id">ID: ORD-004</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default PesananDapur;