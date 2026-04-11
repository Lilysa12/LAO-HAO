import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ==========================================
// IMPORT LANDING PAGES (Dari folder landingPages)
// ==========================================
import Home from './pages/customer/landingPages/Home'; 
import About from './pages/customer/landingPages/About';
import Menu from './pages/customer/landingPages/Menu'; 

// ==========================================
// IMPORT ORDER PAGES (Dari folder order)
// ==========================================
import InputData from './pages/customer/order/InputData';
import MenuList from './pages/customer/order/MenuList'; 
import MenuDetail from './pages/customer/order/MenuDetail';
import Checkout from './pages/customer/order/Checkout'; 
import Payment from './pages/customer/order/Payment';  

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Bagian Landing Pages --- */}
        {/* Redirect root "/" langsung ke "/home" agar lebih rapi */}
        <Route path="/" element={<Navigate to="/home" replace />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />

        {/* --- Bagian Pemesanan (Order) --- */}
        <Route path="/order" element={<InputData />} />
        <Route path="/order-list" element={<MenuList />} /> 
        <Route path="/detail" element={<MenuDetail />} />
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path="/payment" element={<Payment />} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;