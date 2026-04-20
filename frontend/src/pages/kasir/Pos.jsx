import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
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
  const location = useLocation();

  // STATE APLIKASI
  const [menus, setMenus] = useState([]); // Menampung menu dari Supabase
  const [isLoading, setIsLoading] = useState(true);
  
  const [orderType, setOrderType] = useState('Takeaway');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // MENGAMBIL DATA MENU DARI SUPABASE
  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/kasir/menus?_t=${new Date().getTime()}`);
      setMenus(response.data);
    } catch (error) {
      console.error("Gagal mengambil menu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const getMenuClass = (path) => location.pathname === path ? "sidebar-item active" : "sidebar-item";
  const getIconClass = (path) => location.pathname === path ? "sidebar-icon" : "sidebar-icon icon-white";

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

  // --- LOGIKA KERANJANG BELANJA ---
  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([...cart, { id: item.id, name: item.name, price: item.price, qty: 1 }]);
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

  // --- KALKULASI UANG ---
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxPB1 = subtotal * 0.1;
  const serviceCharge = subtotal * 0.05;
  const grandTotal = subtotal + taxPB1 + serviceCharge;

  // FILTER MENU
  const dynamicCategories = ['All', ...new Set(menus.map(item => item.category))];
  const filteredMenu = menus.filter((item) => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch && item.isActive; // Hanya tampilkan yang aktif
  });

  // --- FUNGSI SUBMIT KE DATABASE (CHECKOUT) ---
  const handleCheckout = async (paymentStatus) => {
    if (!customerName.trim()) return alert("Nama pelanggan harus diisi!");
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    if (orderType === 'Dine-in' && !tableNumber.trim()) return alert("Untuk Dine-in, Nomor Meja wajib diisi!");

    setIsProcessing(true);

    // Siapkan data pesanan
    const payload = {
      customer_name: customerName,
      table_number: orderType === 'Takeaway' ? 'Takeaway' : tableNumber,
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
      subtotal: subtotal,
      tax: taxPB1 + serviceCharge,
      total_payment: grandTotal,
      payment_status: paymentStatus // 'LUNAS' atau 'BELUM BAYAR'
    };

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/kasir/orders`, payload);
      alert(`Sukses! Pesanan ${customerName} berhasil dibuat.`);
      
      // Kosongkan keranjang dan form setelah sukses
      setCart([]);
      setCustomerName('');
      setTableNumber('');
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pos-wrapper">
      {/* SIDEBAR LENGKAP */}
      <aside className="pos-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo-area" style={{ width: '100%', padding: '35px 20px 20px 20px', display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
            <img src={logoLaoban} alt="Logo" style={{ width: '100%', maxWidth: '160px', height: 'auto', display: 'block' }} />
          </div>

          <nav className="sidebar-nav" style={{ marginTop: '0px', paddingTop: '10px' }}>
            <Link to="/kasir" className={getMenuClass('/kasir')}><img src={iconDashboard} alt="Denah" className={getIconClass('/kasir')} /><span>Denah Meja</span></Link>
            <Link to="/kasir/pos" className={getMenuClass('/kasir/pos')}><img src={iconPos} alt="POS" className={getIconClass('/kasir/pos')} /><span>Kasir / POS</span></Link>
            <Link to="/kasir/pesanan" className={getMenuClass('/kasir/pesanan')}><img src={iconPesananDapur} alt="Dapur" className={getIconClass('/kasir/pesanan')} /><span>Pesanan Dapur</span></Link>
            <Link to="/kasir/manajemen-menu" className={getMenuClass('/kasir/manajemen-menu')}><img src={iconStok} alt="Menu" className={getIconClass('/kasir/manajemen-menu')} /><span>Manajemen Menu</span></Link>
            <Link to="/kasir/stok" className={getMenuClass('/kasir/stok')}><img src={iconStok} alt="Stok" className={getIconClass('/kasir/stok')} /><span>Stok Bahan Baku</span></Link>
            <Link to="/kasir/laporan" className={getMenuClass('/kasir/laporan')}><img src={iconLaporan} alt="Laporan" className={getIconClass('/kasir/laporan')} /><span>Laporan & Riwayat</span></Link>
            <Link to="/kasir/qr-meja" className={getMenuClass('/kasir/qr-meja')}><img src={iconQrMeja} alt="QR" className={getIconClass('/kasir/qr-meja')} /><span>QR Code Meja</span></Link>
            <div className="sidebar-divider" style={{ margin: '15px 16px', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <Link to="/admin" className="sidebar-item"><img src={iconDashboard} alt="Admin" className="sidebar-icon icon-white" /><span>Kembali ke Pusat</span></Link>
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
          <div className="topbar-breadcrumb"><span className="breadcrumb-gray">Cashier Mode / </span><span className="breadcrumb-bold">Pos</span></div>
          <div className="topbar-user">
            <div className="user-text">
              <span className="user-name">Cashier 01</span>
              <span className="user-status"><span className="status-dot" /> Online</span>
            </div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <div className="pos-layout">
          {/* AREA KIRI: MENU */}
          <div className="pos-menu-section">
            <div className="order-type-toggle">
              <button className={`toggle-btn ${orderType === 'Takeaway' ? 'active' : ''}`} onClick={() => setOrderType('Takeaway')}>Takeaway</button>
              <button className={`toggle-btn ${orderType === 'Dine-in' ? 'active' : ''}`} onClick={() => setOrderType('Dine-in')}>Dine-in</button>
            </div>
            <div className="search-bar">
              <input type="text" placeholder="Cari menu (ex: Nasi Goreng)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="category-filters">
              {dynamicCategories.map((cat) => (
                <button key={cat} className={`cat-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
              ))}
            </div>
            
            <div className="menu-grid">
              {isLoading ? (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>Memuat menu dari Supabase...</p>
              ) : filteredMenu.length > 0 ? (
                filteredMenu.map((item) => (
                  <div key={item.id} className="menu-card" onClick={() => addToCart(item)}>
                    <div className="menu-img-box"><img src={item.img} alt={item.name} /></div>
                    <div className="menu-info">
                      <h4>{item.name}</h4>
                      <span className="menu-price">{formatRupiah(item.price)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>Menu tidak ditemukan.</p>
              )}
            </div>
          </div>

          {/* AREA KANAN: KERANJANG (SESUAI FIGMA) */}
          <div className="pos-cart-section" style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fdfdfd' }}>
            <div className="cart-header" style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8a1313', fontSize: '16px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                Pesanan Saat Ini
              </h3>
            </div>

            <div className="customer-info-inputs" style={{ padding: '20px', display: 'flex', gap: '10px' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>NAMA PELANGGAN</label>
                <input type="text" placeholder="Ex: Budi" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div className="input-group" style={{ width: '100px' }}>
                <label style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>NO. MEJA</label>
                <input type="text" placeholder="Ex: 12" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} disabled={orderType === 'Takeaway'} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: orderType === 'Takeaway' ? '#f1f5f9' : 'white' }} />
              </div>
            </div>

            <div className="cart-items-container" style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '50px' }}>Belum ada pesanan</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item" style={{ marginBottom: '15px', borderBottom: '1px dashed #e2e8f0', paddingBottom: '15px' }}>
                    <div className="cart-item-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="cart-item-name" style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>{item.name}</span>
                      <div className="qty-controls" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '2px' }}>
                        <button onClick={() => removeItem(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px 8px', color: '#ef4444' }}>-</button>
                        <span className="qty-number" style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px 8px', color: '#10b981' }}>+</button>
                      </div>
                    </div>
                    <span className="cart-item-price" style={{ color: '#aa0000', fontSize: '14px', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
                      {formatRupiah(item.price * item.qty)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* RINGKASAN BIAYA SEPERTI FIGMA */}
            <div className="cart-summary-box" style={{ padding: '20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8f9fc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#64748b' }}>
                <span>Subtotal</span><span>{formatRupiah(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#64748b' }}>
                <span>PB1 (10%)</span><span>{formatRupiah(taxPB1)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px', color: '#64748b' }}>
                <span>Service (5%)</span><span>{formatRupiah(serviceCharge)}</span>
              </div>
              
              <div className="summary-row grand-total" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: '900', fontSize: '18px', color: '#0f172a' }}>
                <span>GRAND TOTAL</span>
                <span className="total-amount" style={{ color: '#aa0000' }}>{formatRupiah(grandTotal)}</span>
              </div>
              
              <div className="cart-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => handleCheckout('BELUM BAYAR')} 
                  disabled={isProcessing}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#64748b', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Open Table (Bayar Nanti)
                </button>
                <button 
                  onClick={() => handleCheckout('LUNAS')} 
                  disabled={isProcessing}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#aa0000', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {isProcessing ? 'Memproses...' : 'Proses Pembayaran'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Pos;