import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Pos.css';

// --- IMPORT ASSETS ---
import logoLaoban from '../../assets/Icons/icons-admin/logo.svg';
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';

const Pos = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Tambahkan untuk deteksi menu aktif

  const [orderType, setOrderType] = useState('Takeaway');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [cart, setCart] = useState([]);

  // Helper Sidebar Class
  const getMenuClass = (path) => location.pathname === path ? "sidebar-item active" : "sidebar-item";
  const getIconClass = (path) => location.pathname === path ? "sidebar-icon" : "sidebar-icon icon-white";

  const menuItems = [
    { id: 1, name: 'Nasi Goreng Kampung', price: 28000, category: 'Main Dish', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80' },
    { id: 2, name: 'Mie Goreng Spesial', price: 25000, category: 'Main Dish', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80' },
    { id: 3, name: 'Kopi Susu Lao-Hao', price: 18000, category: 'Beverage', img: 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?auto=format&fit=crop&w=300&q=80' },
    { id: 4, name: 'Teh Tarik', price: 15000, category: 'Beverage', img: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=300&q=80' },
    { id: 5, name: 'Roti Bakar Kaya', price: 15000, category: 'Snack', img: 'https://images.unsplash.com/photo-1621236378699-8597faf6a176?auto=format&fit=crop&w=300&q=80' },
    { id: 6, name: 'Es Teh Manis', price: 8000, category: 'Beverage', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const formatRupiah = (number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([...cart, { ...item, qty: 1, notes: '' }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map((item) => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id) => setCart(cart.filter((item) => item.id !== id));
  const updateNote = (id, note) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, notes: note } : item)));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxPB1 = subtotal * 0.1;
  const serviceCharge = subtotal * 0.05;
  const grandTotal = subtotal + taxPB1 + serviceCharge;

  const filteredMenu = menuItems.filter((item) => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pos-wrapper">
      {/* SIDEBAR */}
      <aside className="pos-sidebar">
        <div className="sidebar-top">
          {/* Wadah Logo Standar 160px */}
          <div className="sidebar-logo-area" style={{ width: '100%', padding: '35px 20px 20px 20px', display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
            <img src={logoLaoban} alt="Logo" style={{ width: '100%', maxWidth: '160px', height: 'auto', display: 'block' }} />
          </div>

          <nav className="sidebar-nav" style={{ marginTop: '0px', paddingTop: '10px' }}>
            <Link to="/kasir" className={getMenuClass('/kasir')}>
              <img src={iconDashboard} alt="Denah" className={getIconClass('/kasir')} />
              <span>Denah Meja</span>
            </Link>
            <Link to="/kasir/pos" className={getMenuClass('/kasir/pos')}>
              <img src={iconPos} alt="POS" className={getIconClass('/kasir/pos')} />
              <span>Kasir / POS</span>
            </Link>
            <Link to="/kasir/pesanan" className={getMenuClass('/kasir/pesanan')}>
              <img src={iconPesananDapur} alt="Dapur" className={getIconClass('/kasir/pesanan')} />
              <span>Pesanan Dapur</span>
            </Link>
            {/* Menu Manajemen Menu Baru */}
            <Link to="/kasir/manajemen-menu" className={getMenuClass('/kasir/manajemen-menu')}>
              <img src={iconStok} alt="Menu" className={getIconClass('/kasir/manajemen-menu')} />
              <span>Manajemen Menu</span>
            </Link>
            <Link to="/kasir/stok" className={getMenuClass('/kasir/stok')}>
              <img src={iconStok} alt="Stok" className={getIconClass('/kasir/stok')} />
              <span>Stok Bahan Baku</span>
            </Link>
            <Link to="/kasir/laporan" className={getMenuClass('/kasir/laporan')}>
              <img src={iconLaporan} alt="Laporan" className={getIconClass('/kasir/laporan')} />
              <span>Laporan & Riwayat</span>
            </Link>
            <Link to="/kasir/qr-meja" className={getMenuClass('/kasir/qr-meja')}>
              <img src={iconQrMeja} alt="QR" className={getIconClass('/kasir/qr-meja')} />
              <span>QR Code Meja</span>
            </Link>

            <div className="sidebar-divider" style={{ margin: '15px 16px', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />

            <Link to="/admin" className="sidebar-item">
              <img src={iconDashboard} alt="Admin" className="sidebar-icon icon-white" />
              <span>Kembali ke Pusat</span>
            </Link>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
            <img src={iconLogout} alt="Logout" className="sidebar-icon icon-white" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="pos-main">
        <header className="pos-topbar">
          <div className="topbar-breadcrumb">
            <span className="breadcrumb-gray">Cashier Mode / </span>
            <span className="breadcrumb-bold">Pos</span>
          </div>
          <div className="topbar-user">
            <div className="user-text">
              <span className="user-name">Cashier 01</span>
              <span className="user-status">
                <span className="status-dot" /> Online
              </span>
            </div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <div className="pos-layout">
          {/* Bagian Menu (Kiri) & Cart (Kanan) tetap seperti kode Abang */}
          <div className="pos-menu-section">
            <div className="order-type-toggle">
              <button className={`toggle-btn ${orderType === 'Takeaway' ? 'active' : ''}`} onClick={() => setOrderType('Takeaway')}>Takeaway</button>
              <button className={`toggle-btn ${orderType === 'Dine-in' ? 'active' : ''}`} onClick={() => setOrderType('Dine-in')}>Dine-in</button>
            </div>
            <div className="search-bar">
              <input type="text" placeholder="Cari menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="category-filters">
              {['All', 'Main Dish', 'Snack', 'Beverage'].map((cat) => (
                <button key={cat} className={`cat-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
              ))}
            </div>
            <div className="menu-grid">
              {filteredMenu.map((item) => (
                <div key={item.id} className="menu-card" onClick={() => addToCart(item)}>
                  <div className="menu-img-box"><img src={item.img} alt={item.name} /></div>
                  <div className="menu-info">
                    <h4>{item.name}</h4>
                    <span className="menu-price">Rp {item.price.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pos-cart-section">
            <div className="cart-header"><h3>Pesanan Saat Ini</h3></div>
            <div className="customer-info-inputs">
              <div className="input-group">
                <label>NAMA PELANGGAN</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div className="input-group">
                <label>NOMOR MEJA</label>
                <input type="text" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} disabled={orderType === 'Takeaway'} />
              </div>
            </div>
            <div className="cart-items-container">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-top">
                    <span className="cart-item-name">{item.name}</span>
                    <div className="qty-controls">
                      <button onClick={() => removeItem(item.id)}>🗑️</button>
                      <span className="qty-number">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)}>+</button>
                    </div>
                  </div>
                  <span className="cart-item-price">Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="cart-summary-box">
              <div className="summary-row grand-total">
                <span>GRAND TOTAL</span>
                <span className="total-amount">{formatRupiah(grandTotal)}</span>
              </div>
              <div className="cart-actions">
                <button className="btn-outline-red">Open Table</button>
                <button className="btn-solid-red">Proses Pembayaran</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pos;