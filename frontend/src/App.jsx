import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- CUSTOMER: LANDING PAGES ---
import Home from './pages/customer/landingPages/Home'; 
import About from './pages/customer/landingPages/About';
import Menu from './pages/customer/landingPages/Menu'; 

// --- CUSTOMER: ORDER FLOW ---
import InputData from './pages/customer/order/InputData';
import MenuList from './pages/customer/order/MenuList'; 
import MenuDetail from './pages/customer/order/MenuDetail';
import Checkout from './pages/customer/order/Checkout'; 
import Voucher from './pages/customer/order/Voucher'; // <-- IMPORT HALAMAN VOUCHER BARU
import Payment from './pages/customer/order/Payment';  
import Status from './pages/customer/order/Status';

// --- ADMIN PAGES ---
import OverviewCabang from './pages/admin/OverviewCabang'; 
import LaporanPenjualanPusat from './pages/admin/LaporanPenjualanPusat';
import ManajemenPromo from './pages/admin/ManajemenPromo';
import ManajemenAkunStaf from './pages/admin/ManajemenAkunStaf';
import Pengaturan from './pages/admin/Pengaturan';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- ROUTE CUSTOMER: LANDING --- */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;