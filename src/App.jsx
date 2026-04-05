import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import semua halaman
import LandingPage from './pages/customer/LandingPage';
import InputData from './pages/customer/InputData';
import MenuList from './pages/customer/MenuList';
import MenuDetail from './pages/customer/MenuDetail';
import Checkout from './pages/customer/Checkout'; 
import Payment from './pages/customer/Payment';   
import Home from './pages/customer/Home';
import About from './pages/customer/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* FIX: Kembalikan Landing Page ke path "/" agar otomatis muncul pertama kali saat web dibuka */}
        <Route path="/" element={<LandingPage />} /> 
        
        {/* Halaman Home baru kita kasih alamat "/home" */}
        <Route path="/home" element={<Home />} /> 

        <Route path="/order" element={<InputData />} />
        <Route path="/menu" element={<MenuList />} />
        <Route path="/detail" element={<MenuDetail />} />
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path="/payment" element={<Payment />} />  
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;