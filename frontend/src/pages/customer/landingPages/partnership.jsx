import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Partnership.css'; 

// --- IMPORT ASSETS HEADER & FOOTER (Standar Laoban) ---
import LogoLaoban from '../../../assets/icons/LogoLaoban.png';
import IconInstagram from '../../../assets/icons/Instagram.png';
import IconWhatsapp from '../../../assets/icons/Whatsapp.png';
import IconFacebook from '../../../assets/icons/icons-customer/facebook.png'; 
import IconTiktok from '../../../assets/icons/Tiktok.png';
import IconMessage from '../../../assets/icons/Message.png'; 
import IconCall from '../../../assets/icons/Call.png'; 

// --- IMPORT ASSETS PARTNERSHIP ---
import BgHero from '../../../assets/icons/icons-partner/image1.png'; 

// Icons Kenapa Bergabung
import IconBrand from '../../../assets/icons/icons-partner/brand.png';
import IconMenu from '../../../assets/icons/icons-partner/menu.png';
import IconOperasional from '../../../assets/icons/icons-partner/operasional.png';
import IconPotensi from '../../../assets/icons/icons-partner/potensi.png';

// Icons Journey
import IconLokasi from '../../../assets/icons/icons-partner/lokasi.png';
import IconContract from '../../../assets/icons/icons-partner/contract.png';
import IconPayment from '../../../assets/icons/icons-partner/payment.png';
import IconRenovation from '../../../assets/icons/icons-partner/renovation.png';
import IconDelivering from '../../../assets/icons/icons-partner/delivering.png';
import IconTraining from '../../../assets/icons/icons-partner/training.png';
import IconOpening from '../../../assets/icons/icons-partner/opening.png';
import IconInnovation from '../../../assets/icons/icons-partner/innovation.png';

// Icons Contact
import IconPhone from '../../../assets/icons/icons-partner/phone.png';
import IconEmail from '../../../assets/icons/icons-partner/email.png';

