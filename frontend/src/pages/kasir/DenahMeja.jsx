import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './DenahMeja.css';

// --- IMPORT ASSETS (LOGO STANDAR 160PX) ---
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
    const location = useLocation();
    const [activeArea, setActiveArea] = useState('indoor');
    
    // --- STATE MODAL & FORM DATA (UI ONLY) ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({
        id: null,
        table_number: '',
        area: 'indoor',
        capacity: ''
    });
    
    // STATE DATA
    const [tables, setTables] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    const fetchTables = async () => {
        setIsLoading(true);
        setErrorMsg(null);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/kasir/tables?_t=${new Date().getTime()}`);
            setTables(response.data);
        } catch (error) {
            console.error("Gagal mengambil data meja:", error);
            setErrorMsg(error.message + (error.response ? ` (Status: ${error.response.status})` : ''));
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

    const handleOpenAddModal = () => {
        setModalData({ id: null, table_number: '', area: activeArea, capacity: '' });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (table) => {
        setModalData({ 
            id: table.id, 
            table_number: table.table_number, 
            area: table.area, 
            capacity: table.capacity 
        });
        setIsModalOpen(true);
    };

    const handleModalInputChange = (e) => {
        setModalData({
            ...modalData,
            [e.target.name]: e.target.value
        });
    };

    const tablesIndoor = tables.filter(t => t.area === 'indoor');
    const tablesOutdoor = tables.filter(t => t.area === 'outdoor');
    const currentTables = activeArea === 'indoor' ? tablesIndoor : tablesOutdoor;

    const getMenuClass = (path) => location.pathname === path ? "menu-item active" : "menu-item";
    const getIconClass = (path) => location.pathname === path ? "menu-icon-svg" : "menu-icon-svg icon-white";

    return (
        <div className="admin-container">
            {/* --- SIDEBAR --- */}
            <aside className="sidebar">
                <div className="sidebar-top-section">
                    <div className="sidebar-logo-container">
                        <img src={logoLaobanSvg} alt="Logo Laoban" className="main-logo-img" />
                    </div>
                    
                    <nav className="sidebar-menu">
                        <Link to="/kasir" className={getMenuClass('/kasir')}>
                            <img src={iconDashboard} alt="Denah" className={getIconClass('/kasir')} /> Denah Meja
                        </Link>
                        <Link to="/kasir/pos" className={getMenuClass('/kasir/pos')}>
                            <img src={iconPos} alt="POS" className={getIconClass('/kasir/pos')} /> Kasir / POS
                        </Link>
                        <Link to="/kasir/pesanan" className={getMenuClass('/kasir/pesanan')}>
                            <img src={iconPesananDapur} alt="Pesanan" className={getIconClass('/kasir/pesanan')} /> Pesanan Dapur
                        </Link>
                        <Link to="/kasir/manajemen-menu" className={getMenuClass('/kasir/manajemen-menu')}>
                            <img src={iconStok} alt="Menu" className={getIconClass('/kasir/manajemen-menu')} /> Manajemen Menu
                        </Link>
                        <Link to="/kasir/stok" className={getMenuClass('/kasir/stok')}>
                            <img src={iconStok} alt="Stok" className={getIconClass('/kasir/stok')} /> Stok Bahan Baku
                        </Link>
                        <Link to="/kasir/laporan" className={getMenuClass('/kasir/laporan')}>
                            <img src={iconLaporan} alt="Laporan" className={getIconClass('/kasir/laporan')} /> Laporan & Riwayat
                        </Link>
                        <Link to="/kasir/qr-meja" className={getMenuClass('/kasir/qr-meja')}>
                            <img src={iconQrMeja} alt="QR" className={getIconClass('/kasir/qr-meja')} /> QR Code Meja
                        </Link>
                        <div className="sidebar-divider"></div>
                        <Link to="/admin" className="menu-item">
                            <img src={iconDashboard} alt="Admin" className="menu-icon-svg icon-white" /> Kembali ke Pusat
                        </Link>
                    </nav>
                </div>
                
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" /> Logout
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
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
                        <div className="denah-header-row">
                            <div>
                                <h1 className="page-title">Denah Meja</h1>
                                <p className="page-subtitle">Manajemen ketersediaan meja cabang</p>
                            </div>
                            <button className="btn-tambah-meja" onClick={handleOpenAddModal}>
                                + Tambah Meja Baru
                            </button>
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
                            <div className="loading-state">Memuat data meja...</div>
                        ) : errorMsg ? (
                            <div className="error-state">
                                <strong>Koneksi ke Backend Gagal:</strong> <br/> {errorMsg}
                            </div>
                        ) : (
                            <div className="tables-grid">
                                {currentTables.length > 0 ? (
                                    currentTables.map((table) => (
                                        <div key={table.id} className={`table-card ${table.status}`}>
                                            <div className="table-card-top">
                                                <span className="table-status-label">
                                                    {table.status === 'tersedia' && 'Tersedia'}
                                                    {table.status === 'lunas' && 'Dine-in (Lunas)'}
                                                    {table.status === 'pending' && 'OPEN TABLE (BELUM BAYAR)'}
                                                </span>
                                                
                                                <div className="card-right-actions">
                                                    <div className="hover-action-container">
                                                        {/* Ikon Kapasitas (Kondisi Diam) */}
                                                        <div className="table-capacity">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                                <circle cx="9" cy="7" r="4"></circle>
                                                            </svg>
                                                            {table.capacity}
                                                        </div>

                                                        {/* Tombol Edit/Hapus (Kondisi Hover Menimpa) */}
                                                        <div className="action-buttons-group">
                                                            <button className="action-circle-btn" onClick={() => handleOpenEditModal(table)}>
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                                            </button>
                                                            <button className="action-circle-btn text-red">
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h1 className="table-number">{table.table_number}</h1>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">Belum ada meja di area ini.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* --- MODAL --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content-sm">
                        <div className="modal-header">
                            <h2>{modalData.id ? 'Edit Meja' : 'Tambah Meja Baru'}</h2>
                            <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>NOMOR / NAMA MEJA</label>
                                <input type="text" name="table_number" className="form-input" value={modalData.table_number} onChange={handleModalInputChange} />
                            </div>
                            <div className="form-group">
                                <label>AREA</label>
                                <select name="area" className="form-input select-input" value={modalData.area} onChange={handleModalInputChange}>
                                    <option value="indoor">Indoor</option>
                                    <option value="outdoor">Outdoor</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>KAPASITAS (JUMLAH ORANG)</label>
                                <input type="number" name="capacity" className="form-input" value={modalData.capacity} onChange={handleModalInputChange} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Batal</button>
                            <button className="btn-solid-red">Simpan Meja</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DenahMeja;