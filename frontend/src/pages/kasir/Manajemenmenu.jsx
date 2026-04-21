import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Manajemenmenu.css';

// --- IMPORT ASSETS ---
import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg'; 
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';

const Manajemenmenu = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // STATE FILTER & SEARCH
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua Kategori');

  // STATE MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', category: '', description: ''
  });

  const fetchMenus = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/kasir/menus?_t=${new Date().getTime()}`);
      setMenus(response.data);
    } catch (error) {
      console.error("Gagal mengambil data menu:", error);
      setErrorMsg(error.message);
      setMenus([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // MENDAPATKAN KATEGORI DINAMIS DARI DATABASE
  const dynamicCategories = ['Semua Kategori', ...new Set(menus.map(item => item.category))];

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const getMenuClass = (path) => location.pathname === path ? "menu-item active" : "menu-item";
  const getIconClass = (path) => location.pathname === path ? "menu-icon-svg" : "menu-icon-svg icon-white";

  // HANDLER MODAL
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddClick = () => {
    setIsEditMode(false); setEditId(null);
    setFormData({ name: '', price: '', category: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setIsEditMode(true); setEditId(item.id);
    setFormData({ name: item.name, price: item.price, category: item.category, description: item.description || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.post(`http://127.0.0.1:8000/api/kasir/menus/${editId}/update`, formData);
      } else {
        await axios.post('http://127.0.0.1:8000/api/kasir/menus', formData);
      }
      setIsModalOpen(false); fetchMenus();
    } catch (error) { alert('Terjadi kesalahan saat menyimpan menu.'); }
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus menu ${nama}?`)) {
      try {
        await axios.post(`http://127.0.0.1:8000/api/kasir/menus/${id}/delete`);
        fetchMenus();
      } catch (error) {
        alert('Gagal menghapus menu.');
      }
    }
  };

  // FILTER LOGIC
  const filteredMenus = menus.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'Semua Kategori' || item.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-container">
      {/* SIDEBAR LENGKAP */}
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
            <Link to="/admin" className="menu-item"><img src={iconDashboard} alt="Admin" className="menu-icon-svg icon-white" /> Kembali ke Pusat</Link>
          </nav>
        </div>
        <div className="sidebar-footer" style={{ padding: '20px' }}>
          <button className="logout-btn" onClick={handleLogout} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: 'white' }}>
            <img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Cashier Mode / <span className="text-black font-bold">Menu</span></div>
          <div className="user-profile">
            <div className="user-info">
              <span className="user-role">Cashier 01</span>
              <span className="user-status">Online</span>
            </div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 className="page-title">Manajemen Menu</h1>
              <p className="page-subtitle">Kelola daftar menu, harga, dan ketersediaan</p>
            </div>
            <button className="btn-add-menu-figma" onClick={handleAddClick}>
              + Tambah Menu Cabang
            </button>
          </div>

          <div className="table-container-figma">
            <div className="toolbar-figma">
              <div className="search-bar-figma">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Cari menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              {/* DROPDOWN KATEGORI DINAMIS */}
              <select className="category-select-figma" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                {dynamicCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Memuat data menu...</div>
            ) : errorMsg ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#b91c1c' }}>Error: {errorMsg}</div>
            ) : (
              <table className="menu-table-figma">
                <thead>
                  <tr>
                    <th>MENU</th>
                    <th>KATEGORI</th>
                    <th>HARGA</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'right' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMenus.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="menu-info-figma">
                          <img src={item.img} alt={item.name} className="menu-image-figma" />
                          <span className="menu-name-figma">{item.name}</span>
                        </div>
                      </td>
                      <td className="menu-cat-figma">{item.category}</td>
                      <td className="menu-price-figma">{formatRupiah(item.price)}</td>
                      <td>
                        <label className="switch">
                          <input type="checkbox" defaultChecked={item.isActive} />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn-edit-figma" onClick={() => handleEditClick(item)} style={{ marginRight: '8px' }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          Edit
                        </button>
                        <button className="btn-edit-figma" onClick={() => handleDelete(item.id, item.name)} style={{ color: '#ef4444', borderColor: '#fee2e2' }}>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredMenus.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Tidak ada menu yang sesuai.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '20px' }}>{isEditMode ? 'Edit Menu' : 'Tambah Menu Baru'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '12px', color: '#64748b' }}>NAMA MENU</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '12px', color: '#64748b' }}>KATEGORI</label>
                  {/* INPUT DENGAN DATALIST AGAR BISA KETIK KATEGORI BEBAS */}
                  <input type="text" name="category" list="category-options" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} placeholder="Contoh: Main Dish" required />
                  <datalist id="category-options">
                    {dynamicCategories.filter(c => c !== 'Semua Kategori').map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '12px', color: '#64748b' }}>HARGA (RP)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
                </div>
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '12px', color: '#64748b' }}>DESKRIPSI (Opsional)</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '80px' }}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#aa0000', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Simpan Menu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manajemenmenu;