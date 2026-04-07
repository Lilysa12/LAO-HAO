import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InputData.css';

// --- IMPORT ASSETS (Jalur Sudah Diperbaiki) ---
import ImgHero from '../../assets/image/Image5.png'; // Pastikan ekstensinya .png atau .jpg sesuai file asli
import LogoLaoban from '../../assets/icons/icons-customer/logoLaoban.png';
import IconInstagram from '../../assets/icons/icons-customer/instagram.png';
import IconWhatsapp from '../../assets/icons/icons-customer/whatsapp.png';
import IconFacebook from '../../assets/icons/icons-customer/facebook.png';
import IconLink from '../../assets/icons/icons-customer/link.png';
import IconTiktok from '../../assets/icons/icons-customer/tiktok.png';
import IconPeta from '../../assets/icons/icons-customer/peta.png';

export default function InputData() {
  const navigate = useNavigate(); // <-- Fungsi pindah halaman

  return (
    <div className="input-data-container">
      
      {/* ================= HEADER ================= */}
      <header className="id-header">
        <div className="id-logo-box">
          <img src={LogoLaoban} alt="Logo Laoban" className="id-logo" />
        </div>
        <nav className="id-nav-links">
          <a href="#" className="active">Home</a>
          <a href="#">About</a>
          <a href="#">Menu</a>
          <a href="#">Our Partner</a>
          <a href="#">Partnership</a>
        </nav>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="id-main-body">
        
        {/* Gambar Kiri */}
        <div className="id-image-section">
          <img src={ImgHero} alt="Menu Laoban" className="id-hero-img" />
        </div>
        
        {/* Form Kanan */}
        <div className="id-form-section">
          <div className="id-text-header">
            <h1 className="id-title">Selamat Datang Para Laoban!</h1>
            <p className="id-subtitle">Pesan dan bayar langsung dari mejamu. Masukkan nama untuk memulai.</p>
          </div>

          <div className="id-form-card">
            {/* Lokasi & Meja */}
            <div className="id-location-row">
              <div className="id-loc-left">
                <img src={IconPeta} alt="Pin" className="id-loc-icon" />
                <span>Laoban Malang</span>
              </div>
              <div className="id-table-badge">
                <span className="badge-icon">↳</span> Meja 12
              </div>
            </div>

            {/* Input Fields */}
            <form className="id-form">
              <div className="id-input-group">
                <label>Nama Lengkap</label>
                <input type="text" placeholder="Masukkan Nama Anda" />
              </div>
              
              <div className="id-input-group">
                <label>No Handphone</label>
                <input type="tel" placeholder="Contoh: 089123456789" />
              </div>
              
              <div className="id-input-group">
                <label>Email (opsional)</label>
                <input type="email" placeholder="contoh123@gmail.com" />
              </div>

              {/* <-- Tombol pindah ke MenuList --> */}
              <button 
                type="button" 
                className="id-btn-submit efek-klik" 
                onClick={() => navigate('/menu')}
              >
                &gt; Mulai Memesan
              </button>
            </form>
          </div>
        </div>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="id-footer">
        <div className="id-socials">
          <div className="id-soc-circle"><img src={IconInstagram} alt="Instagram" /></div>
          <div className="id-soc-circle"><img src={IconWhatsapp} alt="Whatsapp" /></div>
          <div className="id-soc-circle"><img src={IconFacebook} alt="Facebook" /></div>
          <div className="id-soc-circle"><img src={IconLink} alt="Link" /></div>
          <div className="id-soc-circle"><img src={IconTiktok} alt="Tiktok" /></div>
        </div>
        <div className="id-copyright">
          © Copyright Laoban Nusantara.
        </div>
      </footer>

    </div>
  );
}