import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './History.css';
import Loading from '../../../components/Loading'; // <--- IMPORT LOADING

// SVG Icons
const IconBack = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const IconCutlery = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
    <path d="M7 2v20"></path>
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
  </svg>
);

export default function History() {
  const navigate = useNavigate();
  const [historyOrders, setHistoryOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // STATE UNTUK LOADING
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading selama 1.2 detik agar animasi terlihat
    const timer = setTimeout(() => {
      // 1. Ambil data dari Session Storage
      const sessionData = sessionStorage.getItem('laoban_order_history');
      let parsedData = [];
      
      if (sessionData) {
        parsedData = JSON.parse(sessionData);
      } else {
        // MOCKUP DATA JIKA SESSION KOSONG
        parsedData = [
          {
            id: '#LH-992705',
            title: 'Sarapan Klasik Lao-Hao',
            date: new Date().toISOString(),
            totalItems: 2,
            totalPrice: 48500,
            status: 'SELESAI',
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&q=80',
            items: [{ name: 'Kopi Laoban', price: 12000, qty: 1 }, { name: 'Nasi Lemak', price: 36500, qty: 1 }]
          },
          {
            id: '#LH-991822',
            title: 'Nasi Lemak Special',
            date: new Date(Date.now() - 3600000).toISOString(),
            totalItems: 3,
            totalPrice: 72000,
            status: 'SELESAI',
            image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&q=80',
            items: [{ name: 'Nasi Lemak', price: 36000, qty: 1 }, { name: 'Teh Tarik', price: 18000, qty: 2 }]
          }
        ];
      }

      // 2. FILTER WAKTU: Hanya tampilkan pesanan dalam 24 Jam terakhir
      const currentTime = new Date().getTime();
      const timeLimit = 24 * 60 * 60 * 1000; 
      
      const validOrders = parsedData.filter(order => {
        const orderTime = new Date(order.date).getTime();
        return (currentTime - orderTime) <= timeLimit;
      });

      setHistoryOrders(validOrders);
      setIsLoading(false); // Matikan loading setelah data siap
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('id-ID', options).replace(',', '');
  };

  // TAMPILKAN KOMPONEN LOADING JIKA MASIH PROSES
  if (isLoading) {
    return <Loading text="Mencari riwayat pesananmu..." />;
  }

  return (
    <div className="hs-container">
      {/* --- HEADER --- */}
      <header className="hs-header">
        <button className="hs-back-btn" onClick={() => navigate(-1)}>
          <IconBack />
        </button>
        <h1 className="hs-brand-title">LAO-HAO</h1>
      </header>

      {/* --- CONTENT --- */}
      <main className="hs-main">
        <h2 className="hs-page-title">Riwayat Pesanan</h2>

        <div className="hs-list">
          {historyOrders.length > 0 ? (
            historyOrders.map((order, index) => (
              <div key={index} className="hs-card fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                
                <div className="hs-card-top">
                  <div className="hs-card-img">
                    <img src={order.image || 'https://via.placeholder.com/150'} alt={order.title} />
                  </div>
                  <div className="hs-card-info">
                    <div className="hs-info-header">
                      <span className="hs-order-id">{order.id}</span>
                      <span className={`hs-badge ${order.status === 'SELESAI' ? 'badge-green' : 'badge-red'}`}>
                        {order.status}
                      </span>
                    </div>
                    <h3 className="hs-order-title">{order.title}</h3>
                    <p className="hs-order-date">{formatDate(order.date)}</p>
                  </div>
                </div>

                <div className="hs-divider"></div>

                <div className="hs-card-middle">
                  <div className="hs-total-items">
                    <IconCutlery />
                    <span>{order.totalItems} Items</span>
                  </div>
                  <div className="hs-total-price-box">
                    <span className="hs-price-label">Total Bayar</span>
                    <span className="hs-price-value">{formatRupiah(order.totalPrice)}</span>
                  </div>
                </div>

                <button className="hs-btn-detail" onClick={() => setSelectedOrder(order)}>
                  Detail
                </button>

              </div>
            ))
          ) : (
            <div className="hs-empty-state">
              <p>Belum ada riwayat pesanan dalam 24 jam terakhir.</p>
            </div>
          )}
        </div>
      </main>

      {/* ================= MODAL DETAIL PESANAN ================= */}
      {selectedOrder && (
        <div className="hs-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="hs-modal-box slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="hs-modal-header">
              <h2>Detail Pesanan</h2>
              <button className="hs-close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            
            <div className="hs-modal-body">
              <div className="hs-modal-status">
                <span className="hs-order-id">{selectedOrder.id}</span>
                <span className={`hs-badge ${selectedOrder.status === 'SELESAI' ? 'badge-green' : 'badge-red'}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <p className="hs-order-date">{formatDate(selectedOrder.date)}</p>
              
              <div className="hs-detail-items">
                <h4>Item Dipesan:</h4>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="hs-detail-item-row">
                    <span className="hs-item-name">{item.qty || item.quantity || 1}x {item.name}</span>
                    <span className="hs-item-price">{formatRupiah((item.price || 0) * (item.qty || item.quantity || 1))}</span>
                  </div>
                ))}
              </div>

              <div className="hs-divider" style={{margin: '15px 0'}}></div>

              <div className="hs-detail-summary">
                <div className="hs-summary-row">
                  <span>Subtotal</span>
                  <span>{formatRupiah(selectedOrder.totalPrice)}</span>
                </div>
                <div className="hs-summary-row">
                  <span>Pajak & Layanan</span>
                  <span>Sudah Termasuk</span>
                </div>
                <div className="hs-summary-row hs-grand-total">
                  <span>Total Pembayaran</span>
                  <span className="text-red">{formatRupiah(selectedOrder.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
