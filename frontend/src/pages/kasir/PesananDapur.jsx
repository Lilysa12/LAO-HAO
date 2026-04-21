import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

  const fetchOrders = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/kasir/orders?_t=${new Date().getTime()}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
      setErrorMsg(error.message + (error.response?.data?.message ? ` - ${error.response.data.message}` : ''));
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // --- PERBAIKAN: Menampilkan Error Asli di Alert ---
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/kasir/orders/${id}/status`, { status: newStatus });
      fetchOrders(); 
    } catch (error) {
      console.error("Gagal mengupdate status:", error);
      // Tampilkan pesan error langsung dari Laravel agar mudah dilacak
      const pesanError = error.response?.data?.message || error.message;
      alert(`Gagal: ${pesanError}`);
    }
  };

  const getMenuClass = (path) => location.pathname === path ? "menu-item active" : "menu-item";
  const getIconClass = (path) => location.pathname === path ? "menu-icon-svg" : "menu-icon-svg icon-white";

  const processingOrders = orders.filter(order => order.status === 'diproses');
  const readyOrders = orders.filter(order => order.status === 'siap');

  return (
    <div className="admin-container">
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div className="sidebar-logo-container" style={{ width: '100%', padding: '35px 20px 20px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
            <img src={logoLaobanSvg} alt="Logo Laoban" style={{ width: '100%', maxWidth: '160px', height: 'auto', display: 'block' }} />
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
                <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Mensinkronkan pesanan...</div>
            ) : errorMsg ? (
                <div style={{ textAlign: 'center', padding: '30px', margin: '20px 0', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', border: '1px solid #f87171' }}>
                    <strong>Koneksi ke Database Bermasalah:</strong> <br/> {errorMsg} <br/> 
                    <small style={{ display: 'block', marginTop: '10px' }}>Struktur tabel di Supabase mungkin tidak sesuai.</small>
                </div>
            ) : (
              <div className="orders-grid">
                <div className="order-column column-processing">
                  <div className="column-header">
                    <h2>Sedang Diproses</h2>
                    <span className="count-badge">{processingOrders.length}</span>
                  </div>
                  {processingOrders.length > 0 ? (
                    processingOrders.map((order) => (
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
                              {order.formatted_time}
                            </div>
                          </div>
                          <span className={`status-badge ${order.payment_status === 'LUNAS' ? 'lunas' : 'pending'}`}>
                            {order.payment_status}
                          </span>
                        </div>
                        <div className="order-items">
                          {order.items && order.items.map((item, index) => (
                            <div key={index} className="order-item">
                              <span className="item-qty">{item.qty}x</span>
                              <span className="item-name">{item.name}</span>
                            </div>
                          ))}
                        </div>
                        <div className="order-card-footer">
                          <span className="order-id">ID: {order.order_id}</span>
                          <button className="btn-action" onClick={() => handleUpdateStatus(order.id, 'siap')}>
                            <img src={iconCeklis} alt="Check" className="icon-white ceklis-icon" />
                            Sajikan / Selesai
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', color: '#64748b', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px' }}>Tidak ada pesanan masuk.</div>
                  )}
                </div>

                <div className="order-column column-ready">
                  <div className="column-header">
                    <h2>Siap Disajikan</h2>
                    <span className="count-badge">{readyOrders.length}</span>
                  </div>
                  {readyOrders.length > 0 ? (
                    readyOrders.map((order) => (
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
                              {order.formatted_time}
                            </div>
                          </div>
                          <span className={`status-badge ${order.payment_status === 'LUNAS' ? 'lunas' : 'pending'}`}>
                            {order.payment_status}
                          </span>
                        </div>
                        <div className="order-items">
                          {order.items && order.items.map((item, index) => (
                            <div key={index} className="order-item">
                              <span className="item-qty">{item.qty}x</span>
                              <span className="item-name">{item.name}</span>
                            </div>
                          ))}
                        </div>
                        <div className="order-card-footer">
                          <span className="order-id">ID: {order.order_id}</span>
                          <button className="btn-action" style={{ backgroundColor: '#10b981' }} onClick={() => handleUpdateStatus(order.id, 'selesai')}>
                            <img src={iconCeklis} alt="Check" className="icon-white ceklis-icon" />
                            Pesanan Diserahkan
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', color: '#64748b', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px' }}>Tidak ada pesanan siap saji.</div>
                  )}
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