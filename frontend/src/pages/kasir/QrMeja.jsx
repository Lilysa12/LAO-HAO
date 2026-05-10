import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './QrMeja.css';

// --- IMPORT ASSETS ---
import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg'; 
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';

const QrMeja = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [activeTab, setActiveTab] = useState('Semua Meja');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputMeja, setInputMeja] = useState('');
  
  // STATE UNTUK DATA DARI SUPABASE
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // MENGAMBIL DATA MEJA DARI DATABASE
  const fetchTables = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/kasir/tables?_t=${new Date().getTime()}`);
      setTables(response.data);
    } catch (error) {
      console.error("Gagal mengambil data meja:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => document.body.style.overflow = 'auto';
  }, [isModalOpen]);

  // --- FIX: FUNGSI LOGOUT DIPERBAIKI ---
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const getMenuClass = (path) => location.pathname === path ? "menu-item active" : "menu-item";
  const getIconClass = (path) => location.pathname === path ? "menu-icon-svg" : "menu-icon-svg icon-white";

  // FILTERING LOGIC
  const filteredTables = tables.filter(table => {
    if (activeTab === 'Semua Meja') return true;
    if (activeTab === 'Aktif' && table.status !== 'pending' && table.status !== 'lunas') return true; // Asumsi 'tersedia' = Aktif
    if (activeTab === 'Nonaktif' && (table.status === 'pending' || table.status === 'lunas')) return true; // Sedang dipakai = Nonaktif QR sementara
    return false;
  });

  // FUNGSI MENCETAK QR CODE KE PDF
  const handlePrintQR = (tableName) => {
    const tableIdClean = tableName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const urlOrder = `https://laohao.com/order/t/${tableIdClean}`;
    const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(urlOrder)}`;

    const printWindow = window.open('', '_blank', 'width=600,height=800');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak QR - ${tableName}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: white; }
            .card { border: 2px solid #e2e8f0; border-radius: 16px; padding: 40px; text-align: center; width: 350px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
            h1 { color: #aa0000; margin-bottom: 5px; font-size: 28px; }
            p { color: #64748b; margin-top: 0; margin-bottom: 30px; font-size: 14px; }
            img { width: 250px; height: 250px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; }
            h2 { color: #1e293b; margin-top: 30px; font-size: 32px; letter-spacing: 2px; }
            .footer { margin-top: 15px; font-size: 12px; color: #94a3b8; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>LAO-HAO</h1>
            <p>Scan di sini untuk memesan</p>
            <img src="${qrImageSrc}" alt="QR Code" onload="window.print()" />
            <h2>MEJA ${tableName}</h2>
            <div class="footer">${urlOrder}</div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleGenerateNewQR = () => {
    if (!inputMeja) return alert('Silakan masukkan nomor meja terlebih dahulu!');
    handlePrintQR(inputMeja);
    setIsModalOpen(false);
    setInputMeja('');
  };

  return (
    <div className="admin-container">
      {/* --- SIDEBAR STANDAR --- */}
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div className="sidebar-logo-container" style={{ width: '100%', padding: '35px 20px 20px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
            <img src={logoLaobanSvg} alt="Logo" style={{ width: '100%', maxWidth: '160px', height: 'auto', display: 'block' }} />
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
            
            {/* --- FIX: TOMBOL KEMBALI KE PUSAT SEKARANG MEMICU LOGOUT --- */}
            <button onClick={handleLogout} className="menu-item" style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', fontFamily: 'inherit', color: 'white', display: 'flex', alignItems: 'center', fontSize: '13px', gap: '12px', padding: '10px 16px' }}>
              <img src={iconDashboard} alt="Admin" className="menu-icon-svg icon-white" /> Kembali ke Pusat
            </button>
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
          <div className="breadcrumb"><span className="text-gray">Cashier Mode / </span><span className="text-black font-bold">Qr Meja</span></div>
          <div className="user-profile">
            <div className="user-info">
                <span className="user-role">Cashier 01</span>
                <span className="user-status">Online</span>
            </div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="page-title">QR Code Meja</h1>
              <p className="page-subtitle">Kelola meja dan cetak QR Code untuk self-ordering</p>
            </div>
            
            <button className="btn-generate-main" onClick={() => setIsModalOpen(true)}>
              <span className="plus-icon-large">+</span> Generate QR Baru
            </button>
          </div>

          <div className="qr-filter-container" style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
            {['Semua Meja', 'Aktif', 'Nonaktif'].map(tab => (
               <button 
                 key={tab}
                 className={`filter-tab ${activeTab === tab ? 'active' : ''}`} 
                 onClick={() => setActiveTab(tab)}
               >
                 {tab}
               </button>
            ))}
          </div>

          {isLoading ? (
             <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Menarik data meja dari database...</div>
          ) : (
            <div className="qr-grid">
              {filteredTables.map((table) => {
                const isNonaktif = table.status === 'pending' || table.status === 'lunas';
                return (
                  <div key={table.id} className={`qr-card ${isNonaktif ? 'nonaktif' : ''}`} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', textAlign: 'center', opacity: isNonaktif ? 0.6 : 1, position: 'relative' }}>
                    <div className="qr-card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                      <span style={{ color: isNonaktif ? '#ef4444' : '#10b981', backgroundColor: isNonaktif ? '#fee2e2' : '#d1fae5', padding: '4px 8px', borderRadius: '4px' }}>
                        {isNonaktif ? 'NONAKTIF' : 'AKTIF'}
                      </span>
                      <span style={{ color: '#64748b' }}>👥 {table.capacity} Org</span>
                    </div>
                    
                    <div className="qr-frame-box" style={{ margin: '0 auto 20px auto', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: isNonaktif ? 'not-allowed' : 'pointer' }} onClick={() => !isNonaktif && handlePrintQR(table.table_number)}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://laohao.com/order/t/${table.table_number.toLowerCase().replace(/[^a-z0-9]/g, '')}`} 
                        alt="QR" 
                        style={{ width: '100%', height: '100%', borderRadius: '8px' }} 
                      />
                      
                      {!isNonaktif && (
                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        </div>
                      )}
                    </div>

                    <div className="qr-card-footer">
                      <h3 style={{ fontSize: '20px', margin: '0 0 5px 0', color: '#1e293b' }}>MEJA {table.table_number}</h3>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>laohao.com/order/t/{table.table_number.toLowerCase().replace(/[^a-z0-9]/g, '')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL GENERATE QR BARU --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="qr-modal" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', width: '400px', textAlign: 'center' }}>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            <h2 style={{ marginBottom: '10px', marginTop: 0 }}>Generate QR Custom</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>QR Code ini dapat dicetak untuk meja tambahan atau event khusus.</p>
            
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '5px' }}>NOMOR / NAMA MEJA CUSTOM</label>
              <input 
                type="text" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', boxSizing: 'border-box', outline: 'none' }}
                placeholder="EX: VIP-2 OUTDOOR" 
                value={inputMeja}
                onChange={(e) => setInputMeja(e.target.value.toUpperCase())}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', fontWeight: 'bold', color: '#64748b' }} onClick={() => setIsModalOpen(false)}>Batal</button>
              <button style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', background: '#aa0000', color: 'white', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleGenerateNewQR}>Generate & Unduh PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrMeja;