import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DownloadApp.css';

// --- IMPORT ASSETS (Pastikan path folder benar) ---
import LogoLaoban from '../../../assets/icons/LogoLaoban.png';
import IconInstagram from '../../../assets/icons/Instagram.png';
import IconWhatsapp from '../../../assets/icons/Whatsapp.png';
import IconTiktok from '../../../assets/icons/Tiktok.png';
import IconFacebook from '../../../assets/icons/icons-customer/facebook.png'; 
import IconMessage from '../../../assets/icons/Message.png'; 
import IconCall from '../../../assets/icons/Call.png'; 

import PlaystoreBtn from '../../../assets/Icons/image/playstore.png';
import AppstoreBtn from '../../../assets/Icons/image/appstore.png';
import PhoneMockup from '../../../assets/Icons/image/image1.png';

export default function DownloadApp() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateToTop = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
    window.scrollTo(0, 0);
  };

  // LOGIKA ANIMASI SCROLL KHUSUS PAGE DOWNLOAD
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.dl-reveal');
      elements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 50) {
          el.classList.add('dl-visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Jalankan sekali saat load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="dl-page-container">
      
      {/* ================= 1. NAVBAR ================= */}
      <nav className="dl-navbar">
        <div className="dl-logo-box">
          <img 
            src={LogoLaoban} 
            alt="Logo Laoban" 
            className="dl-logo-img" 
            onClick={() => navigateToTop('/home')} 
          />
        </div>

        <div className={`dl-nav-links ${isMobileMenuOpen ? 'dl-mobile-active' : ''}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/home'); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/about'); }}>About</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/menu'); }}>Menu</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/our-partner'); }}>Our Partner</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/partnership'); }}>Partnership</a>
          
          <button className="dl-btn-red dl-mobile-only-btn" onClick={() => navigateToTop('/download')}>Pesan Sekarang</button>
        </div>

        <div className="dl-nav-actions">
          <button className="dl-btn-red dl-desktop-only-btn" onClick={() => navigateToTop('/download')}>Pesan Sekarang</button>
          <div className={`dl-hamburger ${isMobileMenuOpen ? 'dl-open' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span className="dl-bar"></span>
            <span className="dl-bar"></span>
            <span className="dl-bar"></span>
          </div>
        </div>
      </nav>

      {/* ================= 2. HERO CONTENT ================= */}
      <main className="dl-main-content">
        <div className="dl-flex-wrapper">
          
          <div className="dl-text-side dl-reveal dl-delay-1">
            <div className="dl-tag">L A O - H A O &nbsp;&nbsp; A P P</div>
            
            <h1 className="dl-hero-title">
              <div className="dl-text-red">LaoHao Mobile App is Here!</div>
              <div className="dl-title-row-2">
                <span className="dl-text-dark">Dapatkan Promo Special, </span>
                <span className="dl-text-green">Download Sekarang!</span>
              </div>
            </h1>
            
            <p className="dl-hero-desc">
              Nikmati menu Kopitiam favoritmu, temukan lokasi terdekat, dan nikmati promo eksklusif.<br />
              Unduh aplikasi "LaoHao" sekarang untuk pengalaman bersantap yang lebih baik.
            </p>

            <div className="dl-store-wrapper">
              <img src={PlaystoreBtn} alt="Google Play" className="dl-store-img" />
              <img src={AppstoreBtn} alt="App Store" className="dl-store-img" />
            </div>
          </div>

          <div className="dl-image-side dl-reveal dl-delay-2">
            <img src={PhoneMockup} alt="Mockup App" className="dl-phone-img" />
          </div>

        </div>
      </main>

      {/* ================= 3. FOOTER ================= */}
      <footer className="dl-footer dl-reveal">
        <div className="dl-foot-grid">
          <div className="dl-foot-brand">
            <img src={LogoLaoban} alt="Logo" className="dl-logo-img" style={{marginBottom: '15px'}} />
            <p>Menyajikan hidangan dan minuman khas Kopitiam Nusantara dengan bahan premium, kebersihan terjaga, dan resep rahasia Uncle Osh.</p>
            <div className="dl-socials">
               <div className="dl-soc-item" onClick={() => window.open('https://www.instagram.com/laoban.nusantara/')}><img src={IconInstagram} alt="IG" /></div>
               <div className="dl-soc-item" onClick={() => window.open('https://www.tiktok.com/@laoban.nusantara')}><img src={IconTiktok} alt="Tiktok" /></div>
               <div className="dl-soc-item" onClick={() => window.open('https://api.whatsapp.com/send/?phone=%2B6282244503221')}><img src={IconWhatsapp} alt="WA" /></div>
               <div className="dl-soc-item" onClick={() => window.open('https://www.facebook.com/laoban.nusantara/')}><img src={IconFacebook} alt="FB" /></div>
            </div>
          </div>
          
          <div className="dl-foot-links">
            <h4>Navigasi</h4>
            <ul>
              <li onClick={() => navigateToTop('/home')}>Home</li>
              <li onClick={() => navigateToTop('/about')}>Tentang Kami</li>
              <li onClick={() => navigateToTop('/menu')}>Menu Perguruan</li>
              <li onClick={() => navigateToTop('/our-partner')}>Daftar Cabang</li>
            </ul>
          </div>
          
          <div className="dl-foot-links">
            <h4>Hubungi Kami</h4>
            <ul className="dl-contact-list">
              <li><img src={IconMessage} alt="Email" /> laobankopitiam@gmail.com</li>
              <li><img src={IconCall} alt="Phone" /> +62 822 4450 3221</li>
            </ul>
          </div>
        </div>
        
        <div className="dl-foot-bottom">
          <p>© 2026 Laoban by Uncle Osh. All rights reserved.</p>
          <p>Kebijakan Privasi &nbsp;&nbsp;•&nbsp;&nbsp; Syarat & Ketentuan</p>
        </div>
      </footer>

    </div>
  );
}