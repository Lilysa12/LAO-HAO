import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DownloadApp.css';

// --- IMPORT ASSETS HEADER & FOOTER ---
import LogoLaoban from '../../../assets/icons/LogoLaoban.png';
import IconInstagram from '../../../assets/icons/Instagram.png';
import IconWhatsapp from '../../../assets/icons/Whatsapp.png';
import IconTiktok from '../../../assets/icons/Tiktok.png';
import IconFacebook from '../../../assets/icons/icons-customer/facebook.png'; 
import IconMessage from '../../../assets/icons/Message.png'; 
import IconCall from '../../../assets/icons/Call.png'; 

// --- IMPORT ASSETS CONTENT ---
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

  // LOGIKA SCROLL ANIMATION
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.dl-reveal');
      const windowHeight = window.innerHeight;
      
      elements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
          el.classList.add('active');
        }
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="dl-container">
      
      {/* ================= 1. NAVBAR ================= */}
      <nav className="navbar">
        <div className="logo-box">
          <img 
            src={LogoLaoban} 
            alt="Logo Laoban" 
            className="logo-img" 
            style={{cursor: 'pointer'}} 
            onClick={() => navigateToTop('/home')} 
          />
        </div>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/home'); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/about'); }}>About</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/menu'); }}>Menu</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/our-partner'); }}>Our Partner</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/partnership'); }}>Partnership</a>
          
          {/* TOMBOL PESAN SEKARANG (MOBILE) - DIARAHKAN KE HALAMAN DOWNLOAD SENDIRI */}
          <button className="btn-red mobile-only-btn" onClick={() => navigateToTop('/download')}>Pesan Sekarang</button>
        </div>

        <div className="nav-actions">
          {/* TOMBOL PESAN SEKARANG (DESKTOP) - DIARAHKAN KE HALAMAN DOWNLOAD SENDIRI */}
          <button className="btn-red desktop-only-btn" onClick={() => navigateToTop('/download')}>Pesan Sekarang</button>
          
          <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      {/* ================= 2. HERO DOWNLOAD CONTENT ================= */}
      <main className="dl-main-content">
        <div className="dl-flex-wrapper">
          
          {/* --- AREA TEKS --- */}
          <div className="dl-text-side dl-reveal dl-delay-1">
            <div className="dl-tag">L A O - H A O &nbsp;&nbsp; A P P</div>
            
            <h1 className="dl-hero-title">
              <div className="text-red">LaoHao Mobile App is Here!</div>
              <div className="title-row-2">
                <span className="text-dark">Dapatkan Promo Special, </span>
                <span className="text-green">Download Sekarang!</span>
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

          {/* --- AREA GAMBAR --- */}
          <div className="dl-image-side dl-reveal dl-delay-2">
            <img src={PhoneMockup} alt="Mockup App" className="dl-phone-img" />
          </div>

        </div>
      </main>

      {/* ================= 3. FOOTER ================= */}
      <footer className="footer-modern dl-reveal dl-delay-3">
        <div className="foot-grid">
          <div className="foot-brand">
            <img src={LogoLaoban} alt="Logo Laoban" className="logo-img" style={{marginBottom: '15px', cursor: 'pointer'}} onClick={() => navigateToTop('/home')} />
            <p>Menyajikan hidangan dan minuman khas Kopitiam Nusantara dengan bahan premium, kebersihan terjaga, dan resep rahasia Uncle Osh.</p>
            <div className="socials socials-colored unified-socmed">
               <div className="soc-colored" onClick={() => window.open('https://www.instagram.com/laoban.nusantara/', '_blank')}><img src={IconInstagram} alt="Instagram" className="soc-img" /></div>
               <div className="soc-colored" onClick={() => window.open('https://www.tiktok.com/@laoban.nusantara', '_blank')}><img src={IconTiktok} alt="Tiktok" className="soc-img" /></div>
               <div className="soc-colored" onClick={() => window.open('https://api.whatsapp.com/send/?phone=%2B6282244503221', '_blank')}><img src={IconWhatsapp} alt="Whatsapp" className="soc-img" /></div>
               <div className="soc-colored" onClick={() => window.open('https://www.facebook.com/laoban.nusantara/', '_blank')}><img src={IconFacebook} alt="Facebook" className="soc-img" /></div>
            </div>
          </div>
          
          <div className="foot-links">
            <h4>Navigasi</h4>
            <ul>
              <li onClick={() => navigateToTop('/home')}>Home</li>
              <li onClick={() => navigateToTop('/about')}>Tentang Kami</li>
              <li onClick={() => navigateToTop('/menu')}>Menu Perguruan</li>
              <li onClick={() => navigateToTop('/our-partner')}>Daftar Cabang</li>
            </ul>
          </div>
          
          <div className="foot-links">
            <h4>Kemitraan</h4>
            <ul>
              <li onClick={() => navigateToTop('/partnership')}>Info Franchise</li>
              <li onClick={() => window.open('https://api.whatsapp.com/send/?phone=%2B6282244503221', '_blank')}>Hubungi Sales</li>
            </ul>
          </div>
          
          <div className="foot-links">
            <h4>Hubungi Kami</h4>
            <ul className="contact-list contact-modern">
              <li onClick={() => window.location.href = 'mailto:laobankopitiam@gmail.com'} style={{cursor: 'pointer'}}>
                <img src={IconMessage} alt="Email" className="contact-icon" /> 
                <span className="contact-info contact-link">laobankopitiam@gmail.com</span>
              </li>
              <li onClick={() => window.open('https://api.whatsapp.com/send/?phone=%2B6282244503221', '_blank')} style={{cursor: 'pointer'}}>
                <img src={IconCall} alt="Phone" className="contact-icon" /> 
                <span className="contact-info contact-bold">+62 822 4450 3221</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="foot-bottom">
          <p>© 2026 Laoban by Uncle Osh. All rights reserved.</p>
          <p>Kebijakan Privasi &nbsp;&nbsp;•&nbsp;&nbsp; Syarat & Ketentuan</p>
        </div>
      </footer>

    </div>
  );
}