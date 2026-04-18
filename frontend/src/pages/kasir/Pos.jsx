import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const [orderType, setOrderType] = useState('Takeaway');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [cart, setCart] = useState([]);

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

        {/* Logo + Nav dalam satu blok agar tidak terpisah */}
        <div className="sidebar-top">
          <div className="sidebar-logo-area">
            <img src={logoLaoban} alt="Laoban Logo" className="sidebar-logo-img" />
          </div>
          <nav className="sidebar-nav">
          <Link to="/kasir" className="sidebar-item">
            <img src={iconDashboard} alt="Denah" className="sidebar-icon icon-white" />
            <span>Denah Meja</span>
          </Link>
          <Link to="/kasir/pos" className="sidebar-item active">
            <img src={iconPos} alt="POS" className="sidebar-icon" />
            <span>Kasir / POS</span>
          </Link>
          <Link to="/kasir/pesanan" className="sidebar-item">
            <img src={iconPesananDapur} alt="Dapur" className="sidebar-icon icon-white" />
            <span>Pesanan Dapur</span>
          </Link>
          <Link to="/kasir/stok" className="sidebar-item">
            <img src={iconStok} alt="Stok" className="sidebar-icon icon-white" />
            <span>Stok & Menu</span>
          </Link>
          <Link to="/kasir/laporan" className="sidebar-item">
            <img src={iconLaporan} alt="Laporan" className="sidebar-icon icon-white" />
            <span>Laporan & Riwayat</span>
          </Link>
          <Link to="/kasir/qr" className="sidebar-item">
            <img src={iconQrMeja} alt="QR" className="sidebar-icon icon-white" />
            <span>QR Code Meja</span>
          </Link>

          <div className="sidebar-divider" />

          <Link to="/admin" className="sidebar-item">
            <img src={iconDashboard} alt="Admin" className="sidebar-icon icon-white" />
            <span>Kembali ke Pusat</span>
          </Link>
          </nav>

        </div>{/* end sidebar-top */}

        {/* Logout */}
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <img src={iconLogout} alt="Logout" className="sidebar-icon icon-white" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="pos-main">

        {/* Topbar */}
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
            <div className="user-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
          </div>
        </header>

        {/* POS Layout */}
        <div className="pos-layout">

          {/* KIRI: MENU */}
          <div className="pos-menu-section">

            <div className="order-type-toggle">
              <button
                className={`toggle-btn ${orderType === 'Takeaway' ? 'active' : ''}`}
                onClick={() => setOrderType('Takeaway')}
              >
                Takeaway
              </button>
              <button
                className={`toggle-btn ${orderType === 'Dine-in' ? 'active' : ''}`}
                onClick={() => setOrderType('Dine-in')}
              >
                Dine-in
              </button>
            </div>

            <div className="search-bar">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Cari menu (ex: Nasi Goreng)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="category-filters">
              {['All', 'Main Dish', 'Snack', 'Beverage'].map((cat) => (
                <button
                  key={cat}
                  className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="menu-grid">
              {filteredMenu.map((item) => (
                <div key={item.id} className="menu-card" onClick={() => addToCart(item)}>
                  <div className="menu-img-box">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="menu-info">
                    <h4>{item.name}</h4>
                    <span className="menu-price">Rp {item.price.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KANAN: CART */}
          <div className="pos-cart-section">

            <div className="cart-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aa0000" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <h3>Pesanan Saat Ini</h3>
            </div>

            <div className="customer-info-inputs">
              <div className="input-group">
                <label>NAMA PELANGGAN</label>
                <input
                  type="text"
                  placeholder="Ex: Budi"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>NOMOR MEJA</label>
                <input
                  type="text"
                  placeholder="Ex: 12"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  disabled={orderType === 'Takeaway'}
                />
              </div>
            </div>

            <div className="cart-items-container">
              {cart.length === 0 ? (
                <div className="empty-cart">Belum ada pesanan</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-top">
                      <span className="cart-item-name">{item.name}</span>
                      <div className="qty-controls">
                        <button className="btn-trash" onClick={() => removeItem(item.id)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                        <span className="qty-number">{item.qty}</span>
                        <button className="btn-plus" onClick={() => updateQty(item.id, 1)}>+</button>
                      </div>
                    </div>
                    <span className="cart-item-price">Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
                    <div className="cart-item-notes">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Tambah catatan..."
                        value={item.notes}
                        onChange={(e) => updateNote(item.id, e.target.value)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-summary-box">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>PB1 (10%)</span>
                <span>{formatRupiah(taxPB1)}</span>
              </div>
              <div className="summary-row">
                <span>Service (5%)</span>
                <span>{formatRupiah(serviceCharge)}</span>
              </div>
              <div className="summary-row grand-total">
                <span>GRAND TOTAL</span>
                <span className="total-amount">{formatRupiah(grandTotal)}</span>
              </div>
              <div className="cart-actions">
                <button className="btn-outline-red">Open Table (Bayar Nanti)</button>
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
