import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import semua halaman
import InputData from './pages/customer/InputData';
import MenuList from './pages/customer/MenuList'; // Halaman pesanan (keranjang)
import MenuDetail from './pages/customer/MenuDetail';
import Checkout from './pages/customer/Checkout'; 
import Payment from './pages/customer/Payment';   
import Home from './pages/customer/Home'; // Ini sekarang jadi landing page sekaligus home
import About from './pages/customer/About';
import Menu from './pages/customer/Menu'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* FIX: Alamat root "/" sekarang langsung ngebuka Home (karena LandingPage udah dihapus) */}
        <Route path="/" element={<Home />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />

        {/* --- Bagian Pemesanan --- */}
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