export default function Partnership() {
  const navigate = useNavigate();

  // STATE MENU MOBILE (HAMBURGER) - SAMA PERSIS DENGAN HOME
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper untuk navigasi dan scroll ke atas otomatis
  const navigateToTop = (path) => {
    setIsMobileMenuOpen(false); // Tutup menu kalau pindah
    navigate(path);
    window.scrollTo(0, 0);
  };

  // URL WhatsApp untuk digunakan berulang kali
  const waLink = "https://api.whatsapp.com/send/?phone=%2B6282244503221&text&type=phone_number&app_absent=0";

  // Animasi Scroll (Sama dengan Home, threshold diatur kecil biar responsif di HP)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 }); 

    const hiddenElements = document.querySelectorAll('.fade-in-up');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="pt-container">
      
      {/* ================= 1. NAVBAR (SAMA PERSIS DENGAN HOME) ================= */}
      <nav className="navbar fade-in-up">
        <div className="logo-box" onClick={() => navigateToTop('/home')} style={{cursor: 'pointer'}}>
          <img src={LogoLaoban} alt="Logo Laoban" className="logo-img" />
        </div>

        {/* --- MENU OVERLAY MOBILE / DESKTOP LINKS --- */}
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/home'); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/about'); }}>About</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/menu'); }}>Menu</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/our-partner'); }}>Our Partner</a>
          <a href="#" onClick={(e) => { e.preventDefault(); }} className="active">Partnership</a>
          
          <button className="btn-red mobile-only-btn" onClick={() => navigateToTop('/download')}>Pesan Sekarang</button>
        </div>

        <div className="nav-actions">
          <button className="btn-red desktop-only-btn" onClick={() => navigateToTop('/download')}>Pesan Sekarang</button>
          
          {/* --- HAMBURGER TOGGLE --- */}
          <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>


      {/* ================= 2. HERO SECTION ================= */}
      <section className="pt-hero fade-in-up delay-1">
        
        <div className="pt-hero-bg">
          <img src={BgHero} alt="Laoban Outlet" className="pt-bg-img" />
          <div className="pt-hero-overlay"></div>
        </div>

        <div className="pt-hero-content">
          <p className="pt-hero-label">GROW WITH US!</p>
          <h1 className="pt-hero-title">
            BERGABUNGLAH BERSAMA<br/>LAOBAN NUSANTARA
          </h1>
          <p className="pt-hero-desc">
            Anda berkesempatan menjadi bagian dalam pertumbuhan industri minuman dan makanan dengan konsep kopitiam ala Laoban di Indonesia. Tentunya bersama dengan menu-menu kebanggaan Laoban seperti Nasi-nasi khas Laoban, Kudapan Khas Laoban, Minuman Khas Laoban.
          </p>
          
          <button className="pt-btn-dark-red" onClick={() => window.open(waLink, '_blank')}>
            Initiate Partnership
          </button>
        </div>
      </section>

      {/* ================= 3. KENAPA BERGABUNG SECTION ================= */}
      <section className="pt-why-section fade-in-up">
        <div className="pt-section-header">
          <h2 className="pt-title-white">Kenapa Harus Bergabung?</h2>
          <div className="pt-yellow-line"></div>
        </div>

        {/* Di mobile ini bakal berubah jadi 1 kolom */}
        <div className="pt-why-grid">
          <div className="pt-why-card">
            <div className="pt-icon-wrap"><img src={IconBrand} alt="Brand" /></div>
            <h3>Brand yang Kuat &<br/>Terpercaya</h3>
            <p>Bergabung dengan brand yang memiliki jejak pertumbuhan pesat dan basis pelanggan setia di seluruh nusantara.</p>
          </div>
          <div className="pt-why-card">
            <div className="pt-icon-wrap"><img src={IconMenu} alt="Menu" /></div>
            <h3>Inovasi Menu<br/>Berkelanjutan</h3>
            <p>Nikmati keunggulan menu inovatif yang memadukan cita rasa Asia tradisional dan modern secara apik.</p>
          </div>
          <div className="pt-why-card">
            <div className="pt-icon-wrap"><img src={IconOperasional} alt="Operasional" /></div>
            <h3>Dukungan Operasional<br/>Penuh</h3>
            <p>Dapatkan pelatihan komprehensif dan dukungan rantai pasok yang andal untuk kelancaran bisnis Anda.</p>
          </div>
          <div className="pt-why-card">
            <div className="pt-icon-wrap"><img src={IconPotensi} alt="Potensi" /></div>
            <h3>Potensi Pertumbuhan<br/>Tinggi</h3>
            <p>Model bisnis yang mudah diskalakan dalam industri F&B yang terus berkembang pesat.</p>
          </div>
        </div>
      </section>

      {/* ================= 4. JOURNEY SECTION ================= */}
      <section className="pt-journey-section fade-in-up">
        <h2 className="pt-title-darkred text-center" style={{marginBottom: '50px'}}>The Journey to Partnership</h2>
        
        {/* REVISI 2: Di mobile grid ini jadi 2 Kolom 4 Baris */}
        <div className="pt-journey-grid">
          <div className="pt-journey-card">
            <div className="pt-circle-icon"><img src={IconLokasi} alt="Location" /></div>
            <h4>Location searching by partner</h4>
            <p>Identify the perfect spot for your new kopitiam.</p>
          </div>
          <div className="pt-journey-card">
            <div className="pt-circle-icon"><img src={IconContract} alt="Contract" /></div>
            <h4>Contract and invoicing</h4>
            <p>Streamlined legal and financial onboarding.</p>
          </div>
          <div className="pt-journey-card">
            <div className="pt-circle-icon"><img src={IconPayment} alt="Payment" /></div>
            <h4>Payment</h4>
            <p>Secure and transparent transaction process.</p>
          </div>
          <div className="pt-journey-card">
            <div className="pt-circle-icon"><img src={IconRenovation} alt="Renovation" /></div>
            <h4>Renovation and preparing outlet</h4>
            <p>Transforming the space into a heritage experience.</p>
          </div>
          <div className="pt-journey-card">
            <div className="pt-circle-icon"><img src={IconDelivering} alt="Delivering" /></div>
            <h4>Delivering goods</h4>
            <p>Supplying your outlet with authentic ingredients.</p>
          </div>
          <div className="pt-journey-card">
            <div className="pt-circle-icon"><img src={IconTraining} alt="Training" /></div>
            <h4>Training</h4>
            <p>Empowering your team with operational excellence.</p>
          </div>
          <div className="pt-journey-card">
            <div className="pt-circle-icon"><img src={IconOpening} alt="Opening" /></div>
            <h4>Opening</h4>
            <p>Launching your Kopitiam to the community.</p>
          </div>
          <div className="pt-journey-card">
            <div className="pt-circle-icon"><img src={IconInnovation} alt="Innovation" /></div>
            <h4>Innovation</h4>
            <p>Continuous support and product development.</p>
          </div>
        </div>

        {/* Info Kontak Cards (REVISI 3: Di mobile grid ini jadi 1 Kolom vertikal) */}
        <div className="pt-contact-cards fade-in-up">
          <div className="pt-contact-card clickable" onClick={() => window.open(waLink, '_blank')}>
            <div className="pt-contact-icon-bg bg-yellow">
              <img src={IconPhone} alt="Phone" />
            </div>
            <div className="pt-contact-text">
              <h5>Franchise Inquiry (Phone)</h5>
              <p>Speak directly with our partnership team.</p>
              <h4 className="text-red">0822-4450-3221</h4>
            </div>
          </div>

          <div className="pt-contact-card clickable" onClick={() => window.location.href = 'mailto:laobankopitiam@gmail.com'}>
            <div className="pt-contact-icon-bg bg-green">
              <img src={IconEmail} alt="Email" />
            </div>
            <div className="pt-contact-text">
              <h5>General Inquiries (Email)</h5>
              <p>Send us your proposals and questions.</p>
              <h4 className="text-red">laobankopitiam@gmail.com</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. CTA BOTTOM SECTION ================= */}
      <section className="pt-cta-bottom fade-in-up">
        <h2 className="pt-cta-title">Ready to build the legacy?</h2>
        <button className="pt-btn-white" onClick={() => window.open(waLink, '_blank')}>
          Contact Our Team
        </button>
      </section>

      {/* ================= 6. FOOTER MODERN (SAMA PERSIS DENGAN HOME) ================= */}
      <footer className="footer-modern fade-in-up delay-1">
        <div className="foot-grid">
          <div className="foot-brand">
            <img src={LogoLaoban} alt="Logo Laoban" className="logo-img" style={{marginBottom: '15px', cursor: 'pointer'}} onClick={() => navigateToTop('/home')} />
            <p>Menyajikan hidangan dan minuman khas Kopitiam Nusantara dengan bahan premium, kebersihan terjaga, dan resep rahasia Uncle Osh.</p>
            
            <div className="socials socials-colored unified-socmed">
               <div className="soc-colored" onClick={() => window.open('https://www.instagram.com/laoban.nusantara/', '_blank')}><img src={IconInstagram} alt="Instagram" className="soc-img" /></div>
               <div className="soc-colored" onClick={() => window.open('https://www.tiktok.com/@laoban.nusantara', '_blank')}><img src={IconTiktok} alt="Tiktok" className="soc-img" /></div>
               <div className="soc-colored" onClick={() => window.open(waLink, '_blank')}><img src={IconWhatsapp} alt="Whatsapp" className="soc-img" /></div>
               <div className="soc-colored" onClick={() => window.open('https://www.facebook.com/laoban.nusantara/', '_blank')}><img src={IconFacebook} alt="Facebook" className="soc-img" /></div>
            </div>
          </div>
          
          <div className="foot-links">
            <h4>Navigasi</h4>
            <ul>
              <li onClick={() => navigateToTop('/home')} style={{cursor: 'pointer'}}>Home</li>
              <li onClick={() => navigateToTop('/about')} style={{cursor: 'pointer'}}>Tentang Kami</li>
              <li onClick={() => navigateToTop('/menu')} style={{cursor: 'pointer'}}>Menu Perguruan</li>
              <li onClick={() => navigateToTop('/our-partner')} style={{cursor: 'pointer'}}>Daftar Cabang</li>
            </ul>
          </div>
          
          <div className="foot-links">
            <h4>Kemitraan</h4>
            <ul>
              <li onClick={() => navigateToTop('/partnership')} style={{cursor: 'pointer'}}>Info Franchise</li>
              <li onClick={() => window.open(waLink, '_blank')} style={{cursor: 'pointer'}}>Hubungi Sales</li>
            </ul>
          </div>
          
          <div className="foot-links">
            <h4>Hubungi Kami</h4>
            <ul className="contact-list contact-modern">
              <li onClick={() => window.location.href = 'mailto:laobankopitiam@gmail.com'} style={{cursor: 'pointer'}}>
                <img src={IconMessage} alt="Email" className="contact-icon" /> 
                <span className="contact-info contact-link">laobankopitiam@gmail.com</span>
              </li>
              <li onClick={() => window.open(waLink, '_blank')} style={{cursor: 'pointer'}}>
                <img src={IconCall} alt="Phone" className="contact-icon" /> 
                <span className="contact-info contact-bold">+62 822 4450 3221</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="foot-bottom">
          <p>© 2026 Laoban by Uncle Osh. All rights reserved.</p>
          <p>Kebijakan Privasi   •   Syarat & Ketentuan</p>
        </div>
      </footer>

    </div>
  );
}