import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import semua halaman
import LandingPage from './pages/customer/LandingPage';
import InputData from './pages/customer/InputData';
import MenuList from './pages/customer/MenuList'; // Halaman pesanan (keranjang)
import MenuDetail from './pages/customer/MenuDetail';
import Checkout from './pages/customer/Checkout'; 
import Payment from './pages/customer/Payment';   
import Home from './pages/customer/Home';
import About from './pages/customer/About';

// FIX 1: Tambahkan Import untuk halaman Menu yang baru (Desain Feed IG)
import Menu from './pages/customer/Menu'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/about" element={<About />} />
        
        {/* FIX 2: Alamat /menu sekarang membuka file Menu.jsx yang baru */}
        <Route path="/menu" element={<Menu />} />

        {/* --- Bagian Pemesanan --- */}
        <Route path="/order" element={<InputData />} />
        
        {/* FIX 3: Halaman pesan makan yang lama digeser ke /order-list biar gak bentrok */}
        <Route path="/order-list" element={<MenuList />} /> 
        
        <Route path="/detail" element={<MenuDetail />} />
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path="/payment" element={<Payment />} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;