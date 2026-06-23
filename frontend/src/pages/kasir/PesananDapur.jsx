import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import './PesananDapur.css';

// --- IMPORT ASSETS ---
import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg'; 
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';
import iconCeklis from '../../assets/Icons/icons-admin/ceklis.svg';
import iconJam from '../../assets/Icons/icons-admin/jam.svg';

const PesananDapur = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null); 

  const supabaseUrl = 'https://jxeaplzfgydytostlvmi.supabase.co';
  const supabaseKey = 'sb_publishable_PPdS9m0kJl8rKerxbRDMLA_Nh9JaOCY';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const fetchOrders = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await axios.get(`/api/kasir/orders?_t=${new Date().getTime()}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
      setErrorMsg(error.message);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const orderChannel = supabase
      .channel('pesanan-dapur-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          console.log('Ting! Ada perubahan di tabel orders:', payload);
          fetchOrders(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.post(`/api/kasir/orders/${id}/status`, { status: newStatus });
      fetchOrders(); 
    } catch (error) {
      const pesanError = error.response?.data?.message || error.message;
      alert(`Gagal: ${pesanError}`);
    }
  };

  const getMenuClass = (path) => location.pathname === path ? "menu-item active" : "menu-item";
  const getIconClass = (path) => location.pathname === path ? "menu-icon-svg" : "menu-icon-svg icon-white";

  const processingOrders = orders.filter(
    (order) => order.status?.toLowerCase() === 'pending' || order.status?.toLowerCase() === 'cooking'
  );
  
  const readyOrders = orders.filter(
    (order) => order.status?.toLowerCase() === 'ready'
  );

  // ✅ PARSING SUPER KEBAL VERSI REACT (Dipindah ke atas return)
  const renderOrderItems = (rawItems) => {
    if (!rawItems) return <div className="order-item" style={{ color: 'gray', fontSize: '12px' }}>Detail tidak tersedia</div>;

    // 1. Jika datanya sudah berupa Array rapi
    if (Array.isArray(rawItems)) {
      return rawItems.map((item, idx) => (
        <div key={idx} className="order-item">
          <span className="item-qty">{item.qty || item.quantity || 1}x</span>
          <span className="item-name">{item.name || item.nama_menu}</span>
        </div>
      ));
    }

    // 2. Jika datanya berupa String (Teks biasa dari Supabase)
    if (typeof rawItems === 'string') {
      try {
        // Coba baca siapa tahu ini JSON String
        const parsed = JSON.parse(rawItems);
        if (Array.isArray(parsed)) {
          return parsed.map((item, idx) => (
            <div key={idx} className="order-item">
              <span className="item-qty">{item.qty || item.quantity || 1}x</span>
              <span className="item-name">{item.name || item.nama_menu}</span>
            </div>
          ));
        }
      } catch (e) {
        // Jika gagal JSON parse, berarti murni teks jadul (Contoh: "Nasi Ayam (1), Mie (2)")
        // Langsung tampilkan apa adanya!
        return (
          <div className="order-item">
            <span className="item-name">{rawItems}</span>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-top-section">
          <div className="sidebar-logo-container">
            <img src={logoLaobanSvg} alt="Logo Laoban" />
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
            
            <button onClick={handleLogout} className="menu-item" style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', fontFamily: 'inherit', color: 'white', display: 'flex', alignItems: 'center', fontSize: '13px', gap: '12px', padding: '10px 16px' }}>
              <img src={iconDashboard} alt="Admin" className="menu-icon-svg icon-white" /> Kembali ke Pusat
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: 'white' }}>
            <img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="text-gray">Cashier Mode / </span>
            <span className="text-black font-bold">Orders</span>
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
                <h1 className="page-title">Live Orders</h1>
                <p className="page-subtitle">Kelola pesanan dapur dan status penyajian</p>
              </div>
            </div>

            {isLoading && orders.length === 0 ? (
                <div className="loading-state">Mensinkronkan pesanan...</div>
            ) : (
              <div className="orders-grid">
                
                {/* ========================================== */}
                {/* KOLOM SEDANG DIPROSES (Pending & Cooking)    */}
                {/* ========================================== */}
                <div className="order-column column-processing">
                  <div className="column-header">
                    <h2>Sedang Diproses</h2>
                    <span className="count-badge">{processingOrders.length}</span>
                  </div>
                  {processingOrders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-card-header">
                        <div className="table-info-box">
                          <span className="label">MEJA</span>
                          <span className="number">{order.table_number}</span>
                        </div>
                        <div className="customer-info">
                          <div className="customer-name">{order.customer_name}</div>
                          <div className="order-time">
                            <img src={iconJam} alt="Jam" className="jam-icon" />
                            {order.formatted_time || "Baru saja"}
                          </div>
                        </div>
                        <span className="status-badge lunas">{order.payment_status}</span>
                      </div>
                      
                      <div className="order-items">
                        {/* ✅ MENGGUNAKAN FUNGSI HELPER BARU */}
                        {renderOrderItems(order.items)}
                      </div>

                      <div className="order-card-footer">
                        <span className="order-id">ID: {order.order_id}</span>
                        
                        {order.status?.toLowerCase() === 'pending' ? (
                          <button className="btn-action" onClick={() => handleUpdateStatus(order.id, 'cooking')}>
                            <img src={iconCeklis} alt="Check" className="ceklis-icon" /> Mulai Masak
                          </button>
                        ) : (
                          <button className="btn-action" style={{ backgroundColor: '#eab308' }} onClick={() => handleUpdateStatus(order.id, 'ready')}>
                            <img src={iconCeklis} alt="Check" className="ceklis-icon" /> Selesai Masak
                          </button>
                        )}
                        
                      </div>
                    </div>
                  ))}
                </div>

                {/* ========================================== */}
                {/* KOLOM SIAP DISAJIKAN (Ready)                 */}
                {/* ========================================== */}
                <div className="order-column column-ready">
                  <div className="column-header">
                    <h2>Siap Disajikan</h2>
                    <span className="count-badge">{readyOrders.length}</span>
                  </div>
                  {readyOrders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-card-header">
                        <div className="table-info-box">
                          <span className="label">MEJA</span>
                          <span className="number">{order.table_number}</span>
                        </div>
                        <div className="customer-info">
                          <div className="customer-name">{order.customer_name}</div>
                          <div className="order-time">
                            <img src={iconJam} alt="Jam" className="jam-icon" />
                            {order.formatted_time || "Siap"}
                          </div>
                        </div>
                        <span className="status-badge lunas">{order.payment_status}</span>
                      </div>

                      <div className="order-items">
                        {/* ✅ MENGGUNAKAN FUNGSI HELPER BARU */}
                        {renderOrderItems(order.items)}
                      </div>

                      <div className="order-card-footer">
                        <span className="order-id">ID: {order.order_id}</span>
                        <button className="btn-action btn-ready" onClick={() => handleUpdateStatus(order.id, 'completed')}>
                          <img src={iconCeklis} alt="Check" className="ceklis-icon" /> Pesanan Diserahkan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default PesananDapur;