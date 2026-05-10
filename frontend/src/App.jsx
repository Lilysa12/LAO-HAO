import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- CUSTOMER PAGES ---
import Home from './pages/customer/landingPages/Home'; 
import About from './pages/customer/landingPages/About';
import Menu from './pages/customer/landingPages/Menu'; 
import Partnership from './pages/customer/landingPages/partnership'; 
import OurPartner from './pages/customer/landingPages/ourPartner'; 
import InputData from './pages/customer/order/InputData';
import MenuList from './pages/customer/order/MenuList'; 
import MenuDetail from './pages/customer/order/MenuDetail';
import Checkout from './pages/customer/order/Checkout'; 
import Voucher from './pages/customer/order/Voucher';
import Payment from './pages/customer/order/Payment';
import Status from './pages/customer/order/Status';
import History from './pages/customer/order/History';
import DownloadApp from './pages/customer/landingPages/DownloadApp';

// --- AUTH PAGE ---
import Login from './pages/auth/Login';

// --- ADMIN PAGES ---
import OverviewCabang from './pages/admin/OverviewCabang'; 
import LaporanPenjualanPusat from './pages/admin/LaporanPenjualanPusat';
import ManajemenPromo from './pages/admin/ManajemenPromo';
import ManajemenAkunStaf from './pages/admin/ManajemenAkunStaf';
import Pengaturan from './pages/admin/Pengaturan';

// --- KASIR PAGES ---
import Kasir from './pages/kasir/DenahMeja';
import Pos from './pages/kasir/Pos'; 
import PesananDapur from './pages/kasir/PesananDapur';
import Manajemenmenu from './pages/kasir/Manajemenmenu';
import StokMenu from './pages/kasir/StokMenu';
import LaporanRiwayat from './pages/kasir/LaporanRiwayat';
import QrMeja from './pages/kasir/QrMeja';

// --- KOMPONEN PROTECTED ROUTE BERLAPIS (FILTER ROLE) ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const userRole = localStorage.getItem('userRole'); // Ambil role yang login ('SUPER ADMIN' atau 'KASIR')

  // 1. Jika belum login sama sekali, tendang ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Jika sudah login, tapi role-nya tidak diizinkan masuk ke rute ini
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Jika Kasir nyasar ke halaman Admin, kembalikan ke Kasir
    if (userRole === 'KASIR') {
      return <Navigate to="/kasir" replace />;
    }
    // Jika Super Admin nyasar ke halaman yang cuma untuk Kasir, kembalikan ke Admin
    if (userRole === 'SUPER ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    // Jaga-jaga jika role tidak valid, paksa login ulang
    return <Navigate to="/login" replace />;
  }

  // 3. Jika aman, izinkan masuk
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- ROUTE CUSTOMER: LANDING (PUBLIC) --- */}
        <Route path="/" element={<Navigate to="/home" replace />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/partnership" element={<Partnership />} /> 
        <Route path="/our-partner" element={<OurPartner />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/download" element={<DownloadApp />} />

        {/* --- CUSTOMER ORDER FLOW --- */}
        <Route path="/order" element={<InputData />} />
        <Route path="/order-list" element={<MenuList />} /> 
        <Route path="/detail" element={<MenuDetail />} />
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path="/voucher" element={<Voucher />} />
        <Route path="/payment" element={<Payment />} />  
        <Route path="/status" element={<Status />} />
        <Route path="/history" element={<History />} /> 
        
        {/* --- AREA ADMIN (HANYA BISA DIAKSES OLEH SUPER ADMIN) --- */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['SUPER ADMIN']}><OverviewCabang /></ProtectedRoute>} />
        <Route path="/admin/laporan-penjualan-pusat" element={<ProtectedRoute allowedRoles={['SUPER ADMIN']}><LaporanPenjualanPusat /></ProtectedRoute>} />
        <Route path="/admin/manajemen-promo" element={<ProtectedRoute allowedRoles={['SUPER ADMIN']}><ManajemenPromo /></ProtectedRoute>} />
        <Route path="/admin/manajemen-akun-staf" element={<ProtectedRoute allowedRoles={['SUPER ADMIN']}><ManajemenAkunStaf /></ProtectedRoute>} />
        <Route path="/admin/pengaturan" element={<ProtectedRoute allowedRoles={['SUPER ADMIN']}><Pengaturan /></ProtectedRoute>} />

        {/* --- AREA KASIR (BISA DIAKSES KASIR & SUPER ADMIN JIKA MAU) --- */}
        {/* Catatan: Super Admin diizinkan masuk sini, tapi kalau mau ketat cuma Kasir, hapus 'SUPER ADMIN' dari array */}
        <Route path="/kasir" element={<ProtectedRoute allowedRoles={['KASIR', 'SUPER ADMIN']}><Kasir /></ProtectedRoute>} />
        <Route path="/kasir/pos" element={<ProtectedRoute allowedRoles={['KASIR', 'SUPER ADMIN']}><Pos /></ProtectedRoute>} /> 
        <Route path="/kasir/pesanan" element={<ProtectedRoute allowedRoles={['KASIR', 'SUPER ADMIN']}><PesananDapur /></ProtectedRoute>} />
        <Route path="/kasir/manajemen-menu" element={<ProtectedRoute allowedRoles={['KASIR', 'SUPER ADMIN']}><Manajemenmenu /></ProtectedRoute>} />
        <Route path="/kasir/stok" element={<ProtectedRoute allowedRoles={['KASIR', 'SUPER ADMIN']}><StokMenu /></ProtectedRoute>} />
        <Route path="/kasir/laporan" element={<ProtectedRoute allowedRoles={['KASIR', 'SUPER ADMIN']}><LaporanRiwayat /></ProtectedRoute>} />
        <Route path="/kasir/qr-meja" element={<ProtectedRoute allowedRoles={['KASIR', 'SUPER ADMIN']}><QrMeja /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;