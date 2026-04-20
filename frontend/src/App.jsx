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
import History from './pages/customer/order/History'; // <--- IMPORT HISTORY DITAMBAHKAN DI SINI
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

// --- KOMPONEN PROTECTED ROUTE ---
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/partnership" element={<Partnership />} /> 
        <Route path="/our-partner" element={<OurPartner />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/download" element={<DownloadApp />} />

        <Route path="/order" element={<InputData />} />
        <Route path="/order-list" element={<MenuList />} /> 
        <Route path="/detail" element={<MenuDetail />} />
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path="/voucher" element={<Voucher />} />
        <Route path="/payment" element={<Payment />} />   
        <Route path="/status" element={<Status />} />
        <Route path="/history" element={<History />} /> {/* <--- RUTE HISTORY DITAMBAHKAN DI SINI */}
        
        <Route path="/admin" element={<ProtectedRoute><OverviewCabang /></ProtectedRoute>} />
        <Route path="/admin/laporan-penjualan-pusat" element={<ProtectedRoute><LaporanPenjualanPusat /></ProtectedRoute>} />
        <Route path="/admin/manajemen-promo" element={<ProtectedRoute><ManajemenPromo /></ProtectedRoute>} />
        <Route path="/admin/manajemen-akun-staf" element={<ProtectedRoute><ManajemenAkunStaf /></ProtectedRoute>} />
        <Route path="/admin/pengaturan" element={<ProtectedRoute><Pengaturan /></ProtectedRoute>} />

        <Route path="/kasir" element={<ProtectedRoute><Kasir /></ProtectedRoute>} />
        <Route path="/kasir/pos" element={<ProtectedRoute><Pos /></ProtectedRoute>} /> 
        <Route path="/kasir/pesanan" element={<ProtectedRoute><PesananDapur /></ProtectedRoute>} />
        <Route path="/kasir/manajemen-menu" element={<ProtectedRoute><Manajemenmenu /></ProtectedRoute>} />
        <Route path="/kasir/stok" element={<ProtectedRoute><StokMenu /></ProtectedRoute>} />
        <Route path="/kasir/laporan" element={<ProtectedRoute><LaporanRiwayat /></ProtectedRoute>} />
        <Route path="/kasir/qr-meja" element={<ProtectedRoute><QrMeja /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;