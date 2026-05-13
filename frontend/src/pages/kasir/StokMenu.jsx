import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StokMenu.css';

// ============================================================================
// IMPORT ASSETS
// ============================================================================

import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg';
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';
import iconUpdateStok from '../../assets/Icons/icons-admin/updatestok.svg';

const API_BASE_URL = 'http://127.0.0.1:8000/api/kasir';

const StokMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [stokData, setStokData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [filterKategori, setFilterKategori] = useState('Semua Kategori');

    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const [restockForm, setRestockForm] = useState({
        inventory_id: '',
        quantity: '',
        note: '',
    });

    // ============================================================================
    // FETCH DATA SUPABASE VIA BACKEND LARAVEL
    // ============================================================================

    const fetchInventory = async () => {
        setIsLoading(true);
        setErrorMsg('');

        try {
            const response = await axios.get(`${API_BASE_URL}/inventory`, {
                params: {
                    _t: Date.now(),
                },
            });

            setStokData(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Gagal mengambil data inventory:', error);
            setErrorMsg(error.response?.data?.message || error.message || 'Gagal mengambil data inventory.');
            setStokData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    // ============================================================================
    // DATA TURUNAN DARI SUPABASE
    // ============================================================================

    const categories = useMemo(() => {
        const uniqueCategories = stokData
            .map((item) => item.category || item.kategori)
            .filter(Boolean);

        return ['Semua Kategori', ...new Set(uniqueCategories)];
    }, [stokData]);

    const filteredData = useMemo(() => {
        return stokData.filter((item) => {
            const itemName = item.name || item.nama || '';
            const itemCategory = item.category || item.kategori || '';

            const matchSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCategory = filterKategori === 'Semua Kategori' || itemCategory === filterKategori;

            return matchSearch && matchCategory;
        });
    }, [stokData, searchQuery, filterKategori]);

    const totalItem = stokData.length;

    const perluRestock = stokData.filter((item) => {
        const stock = Number(item.stock ?? item.sisa ?? 0);
        const minStock = Number(item.min_stock ?? item.min ?? 0);

        return stock <= minStock;
    }).length;

    const nilaiEstimasi = stokData.reduce((total, item) => {
        const stock = Number(item.stock ?? item.sisa ?? 0);
        const price = Number(item.price_per_unit ?? item.price ?? 0);

        return total + stock * price;
    }, 0);

    // ============================================================================
    // HELPER FORMAT
    // ============================================================================

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(angka || 0));
    };

    const formatDateTime = (dateValue) => {
        if (!dateValue) {
            return '-';
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return '-';
        }

        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getInventoryStatus = (item) => {
        const stock = Number(item.stock ?? item.sisa ?? 0);
        const minStock = Number(item.min_stock ?? item.min ?? 0);

        return stock <= minStock ? 'STOK MENIPIS' : 'AMAN';
    };

    const getMenuClass = (path) => {
        return location.pathname === path ? 'menu-item active' : 'menu-item';
    };

    const getIconClass = (path) => {
        return location.pathname === path ? 'menu-icon-svg' : 'menu-icon-svg icon-white';
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    // ============================================================================
    // MODAL UPDATE STOK MASUK
    // ============================================================================

    const selectedInventory = useMemo(() => {
        return stokData.find((item) => String(item.id) === String(restockForm.inventory_id)) || null;
    }, [stokData, restockForm.inventory_id]);

    const handleOpenRestockModal = () => {
        setRestockForm({
            inventory_id: '',
            quantity: '',
            note: '',
        });

        setIsRestockModalOpen(true);
    };

    const handleCloseRestockModal = () => {
        if (isSubmitting) {
            return;
        }

        setIsRestockModalOpen(false);
        setRestockForm({
            inventory_id: '',
            quantity: '',
            note: '',
        });
    };

    const handleRestockInputChange = (event) => {
        const { name, value } = event.target;

        setRestockForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitRestock = async () => {
        if (!selectedInventory) {
            alert('Pilih bahan baku terlebih dahulu.');
            return;
        }

        const quantity = Number(restockForm.quantity);

        if (!Number.isFinite(quantity) || quantity <= 0) {
            alert('Kuantitas stok masuk harus lebih dari 0.');
            return;
        }

        const currentStock = Number(selectedInventory.stock ?? selectedInventory.sisa ?? 0);
        const nextStock = currentStock + quantity;

        const payload = {
    name: selectedInventory.name ?? selectedInventory.nama,
    category: selectedInventory.category ?? selectedInventory.kategori,
    stock: nextStock,
    unit: selectedInventory.unit,
    min_stock: selectedInventory.min_stock ?? selectedInventory.min,
    price_per_unit: selectedInventory.price_per_unit ?? selectedInventory.price,
    last_note: restockForm.note,
    last_restock_quantity: quantity,
    last_restock_at: new Date().toISOString(),
};

        setIsSubmitting(true);

        try {
            await axios.post(`${API_BASE_URL}/inventory/${selectedInventory.id}/update`, payload);

            alert('Stok berhasil diperbarui.');
            setIsRestockModalOpen(false);

            await fetchInventory();
        } catch (error) {
            console.error('Gagal memperbarui stok:', error);
            alert(error.response?.data?.message || error.message || 'Gagal memperbarui stok.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-container">
            <aside className="sidebar">
                <div className="sidebar-top-section">
                    <div className="sidebar-logo-container">
                        <img src={logoLaobanSvg} alt="Logo Laoban" />
                    </div>

                    <nav className="sidebar-menu">
                        <Link to="/kasir" className={getMenuClass('/kasir')}>
                            <img src={iconDashboard} alt="Denah" className={getIconClass('/kasir')} />
                            Denah Meja
                        </Link>

                        <Link to="/kasir/pos" className={getMenuClass('/kasir/pos')}>
                            <img src={iconPos} alt="POS" className={getIconClass('/kasir/pos')} />
                            Kasir / POS
                        </Link>

                        <Link to="/kasir/pesanan" className={getMenuClass('/kasir/pesanan')}>
                            <img src={iconPesananDapur} alt="Pesanan" className={getIconClass('/kasir/pesanan')} />
                            Pesanan Dapur
                        </Link>

                        <Link to="/kasir/manajemen-menu" className={getMenuClass('/kasir/manajemen-menu')}>
                            <img src={iconStok} alt="Menu" className={getIconClass('/kasir/manajemen-menu')} />
                            Manajemen Menu
                        </Link>

                        <Link to="/kasir/stok" className={getMenuClass('/kasir/stok')}>
                            <img src={iconStok} alt="Stok" className={getIconClass('/kasir/stok')} />
                            Stok Bahan Baku
                        </Link>

                        <Link to="/kasir/laporan" className={getMenuClass('/kasir/laporan')}>
                            <img src={iconLaporan} alt="Laporan" className={getIconClass('/kasir/laporan')} />
                            Laporan & Riwayat
                        </Link>

                        <Link to="/kasir/qr-meja" className={getMenuClass('/kasir/qr-meja')}>
                            <img src={iconQrMeja} alt="QR" className={getIconClass('/kasir/qr-meja')} />
                            QR Code Meja
                        </Link>

                        <div className="divider" />

                        <Link to="/admin" className="menu-item">
                            <img src={iconDashboard} alt="Admin" className="menu-icon-svg icon-white" />
                            Kembali ke Pusat
                        </Link>
                    </nav>
                </div>

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
                        Cashier Mode / <span className="text-black font-bold">Inventory</span>
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
                    <div className="inventory-header">
                        <div>
                            <h1 className="page-title">Stok Bahan (Inventory)</h1>
                            <p className="page-subtitle">Pantau persediaan bahan baku dan minimal stok</p>
                        </div>

                        <button className="btn-update-stok" onClick={handleOpenRestockModal}>
                            <img src={iconUpdateStok} alt="Update stok" />
                            Update Stok Masuk
                        </button>
                    </div>

                    <div className="summary-cards">
                        <div className="card summary-card">
                            <span className="card-label">Total Item Bahan</span>
                            <h2 className="card-value">{totalItem}</h2>
                        </div>

                        <div className="card summary-card card-warning-border">
                            <span className="card-label label-red">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ marginRight: '8px' }}
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                PERLU RESTOCK
                            </span>

                            <div className="value-with-desc">
                                <h2 className="card-value">{perluRestock}</h2>
                                <span className="value-desc">item menipis</span>
                            </div>
                        </div>

                        <div className="card summary-card">
                            <span className="card-label">Nilai Estimasi Stok</span>
                            <h2 className="card-value text-green">{formatRupiah(nilaiEstimasi)}</h2>
                        </div>
                    </div>

                    <div className="table-container-card">
                        <div className="toolbar">
                            <div className="search-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>

                                <input
                                    type="text"
                                    placeholder="Cari bahan baku..."
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                />
                            </div>

                            <select
                                className="category-select"
                                value={filterKategori}
                                onChange={(event) => setFilterKategori(event.target.value)}
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {isLoading ? (
                            <div className="loading-state">Memuat data inventory...</div>
                        ) : errorMsg ? (
                            <div className="error-state">{errorMsg}</div>
                        ) : (
                            <table className="inventory-table">
                                <thead>
                                    <tr>
                                        <th>NAMA BAHAN</th>
                                        <th>KATEGORI</th>
                                        <th>SISA STOK</th>
                                        <th>MIN. STOK</th>
                                        <th>STATUS</th>
                                        <th>UPDATE TERAKHIR</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item) => {
                                            const status = getInventoryStatus(item);

                                            return (
                                                <tr key={item.id}>
                                                    <td className="font-bold">{item.name ?? item.nama}</td>
                                                    <td className="text-gray">{item.category ?? item.kategori}</td>
                                                    <td>
                                                        <span className="font-bold">{item.stock ?? item.sisa}</span>{' '}
                                                        <span className="text-unit">{item.unit}</span>
                                                    </td>
                                                    <td className="text-gray">
                                                        {item.min_stock ?? item.min} {item.unit}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${status === 'AMAN' ? 'badge-aman' : 'badge-menipis'}`}>
                                                            {status}
                                                        </span>
                                                    </td>
                                                    <td className="text-gray">{formatDateTime(item.updated_at)}</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="empty-table-cell">
                                                Tidak ada data inventory.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>

            {isRestockModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h2>Update Stok Bahan Baku</h2>
                            <button className="close-stok-btn" onClick={handleCloseRestockModal}>
                                ✕
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>PILIH BAHAN</label>
                                <select
                                    name="inventory_id"
                                    className="form-input"
                                    value={restockForm.inventory_id}
                                    onChange={handleRestockInputChange}
                                >
                                    <option value="">Pilih bahan baku...</option>
                                    {stokData.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name ?? item.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>STOK SAAT INI</label>
                                    <input
                                        type="text"
                                        value={selectedInventory ? selectedInventory.stock ?? selectedInventory.sisa : ''}
                                        disabled
                                        className="form-input bg-gray"
                                    />
                                </div>

                                <div className="form-group flex-1">
                                    <label>SATUAN</label>
                                    <input
                                        type="text"
                                        value={selectedInventory ? selectedInventory.unit || '' : ''}
                                        disabled
                                        className="form-input bg-gray"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>KUANTITAS STOK MASUK</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    placeholder="Contoh: 50"
                                    className="form-input"
                                    value={restockForm.quantity}
                                    onChange={handleRestockInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>CATATAN</label>
                                <textarea
                                    name="note"
                                    placeholder="Contoh: Restock mingguan dari supplier utama."
                                    className="form-input"
                                    value={restockForm.note}
                                    onChange={handleRestockInputChange}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-batal" onClick={handleCloseRestockModal} disabled={isSubmitting}>
                                Batal
                            </button>

                            <button className="btn-update-final" onClick={handleSubmitRestock} disabled={isSubmitting}>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ marginRight: '6px' }}
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                {isSubmitting ? 'Menyimpan...' : 'Update Stok'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StokMenu;