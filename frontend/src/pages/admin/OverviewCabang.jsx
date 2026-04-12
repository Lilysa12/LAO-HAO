import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './OverviewCabang.css';

// --- IMPORT ASSETS ---
import logoLaoban from '../../assets/Icons/icons-customer/logoLaoban.png';
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconManajemen from '../../assets/Icons/icons-admin/manajemen.svg';
import iconPengaturan from '../../assets/Icons/icons-admin/pengaturan.svg';
import iconKasir from '../../assets/Icons/icons-admin/kasir.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';
import iconPanahBawah from '../../assets/Icons/icons-admin/panahbawah.svg';
import iconTotal from '../../assets/Icons/icons-admin/total.svg';
import iconCabang from '../../assets/Icons/icons-admin/cabang.svg';
import iconPromosi from '../../assets/Icons/icons-admin/promosi.svg'; 

const OverviewCabang = () => {
  const location = useLocation();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Semua Cabang');
  const [isLoading, setIsLoading] = useState(true);

  // STATE UNTUK DATA DINAMIS
  const [summary, setSummary] = useState({
    totalPendapatan: 0,
    totalCabang: 0,
    promoAktif: 0
  });
  const [chartData, setChartData] = useState([]);
  const [branchComparison, setBranchComparison] = useState([]);

  useEffect(() => {
    // MENGAMBIL 3 DATA SEKALIGUS DARI LARAVEL
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const timeStamp = new Date().getTime();
        const [resTrx, resPromo, resStaff] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/admin/transactions?_t=${timeStamp}`),
          axios.get(`http://127.0.0.1:8000/api/admin/promos?_t=${timeStamp}`),
          axios.get(`http://127.0.0.1:8000/api/admin/staff?_t=${timeStamp}`)
        ]);

        const dataTrx = resTrx.data;
        const dataPromo = resPromo.data;
        const dataStaff = resStaff.data;

        // 1. HITUNG PROMO AKTIF
        const activePromosCount = dataPromo.filter(p => p.status === 'AKTIF').length;

        // 2. HITUNG JUMLAH CABANG (Dari Cabang Penempatan Staf yang Unik)
        const uniqueBranches = new Set();
        dataStaff.forEach(staf => {
          if (staf.branch && staf.branch !== 'Semua Cabang (HQ)') {
            uniqueBranches.add(staf.branch);
          }
        });
        const branchCount = uniqueBranches.size > 0 ? uniqueBranches.size : 1;

        // 3. KALKULASI TRANSAKSI (Pendapatan, Grafik, & Perbandingan)
        let tPendapatan = 0;
        const daysTemplate = [
          { name: 'Min', pendapatan: 0 }, { name: 'Sen', pendapatan: 0 },
          { name: 'Sel', pendapatan: 0 }, { name: 'Rab', pendapatan: 0 },
          { name: 'Kam', pendapatan: 0 }, { name: 'Jum', pendapatan: 0 },
          { name: 'Sab', pendapatan: 0 }
        ];
        const branchRevenueMap = {};
        const monthsMap = { 'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'Mei': '05', 'Jun': '06', 'Jul': '07', 'Agt': '08', 'Sep': '09', 'Okt': '10', 'Nov': '11', 'Des': '12' };

        dataTrx.forEach(trx => {
          if (trx.status === 'BERHASIL') {
            const amount = parseInt(trx.total.replace(/[^0-9]/g, ''), 10) || 0;
            
            // Filter berdasarkan Dropdown (Semua Cabang atau Spesifik)
            if (selectedFilter === 'Semua Cabang' || trx.branch === selectedFilter) {
              tPendapatan += amount;

              // Untuk Grafik Harian
              const parts = trx.time.split(' ');
              if (parts.length >= 3) {
                const day = parts[0].padStart(2, '0');
                const month = monthsMap[parts[1]];
                const year = parts[2].replace(',', '');
                const dateObj = new Date(`${year}-${month}-${day}`);
                
                if (!isNaN(dateObj)) {
                  daysTemplate[dateObj.getDay()].pendapatan += amount;
                }
              }
            }

            // Untuk Tabel Perbandingan (Semua dihitung agar bisa dibandingkan)
            const trxBranch = trx.branch || 'Cabang Tebet'; 
            if (!branchRevenueMap[trxBranch]) branchRevenueMap[trxBranch] = 0;
            branchRevenueMap[trxBranch] += amount;
          }
        });

        // Susun ulang grafik dari Senin sampai Minggu
        const orderedChartData = [ daysTemplate[1], daysTemplate[2], daysTemplate[3], daysTemplate[4], daysTemplate[5], daysTemplate[6], daysTemplate[0] ];
        
        // Bentuk Array untuk Tabel Perbandingan (Diurutkan dari terbesar)
        const comparisonArray = Object.keys(branchRevenueMap).map(key => ({
          cabang: key,
          pendapatan: branchRevenueMap[key],
          trend: '+12%' // Tren dibiarkan dummy statis karena belum ada data bulan lalu
        })).sort((a, b) => b.pendapatan - a.pendapatan);

        // MASUKKAN SEMUA KE STATE
        setSummary({ totalPendapatan: tPendapatan, totalCabang: branchCount, promoAktif: activePromosCount });
        setChartData(orderedChartData);
        setBranchComparison(comparisonArray);
        setIsLoading(false);

      } catch (error) {
        console.error("Gagal menarik data dashboard:", error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedFilter]); // Fetch akan dipanggil ulang jika filter cabang diubah!

  const handleSelectFilter = (opsi) => {
    setSelectedFilter(opsi);
    setIsFilterOpen(false); 
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px 15px', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#64748b' }}>{label}</p>
          <p style={{ margin: 0, fontSize: '14px', color: '#aa0000', fontWeight: 'bold' }}>
            Pendapatan : {formatRupiah(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

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
          <Link to="/admin" className="menu-item active">
            <img src={iconDashboard} alt="Dashboard" className="menu-icon-svg" />
            Overview Cabang
          </Link>
          <Link to="/admin/laporan-penjualan-pusat" className="menu-item">
            <img src={iconLaporan} alt="Laporan" className="menu-icon-svg icon-white" />
            Laporan Penjualan Pusat
          </Link>
          <Link to="/admin/manajemen-promo" className="menu-item">
            <img src={iconPromosi} alt="Promo" className="menu-icon-svg icon-white" />
            Manajemen Promo
          </Link>
          <Link to="/admin/manajemen-akun-staf" className="menu-item">
            <img src={iconManajemen} alt="Manajemen Staf" className="menu-icon-svg icon-white" />
            Manajemen Akun Staf
          </Link>
          <Link to="/admin/pengaturan" className="menu-item">
            <img src={iconPengaturan} alt="Pengaturan" className="menu-icon-svg icon-white" />
            Pengaturan
          </Link>

          <div className="divider"></div>

          <Link to="/kasir" className="menu-item">
            <img src={iconKasir} alt="Kasir" className="menu-icon-svg icon-white" />
            Kasir / POS Mode
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn">
            <img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="text-gray">Super Admin / </span>
            <span className="text-black font-bold">Dashboard</span>
          </div>
          <div className="user-profile">
            <div className="user-info">
              <span className="user-role">Super Admin</span>
              <span className="user-status">Online</span>
            </div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="dashboard-page">
            <div className="dashboard-header">
              <div>
                <h1 className="page-title">Overview Cabang</h1>
                <p className="page-subtitle">Laporan performa dan pendapatan seluruh cabang Lao-Hao</p>
              </div>
              
              <div className="filter-container">
                <button 
                  className="filter-btn" 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  Filter: {selectedFilter} 
                  <img 
                    src={iconPanahBawah} 
                    alt="Panah" 
                    className="filter-icon-svg"
                    style={{ transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} 
                  />
                </button>
                
                {isFilterOpen && (
                  <div className="filter-dropdown">
                    <div className="filter-option" onClick={() => handleSelectFilter('Semua Cabang')}>Semua Cabang</div>
                    <div className="filter-option" onClick={() => handleSelectFilter('Cabang Tebet')}>Cabang Tebet</div>
                    <div className="filter-option" onClick={() => handleSelectFilter('Cabang Sudirman')}>Cabang Sudirman</div>
                    <div className="filter-option" onClick={() => handleSelectFilter('Cabang Kelapa Gading')}>Cabang Kelapa Gading</div>
                  </div>
                )}
              </div>
            </div>

            {isLoading ? (
               <div style={{ padding: '40px', textAlign: 'center' }}>Sinkronisasi data dari Supabase...</div>
            ) : (
              <>
                {/* SUMMARY CARDS */}
                <div className="summary-cards">
                  <div className="card">
                    <div className="card-header">
                      <span className="card-label">Total Pendapatan (Bulan Ini)</span>
                      <div className="icon-wrapper">
                        <img src={iconTotal} alt="Total Pendapatan" className="card-icon-svg" />
                      </div>
                    </div>
                    <h2 className="card-value">{formatRupiah(summary.totalPendapatan)}</h2>
                    <p className="card-desc">Berdasarkan data {selectedFilter}</p>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <span className="card-label">Total Cabang</span>
                      <div className="icon-wrapper">
                        <img src={iconCabang} alt="Total Cabang" className="card-icon-svg" />
                      </div>
                    </div>
                    <h2 className="card-value">{summary.totalCabang}</h2>
                    <p className="card-desc">Cabang terdaftar di sistem</p>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <span className="card-label">Promo Aktif</span>
                      <div className="icon-wrapper">
                        <img src={iconPromosi} alt="Promo Aktif" className="card-icon-svg" />
                      </div>
                    </div>
                    <h2 className="card-value">{summary.promoAktif}</h2>
                    <p className="card-desc">Berlaku untuk semua cabang</p>
                  </div>
                </div>

                <div className="bottom-section">
                  {/* CHART LINE DINAMIS */}
                  <div className="chart-container card">
                    <h3 className="section-title">Grafik Pendapatan ({selectedFilter})</h3>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `Rp ${value / 1000}k`} />
                          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
                          <Line type="monotone" dataKey="pendapatan" stroke="#aa0000" strokeWidth={3} dot={{ r: 4, fill: '#aa0000', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#ffcc00', stroke: '#aa0000', strokeWidth: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* TABEL PERBANDINGAN CABANG DINAMIS */}
                  <div className="comparison-container card">
                    <h3 className="section-title">Perbandingan Cabang</h3>
                    <table className="comparison-table">
                      <thead>
                        <tr>
                          <th>CABANG</th>
                          <th className="text-right">PENDAPATAN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branchComparison.length > 0 ? (
                          branchComparison.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <div className="cabang-name">{item.cabang}</div>
                                <div className="cabang-trend positive">{item.trend}</div>
                              </td>
                              <td className="text-right font-bold text-red">{formatRupiah(item.pendapatan)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="text-center text-gray">Belum ada transaksi</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <button className="detail-btn">Lihat Detail {'>'}</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OverviewCabang;