import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './OverviewCabang.css';

// --- IMPORT ASSETS ---
import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg'; 
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconManajemen from '../../assets/Icons/icons-admin/manajemen.svg';
import iconPengaturan from '../../assets/Icons/icons-admin/pengaturan.svg';
import iconKasir from '../../assets/Icons/icons-admin/kasir.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';

// --- IMPORT IKON CARD BARU ---
import iconTotal from '../../assets/Icons/icons-admin/total.svg';
import iconCabang from '../../assets/Icons/icons-admin/cabang.svg';
import iconPromosi from '../../assets/Icons/icons-admin/promosi.svg';

const OverviewCabang = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Inisialisasi navigate
  
  const [selectedFilter, setSelectedFilter] = useState('Semua Cabang');
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE UNTUK POP-UP DETAIL CABANG ---
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // DATA STATE
  const [summary, setSummary] = useState({
    totalPendapatan: 0,
    totalCabang: 0,
    promoAktif: 0
  });
  const [chartData, setChartData] = useState([]);
  const [branchComparison, setBranchComparison] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState(['Semua Cabang']);

  // --- FIX: FUNGSI LOGOUT DI DALAM KOMPONEN ---
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login'); // Arahkan ke halaman login
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const timeStamp = new Date().getTime();
        const [resTrx, resPromo, resBranch] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/admin/transactions?_t=${timeStamp}`),
          axios.get(`http://127.0.0.1:8000/api/admin/promos?_t=${timeStamp}`),
          axios.get(`http://127.0.0.1:8000/api/admin/branches?_t=${timeStamp}`)
        ]);

        const dataTrx = resTrx.data;
        const dataPromo = resPromo.data;
        const dataBranch = resBranch.data;

        const activePromosCount = dataPromo.filter(p => p.status === 'AKTIF').length;
        const branchCount = dataBranch.length;
        const options = ['Semua Cabang', ...dataBranch.map(b => b.name)];
        setDropdownOptions(options);

        let tPendapatan = 0;
        const daysTemplate = [
          { name: 'Min', p: 0 }, { name: 'Sen', p: 0 }, { name: 'Sel', p: 0 }, 
          { name: 'Rab', p: 0 }, { name: 'Kam', p: 0 }, { name: 'Jum', p: 0 }, { name: 'Sab', p: 0 }
        ];
        const branchRev = {};

        dataTrx.forEach(trx => {
          if (trx.status === 'BERHASIL') {
            const amount = parseInt(trx.total.replace(/[^0-9]/g, ''), 10) || 0;
            const tBranch = trx.branch || 'Laoban Kopitiam Pusat'; 
            
            if (selectedFilter === 'Semua Cabang' || tBranch.includes(selectedFilter)) {
              tPendapatan += amount;
              const d = new Date(trx.time); 
              if (!isNaN(d)) daysTemplate[d.getDay()].p += amount;
            }
            
            if (!branchRev[tBranch]) branchRev[tBranch] = 0;
            branchRev[tBranch] += amount;
          }
        });

        const orderedChartData = [ daysTemplate[1], daysTemplate[2], daysTemplate[3], daysTemplate[4], daysTemplate[5], daysTemplate[6], daysTemplate[0] ];
        
        const comparisonArray = Object.keys(branchRev).length > 0 
          ? Object.keys(branchRev).map(key => ({
              cabang: key, pendapatan: branchRev[key], trend: '+12%' 
            })).sort((a, b) => b.pendapatan - a.pendapatan)
          : [ { cabang: 'Cabang Tebet', pendapatan: 45000000, trend: '+12%' }, { cabang: 'Cabang Sudirman', pendapatan: 68500000, trend: '+15%' } ];

        setSummary({ totalPendapatan: tPendapatan || 174000000, totalCabang: branchCount || 13, promoAktif: activePromosCount });
        setChartData(orderedChartData);
        setBranchComparison(comparisonArray);
        setIsLoading(false);

      } catch (error) {
        console.error("Gagal menarik data dashboard:", error);
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [selectedFilter]);

  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div className="sidebar-logo-container" style={{ width: '100%', padding: '35px 20px 20px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={logoLaobanSvg} alt="Logo" style={{ width: '100%', maxWidth: '160px' }} />
          </div>
          <nav className="sidebar-menu" style={{ marginTop: '0px', paddingTop: '10px' }}>
            <Link to="/admin" className="menu-item active"><img src={iconDashboard} alt="Dash" className="menu-icon-svg" /> Overview Cabang</Link>
            <Link to="/admin/laporan-penjualan-pusat" className="menu-item"><img src={iconLaporan} alt="Lap" className="menu-icon-svg icon-white" /> Laporan Penjualan Pusat</Link>
            <Link to="/admin/manajemen-promo" className="menu-item"><img src={iconManajemen} alt="Promo" className="menu-icon-svg icon-white" /> Manajemen Promo</Link>
            <Link to="/admin/manajemen-akun-staf" className="menu-item"><img src={iconManajemen} alt="Staf" className="menu-icon-svg icon-white" /> Manajemen Akun Staf</Link>
            <Link to="/admin/pengaturan" className="menu-item"><img src={iconPengaturan} alt="Set" className="menu-icon-svg icon-white" /> Pengaturan</Link>
            <div className="divider" style={{ margin: '15px 16px' }}></div>
            <Link to="/kasir" className="menu-item"><img src={iconKasir} alt="Kasir" className="menu-icon-svg icon-white" /> Kasir / POS Mode</Link>
          </nav>
        </div>
        
        {/* --- FIX: TOMBOL LOGOUT SEKARANG MENGGUNAKAN FUNGSI handleLogout --- */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn" style={{ background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content" style={{ backgroundColor: '#f8f9fc' }}>
        <header className="topbar">
          <div className="breadcrumb"><span className="text-gray">Super Admin / </span><span className="text-black font-bold">Dashboard</span></div>
          <div className="user-profile">
            <div className="user-info"><span className="user-role">Super Admin</span><span className="user-status">Online</span></div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="dashboard-page">
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h1 className="page-title">Overview Cabang</h1>
                <p className="page-subtitle">Laporan performa dan pendapatan seluruh cabang Lao-Hao</p>
              </div>
              <div className="filter-wrapper">
                <select className="filter-dropdown-figma" value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#334155', fontWeight: 'bold' }}>
                  {dropdownOptions.map(opt => <option key={opt} value={opt}>Filter: {opt}</option>)}
                </select>
              </div>
            </div>

            {isLoading ? ( <div style={{ textAlign: 'center', padding: '40px' }}>Memuat data cabang...</div> ) : (
              <>
                <div className="summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
                  <div className="card" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Total Pendapatan (Bulan Ini)</span>
                    <div style={{ position: 'absolute', top: '20px', right: '20px', width: '32px', height: '32px', backgroundColor: '#fee2e2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={iconTotal} alt="Total" style={{ width: '16px', height: '16px' }} />
                    </div>
                    <h2 style={{ fontSize: '28px', color: '#0f172a', margin: '15px 0 5px 0' }}>{formatRupiah(summary.totalPendapatan)}</h2>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Dari {summary.totalCabang} Cabang Aktif</span>
                  </div>
                  <div className="card" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Total Cabang</span>
                    <div style={{ position: 'absolute', top: '20px', right: '20px', width: '32px', height: '32px', backgroundColor: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={iconCabang} alt="Cabang" style={{ width: '16px', height: '16px' }} />
                    </div>
                    <h2 style={{ fontSize: '28px', color: '#0f172a', margin: '15px 0 5px 0' }}>{summary.totalCabang}</h2>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Beroperasi Penuh</span>
                  </div>
                  <div className="card" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Promo Aktif</span>
                    <div style={{ position: 'absolute', top: '20px', right: '20px', width: '32px', height: '32px', backgroundColor: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={iconPromosi} alt="Promo" style={{ width: '16px', height: '16px' }} />
                    </div>
                    <h2 style={{ fontSize: '28px', color: '#0f172a', margin: '15px 0 5px 0' }}>{summary.promoAktif}</h2>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Berlaku untuk semua cabang</span>
                  </div>
                </div>

                <div className="bottom-section" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                  <div className="card chart-container" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '20px', color: '#1e293b' }}>Grafik Pendapatan Gabungan</h3>
                    <div style={{ width: '100%', height: 280 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `Rp ${value / 1000}k`} />
                          <Tooltip cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                          <Line type="monotone" dataKey="p" stroke="#aa0000" strokeWidth={3} dot={{ r: 4, fill: '#aa0000', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#ffcc00', stroke: '#aa0000', strokeWidth: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="card comparison-container" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '20px', color: '#1e293b' }}>Perbandingan Cabang</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '10px' }}>
                      <span>CABANG</span><span>PENDAPATAN</span>
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                      {branchComparison.slice(0, 4).map((item, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>{item.cabang}</div>
                            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>{item.trend}</div>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#aa0000' }}>{formatRupiah(item.pendapatan)}</div>
                        </div>
                      ))}
                    </div>
                    {branchComparison.length > 0 && (
                      <div style={{ textAlign: 'center', marginTop: '15px' }}>
                        <span onClick={() => setIsDetailModalOpen(true)} style={{ color: '#aa0000', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                          Lihat Detail &gt;
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* MODAL DETAIL SEMUA CABANG */}
      {isDetailModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal-content" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', margin: 0, color: '#0f172a' }}>Detail Perbandingan Semua Cabang</h2>
              <button onClick={() => setIsDetailModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '10px' }}>
              <span>CABANG</span><span>PENDAPATAN</span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '10px' }}>
              {branchComparison.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>{item.cabang}</div>
                    <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>{item.trend}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#aa0000' }}>{formatRupiah(item.pendapatan)}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button onClick={() => setIsDetailModalOpen(false)} style={{ padding: '8px 20px', backgroundColor: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewCabang;