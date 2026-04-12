import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/customer/landingPages/Home'; 
import About from './pages/customer/landingPages/About';
import Menu from './pages/customer/landingPages/Menu'; 

import InputData from './pages/customer/order/InputData';
import MenuList from './pages/customer/order/MenuList'; 
import MenuDetail from './pages/customer/order/MenuDetail';
import Checkout from './pages/customer/order/Checkout'; 
import Payment from './pages/customer/order/Payment'; 

import OverviewCabang from './pages/admin/OverviewCabang'; 
import LaporanPenjualanPusat from './pages/admin/LaporanPenjualanPusat';
import ManajemenPromo from './pages/admin/ManajemenPromo';
import ManajemenAkunStaf from './pages/admin/ManajemenAkunStaf';
import Pengaturan from './pages/admin/Pengaturan';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />

        <Route path="/order" element={<InputData />} />
        <Route path="/order-list" element={<MenuList />} /> 
        <Route path="/detail" element={<MenuDetail />} />
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path="/payment" element={<Payment />} /> 
        
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