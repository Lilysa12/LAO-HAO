import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

// --- IMPORT ASSETS (JALUR SUDAH DIPERBAIKI) ---
import LogoLaoban from '../../assets/icons/icons-customer/logoLaoban.png';
import IconInstagram from '../../assets/icons/icons-customer/instagram.png';
import IconWhatsapp from '../../assets/icons/icons-customer/whatsapp.png';
import IconTiktok from '../../assets/icons/icons-customer/tiktok.png';
import IconFacebook from '../../assets/icons/icons-customer/facebook.png';
import IconLink from '../../assets/icons/icons-customer/link.png';

// Placeholder Gambar Menu
import ImgNasi from '../../assets/image/image1.png'; 
import ImgRoti from '../../assets/image/image4.png'; 

export default function Checkout() {
  const navigate = useNavigate();

  return (
    <div className="co-container">
      
      {/* ================= HEADER ================= */}
      <header className="co-header">
        <div className="co-logo-box">
          <img src={LogoLaoban} alt="Logo Laoban" className="co-logo" />
        </div>
        <nav className="co-nav-links">
          <a href="#" className="active">Home</a>
          <a href="#">About</a>
          <a href="#">Menu</a>
          <a href="#">Our Partner</a>
          <a href="#">Partnership</a>
        </nav>
        <div style={{ width: '100px' }}></div>
      </header>

      {/* ================= TOP BAR (BACK & TITLE) ================= */}
      <div className="co-top-bar">
        <button className="co-back-btn efek-klik" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h2 className="co-page-title">Pesanan Anda</h2>
      </div>

      {/* ================= MAIN CONTENT (2 KOLOM) ================= */}
      <main className="co-main-layout">
        
        {/* KOLOM KIRI: Daftar Pesanan */}
        <section className="co-left-column">
          
          {/* Card Item 1 */}
          <div className="co-item-card">
            <div className="co-item-header">
              <img src={ImgNasi} alt="Nasi Goreng" className="co-item-img" />
              <div className="co-item-info">
                <h3>Nasi Goreng Lao-Hao</h3>
                <p className="co-item-price">Rp 35.000</p>
              </div>
              <div className="co-qty-control">
                <button className="co-qty-btn">-</button>
                <span className="co-qty-num">1</span>
                <button className="co-qty-btn text-red">+</button>
              </div>
            </div>
            <input type="text" className="co-notes-input" placeholder="Tambah catatan (opsional)" />
          </div>

          {/* Card Item 2 */}
          <div className="co-item-card">
            <div className="co-item-header">
              <img src={ImgRoti} alt="Roti Bakar" className="co-item-img" />
              <div className="co-item-info">
                <h3>Roti Bakar Srikaya</h3>
                <p className="co-item-price">Rp 22.000</p>
              </div>
              <div className="co-qty-control">
                <button className="co-qty-btn">-</button>
                <span className="co-qty-num">1</span>
                <button className="co-qty-btn text-red">+</button>
              </div>
            </div>
            <input type="text" className="co-notes-input" placeholder="Tambah catatan (opsional)" />
          </div>

        </section>

        {/* KOLOM KANAN: Promo & Summary */}
        <section className="co-right-column">
          
          {/* Promo Card 1 (Yellow) */}
          <div className="co-promo-card yellow-tint efek-klik-kartu">
            <div className="co-promo-icon text-yellow">⭐</div>
            <div className="co-promo-text">
              <h4>Kumpulkan Poin Lao-Hao</h4>
              <p>Dapat 57 poin dari pesanan ini</p>
            </div>
          </div>

          {/* Promo Card 2 (White) */}
          <div className="co-promo-card efek-klik-kartu">
            <div className="co-promo-icon text-red">%</div>
            <div className="co-promo-text">
              <h4>Promo/ Diskon Voucher</h4>
              <p>Masukan promo atau kode voucher disini!</p>
            </div>
          </div>

          {/* Summary Card */}
          <div className="co-summary-card">
            <div className="co-summary-row">
              <span className="co-sum-label">Subtotal</span>
              <span className="co-sum-value">Rp 57.000</span>
            </div>
            <div className="co-summary-row">
              <span className="co-sum-label">Pajak Restoran (10%)</span>
              <span className="co-sum-value">Rp 5.700</span>
            </div>
            
            <div className="co-divider"></div>
            
            <div className="co-summary-row total-row">
              <span className="co-sum-label-bold">Total Pembayaran</span>
              <span className="co-sum-total">Rp 62.700</span>
            </div>

            <button 
              className="co-btn-pay efek-klik" 
              onClick={() => navigate('/payment')}
            >
              Pilih Pembayaran
            </button>
          </div>

        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="co-footer">
        <div className="co-socials">
          <div className="co-soc-circle"><img src={IconInstagram} alt="Instagram" /></div>
          <div className="co-soc-circle"><img src={IconWhatsapp} alt="Whatsapp" /></div>
          <div className="co-soc-circle"><img src={IconFacebook} alt="Facebook" /></div>
          <div className="co-soc-circle"><img src={IconLink} alt="Link" /></div>
          <div className="co-soc-circle"><img src={IconTiktok} alt="Tiktok" /></div>
        </div>
        <div className="co-copyright">
          © Copyright Laoban Nusantara.
        </div>
      </footer>

    </div>
  );
}