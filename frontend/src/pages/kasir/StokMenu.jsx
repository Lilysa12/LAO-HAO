import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './StokMenu.css';

// --- IMPORT ASSETS (Logo & Sidebar Icons) ---
import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg'; 
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';

// --- IMPORT ASSETS (Page Specific Icons) ---
import iconTambahBarang from '../../assets/Icons/icons-admin/tambahbarang.svg';
import iconUpdateStok from '../../assets/Icons/icons-admin/updatestok.svg';
import iconPerluRestock from '../../assets/Icons/icons-admin/perlurestock.svg';

const StokMenu = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Deteksi rute aktif
  
  // STATE DATA & FILTER
  const [stokData, setStokData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua Kategori');

  // STATE MODAL 1: TAMBAH / EDIT MASTER DATA
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Bahan Pokok',
    stock: 0,
    min_stock: 0,
    unit: 'kg',
    price_per_unit: 0
  });

  // STATE MODAL 2: QUICK UPDATE STOK (RESTOCK)
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockData, setRestockData] = useState({
    id: '',
    qtyToAdd: 0
  });

  // MENGAMBIL DATA
  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/kasir/inventory?_t=${new Date().getTime()}`);
      setStokData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data stok:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // HITUNGAN RINGKASAN
  const totalItem = stokData.length;
  const perluRestock = stokData.filter(item => item.status === 'STOK MENIPIS').length;
  const nilaiEstimasi = stokData.reduce((total, item) => total + (item.sisa * item.price), 0);
  
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Helper Sidebar Class
  const getMenuClass = (path) => location.pathname === path ? "menu-item active" : "menu-item";
  const getIconClass = (path) => location.pathname === path ? "menu-icon-svg" : "menu-icon-svg icon-white";

  // HANDLER MODAL 1
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditId(null);
    setFormData({ name: '', category: 'Bahan Pokok', stock: 0, min_stock: 0, unit: 'kg', price_per_unit: 0 });
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setIsEditMode(true);
    setEditId(item.id);
    setFormData({
      name: item.nama,
      category: item.kategori,
      stock: item.sisa,
      min_stock: item.min,
      unit: item.unit,
      price_per_unit: item.price
    });
    setIsModalOpen(true);
  };

  const handleSubmitMaster = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.post(`http://127.0.0.1:8000/api/kasir/inventory/${editId}/update`, formData);
      } else {
        await axios.post('http://127.0.0.1:8000/api/kasir/inventory', formData);
      }
      setIsModalOpen(false);
      fetchInventory();
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus bahan ${nama}?`)) {
      try {
        await axios.post(`http://127.0.0.1:8000/api/kasir/inventory/${id}/delete`);
        fetchInventory();
      } catch (error) {
        alert('Gagal menghapus data.');
      }
    }
  };

  // HANDLER MODAL 2
  const handleQuickUpdateClick = () => {
    setRestockData({
      id: stokData.length > 0 ? stokData[0].id : '',
      qtyToAdd: 0
    });
    setIsRestockModalOpen(true);
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    const selectedItem = stokData.find(item => item.id === parseInt(restockData.id));
    if (!selectedItem) return;
    const newStockTotal = parseInt(selectedItem.sisa) + parseInt(restockData.qtyToAdd);

    try {
      await axios.post(`http://127.0.0.1:8000/api/kasir/inventory/${selectedItem.id}/update`, {
        stock: newStockTotal
      });
      setIsRestockModalOpen(false);
      fetchInventory();
    } catch (error) {
      alert('Gagal melakukan restock barang.');
    }
  };

  const filteredData = stokData.filter(item => {
    const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterKategori === 'Semua Kategori' || item.kategori === filterKategori;
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-container">
      {/* --- SIDEBAR STANDAR 8 MENU --- */}
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div className="sidebar-logo-container" style={{ width: '100%', padding: '35px 20px 20px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
            <img 
              src={logoLaobanSvg} 
              alt="Logo Laoban" 
              style={{ width: '100%', maxWidth: '160px', height: 'auto', display: 'block' }} 
            />
          </div>

          <nav className="sidebar-menu" style={{ marginTop: '0px', paddingTop: '10px' }}>
            <Link to="/kasir" className={getMenuClass('/kasir')}>
              <img src={iconDashboard} alt="Denah" className={getIconClass('/kasir')} /> Denah Meja
            </Link>
            <Link to="/kasir/pos" className={getMenuClass('/kasir/pos')}>
              <img src={iconPos} alt="POS" className={getIconClass('/kasir/pos')} /> Kasir / POS
            </Link>
            <Link to="/kasir/pesanan" className={getMenuClass('/kasir/pesanan')}>
              <img src={iconPesananDapur} alt="Pesanan" className={getIconClass('/kasir/pesanan')} /> Pesanan Dapur
            </Link>
            <Link to="/kasir/manajemen-menu" className={getMenuClass('/kasir/manajemen-menu')}>
              <img src={iconStok} alt="Menu" className={getIconClass('/kasir/manajemen-menu')} /> Manajemen Menu
            </Link>
            <Link to="/kasir/stok" className={getMenuClass('/kasir/stok')}>
              <img src={iconStok} alt="Stok" className={getIconClass('/kasir/stok')} /> Stok Bahan Baku
            </Link>
            <Link to="/kasir/laporan" className={getMenuClass('/kasir/laporan')}>
              <img src={iconLaporan} alt="Laporan" className={getIconClass('/kasir/laporan')} /> Laporan & Riwayat
            </Link>
            <Link to="/kasir/qr-meja" className={getMenuClass('/kasir/qr-meja')}>
              <img src={iconQrMeja} alt="QR" className={getIconClass('/kasir/qr-meja')} /> QR Code Meja
            </Link>
            <div className="divider" style={{ margin: '15px 16px', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
            <Link to="/admin" className="menu-item">
              <img src={iconDashboard} alt="Admin" className="menu-icon-svg icon-white" /> Kembali ke Pusat
            </Link>
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
                <button className="btn-secondary flex-btn" onClick={handleQuickUpdateClick}>
                  <img src={iconUpdateStok} alt="Update" className="btn-icon-svg icon-dark" />
                  Update Stok
                </button>
                <button className="btn-primary flex-btn" onClick={handleAddClick}>
                  <img src={iconTambahBarang} alt="Tambah" className="btn-icon-svg icon-white" />
                  Tambah Bahan
                </button>
              </div>
            </div>

            <div className="inventory-summary-cards">
              <div className="card summary-card">
                <span className="card-label">Total Item Bahan</span>
                <h2 className="card-value">{totalItem}</h2>
              </div>
              <div className="card summary-card card-warning">
                <span className="card-label text-red flex-align-center">
                  <img src={iconPerluRestock} alt="Warning" className="warning-icon icon-red" />
                  Perlu Restock
                </span>
                <div className="value-with-desc">
                  <h2 className="card-value">{perluRestock}</h2>
                  <span className="value-desc">item menipis</span>
                </div>
              </div>
              <div className="card summary-card">
                <span className="card-label">Nilai Estimasi Stok</span>
                <h2 className="card-value text-green">{formatRupiah(nilaiEstimasi)}</h2>
              </div>
            </div>

            <div className="card table-container">
              <div className="table-toolbar">
                <div className="search-wrapper">
                  <input type="text" placeholder="Cari bahan..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="filter-dropdown-wrapper">
                  <select className="form-input select-filter" value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)}>
                    <option value="Semua Kategori">Semua Kategori</option>
                    <option value="Bahan Pokok">Bahan Pokok</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Cemilan">Cemilan</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Memuat data...</div>
              ) : (
                <table className="transaction-table inventory-table">
                  <thead>
                    <tr>
                      <th>NAMA BAHAN</th>
                      <th>KATEGORI</th>
                      <th>SISA STOK</th>
                      <th>MIN. STOK</th>
                      <th>STATUS</th>
                      <th className="text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item.id}>
                        <td className="font-bold text-black">{item.nama}</td>
                        <td className="text-gray">{item.kategori}</td>
                        <td><span className="font-bold text-black">{item.sisa}</span> {item.unit}</td>
                        <td>{item.min} {item.unit}</td>
                        <td><span className={`badge ${item.status === 'AMAN' ? 'badge-aman' : 'badge-warning-stok'}`}>{item.status}</span></td>
                        <td className="text-right">
                          <button className="action-icon-btn" onClick={() => handleEditClick(item)}>⚙️</button>
                          <button className="action-icon-btn" onClick={() => handleDelete(item.id, item.nama)}>🗑️</button>
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

      {/* MODAL 1: MASTER DATA */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditMode ? 'Edit Bahan' : 'Tambah Bahan'}</h2>
            <form onSubmit={handleSubmitMaster}>
              <div className="modal-body">
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nama Bahan" className="form-input" required />
                <div className="form-row">
                  <select name="category" value={formData.category} onChange={handleInputChange} className="form-input half-width">
                    <option value="Bahan Pokok">Bahan Pokok</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Cemilan">Cemilan</option>
                  </select>
                  <input type="text" name="unit" value={formData.unit} onChange={handleInputChange} placeholder="Unit (kg/pcs)" className="form-input half-width" />
                </div>
                <div className="form-row">
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Stok" className="form-input half-width" />
                  <input type="number" name="min_stock" value={formData.min_stock} onChange={handleInputChange} placeholder="Min Stok" className="form-input half-width" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK RESTOCK */}
      {isRestockModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Restock Barang</h2>
            <form onSubmit={handleRestockSubmit}>
              <div className="modal-body">
                <select className="form-input" value={restockData.id} onChange={(e) => setRestockData({ ...restockData, id: e.target.value })}>
                  {stokData.map(item => <option key={item.id} value={item.id}>{item.nama}</option>)}
                </select>
                <input type="number" value={restockData.qtyToAdd} onChange={(e) => setRestockData({ ...restockData, qtyToAdd: e.target.value })} className="form-input" placeholder="Jumlah Tambahan" />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsRestockModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-primary">Update Stok</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StokMenu;