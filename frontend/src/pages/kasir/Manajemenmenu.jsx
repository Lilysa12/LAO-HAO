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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua Kategori');

  // --- STATE MODAL & FORM ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    category: '', 
    description: '',
    img: null 
  });

  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/kasir/menus?_t=${new Date().getTime()}`);
      setMenus(response.data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMenus(); }, []);

  const dynamicCategories = ['Semua Kategori', ...new Set(menus.map(item => item.category))];
  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  const handleLogout = () => { localStorage.removeItem('isAuthenticated'); navigate('/login'); };
  const getMenuClass = (path) => location.pathname === path ? "menu-item active" : "menu-item";
  const getIconClass = (path) => location.pathname === path ? "menu-icon-svg" : "menu-icon-svg icon-white";

  // --- HANDLERS FOR MODAL ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (item) => {
    setIsEditMode(true); 
    setEditId(item.id);
    setFormData({ 
      name: item.name, 
      price: item.price, 
      category: item.category, 
      description: item.description || '',
      img: item.img 
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
    setFormData({ name: '', price: '', category: '', description: '', img: null });
  };

  const filteredMenus = menus.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'Semua Kategori' || item.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-top-section">
          <div className="sidebar-logo-container">
            <img src={logoLaobanSvg} alt="Logo" />
          </div>
          <nav className="sidebar-menu">
            <Link to="/kasir" className={getMenuClass('/kasir')}><img src={iconDashboard} alt="Denah" className={getIconClass('/kasir')} /> Denah Meja</Link>
            <Link to="/kasir/pos" className={getMenuClass('/kasir/pos')}><img src={iconPos} alt="POS" className={getIconClass('/kasir/pos')} /> Kasir / POS</Link>
            <Link to="/kasir/pesanan" className={getMenuClass('/kasir/pesanan')}><img src={iconPesananDapur} alt="Pesanan" className={getIconClass('/kasir/pesanan')} /> Pesanan Dapur</Link>
            <Link to="/kasir/manajemen-menu" className={getMenuClass('/kasir/manajemen-menu')}><img src={iconStok} alt="Menu" className={getIconClass('/kasir/manajemen-menu')} /> Manajemen Menu</Link>
            <Link to="/kasir/stok" className={getMenuClass('/kasir/stok')}><img src={iconStok} alt="Stok" className={getIconClass('/kasir/stok')} /> Stok Bahan Baku</Link>
            <Link to="/kasir/laporan" className={getMenuClass('/kasir/laporan')}><img src={iconLaporan} alt="Laporan" className={getIconClass('/kasir/laporan')} /> Laporan & Riwayat</Link>
            <Link to="/kasir/qr-meja" className={getMenuClass('/kasir/qr-meja')}><img src={iconQrMeja} alt="QR" className={getIconClass('/kasir/qr-meja')} /> QR Code Meja</Link>
            <div className="divider"></div>
            <Link to="/admin" className="menu-item"><img src={iconDashboard} alt="Admin" className="menu-icon-svg icon-white" /> Kembali ke Pusat</Link>
          </nav>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}><img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" /> Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Cashier Mode / <span className="text-black font-bold">Menu</span></div>
          <div className="user-profile">
            <div className="user-info"><span className="user-role">Cashier 01</span><span className="user-status">Online</span></div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="dashboard-header-figma">
            <div className="header-text-group">
              <h1 className="page-title">Manajemen Menu</h1>
              <p className="page-subtitle">Kelola daftar menu, harga, dan ketersediaan</p>
            </div>
            <button className="btn-add-menu-figma" onClick={() => {setIsEditMode(false); setIsModalOpen(true);}}>
              <span className="plus-icon">+</span> Tambah Menu Cabang
            </button>
          </div>

          <div className="table-card-figma">
            <div className="toolbar-figma">
              <div className="search-bar-figma">
                <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Cari menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <select className="category-select-figma" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                {dynamicCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <table className="menu-table-figma">
              <thead>
                <tr>
                  <th>MENU</th>
                  <th>KATEGORI</th>
                  <th>HARGA</th>
                  <th>STATUS</th>
                  <th className="text-right">AKSI</th>
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
                      <label className="toggle-switch-figma">
                        <input type="checkbox" defaultChecked={item.isActive} />
                        <span className="toggle-slider round"></span>
                      </label>
                    </td>
                    <td className="action-cell">
                      <button className="btn-edit-figma" onClick={() => handleEditClick(item)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- MODAL DETAIL MENU (TAMBAH / EDIT) --- */}
      {isModalOpen && (
        <div className="modal-overlay-figma">
          <div className="modal-content-figma">
            <div className="modal-header-figma">
              <h2>{isEditMode ? 'Edit Menu Cabang' : 'Tambah Menu Baru'}</h2>
              <button className="btn-close-modal" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <div className="modal-body-figma">
              {/* SISI KIRI: UPLOAD GAMBAR */}
              <div className="modal-image-section">
                <label className="image-upload-label">
                  {formData.img ? (
                    <img src={formData.img} alt="Preview" className="image-preview-large" />
                  ) : (
                    <div className="image-placeholder">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      <span>Pilih Foto Menu</span>
                    </div>
                  )}
                  <input type="file" style={{display: 'none'}} />
                </label>
                <p className="image-hint">Format JPG, PNG. Maks 2MB</p>
              </div>

              {/* SISI KANAN: FORM INPUT */}
              <div className="modal-form-section">
                <div className="form-group-figma">
                  <label>NAMA MENU</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Contoh: Es Teh Manis" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                  />
                </div>

                <div className="form-row-figma">
                  <div className="form-group-figma">
                    <label>KATEGORI</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}>
                      <option value="">Pilih Kategori</option>
                      {dynamicCategories.filter(c => c !== 'Semua Kategori').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group-figma">
                    <label>HARGA (RP)</label>
                    <input 
                      type="number" 
                      name="price" 
                      placeholder="0" 
                      value={formData.price} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>

                <div className="form-group-figma">
                  <label>DESKRIPSI (OPSIONAL)</label>
                  <textarea 
                    name="description" 
                    rows="3" 
                    placeholder="Tulis komposisi atau detail menu..."
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer-figma">
              <button className="btn-cancel-figma" onClick={handleCloseModal}>Batal</button>
              <button className="btn-save-figma">
                {isEditMode ? 'Simpan Perubahan' : 'Tambahkan Menu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manajemenmenu;