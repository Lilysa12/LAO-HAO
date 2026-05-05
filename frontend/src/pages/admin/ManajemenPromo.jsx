import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ManajemenPromo.css';

// --- IMPORT ASSETS ---
import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg'; 
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconManajemen from '../../assets/Icons/icons-admin/manajemen.svg';
import iconPengaturan from '../../assets/Icons/icons-admin/pengaturan.svg';
import iconKasir from '../../assets/Icons/icons-admin/kasir.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';
import iconPromosi from '../../assets/Icons/icons-admin/promosi.svg'; 

const ManajemenPromo = () => {
  const navigate = useNavigate(); // Inisialisasi navigate

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [activeTab, setActiveTab] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [promoData, setPromoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [promoDate, setPromoDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    code: '',
    type: 'Persentase (%)',
    value: '',
  });

  // ==========================================
  // HANDLERS
  // ==========================================
  
  // --- FIX: FUNGSI LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login'); // Kembali ke login tanpa layar putih
  };

  const fetchPromos = () => {
    setIsLoading(true);
    axios.get(`http://127.0.0.1:8000/api/admin/promos?_t=${new Date().getTime()}`)
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditId(null);
    setFormData({ description: '', code: '', type: 'Persentase (%)', value: '' });
    setPromoDate(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (promo) => {
    setIsEditMode(true);
    setEditId(promo.id);
    let rawValue = promo.value.replace(/[^0-9]/g, '');
    
    const parseIndonesianDate = (dateStr) => {
      const months = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5, 'Jul': 6, 'Agt': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11 };
      const parts = dateStr.split(' ');
      if (parts.length === 3) return new Date(parts[2], months[parts[1]], parts[0]);
      return new Date();
    };

    setFormData({
      description: promo.desc,
      code: promo.code,
      type: promo.type === 'Persentase' ? 'Persentase (%)' : 'Nominal (Rp)',
      value: rawValue,
    });
    setPromoDate(parseIndonesianDate(promo.exp));
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!promoDate) { 
      alert('Tolong pilih tanggal kedaluwarsa!'); 
      return; 
    }
    
    setIsSubmitting(true);
    const formattedDate = promoDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const payload = { ...formData, expired_at: formattedDate };
    
    try {
      if (isEditMode) {
        await axios.post(`http://127.0.0.1:8000/api/admin/promos/${editId}/update`, payload);
      } else {
        await axios.post('http://127.0.0.1:8000/api/admin/promos', payload);
      }
      setIsModalOpen(false);
      fetchPromos();
    } catch (error) { 
      alert('Gagal menyimpan promo.'); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleDeletePromo = async (id, promoCode) => {
    if (window.confirm(`Hapus promo ${promoCode}?`)) {
      try {
        await axios.post(`http://127.0.0.1:8000/api/admin/promos/${id}/delete`);
        fetchPromos(); 
      } catch (error) { 
        alert('Gagal menghapus promo.'); 
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/admin/promos/${id}/toggle-status`);
      fetchPromos();
    } catch (error) { 
      alert('Gagal mengubah status.'); 
    }
  };

  const filteredPromos = promoData.filter((promo) => {
    const matchesSearch = promo.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          promo.desc.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesTab = true;
    if (activeTab === 'Aktif') matchesTab = promo.status === 'AKTIF';
    if (activeTab === 'Nonaktif') matchesTab = promo.status !== 'AKTIF';
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={{ width: '100%', padding: '35px 20px 20px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
            <img src={logoLaobanSvg} alt="Logo" style={{ width: '100%', maxWidth: '160px', height: 'auto', display: 'block' }} />
          </div>

          <nav className="sidebar-menu" style={{ marginTop: '0px', paddingTop: '10px' }}>
            <Link to="/admin" className="menu-item">
              <img src={iconDashboard} alt="Dashboard" className="menu-icon-svg icon-white" /> Overview Cabang
            </Link>
            <Link to="/admin/laporan-penjualan-pusat" className="menu-item">
              <img src={iconLaporan} alt="Laporan" className="menu-icon-svg icon-white" /> Laporan Penjualan Pusat
            </Link>
            <Link to="/admin/manajemen-promo" className="menu-item active">
              <img src={iconPromosi} alt="Promo" className="menu-icon-svg" /> Manajemen Promo
            </Link>
            <Link to="/admin/manajemen-akun-staf" className="menu-item">
              <img src={iconManajemen} alt="Staf" className="menu-icon-svg icon-white" /> Manajemen Akun Staf
            </Link>
            <Link to="/admin/pengaturan" className="menu-item">
              <img src={iconPengaturan} alt="Pengaturan" className="menu-icon-svg icon-white" /> Pengaturan
            </Link>
            
            <div className="divider" style={{ margin: '15px 16px' }}></div>
            
            <Link to="/kasir" className="menu-item">
              <img src={iconKasir} alt="Kasir" className="menu-icon-svg icon-white" /> Kasir / POS Mode
            </Link>
          </nav>
        </div>
        
        {/* --- FIX: TOMBOL LOGOUT SEKARANG PAKAI FUNGSI --- */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn" style={{ background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer', textAlign: 'left', width: '100%', display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
            <img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
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
              <button className="btn-primary" onClick={handleAddClick}>
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
                  <input 
                    type="text" 
                    placeholder="Cari kode promo..." 
                    className="search-input" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                </div>
                
                <div className="filter-section">
                  <button className={`tab-btn ${activeTab === 'Semua' ? 'active' : ''}`} onClick={() => setActiveTab('Semua')}>Semua</button>
                  <button className={`tab-btn ${activeTab === 'Aktif' ? 'active' : ''}`} onClick={() => setActiveTab('Aktif')}>Aktif</button>
                  <button className={`tab-btn ${activeTab === 'Nonaktif' ? 'active' : ''}`} onClick={() => setActiveTab('Nonaktif')}>Nonaktif</button>
                </div>
              </div>

              {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>Memuat data promo...</div>
              ) : (
                <table className="transaction-table promo-table">
                  <thead>
                    <tr>
                      <th>KODE PROMO</th>
                      <th>POTONGAN</th>
                      <th>KUOTA TERPAKAI</th>
                      <th>MASA BERLAKU</th>
                      <th>STATUS</th>
                      <th className="text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPromos.length > 0 ? (
                      filteredPromos.map((promo) => (
                        <tr key={promo.id}>
                          <td>
                            <div className="promo-code-cell">
                              <div className="promo-icon-box">
                                <img src={iconPromosi} alt="Icon" className="promo-icon-svg" />
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
                          <td className="text-gray">
                            {promo.used_quota || 0} / {promo.max_quota || '∞'}
                          </td>
                          <td className="text-gray">{promo.exp}</td>
                          <td>
                            <span className={`badge ${promo.status === 'AKTIF' ? 'badge-success' : 'badge-danger'}`}>
                              {promo.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-icons-cell">
                              <button className="action-icon-btn" onClick={() => handleToggleStatus(promo.id)}>
                                {promo.status === 'AKTIF' ? (
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2">
                                    <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
                                    <circle cx="16" cy="12" r="3"></circle>
                                  </svg>
                                ) : (
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2">
                                    <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
                                    <circle cx="8" cy="12" r="3"></circle>
                                  </svg>
                                )}
                              </button>
                              <button className="action-icon-btn" onClick={() => handleEditClick(promo)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                              </button>
                              <button className="action-icon-btn" onClick={() => handleDeletePromo(promo.id, promo.code)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-gray" style={{ padding: '30px' }}>
                          Tidak ada promo ditemukan.
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

      {/* MODAL EDIT / TAMBAH */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditMode ? 'Edit Promo & Voucher' : 'Buat Promo & Voucher'}</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmitForm}>
              <div className="modal-body">
                <div className="form-group">
                  <label>NAMA PROMO</label>
                  <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Ex: Diskon Spesial" className="form-input" required />
                </div>
                <div className="form-group">
                  <label>KODE VOUCHER</label>
                  <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="Ex: LAOBAN10" className="form-input" required />
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
                    <input type="number" name="value" value={formData.value} onChange={handleInputChange} className="form-input" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>BERLAKU HINGGA</label>
                  <DatePicker selected={promoDate} onChange={(date) => setPromoDate(date)} dateFormat="dd/MM/yyyy" className="form-input" required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
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
