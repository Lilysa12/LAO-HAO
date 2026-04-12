import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ManajemenPromo.css';

import logoLaoban from '../../assets/Icons/icons-customer/logoLaoban.png';
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconManajemen from '../../assets/Icons/icons-admin/manajemen.svg';
import iconPengaturan from '../../assets/Icons/icons-admin/pengaturan.svg';
import iconKasir from '../../assets/Icons/icons-admin/kasir.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';
import iconPromosi from '../../assets/Icons/icons-admin/promosi.svg'; 

const ManajemenPromo = () => {
  const [activeTab, setActiveTab] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // STATE TABEL
  const [promoData, setPromoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // STATE FORMULIR
  const [promoDate, setPromoDate] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    code: '',
    type: 'Persentase (%)',
    value: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FUNGSI MENGAMBIL DATA PROMO
  const fetchPromos = () => {
    setIsLoading(true);
    axios.get('http://127.0.0.1:8000/api/admin/promos')
      .then(response => {
        setPromoData(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Gagal mengambil data promo:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // FUNGSI MENYIMPAN DATA (POST)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!promoDate) {
      alert('Tolong pilih tanggal kedaluwarsa promo!');
      return;
    }

    setIsSubmitting(true);
    const formattedDate = promoDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const payload = {
      ...formData,
      expired_at: formattedDate
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/admin/promos', payload);
      alert('Berhasil! Promo baru telah diterbitkan.');
      setIsModalOpen(false);
      setFormData({ description: '', code: '', type: 'Persentase (%)', value: '' });
      setPromoDate(null);
      fetchPromos();
    } catch (error) {
      console.error('Gagal menyimpan promo:', error);
      alert('Gagal menambahkan promo. Pastikan Kode Voucher belum pernah digunakan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // FUNGSI MENGHAPUS DATA DENGAN METODE POST (Bypass CORS)
  const handleDeletePromo = async (id, promoCode) => {
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus promo ${promoCode}? Data tidak dapat dikembalikan.`);
    
    if (isConfirmed) {
      try {
        // PERUBAHAN PENTING: Gunakan axios.post dan tambahkan /delete di belakangnya
        await axios.post(`http://127.0.0.1:8000/api/admin/promos/${id}/delete`);
        alert('Promo berhasil dihapus!');
        fetchPromos(); // Refresh otomatis
      } catch (error) {
        console.error('Detail Error:', error);
        const errorMsg = error.response?.data?.message || 'Server menolak koneksi.';
        alert(`Gagal menghapus! Pesan server: ${errorMsg}`);
      }
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
          <Link to="/admin/manajemen-promo" className="menu-item active">
            <img src={iconPromosi} alt="Promo" className="menu-icon-svg" />
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
            <span className="text-black font-bold">Promos</span>
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
                <h1 className="page-title">Manajemen Promo & Voucher</h1>
                <p className="page-subtitle">Buat dan kelola kode promo untuk pelanggan</p>
              </div>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                + Buat Promo Baru
              </button>
            </div>

            <div className="card table-container">
              <div className="table-toolbar">
                <div className="search-wrapper">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input type="text" placeholder="Cari kode promo..." className="search-input" />
                </div>
                
                <div className="tab-filters">
                  <button className={`tab-btn ${activeTab === 'Semua' ? 'active' : ''}`} onClick={() => setActiveTab('Semua')}>Semua</button>
                  <button className={`tab-btn ${activeTab === 'Aktif' ? 'active' : ''}`} onClick={() => setActiveTab('Aktif')}>Aktif</button>
                  <button className={`tab-btn ${activeTab === 'Nonaktif' ? 'active' : ''}`} onClick={() => setActiveTab('Nonaktif')}>Nonaktif</button>
                </div>
              </div>

              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Memuat data promo dari Supabase...</div>
              ) : (
                <table className="transaction-table promo-table">
                  <thead>
                    <tr>
                      <th>KODE PROMO</th>
                      <th>JENIS / NILAI</th>
                      <th>MIN. BELANJA</th>
                      <th>BERLAKU HINGGA</th>
                      <th>STATUS</th>
                      <th className="text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promoData.map((promo) => (
                      <tr key={promo.id}>
                        <td>
                          <div className="promo-code-cell">
                            <div className="promo-icon-box">
                              <img src={iconPromosi} alt="Promo Icon" className="promo-icon-svg" />
                            </div>
                            <div>
                              <div className="font-bold text-red promo-code-text">{promo.code}</div>
                              <div className="text-gray text-small">{promo.desc}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="font-bold text-black">{promo.value}</div>
                          <div className="text-gray text-small">{promo.type}</div>
                        </td>
                        <td className="text-gray">{promo.min}</td>
                        <td className="text-gray">{promo.exp}</td>
                        <td>
                          <span className={`badge ${
                            promo.status === 'AKTIF' ? 'badge-success' : 
                            promo.status === 'NONAKTIF' ? 'badge-danger' : 'badge-neutral'
                          }`}>
                            {promo.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-icons-cell">
                            <button className="action-icon-btn" title="Edit">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
                                <circle cx="16" cy="12" r="3"></circle>
                              </svg>
                            </button>
                            <button className="action-icon-btn" title="Copy">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            {/* TOMBOL DELETE MENGGUNAKAN FUNGSI POST */}
                            <button className="action-icon-btn" title="Hapus Promo" onClick={() => handleDeletePromo(promo.id, promo.code)}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Buat Promo & Voucher</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitForm}>
              <div className="modal-body">
                <div className="form-group">
                  <label>NAMA PROMO</label>
                  <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Ex: Diskon Hari Kemerdekaan" className="form-input" required />
                </div>
                
                <div className="form-group">
                  <label>KODE VOUCHER</label>
                  <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="Ex: LAOBAN10" className="form-input" required />
                  <span className="input-hint">Kode voucher hanya boleh berisi huruf besar dan angka tanpa spasi.</span>
                </div>
                
                <div className="form-row">
                  <div className="form-group half-width">
                    <label>TIPE DISKON</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} className="form-input select-input" required>
                      <option value="Persentase (%)">Persentase (%)</option>
                      <option value="Nominal (Rp)">Nominal (Rp)</option>
                    </select>
                  </div>
                  <div className="form-group half-width">
                    <label>NILAI DISKON</label>
                    <input type="number" name="value" value={formData.value} onChange={handleInputChange} placeholder="Ex: 10 atau 50000" className="form-input" required />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>BERLAKU HINGGA</label>
                  <div className="date-input-wrapper">
                    <DatePicker 
                      selected={promoDate} 
                      onChange={(date) => setPromoDate(date)} 
                      placeholderText="dd/mm/yyyy"
                      dateFormat="dd/MM/yyyy"
                      className="form-input full-width-date"
                      required
                    />
                    <svg className="calendar-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Terbitkan Promo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenPromo;