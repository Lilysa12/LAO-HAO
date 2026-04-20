import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './DenahMeja.css';

// --- IMPORT ASSETS ---
import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg';
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';

const DenahMeja = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Untuk deteksi menu aktif
    const [activeArea, setActiveArea] = useState('indoor');
    const [tables, setTables] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTables = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/kasir/tables?_t=${new Date().getTime()}`);
            setTables(response.data);
        } catch (error) {
            console.error("Gagal mengambil data meja:", error);
            setTables([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const tablesIndoor = tables.filter(t => t.area === 'indoor');
    const tablesOutdoor = tables.filter(t => t.area === 'outdoor');
    const currentTables = activeArea === 'indoor' ? tablesIndoor : tablesOutdoor;

    // Helper untuk class active & icon white
    const getMenuClass = (path) => location.pathname === path ? "menu-item active" : "menu-item";
    const getIconClass = (path) => location.pathname === path ? "menu-icon-svg" : "menu-icon-svg icon-white";

    return (
        <div className="admin-container">
            {/* --- SIDEBAR KONSISTEN 8 MENU --- */}
            <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    {/* WADAH LOGO STANDAR 160PX */}
                    <div className="sidebar-logo-container" style={{ width: '100%', padding: '35px 20px 20px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
                        <img src={logoLaobanSvg} alt="Logo Laoban" style={{ width: '100%', maxWidth: '160px', height: 'auto', display: 'block' }} />
                    </div>
                    
                    <nav className="sidebar-menu" style={{ marginTop: '0px', paddingTop: '10px' }}>
                        {/* 1. Denah Meja */}
                        <Link to="/kasir" className={getMenuClass('/kasir')}>
                            <img src={iconDashboard} alt="Denah" className={getIconClass('/kasir')} /> Denah Meja
                        </Link>

                        {/* 2. Kasir / POS */}
                        <Link to="/kasir/pos" className={getMenuClass('/kasir/pos')}>
                            <img src={iconPos} alt="POS" className={getIconClass('/kasir/pos')} /> Kasir / POS
                        </Link>

                        {/* 3. Pesanan Dapur */}
                        <Link to="/kasir/pesanan" className={getMenuClass('/kasir/pesanan')}>
                            <img src={iconPesananDapur} alt="Pesanan" className={getIconClass('/kasir/pesanan')} /> Pesanan Dapur
                        </Link>

                        {/* 4. Manajemen Menu */}
                        <Link to="/kasir/manajemen-menu" className={getMenuClass('/kasir/manajemen-menu')}>
                            <img src={iconStok} alt="Manajemen Menu" className={getIconClass('/kasir/manajemen-menu')} /> Manajemen Menu
                        </Link>

                        {/* 5. Stok Bahan Baku */}
                        <Link to="/kasir/stok" className={getMenuClass('/kasir/stok')}>
                            <img src={iconStok} alt="Stok" className={getIconClass('/kasir/stok')} /> Stok Bahan Baku
                        </Link>

                        {/* 6. Laporan & Riwayat */}
                        <Link to="/kasir/laporan" className={getMenuClass('/kasir/laporan')}>
                            <img src={iconLaporan} alt="Laporan" className={getIconClass('/kasir/laporan')} /> Laporan & Riwayat
                        </Link>

                        {/* 7. QR Code Meja */}
                        <Link to="/kasir/qr-meja" className={getMenuClass('/kasir/qr-meja')}>
                            <img src={iconQrMeja} alt="QR" className={getIconClass('/kasir/qr-meja')} /> QR Code Meja
                        </Link>

                        <div className="divider" style={{ margin: '15px 16px', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>

                        {/* 8. Kembali ke Pusat */}
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
                        <span className="text-black font-bold">Tables</span>
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
                                <h1 className="page-title">Denah Meja</h1>
                                <p className="page-subtitle">Manajemen ketersediaan meja cabang</p>
                            </div>
                        </div>

                        <div className="area-tabs">
                            <button className={`tab-btn ${activeArea === 'indoor' ? 'active' : ''}`} onClick={() => setActiveArea('indoor')}>
                                Area Indoor
                            </button>
                            <button className={`tab-btn ${activeArea === 'outdoor' ? 'active' : ''}`} onClick={() => setActiveArea('outdoor')}>
                                Area Outdoor
                            </button>
                        </div>

                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Memuat data meja...</div>
                        ) : (
                            <div className="tables-grid">
                                {currentTables.length > 0 ? (
                                    currentTables.map((table) => (
                                        <div key={table.id} className={`table-card ${table.status}`}>
                                            <div className="table-card-top">
                                                <span className="table-status-label">
                                                    {table.status === 'tersedia' && 'Tersedia'}
                                                    {table.status === 'lunas' && 'Dine-in (Lunas)'}
                                                    {table.status === 'pending' && 'Open Table'}
                                                </span>
                                                <div className="table-capacity">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="9" cy="7" r="4"></circle>
                                                    </svg>
                                                    {table.capacity}
                                                </div>
                                            </div>
                                            <h1 className="table-number">{table.table_number}</h1>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: '20px', color: '#64748b' }}>Belum ada meja di area ini.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DenahMeja;