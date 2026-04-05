import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuDetail.css';

// --- IMPORT ASSETS LOKAL (JALUR SUDAH DIPERBAIKI 100%) ---
import LogoLaoban from '../../assets/icons customer/Logo Laoban.png';
import IconCheckout from '../../assets/icons customer/Checkout.png';
import ImgDetail from '../../assets/Image/Image9.png'; // Gambar Makanan Utama

// Social Icons (Jalur sudah diperbaiki)
import IconInstagram from '../../assets/icons customer/Instagram.png';
import IconWhatsapp from '../../assets/icons customer/Whatsapp.png';
import IconFacebook from '../../assets/icons customer/Facebook.png';
import IconLink from '../../assets/icons customer/Link.png';
import IconTiktok from '../../assets/icons customer/Tiktok.png';

export default function MenuDetail() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('MAIN');

  return (
    <div className="md-container">
      
      {/* ================= HEADER ================= */}
      <header className="md-header">
        <div className="md-logo-box">
          <img src={LogoLaoban} alt="Logo Laoban" className="md-logo" />
        </div>
        <nav className="md-nav-links">
          <a href="#" className="active">Home</a>
          <a href="#">About</a>
          <a href="#">Menu</a>
          <a href="#">Our Partner</a>
          <a href="#">Partnership</a>
        </nav>
        <div style={{ width: '100px' }}></div>
      </header>

      {/* ================= TOP BAR ================= */}
      <div className="md-top-bar">
        <div className="md-welcome-text">
          <p className="md-greeting">Hi, Budi!</p>
          <h2 className="md-page-title">Pesan Disini</h2>
        </div>
        <div className="md-table-badge">
          <span className="badge-icon">↳</span> Meja 12
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="md-main-layout">
        
        {/* Sidebar Kategori */}
        <aside className="md-sidebar">
          <div className={`md-side-tab ${activeCategory === 'MAIN' ? 'active' : ''}`} onClick={() => setActiveCategory('MAIN')}>
            <div className="md-st-icon">$</div>
            <span className="md-st-text">MAIN</span>
          </div>
          <div className={`md-side-tab ${activeCategory === 'SNACK' ? 'active' : ''}`} onClick={() => setActiveCategory('SNACK')}>
            <div className="md-st-icon">☐</div>
            <span className="md-st-text">SNACK</span>
          </div>
          <div className={`md-side-tab ${activeCategory === 'DIMSUM' ? 'active' : ''}`} onClick={() => setActiveCategory('DIMSUM')}>
            <div className="md-st-icon">◯</div>
            <span className="md-st-text">DIMSUM</span>
          </div>
          <div className={`md-side-tab ${activeCategory === 'DRINK' ? 'active' : ''}`} onClick={() => setActiveCategory('DRINK')}>
            <div className="md-st-icon">☕</div>
            <span className="md-st-text">DRINK</span>
          </div>
        </aside>

        {/* Content Detail (Closeup) */}
        <section className="md-content-area">
          <div className="md-closeup-card">
            
            {/* Gambar Besar Kiri */}
            <img src={ImgDetail} alt="Nasi Lemak Detail" className="md-closeup-img" />
            
            {/* Detail Kanan */}
            <div className="md-details-info">
              <h2 className="md-item-title">Nasi Lemak</h2>
              <p className="md-item-desc">
                Nasi dengan rempah santan dengan ayam ungkep bumbu dikombinasikan dengan kacang teri yang memanjakan lidah kalian. Sambelnya juga mantap.
              </p>
              
              {/* Text Area Catatan */}
              <textarea 
                className="md-notes-area" 
                placeholder="Tambah catatan (opsional)"
              ></textarea>

              <div className="md-action-row">
                <span className="md-price">Rp 29.000</span>
                <button className="md-btn-add efek-klik">+ Add</button>
              </div>
            </div>

          </div>
          
          {/* Spacer untuk floating bar */}
          <div style={{height: '150px'}}></div>
        </section>

      </main>

      {/* ================= FLOATING CHECKOUT BAR ================= */}
      <div className="md-floating-bar efek-klik-kartu" onClick={() => navigate('/checkout')} style={{cursor: 'pointer'}}>
        <div className="md-fb-left">
          <div className="md-cart-box">
            <img src={IconCheckout} alt="Cart" className="md-cart-icon" />
            <div className="md-cart-dot"></div>
          </div>
          <div className="md-cart-text">
            <h4>Total (2 item)</h4>
            <p>Rp 57.000</p>
          </div>
        </div>
        <button className="md-btn-checkout">
          Checkout &gt;
        </button>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="md-footer">
        <div className="md-socials">
          <div className="md-soc-circle"><img src={IconInstagram} alt="Instagram" /></div>
          <div className="md-soc-circle"><img src={IconWhatsapp} alt="Whatsapp" /></div>
          <div className="md-soc-circle"><img src={IconFacebook} alt="Facebook" /></div>
          <div className="md-soc-circle"><img src={IconLink} alt="Link" /></div>
          <div className="md-soc-circle"><img src={IconTiktok} alt="Tiktok" /></div>
        </div>
        <div className="md-copyright">
          © Copyright Laoban Nusantara.
        </div>
      </footer>

    </div>
  );
}