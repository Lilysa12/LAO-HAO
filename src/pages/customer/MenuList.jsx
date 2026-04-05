import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuList.css';

// --- IMPORT ASSETS (Jalur Sudah Diperbaiki) ---
import LogoLaoban from '../../assets/icons customer/Logo Laoban.png';
import IconCheckout from '../../assets/icons customer/Checkout.png'; // Ikon keranjang

// Gambar Makanan
import ImgImage6 from '../../assets/Image/Image6.png'; // Nasi Lemak
import ImgImage7 from '../../assets/Image/Image7.png'; // Nasi Mala
import ImgImage8 from '../../assets/Image/Image8.png'; // Nasi Hainan

export default function MenuList() {
  const navigate = useNavigate();
  
  // State dummy untuk menandai kategori aktif di sidebar
  const [activeCategory, setActiveCategory] = useState('MAIN');

  // Data Dummy Makanan agar tampilan penuh sesuai desain
  const foodItems = [
    {
      id: 1,
      image: ImgImage6,
      name: 'Nasi Lemak',
      desc: 'Nasi dengan rempah santan dengan ayam ungkep bumbu dikombinasikan dengan kacang teri yang memanjakan lidah kalian. Sambelnya juga mantap.',
      price: 'Rp 29.000'
    },
    {
      id: 2,
      image: ImgImage7,
      name: 'Nasi Mala ⭐', // Tambah emoji star sesuai desain
      desc: 'Nasi putih dengan rempah mala sechuan yang rasanya pedas asin gurih. Pecinta pedas? Wajib cobain!',
      price: 'Rp 22.000'
    },
    {
      id: 3,
      image: ImgImage8,
      name: 'Nasi Hainan',
      desc: 'Nasi berbumbu putih rahasia khas laoban yang pastinya sedap dicampur ayam jasio bumbu coklat yang muantab!',
      price: 'Rp 18.000'
    }
  ];

  return (
    <div className="ml-container">
      
      {/* ================= 1. HEADER (H: 92px) ================= */}
      <header className="ml-header">
        <div className="ml-logo-box">
          <img src={LogoLaoban} alt="Logo Laoban" className="ml-logo" />
        </div>
        <nav className="ml-nav-links">
          <a href="#" className="active">Home</a>
          <a href="#">About</a>
          <a href="#">Menu</a>
          <a href="#">Our Partner</a>
          <a href="#">Partnership</a>
        </nav>
        <div style={{ width: '100px' }}></div> {/* Spacer kanan agar center */}
      </header>

      {/* ================= 2. TOP BAR (Hi Budi & Meja) ================= */}
      <div className="ml-top-bar">
        <div className="ml-welcome-text">
          <p className="ml-greeting">Hi, Budi!</p>
          <h2 className="ml-page-title">Pesan Disini</h2>
        </div>
        <div className="ml-table-badge">
          <span className="badge-icon">↳</span> Meja 12
        </div>
      </div>

      {/* ================= 3. MAIN CONTENT (Layout Jajar Kesamping) ================= */}
      <main className="ml-main-layout">
        
        {/* Sidebar Kategori (W: 80px fixed) */}
        <aside className="ml-sidebar">
          <div className={`ml-side-tab ${activeCategory === 'MAIN' ? 'active' : ''}`} onClick={() => setActiveCategory('MAIN')}>
            <div className="ml-st-icon">$</div>
            <span className="ml-st-text">MAIN</span>
          </div>
          <div className={`ml-side-tab ${activeCategory === 'SNACK' ? 'active' : ''}`} onClick={() => setActiveCategory('SNACK')}>
            <div className="ml-st-icon">☐</div>
            <span className="ml-st-text">SNACK</span>
          </div>
          <div className={`ml-side-tab ${activeCategory === 'DIMSUM' ? 'active' : ''}`} onClick={() => setActiveCategory('DIMSUM')}>
            <div className="ml-st-icon">◯</div>
            <span className="md-st-text">DIMSUM</span>
          </div>
          <div className={`ml-side-tab ${activeCategory === 'DRINK' ? 'active' : ''}`} onClick={() => setActiveCategory('DRINK')}>
            <div className="ml-st-icon">☕</div>
            <span className="ml-st-text">DRINK</span>
          </div>
        </aside>

        {/* List Menu (Grid Atas-Bawah) */}
        <section className="ml-content-area">
          {foodItems.map(item => (
            <div key={item.id} className="ml-card-row efek-klik-kartu" style={{cursor: 'pointer'}} onClick={() => navigate('/detail')}>
              {/* Gambar Kiri */}
              <img src={item.image} alt={item.name} className="ml-card-img" />
              
              {/* Info Kanan */}
              <div className="ml-card-details">
                <div className="ml-details-top">
                  <h3>{item.name}</h3>
                  <p>{item.desc}</p>
                </div>
                <div className="ml-details-bottom">
                  <span className="ml-price">{item.price}</span>
                  <button className="ml-btn-add">+ Add</button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Tambahan padding bawah agar konten tidak tertutup floating bar */}
          <div style={{height: '120px'}}></div>
        </section>

      </main>

      {/* ================= 4. FLOATING CHECKOUT BAR (Sticky Bottom) ================= */}
      {/* Warna background disesuaikan desain (#960000 - Merah Tua) */}
      <div className="ml-floating-bar efek-klik-kartu" onClick={() => navigate('/checkout')} style={{cursor: 'pointer'}}>
        <div className="ml-fb-left">
          <div className="ml-cart-box">
            <img src={IconCheckout} alt="Cart" className="ml-cart-icon" />
            <div className="ml-cart-dot"></div> {/* Notifikasi Kuning */}
          </div>
          <div className="ml-cart-text">
            <h4>Total (2 item)</h4>
            <p>Rp 57.000</p>
          </div>
        </div>
        <button className="ml-btn-checkout">
          Checkout &gt;
        </button>
      </div>

    </div>
  );
}