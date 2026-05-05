import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pengaturan.css';

// --- IMPORT ASSETS (LOGO STANDAR 160PX) ---
import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg'; 
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconManajemen from '../../assets/Icons/icons-admin/manajemen.svg';
import iconPengaturan from '../../assets/Icons/icons-admin/pengaturan.svg';
import iconKasir from '../../assets/Icons/icons-admin/kasir.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';
import iconPromosi from '../../assets/Icons/icons-admin/promosi.svg'; 

import iconCabang from '../../assets/Icons/icons-admin/cabang.svg';
import iconStruk from '../../assets/Icons/icons-admin/struk.svg';
import iconSimpan from '../../assets/Icons/icons-admin/simpan.svg';

const Pengaturan = () => {
  const navigate = useNavigate(); // Inisialisasi navigate
  const [activeTab, setActiveTab] = useState('profil');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    restaurant_name: '',
    phone: '',
    address: '',
    tax_active: true,
    tax_percentage: 0,
    service_charge: 0,
    receipt_footer: ''
  });

  // --- FIX: FUNGSI LOGOUT DI DALAM KOMPONEN ---
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login'); // Lempar kembali ke login
  };

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

  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    try {
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
      const errorMsg = error.response?.data?.message || error.message || 'Koneksi ke server terputus.';
      alert(`Gagal menyimpan pengaturan! Penyebab: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      {/* --- SIDEBAR STANDAR LOGO LAOBAN --- */}
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          
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

            <div className="divider" style={{ margin: '15px 16px' }}></div>

            <Link to="/kasir" className="menu-item">
              <img src={iconKasir} alt="Kasir" className="menu-icon-svg icon-white" />
              Kasir / POS Mode
            </Link>
          </nav>
        </div>

        {/* --- FIX: TOMBOL LOGOUT SEKARANG PAKAI handleLogout --- */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn" style={{ background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                    <img 
                      src={iconCabang} 
                      alt="Profil" 
                      className={`btn-icon-svg ${activeTab === 'profil' ? 'icon-red' : 'icon-gray'}`} 
                      style={activeTab === 'profil' ? { filter: 'brightness(0) saturate(100%) invert(13%) sepia(97%) saturate(4051%) hue-rotate(350deg) brightness(90%) contrast(105%)' } : {}}
                    />
                    Profil Restoran
                  </button>
                  <button className={`settings-nav-btn ${activeTab === 'pajak' ? 'active' : ''}`} onClick={() => setActiveTab('pajak')}>
                    <img 
                      src={iconStruk} 
                      alt="Pajak" 
                      className={`btn-icon-svg ${activeTab === 'pajak' ? 'icon-red' : 'icon-gray'}`} 
                      style={activeTab === 'pajak' ? { filter: 'brightness(0) saturate(100%) invert(13%) sepia(97%) saturate(4051%) hue-rotate(350deg) brightness(90%) contrast(105%)' } : {}}
                    />
                    Pajak & Struk
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
                          <div className="toggle-setting-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div className="toggle-setting-text">
                              <h3 style={{ fontSize: '14px', marginBottom: '4px' }}>Aktifkan Pajak Restoran (PB1)</h3>
                              <p style={{ fontSize: '12px', color: '#64748b' }}>Otomatis tambahkan pajak ke setiap transaksi</p>
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pengaturan;