import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './StokMenu.css';

// --- IMPORT ASSETS ---
import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg'; 
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';

// --- Page Icons ---
import iconUpdateStok from '../../assets/Icons/icons-admin/updatestok.svg';

const StokMenu = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [stokData, setStokData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua Kategori');
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/kasir/inventory?_t=${new Date().getTime()}`);
      setStokData(response.data);
    } catch (error) { console.error(error); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchInventory(); }, []);

  const totalItem = stokData.length;
  const perluRestock = stokData.filter(item => item.status === 'STOK MENIPIS').length;
  const nilaiEstimasi = stokData.reduce((total, item) => total + (item.sisa * (item.price || 0)), 0);
  
  const formatRupiah = (angka) => `Rp ${(angka / 1000).toLocaleString('id-ID')}K`;

  const getMenuClass = (path) => location.pathname === path ? "menu-item active" : "menu-item";
  const getIconClass = (path) => location.pathname === path ? "menu-icon-svg" : "menu-icon-svg icon-white";

  const filteredData = stokData.filter(item => {
    const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterKategori === 'Semua Kategori' || item.kategori === filterKategori;
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-top-section">
          <div className="sidebar-logo-container"><img src={logoLaobanSvg} alt="Logo" /></div>
          <nav className="sidebar-menu">
            <Link to="/kasir" className={getMenuClass('/kasir')}><img src={iconDashboard} alt="Denah" className={getIconClass('/kasir')} /> Denah Meja</Link>
            <Link to="/kasir/pos" className={getMenuClass('/kasir/pos')}><img src={iconPos} alt="POS" className={getIconClass('/kasir/pos')} /> Kasir / POS</Link>
            <Link to="/kasir/pesanan" className={getMenuClass('/kasir/pesanan')}><img src={iconPesananDapur} alt="Pesanan" className={getIconClass('/kasir/pesanan')} /> Pesanan Dapur</Link>
            <Link to="/kasir/manajemen-menu" className={getMenuClass('/kasir/manajemen-menu')}><img src={iconStok} alt="Menu" className={getIconClass('/kasir/manajemen-menu')} /> Manajemen Menu</Link>
            <Link to="/kasir/stok" className={getMenuClass('/kasir/stok')}><img src={iconStok} alt="Stok" className={getIconClass('/kasir/stok')} /> Stok Bahan Baku</Link>
            <Link to="/kasir/laporan" className={getMenuClass('/kasir/laporan')}><img src={iconLaporan} alt="Laporan" className={getIconClass('/kasir/laporan')} /> Laporan & Riwayat</Link>
            <Link to="/kasir/qr-meja" className={getMenuClass('/kasir/qr-meja')}><img src={iconQrMeja} alt="QR" className={getIconClass('/kasir/qr-meja')} /> QR Code Meja</Link>
            <div className="divider" />
            <Link to="/admin" className="menu-item"><img src={iconDashboard} alt="Admin" className="menu-icon-svg icon-white" /> Kembali ke Pusat</Link>
          </nav>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => navigate('/login')}><img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" /> Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Cashier Mode / <span className="text-black font-bold">Inventory</span></div>
          <div className="user-profile">
            <div className="user-info"><span className="user-role">Cashier 01</span><span className="user-status">Online</span></div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="inventory-header">
            <div>
              <h1 className="page-title">Stok Bahan (Inventory)</h1>
              <p className="page-subtitle">Pantau persediaan bahan baku dan minimal stok</p>
            </div>
            <button className="btn-update-stok" onClick={() => setIsRestockModalOpen(true)}>
              <img src={iconUpdateStok} alt="Update" /> Update Stok Masuk
            </button>
          </div>

          <div className="summary-cards">
            <div className="card summary-card">
              <span className="card-label">Total Item Bahan</span>
              <h2 className="card-value">{totalItem}</h2>
            </div>
            
            {/* FIX: CARD PERLU RESTOCK DENGAN INLINE SVG BIAR GAK HILANG */}
            <div className="card summary-card card-warning-border">
              <span className="card-label label-red">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                PERLU RESTOCK
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

          <div className="table-container-card">
            <div className="toolbar">
              <div className="search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Cari bahan baku..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <select className="category-select" value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)}>
                <option value="Semua Kategori">Semua Kategori</option>
                <option value="Bahan Pokok">Bahan Pokok</option>
                <option value="Minuman">Minuman</option>
              </select>
            </div>

            <table className="inventory-table">
              <thead>
                <tr>
                  <th>NAMA BAHAN</th>
                  <th>KATEGORI</th>
                  <th>SISA STOK</th>
                  <th>MIN. STOK</th>
                  <th>STATUS</th>
                  <th>UPDATE TERAKHIR</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="font-bold">{item.nama}</td>
                    <td className="text-gray">{item.kategori}</td>
                    <td><span className="font-bold">{item.sisa}</span> <span className="text-unit">{item.unit}</span></td>
                    <td className="text-gray">{item.min} {item.unit}</td>
                    <td>
                      <span className={`badge ${item.status === 'AMAN' ? 'badge-aman' : 'badge-menipis'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="text-gray">Hari ini, 08:00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL UPDATE STOK */}
      {isRestockModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Update Stok Bahan Baku</h2>
              {/* FIX: CLASS INI BIAR 'X' GAK KABUR KE UJUNG KULON */}
              <button className="close-stok-btn" onClick={() => setIsRestockModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>PILIH BAHAN</label><select className="form-input"><option>Pilih bahan baku...</option></select></div>
              <div className="form-row">
                <div className="form-group flex-1"><label>JENIS</label><input type="text" value="Masuk" disabled className="form-input bg-gray" /></div>
                <div className="form-group flex-1"><label>SATUAN</label><input type="text" placeholder="Kg" disabled className="form-input bg-gray" /></div>
              </div>
              <div className="form-group"><label>KUANTITAS</label><input type="number" placeholder="Ex: 50" className="form-input" /></div>
              <div className="form-group"><label>CATATAN</label><textarea placeholder="Ex: Restock mingguan dari supplier utama" className="form-input"></textarea></div>
            </div>
            <div className="modal-footer">
              <button className="btn-batal" onClick={() => setIsRestockModalOpen(false)}>Batal</button>
              <button className="btn-update-final">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><polyline points="20 6 9 17 4 12"></polyline></svg>
                 Update Catatan Stok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StokMenu;