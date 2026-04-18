import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- CUSTOMER: ORDER FLOW ---
// --- CUSTOMER PAGES ---
import Home from './pages/customer/landingPages/Home'; 
import About from './pages/customer/landingPages/About';
import Menu from './pages/customer/landingPages/Menu'; 
import InputData from './pages/customer/order/InputData';
import MenuList from './pages/customer/order/MenuList'; 
import MenuDetail from './pages/customer/order/MenuDetail';
import Checkout from './pages/customer/order/Checkout'; 
import Voucher from './pages/customer/order/Voucher'; // <-- IMPORT HALAMAN VOUCHER BARU
import Payment from './pages/customer/order/Payment';  
import Status from './pages/customer/order/Status';

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
import PesananDapur from './pages/kasir/PesananDapur';
import StokMenu from './pages/kasir/StokMenu';
import LaporanRiwayat from './pages/kasir/LaporanRiwayat';

// --- KOMPONEN PROTECTED ROUTE ---
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  
  // Jika belum login, tendang ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Bebas akses ke semua halaman internal jika sudah login
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- ROUTE CUSTOMER: LANDING --- */}
        {/* Rute Publik */}
        <Route path="/" element={<Navigate to="/home" replace />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />

        {/* --- ROUTE CUSTOMER: ORDER FLOW --- */}
        <Route path="/order" element={<InputData />} />
        <Route path="/order-list" element={<MenuList />} /> 
        <Route path="/detail" element={<MenuDetail />} />
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path="/voucher" element={<Voucher />} /> {/* <-- ROUTE BARU UNTUK VOUCHER */}
        <Route path="/payment" element={<Payment />} />  
        <Route path="/status" element={<Status />} />
        
        {/* --- ROUTE ADMIN --- */}
        <Route path="/admin" element={<OverviewCabang />} />
        <Route path="/admin/laporan-penjualan-pusat" element={<LaporanPenjualanPusat />} />
        <Route path="/admin/manajemen-promo" element={<ManajemenPromo />} />
        <Route path="/admin/manajemen-akun-staf" element={<ManajemenAkunStaf />} />
        <Route path="/admin/pengaturan" element={<Pengaturan />} />
        <Route path="/payment" element={<Payment />} /> 
        
        <Route path="/login" element={<Login />} />
        
        {/* --- AREA ADMIN --- */}
        <Route path="/admin" element={<ProtectedRoute><OverviewCabang /></ProtectedRoute>} />
        <Route path="/admin/laporan-penjualan-pusat" element={<ProtectedRoute><LaporanPenjualanPusat /></ProtectedRoute>} />
        <Route path="/admin/manajemen-promo" element={<ProtectedRoute><ManajemenPromo /></ProtectedRoute>} />
        <Route path="/admin/manajemen-akun-staf" element={<ProtectedRoute><ManajemenAkunStaf /></ProtectedRoute>} />
        <Route path="/admin/pengaturan" element={<ProtectedRoute><Pengaturan /></ProtectedRoute>} />

        {/* --- AREA KASIR --- */}
        <Route path="/kasir" element={<ProtectedRoute><Kasir /></ProtectedRoute>} />
        <Route path="/kasir/pesanan" element={<ProtectedRoute><PesananDapur /></ProtectedRoute>} />
        <Route path="/kasir/stok" element={<ProtectedRoute><StokMenu /></ProtectedRoute>} />
        <Route path="/kasir/laporan" element={<ProtectedRoute><LaporanRiwayat /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;