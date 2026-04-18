import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PesananDapur.css';

import logoLaoban from '../../assets/Icons/icons-customer/logoLaoban.png';
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
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // MENGAMBIL DATA DARI SUPABASE
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/kasir/orders?_t=${new Date().getTime()}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // (Opsional) Refresh otomatis tiap 10 detik agar kasir selalu dapat update terbaru
    const intervalId = setInterval(fetchOrders, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // FUNGSI LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // FUNGSI UBAH STATUS PESANAN
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/kasir/orders/${id}/status`, { status: newStatus });
      fetchOrders(); // Refresh data otomatis setelah tombol diklik
    } catch (error) {
      console.error("Gagal mengupdate status:", error);
      alert("Terjadi kesalahan saat mengupdate status pesanan.");
    }
  };

  // PISAHKAN DATA BERDASARKAN STATUS
  const processingOrders = orders.filter(order => order.status === 'diproses');
  const readyOrders = orders.filter(order => order.status === 'siap');

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logoLaoban} alt="Laoban Logo" className="logo-circle" />
          <div className="brand-text">
            <h2>LAOBAN</h2>
            <p>BY UNCLE OEH</p>
          </div>
        </div>

        <nav className="sidebar-menu">
          <Link to="/kasir" className="menu-item">
            <img src={iconDashboard} alt="Denah" className="menu-icon-svg icon-white" />
            Denah Meja
          </Link>
          <Link to="/kasir/pos" className="menu-item">
            <img src={iconPos} alt="POS" className="menu-icon-svg icon-white" />
            Kasir / POS
          </Link>
          <Link to="/kasir/pesanan" className="menu-item active">
            <img src={iconPesananDapur} alt="Pesanan" className="menu-icon-svg" />
            Pesanan Dapur
          </Link>
          <Link to="/kasir/stok" className="menu-item">
            <img src={iconStok} alt="Stok" className="menu-icon-svg icon-white" />
            Stok & Menu
          </Link>
          <Link to="/kasir/laporan" className="menu-item">
            <img src={iconLaporan} alt="Laporan" className="menu-icon-svg icon-white" />
            Laporan & Riwayat
          </Link>
          <Link to="/kasir/qr" className="menu-item">
            <img src={iconQrMeja} alt="QR" className="menu-icon-svg icon-white" />
            QR Code Meja
          </Link>

          <div className="divider"></div>

          <Link to="/admin" className="menu-item">
            <img src={iconDashboard} alt="Admin" className="menu-icon-svg icon-white" />
            Kembali ke Pusat
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" />
            Logout
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
               <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Mensinkronkan pesanan dari Supabase...</div>
            ) : (
              <div className="orders-grid">
                
                {/* KOLOM 1: SEDANG DIPROSES */}
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
                          {order.items.map((item, index) => (
                            <div key={index} className="order-item">
                              <span className="item-qty">{item.qty}x</span>
                              <span className="item-name">{item.name}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="order-card-footer">
                          <span className="order-id">ID: {order.order_id}</span>
                          {/* TOMBOL UNTUK PINDAH KE KOLOM KANAN */}
                          <button className="btn-action" onClick={() => handleUpdateStatus(order.id, 'siap')}>
                            <img src={iconCeklis} alt="Check" className="icon-white ceklis-icon" />
                            Sajikan / Selesai
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', color: '#64748b', textAlign: 'center', fontSize: '14px' }}>Tidak ada pesanan masuk.</div>
                  )}
                </div>

                {/* KOLOM 2: SIAP DISAJIKAN */}
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
                          {order.items.map((item, index) => (
                            <div key={index} className="order-item">
                              <span className="item-qty">{item.qty}x</span>
                              <span className="item-name">{item.name}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="order-card-footer">
                          <span className="order-id">ID: {order.order_id}</span>
                          {/* TOMBOL UNTUK MENGHILANGKAN PESANAN DARI LAYAR */}
                          <button className="btn-action" style={{ backgroundColor: '#10b981' }} onClick={() => handleUpdateStatus(order.id, 'selesai')}>
                            <img src={iconCeklis} alt="Check" className="icon-white ceklis-icon" />
                            Pesanan Diserahkan
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', color: '#64748b', textAlign: 'center', fontSize: '14px' }}>Tidak ada pesanan siap saji.</div>
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