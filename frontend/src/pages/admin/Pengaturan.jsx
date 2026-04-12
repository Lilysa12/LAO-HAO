import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Pengaturan.css';

import logoLaoban from '../../assets/Icons/icons-customer/logoLaoban.png';
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconManajemen from '../../assets/Icons/icons-admin/manajemen.svg';
import iconPengaturan from '../../assets/Icons/icons-admin/pengaturan.svg';
import iconKasir from '../../assets/Icons/icons-admin/kasir.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';
import iconPromosi from '../../assets/Icons/icons-admin/promosi.svg'; 

import iconCabang from '../../assets/Icons/icons-admin/cabang.svg';
import iconStruk from '../../assets/Icons/icons-admin/struk.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconNotifikasi from '../../assets/Icons/icons-admin/notifikasi.svg';
import iconKeamanan from '../../assets/Icons/icons-admin/keamanan.svg';
import iconSimpan from '../../assets/Icons/icons-admin/simpan.svg';

const Pengaturan = () => {
  const [activeTab, setActiveTab] = useState('pos');

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
          <Link to="/admin/laporan-penjualan-pusat" className="menu-item">
            <img src={iconLaporan} alt="Laporan" className="menu-icon-svg icon-white" />
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
          <Link to="/admin/pengaturan" className="menu-item active">
            <img src={iconPengaturan} alt="Pengaturan" className="menu-icon-svg" />
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
            <span className="text-black font-bold">Settings</span>
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
                <h1 className="page-title">Pengaturan Sistem</h1>
                <p className="page-subtitle">Konfigurasi restoran, pajak, struk, dan notifikasi</p>
              </div>
            </div>

            <div className="settings-layout">
              <div className="settings-sidebar">
                <div className="settings-nav-card">
                  <button 
                    className={`settings-nav-btn ${activeTab === 'profil' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profil')}
                  >
                    <img src={iconCabang} alt="Profil" className={`btn-icon-svg ${activeTab === 'profil' ? 'icon-red' : 'icon-gray'}`} />
                    Profil Restoran
                  </button>
                  <button 
                    className={`settings-nav-btn ${activeTab === 'pajak' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pajak')}
                  >
                    <img src={iconStruk} alt="Pajak" className={`btn-icon-svg ${activeTab === 'pajak' ? 'icon-red' : 'icon-gray'}`} />
                    Pajak & Struk
                  </button>
                  <button 
                    className={`settings-nav-btn ${activeTab === 'pos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pos')}
                  >
                    <img src={iconPos} alt="POS" className={`btn-icon-svg ${activeTab === 'pos' ? 'icon-red' : 'icon-gray'}`} />
                    Tampilan POS
                  </button>
                  <button 
                    className={`settings-nav-btn ${activeTab === 'notifikasi' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notifikasi')}
                  >
                    <img src={iconNotifikasi} alt="Notifikasi" className={`btn-icon-svg ${activeTab === 'notifikasi' ? 'icon-red' : 'icon-gray'}`} />
                    Notifikasi
                  </button>
                  <button 
                    className={`settings-nav-btn ${activeTab === 'keamanan' ? 'active' : ''}`}
                    onClick={() => setActiveTab('keamanan')}
                  >
                    <img src={iconKeamanan} alt="Keamanan" className={`btn-icon-svg ${activeTab === 'keamanan' ? 'icon-red' : 'icon-gray'}`} />
                    Keamanan
                  </button>
                </div>
              </div>

              <div className="settings-content-area">
                {activeTab === 'profil' && (
                  <div className="settings-card">
                    <div className="settings-card-header">
                      <img src={iconCabang} alt="Store" className="btn-icon-svg icon-red" />
                      <h2>Informasi Dasar</h2>
                    </div>
                    <div className="settings-form">
                      <div className="form-row">
                        <div className="form-group half-width">
                          <label>NAMA OUTLET</label>
                          <input type="text" defaultValue="Lao-Hao (Pusat)" className="form-input" />
                        </div>
                        <div className="form-group half-width">
                          <label>NOMOR TELEPON</label>
                          <input type="text" defaultValue="0812-3456-7890" className="form-input" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>ALAMAT LENGKAP</label>
                        <textarea className="form-input textarea-input" rows="3" defaultValue="Jl. Merdeka No. 45, Bandung, Jawa Barat"></textarea>
                      </div>
                      <div className="form-group">
                        <label>LOGO STRUK</label>
                        <div className="logo-dropzone">
                          <div className="logo-preview-box">
                            <span className="logo-preview-text">LAOBAN</span>
                          </div>
                          <p className="dropzone-text">Klik untuk ubah logo (Maks 2MB, JPG/PNG)</p>
                        </div>
                      </div>
                      <div className="settings-form-actions">
                        <button className="btn-secondary">Batal</button>
                        <button className="btn-primary flex-btn">
                          <img src={iconSimpan} alt="Simpan" className="btn-icon-svg icon-white" />
                          Simpan Perubahan
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'pajak' && (
                  <div className="settings-card">
                    <div className="settings-card-header">
                      <img src={iconStruk} alt="Pajak" className="btn-icon-svg icon-red" />
                      <h2>Pengaturan Pajak & Struk</h2>
                    </div>
                    <div className="settings-form">
                      <div className="toggle-setting-box">
                        <div className="toggle-setting-text">
                          <h3>Aktifkan Pajak Restoran (PB1)</h3>
                          <p>Otomatis tambahkan pajak ke setiap transaksi</p>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" className="toggle-input" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                      <div className="form-row">
                        <div className="form-group half-width">
                          <label>PERSENTASE PB1 (%)</label>
                          <input type="number" defaultValue="10" className="form-input" />
                        </div>
                        <div className="form-group half-width">
                          <label>SERVICE CHARGE (%)</label>
                          <input type="number" defaultValue="5" className="form-input" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>PESAN FOOTER STRUK</label>
                        <textarea className="form-input textarea-input" rows="3" defaultValue="Terima kasih telah berkunjung ke Lao-Hao. Kepuasan Anda adalah kebahagiaan kami."></textarea>
                      </div>
                      <div className="settings-form-actions">
                        <button className="btn-secondary">Batal</button>
                        <button className="btn-primary flex-btn">
                          <img src={iconSimpan} alt="Simpan" className="btn-icon-svg icon-white" />
                          Simpan Perubahan
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'pos' && (
                  <div className="settings-card">
                    <div className="empty-state-wrapper">
                      <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <h2 className="empty-state-title">Menu sedang dalam pengembangan</h2>
                      <p className="empty-state-desc">Fitur pos akan segera hadir pada update berikutnya.</p>
                    </div>
                    <div className="settings-form-actions">
                      <button className="btn-secondary">Batal</button>
                      <button className="btn-primary flex-btn">
                        <img src={iconSimpan} alt="Simpan" className="btn-icon-svg icon-white" />
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'notifikasi' && (
                  <div className="settings-card">
                    <div className="empty-state-wrapper">
                      <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <h2 className="empty-state-title">Menu sedang dalam pengembangan</h2>
                      <p className="empty-state-desc">Fitur notif akan segera hadir pada update berikutnya.</p>
                    </div>
                    <div className="settings-form-actions">
                      <button className="btn-secondary">Batal</button>
                      <button className="btn-primary flex-btn">
                        <img src={iconSimpan} alt="Simpan" className="btn-icon-svg icon-white" />
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'keamanan' && (
                  <div className="settings-card">
                    <div className="empty-state-wrapper">
                      <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <h2 className="empty-state-title">Menu sedang dalam pengembangan</h2>
                      <p className="empty-state-desc">Fitur keamanan akan segera hadir pada update berikutnya.</p>
                    </div>
                    <div className="settings-form-actions">
                      <button className="btn-secondary">Batal</button>
                      <button className="btn-primary flex-btn">
                        <img src={iconSimpan} alt="Simpan" className="btn-icon-svg icon-white" />
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pengaturan;