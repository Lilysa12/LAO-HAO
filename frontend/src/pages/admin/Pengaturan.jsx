import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
  const [activeTab, setActiveTab] = useState('profil');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // STATE UNTUK SEMUA DATA PENGATURAN
  const [formData, setFormData] = useState({
    restaurant_name: '',
    phone: '',
    address: '',
    tax_active: true,
    tax_percentage: 0,
    service_charge: 0,
    receipt_footer: ''
  });

  // MENGAMBIL DATA DARI SUPABASE
  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/admin/settings?_t=${new Date().getTime()}`);
      const data = response.data;
      setFormData({
        restaurant_name: data.restaurant_name || '',
        phone: data.phone || '',
        address: data.address || '',
        tax_active: data.tax_active === 1 || data.tax_active === true,
        tax_percentage: data.tax_percentage || 0,
        service_charge: data.service_charge || 0,
        receipt_footer: data.receipt_footer || ''
      });
    } catch (error) {
      console.error("Gagal mengambil pengaturan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleToggleChange = (e) => {
    setFormData({
      ...formData,
      tax_active: e.target.checked
    });
  };

  // FUNGSI MENYIMPAN DATA (LEBIH AMAN)
  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    try {
      // Pastikan data angka benar-benar angka murni
      const payload = {
        ...formData,
        tax_percentage: formData.tax_percentage ? parseInt(formData.tax_percentage) : 0,
        service_charge: formData.service_charge ? parseInt(formData.service_charge) : 0
      };

      await axios.post('http://127.0.0.1:8000/api/admin/settings/update', payload);
      alert('Berhasil! Pengaturan sistem telah disimpan ke Supabase.');
      fetchSettings();
    } catch (error) {
      console.error('Gagal menyimpan pengaturan:', error);
      // Tangkap pesan error detail dari Laravel agar tidak menebak-nebak
      const errorMsg = error.response?.data?.message || error.message || 'Koneksi ke server terputus.';
      alert(`Gagal menyimpan pengaturan! Penyebab: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
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
                  <button className={`settings-nav-btn ${activeTab === 'profil' ? 'active' : ''}`} onClick={() => setActiveTab('profil')}>
                    <img src={iconCabang} alt="Profil" className={`btn-icon-svg ${activeTab === 'profil' ? 'icon-red' : 'icon-gray'}`} />
                    Profil Restoran
                  </button>
                  <button className={`settings-nav-btn ${activeTab === 'pajak' ? 'active' : ''}`} onClick={() => setActiveTab('pajak')}>
                    <img src={iconStruk} alt="Pajak" className={`btn-icon-svg ${activeTab === 'pajak' ? 'icon-red' : 'icon-gray'}`} />
                    Pajak & Struk
                  </button>
                  <button className={`settings-nav-btn ${activeTab === 'pos' ? 'active' : ''}`} onClick={() => setActiveTab('pos')}>
                    <img src={iconPos} alt="POS" className={`btn-icon-svg ${activeTab === 'pos' ? 'icon-red' : 'icon-gray'}`} />
                    Tampilan POS
                  </button>
                  <button className={`settings-nav-btn ${activeTab === 'notifikasi' ? 'active' : ''}`} onClick={() => setActiveTab('notifikasi')}>
                    <img src={iconNotifikasi} alt="Notifikasi" className={`btn-icon-svg ${activeTab === 'notifikasi' ? 'icon-red' : 'icon-gray'}`} />
                    Notifikasi
                  </button>
                  <button className={`settings-nav-btn ${activeTab === 'keamanan' ? 'active' : ''}`} onClick={() => setActiveTab('keamanan')}>
                    <img src={iconKeamanan} alt="Keamanan" className={`btn-icon-svg ${activeTab === 'keamanan' ? 'icon-red' : 'icon-gray'}`} />
                    Keamanan
                  </button>
                </div>
              </div>

              <div className="settings-content-area">
                
                {isLoading ? (
                  <div className="settings-card" style={{ textAlign: 'center', padding: '40px' }}>
                    Memuat data pengaturan dari Supabase...
                  </div>
                ) : (
                  <>
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
                              <input type="text" name="restaurant_name" value={formData.restaurant_name} onChange={handleInputChange} className="form-input" />
                            </div>
                            <div className="form-group half-width">
                              <label>NOMOR TELEPON</label>
                              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>ALAMAT LENGKAP</label>
                            <textarea name="address" value={formData.address} onChange={handleInputChange} className="form-input textarea-input" rows="3"></textarea>
                          </div>
                          
                          <div className="form-group">
                            <label>LOGO STRUK</label>
                            <div className="logo-dropzone" onClick={() => alert('Fitur upload gambar akan dibuat pada tahap selanjutnya.')}>
                              <div className="logo-preview-box">
                                <span className="logo-preview-text">LAOBAN</span>
                              </div>
                              <p className="dropzone-text">Klik untuk ubah logo (Maks 2MB, JPG/PNG)</p>
                            </div>
                          </div>

                          <div className="settings-form-actions">
                            <button className="btn-secondary" onClick={fetchSettings}>Batal</button>
                            <button className="btn-primary flex-btn" onClick={handleSaveSettings} disabled={isSubmitting}>
                              <img src={iconSimpan} alt="Simpan" className="btn-icon-svg icon-white" />
                              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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
                              <input type="checkbox" name="tax_active" checked={formData.tax_active} onChange={handleToggleChange} className="toggle-input" />
                              <span className="toggle-slider"></span>
                            </label>
                          </div>
                          <div className="form-row">
                            <div className="form-group half-width">
                              <label>PERSENTASE PB1 (%)</label>
                              <input type="number" name="tax_percentage" value={formData.tax_percentage} onChange={handleInputChange} className="form-input" disabled={!formData.tax_active} />
                            </div>
                            <div className="form-group half-width">
                              <label>SERVICE CHARGE (%)</label>
                              <input type="number" name="service_charge" value={formData.service_charge} onChange={handleInputChange} className="form-input" />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>PESAN FOOTER STRUK</label>
                            <textarea name="receipt_footer" value={formData.receipt_footer} onChange={handleInputChange} className="form-input textarea-input" rows="3"></textarea>
                          </div>

                          <div className="settings-form-actions">
                            <button className="btn-secondary" onClick={fetchSettings}>Batal</button>
                            <button className="btn-primary flex-btn" onClick={handleSaveSettings} disabled={isSubmitting}>
                              <img src={iconSimpan} alt="Simpan" className="btn-icon-svg icon-white" />
                              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {(activeTab === 'pos' || activeTab === 'notifikasi' || activeTab === 'keamanan') && (
                  <div className="settings-card">
                    <div className="empty-state-wrapper">
                      <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <h2 className="empty-state-title">Menu sedang dalam pengembangan</h2>
                      <p className="empty-state-desc">Fitur ini akan segera hadir pada update berikutnya.</p>
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