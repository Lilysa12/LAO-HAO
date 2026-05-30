import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './LaporanRiwayat.css';

// --- IMPORT ASSETS ---
import logoLaobanSvg from '../../assets/Icons/icons-admin/logo.svg';
import iconDashboard from '../../assets/Icons/icons-admin/dashboard.svg';
import iconPos from '../../assets/Icons/icons-admin/pos.svg';
import iconPesananDapur from '../../assets/Icons/icons-admin/pesanandapur.svg';
import iconStok from '../../assets/Icons/icons-admin/stok.svg';
import iconLaporan from '../../assets/Icons/icons-admin/laporan.svg';
import iconQrMeja from '../../assets/Icons/icons-admin/QrMeja.svg';
import iconLogout from '../../assets/Icons/icons-admin/logout.svg';
import iconKalender from '../../assets/Icons/icons-admin/kalender.svg';
import iconDownload from '../../assets/Icons/icons-admin/download.svg';
import iconPrinter from '../../assets/Icons/icons-admin/printer.svg';
import iconLaporanKasir from '../../assets/Icons/icons-admin/laporankasir.svg';

const API_BASE_URL = 'http://127.0.0.1:8000/api/kasir';

const LaporanRiwayat = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Hari Ini');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);

  const [summary, setSummary] = useState({
    periodTotal: 0,
    periodCount: 0,
    monthlyTotal: 0,
    monthName: '',
  });

  const formatRupiah = (value) => {
    const numericValue = Number(value) || 0;

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numericValue);
  };

  const parseRupiahToNumber = (value) => {
    if (value === null || value === undefined) {
      return 0;
    }

    if (typeof value === 'number') {
      return value;
    }

    const numericOnly = String(value).replace(/[^0-9]/g, '');

    return Number(numericOnly) || 0;
  };

  const getDateOnly = (dateValue) => {
    if (!dateValue) {
      return null;
    }

    return String(dateValue).substring(0, 10);
  };

  const isPaidTransaction = (status) => {
    const normalizedStatus = String(status || '').trim().toUpperCase();

    return ['BERHASIL', 'LUNAS', 'PAID', 'SELESAI'].includes(normalizedStatus);
  };

  const getDisplayStatus = (status) => {
    const normalizedStatus = String(status || '').trim().toUpperCase();

    if (['DIBATALKAN', 'BATAL', 'CANCELLED'].includes(normalizedStatus)) {
      return 'DIBATALKAN';
    }

    return normalizedStatus || '-';
  };

  const getMonthName = (date) => {
    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getIndonesianDateTime = (dateValue) => {
    if (!dateValue) {
      return '-';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    const dateText = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const timeText = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return `${dateText}, ${timeText}`;
  };

  const getTransactionDateText = (transaction) => {
    if (transaction.time) {
      return transaction.time;
    }

    if (transaction.transaction_time) {
      return transaction.transaction_time;
    }

    return getIndonesianDateTime(transaction.created_at);
  };

  const fetchHistory = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/history?_t=${new Date().getTime()}`);
      setAllData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Gagal mengambil riwayat transaksi:', error);
      setAllData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];
    const currentMonthPrefix = todayISO.substring(0, 7);
    const monthName = getMonthName(today);

    // ============================================================================
    // Minggu Ini dipakai sebagai 7 hari terakhir, bukan minggu kalender Senin-Minggu.
    // Contoh: jika hari ini 12 Mei, maka transaksi 10 Mei tetap ikut tampil.
    // ============================================================================
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    const sevenDaysAgoISO = sevenDaysAgo.toISOString().split('T')[0];

    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const threeMonthsAgoISO = threeMonthsAgo.toISOString().split('T')[0];

    let selectedTransactions = [];

    if (activeTab === 'Hari Ini') {
      selectedTransactions = allData.filter((transaction) => {
        const transactionDate = transaction.date_iso || getDateOnly(transaction.created_at);

        return transactionDate === todayISO;
      });
    } else if (activeTab === 'Minggu Ini') {
      selectedTransactions = allData.filter((transaction) => {
        const transactionDate = transaction.date_iso || getDateOnly(transaction.created_at);

        return transactionDate >= sevenDaysAgoISO && transactionDate <= todayISO;
      });
    } else if (activeTab === 'Bulan Ini') {
      selectedTransactions = allData.filter((transaction) => {
        const transactionDate = transaction.date_iso || getDateOnly(transaction.created_at);

        return transactionDate && transactionDate.startsWith(currentMonthPrefix);
      });
    } else if (activeTab === '3 Bulan Terakhir') {
      selectedTransactions = allData.filter((transaction) => {
        const transactionDate = transaction.date_iso || getDateOnly(transaction.created_at);

        return transactionDate >= threeMonthsAgoISO && transactionDate <= todayISO;
      });
    } else if (activeTab === 'Custom Date') {
      selectedTransactions = allData.filter((transaction) => {
        const transactionDate = transaction.date_iso || getDateOnly(transaction.created_at);

        return transactionDate === customDate;
      });
    } else {
      selectedTransactions = allData;
    }

    const periodTotal = selectedTransactions.reduce((total, transaction) => {
      if (!isPaidTransaction(transaction.status)) {
        return total;
      }

      return total + parseRupiahToNumber(transaction.total || transaction.total_amount);
    }, 0);

    const periodCount = selectedTransactions.length;

    const monthlyTotal = allData.reduce((total, transaction) => {
      const transactionDate = transaction.date_iso || getDateOnly(transaction.created_at);

      if (!transactionDate || !transactionDate.startsWith(currentMonthPrefix)) {
        return total;
      }

      if (!isPaidTransaction(transaction.status)) {
        return total;
      }

      return total + parseRupiahToNumber(transaction.total || transaction.total_amount);
    }, 0);

    setFilteredData(selectedTransactions);
    setSummary({
      periodTotal,
      periodCount,
      monthlyTotal,
      monthName,
    });
  }, [allData, activeTab, customDate]);

  const handleDownloadReport = () => {
    if (filteredData.length === 0) {
      alert('Tidak ada transaksi untuk diunduh.');
      return;
    }

    const csvRows = [
      'NO. INVOICE,WAKTU,MEJA,PELANGGAN,METODE,TOTAL,STATUS',
      ...filteredData.map((transaction) => {
        const invoice = transaction.inv || transaction.invoice_no || '-';
        const time = getTransactionDateText(transaction).replace(/,/g, '');
        const table = transaction.table || '-';
        const customer = transaction.customer || transaction.customer_name || '-';
        const method = transaction.method || transaction.payment_method || '-';
        const total = transaction.total || transaction.total_amount || '0';
        const status = getDisplayStatus(transaction.status);

        return `${invoice},${time},${table},${customer},${method},${total},${status}`;
      }),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = `Laporan_Kasir_${activeTab === 'Custom Date' ? customDate : activeTab}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReceipt = (transaction) => {
    const invoice = transaction.inv || transaction.invoice_no || '-';
    const time = getTransactionDateText(transaction);
    const table = transaction.table || '-';
    const customer = transaction.customer || transaction.customer_name || '-';
    const method = transaction.method || transaction.payment_method || '-';
    const total = transaction.total || transaction.total_amount || 'Rp 0';
    const status = getDisplayStatus(transaction.status);
    const branch = transaction.branch || '-';

    const printWindow = window.open('', '_blank', 'width=400,height=600');

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk ${invoice}</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              font-size: 14px;
              padding: 20px;
              max-width: 300px;
              margin: 0 auto;
              color: #000;
            }

            .text-center {
              text-align: center;
            }

            .font-bold {
              font-weight: bold;
            }

            .divider {
              border-top: 1px dashed #000;
              margin: 12px 0;
            }

            .flex-between {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              margin-bottom: 6px;
            }

            .brand {
              font-size: 22px;
              font-weight: bold;
              text-align: center;
              margin-bottom: 5px;
            }
          </style>
        </head>
        <body>
          <div class="brand">LAO-HAO</div>
          <div class="text-center">By Uncle Oeh</div>
          <div class="text-center" style="font-size: 12px; margin-bottom: 10px;">${branch}</div>

          <div class="divider"></div>

          <div class="flex-between">
            <span>No. Invoice:</span>
            <span>${invoice}</span>
          </div>
          <div class="flex-between">
            <span>Waktu:</span>
            <span>${time}</span>
          </div>

          <div class="divider"></div>

          <div class="flex-between">
            <span>Pelanggan:</span>
            <span>${customer}</span>
          </div>
          <div class="flex-between">
            <span>Meja:</span>
            <span>${table}</span>
          </div>

          <div class="divider"></div>

          <div class="flex-between font-bold" style="font-size: 16px;">
            <span>TOTAL</span>
            <span>${total}</span>
          </div>
          <div class="flex-between">
            <span>Metode Bayar:</span>
            <span>${method}</span>
          </div>
          <div class="flex-between">
            <span>Status:</span>
            <span>${status}</span>
          </div>

          <div class="divider"></div>

          <div class="text-center" style="margin-top: 20px;">Terima Kasih</div>
          <div class="text-center" style="font-size: 12px;">Selamat Menikmati Hidangan Kami</div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  // --- FIX: FUNGSI LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const getMenuClass = (path) => {
    return location.pathname === path ? 'menu-item active' : 'menu-item';
  };

  const getIconClass = (path) => {
    return location.pathname === path ? 'menu-icon-svg' : 'menu-icon-svg icon-white';
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-top-section">
          <div className="sidebar-logo-container">
            <img src={logoLaobanSvg} alt="Logo Lao-Hao" />
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
            <span className="text-black font-bold">History</span>
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
            <div className="history-header">
              <div className="header-titles">
                <h1 className="page-title">Laporan & Riwayat</h1>
                <p className="page-subtitle">Laporan penjualan cabang dan riwayat transaksi POS</p>
              </div>

              <div className="header-actions">
                <div className="filter-pills-container">
                  {['Hari Ini', 'Minggu Ini', 'Bulan Ini', '3 Bulan Terakhir', 'Custom Date'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`filter-pill ${activeTab === tab ? 'active' : ''}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeTab === 'Custom Date' && (
                  <div className="date-picker-wrapper">
                    <img src={iconKalender} alt="Kalender" className="calendar-overlay-icon" />
                    <input
                      type="date"
                      className="date-input-active"
                      value={customDate}
                      onChange={(event) => setCustomDate(event.target.value)}
                    />
                  </div>
                )}

                <button className="btn-unduh-laporan" onClick={handleDownloadReport}>
                  <img src={iconDownload} alt="Download" className="btn-icon-svg" />
                  Unduh Laporan
                </button>
              </div>
            </div>

            <div className="summary-cards-row">
              <div className="card stat-card">
                <span className="stat-label">Total Pemasukan Periode</span>
                <h2 className="stat-value text-red">{formatRupiah(summary.periodTotal)}</h2>
                <span className="stat-desc">{activeTab}</span>
              </div>

              <div className="card stat-card">
                <span className="stat-label">Total Transaksi Periode</span>
                <h2 className="stat-value text-black">{summary.periodCount}</h2>
                <span className="stat-desc">Berdasarkan data Supabase</span>
              </div>

              <div className="card stat-card">
                <span className="stat-label">Total Pemasukan Bulanan</span>
                <h2 className="stat-value text-black">{formatRupiah(summary.monthlyTotal)}</h2>
                <span className="stat-desc">Bulan {summary.monthName}</span>
              </div>
            </div>

            <h2 className="section-heading">Riwayat Transaksi</h2>

            <div className="card table-container">
              <div className="table-header-custom">
                <div className="header-left">
                  <img src={iconLaporanKasir} alt="Dokumen" className="doc-icon icon-yellow" />
                  <span className="date-text">{activeTab === 'Custom Date' ? customDate : activeTab}</span>
                </div>

                <div className="header-right">
                  <span className="total-label">Total Pemasukan:</span>
                  <span className="total-amount text-red">{formatRupiah(summary.periodTotal)}</span>
                </div>
              </div>

              {isLoading ? (
                <div className="loading-state">Menarik data dari Supabase...</div>
              ) : (
                <>
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>NO. INVOICE & WAKTU</th>
                        <th>MEJA & PELANGGAN</th>
                        <th>METODE</th>
                        <th>TOTAL TRANSAKSI</th>
                        <th>STATUS</th>
                        <th className="text-center">TINDAKAN KASIR</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((transaction) => {
                          const invoice = transaction.inv || transaction.invoice_no || '-';
                          const customer = transaction.customer || transaction.customer_name || '-';
                          const method = transaction.method || transaction.payment_method || '-';
                          const total = transaction.total || transaction.total_amount || 'Rp 0';
                          const status = getDisplayStatus(transaction.status);
                          const table = transaction.table || '-';

                          return (
                            <tr key={transaction.id}>
                              <td>
                                <div className="flex-col">
                                  <span className="font-bold text-black">{invoice}</span>
                                  <span className="text-small text-gray">{getTransactionDateText(transaction)}</span>
                                </div>
                              </td>

                              <td>
                                <div className="flex-align-center gap-8">
                                  <span className="badge-meja">{table}</span>
                                  <span className="font-medium text-black">{customer}</span>
                                </div>
                              </td>

                              <td>
                                <span className="badge-metode">{method}</span>
                              </td>

                              <td>
                                <span className="font-bold text-black">{total}</span>
                              </td>

                              <td>
                                <span className={`status-badge ${isPaidTransaction(status) ? 'badge-lunas' : 'badge-batal'}`}>
                                  {status}
                                </span>
                              </td>

                              <td className="text-center">
                                {isPaidTransaction(status) && (
                                  <button className="btn-print" onClick={() => handlePrintReceipt(transaction)}>
                                    <img src={iconPrinter} alt="Print" className="btn-icon-svg icon-gray" />
                                    Cetak Ulang Struk
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center text-gray" style={{ padding: '30px' }}>
                            Belum ada transaksi pada periode ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="table-footer-text">
                    Menampilkan {filteredData.length} transaksi dari Supabase
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LaporanRiwayat;