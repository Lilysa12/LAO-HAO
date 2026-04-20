import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

// --- IMPORT ASSETS HEADER & FOOTER ---
import LogoLaoban from '../../../assets/icons/icons-customer/LogoLaoban.png'; 
import IconInstagram from '../../../assets/icons/icons-customer/Instagram.png'; 
import IconWhatsapp from '../../../assets/icons/icons-customer/Whatsapp.png'; 
import IconFacebook from '../../../assets/icons/icons-customer/facebook.png'; 
import IconTiktok from '../../../assets/icons/icons-customer/Tiktok.png'; 
import IconMessage from '../../../assets/icons/Message.png'; 
import IconCall from '../../../assets/icons/Call.png'; 

// --- IMPORT GAMBAR ABOUT MAIN CONTENT ---
import ImgHistory from '../../../assets/home/image1.png'; 
import ImgFounder from '../../../assets/home/image2.png'; 

export default function About() {
  const navigate = useNavigate();
  
  // STATE MENU MOBILE (HAMBURGER) SAMA DENGAN HOME
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper untuk pindah halaman dan otomatis scroll ke atas
  const navigateToTop = (path) => {
    setIsMobileMenuOpen(false); // Tutup menu saat pindah halaman
    navigate(path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.15 }); 

    const hiddenElements = document.querySelectorAll('.slide-up, .fade-in-up');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="ab-container">
      
      {/* ================= HEADER NAVBAR (PERSIS HOME) ================= */}
      <nav className="navbar fade-in-up">
        <div className="logo-box">
          <img src={LogoLaoban} alt="Logo Laoban" className="logo-img" style={{cursor: 'pointer'}} onClick={() => navigateToTop('/home')} />
        </div>

        {/* --- MENU OVERLAY MOBILE / DESKTOP LINKS --- */}
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/home'); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/about'); }} className="active">About</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/menu'); }}>Menu</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/our-partner'); }}>Our Partner</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/partnership'); }}>Partnership</a>
          
          {/* Tombol Pesan Khusus Tampil di Overlay Menu HP */}
          <button className="btn-red mobile-only-btn" onClick={() => navigateToTop('/download')}>Pesan Sekarang</button>
        </div>

        <div className="nav-actions">
          {/* Tombol Pesan Desktop */}
          <button className="btn-red desktop-only-btn" onClick={() => navigateToTop('/download')}>Pesan Sekarang</button>
          
          {/* --- HAMBURGER TOGGLE --- */}
          <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="ab-main-content">
        
        {/* --- SECTION 1: HISTORY --- */}
        <section className="ab-section ab-history slide-up">
          <div className="ab-text-area">
            <div className="ab-label-wrapper">
              <span className="ab-label red-text">ABOUT US</span>
            </div>
            <h1 className="ab-title">HISTORY LAOBAN<br/>NUSANTARA</h1>
            
            <p className="ab-desc">
              Berawal dari kegelisahan sang owner dan istri yang mencari rasa otentik kopitiam untuk warga lokal, LAO BAN terlahir untuk mengungkap bakat masak terpendam sang owner. Melalui survei dari Singapura hingga Malaysia, kami menyempurnakan resep makanan, mengolah bumbu non-asli Indonesia tanpa campuran non-halal tentu menjadi tantangan untuk owner LAO BAN dalam perjalanan mencari jati diri. Mengolah kelapa hingga menjadi selai kaya, hingga kini masih menjadi andalan para laoban menjadi titik klimaks dalam pencarian jati diri LAO BAN.
            </p>
            <p className="ab-desc">
              Hingga pada akhirnya penentuan tgl diputuskan, waktu yg tidak terasa habis untuk merekrut para crew dan tepat pada tgl 20 training pertama bersama 5 crew "babat alas" pun dimulai 3 hari berlalu di hari ke 4 kita memutuskan untuk membuka LAO BAN untuk pertama kali nya. Hari demi hari tidak terasa adrenalin para crew dan owner semakin terguncang bertubi tubi karena derasnya antusias para predator makanan asia.
            </p>
            <p className="ab-desc">
              Hujatan, pujian, review buruk, cust langganan sampai hatters bayaran semua Menjadikan cambuk untuk LAO BAN terpacu jadi semakin besar dan dikenal banyak orang. sebagai pemanfaat situasi dan pembidik jitu tidak afdal jika LAO BAN mecampakkan platform ig dan tiktok.
            </p>
            <p className="ab-desc">
              Perjalanan kisah jatuh bangun warga tiktok yg fyp menjadi kiblat LAO BAN untuk membuat cuplikan cerita singkat proses pendakian kedai ini. Semakin fyp semakin banyak orang kepo dan fomo terhadap LAO BAN dan yg akhirnya bisa membuat LAO BAN buka cabang di kota kota besar lainnya.
            </p>
          </div>
          
          <div className="ab-img-area">
            <img src={ImgHistory} alt="Sejarah Laoban" className="ab-main-img" />
          </div>
        </section>

        {/* --- SECTION 2: FOUNDER --- */}
        <section className="ab-section ab-founder slide-up delay-1">
          <div className="ab-img-area">
            <div className="ab-founder-card">
              <img src={ImgFounder} alt="Alvin Osh" className="ab-founder-img" />
              <div className="ab-founder-info">
                <h3>Alvin Osh</h3>
                <p>CEO</p>
              </div>
            </div>
          </div>

          <div className="ab-text-area founder-text">
            <div className="ab-label-wrapper">
              <span className="ab-label red-text">FOUNDER LAOBAN NUSANTARA</span>
            </div>
            <h1 className="ab-title">ALVIN OSH</h1>
            
            <p className="ab-desc">
              Jadilah bagian dari keluarga besar Laoban Nusantara. Bertumbuh bersama memajukan industri F&B di Indonesia.
            </p>
            <p className="ab-desc">
              Yuk Mampir ke Outlet terdekat kami, Udah Cobain Menu-menu terbaru dari Laoban Nusantara belum???
            </p>
          </div>
        </section>

      </main>

      {/* ================= FOOTER MODERN (PERSIS HOME MOBILE) ================= */}
      <footer className="footer-modern fade-in-up delay-1">
        <div className="foot-grid">
          <div className="foot-brand">
            <img src={LogoLaoban} alt="Logo Laoban" className="logo-img" style={{marginBottom: '15px', cursor: 'pointer'}} onClick={() => navigateToTop('/home')} />
            <p>Menyajikan hidangan dan minuman khas Kopitiam Nusantara dengan bahan premium, kebersihan terjaga, dan resep rahasia Uncle Osh.</p>
            
            <div className="socials socials-colored unified-socmed">
               <div className="soc-colored" onClick={() => window.open('https://www.instagram.com/laoban.nusantara/', '_blank')}><img src={IconInstagram} alt="Instagram" className="soc-img" /></div>
               <div className="soc-colored" onClick={() => window.open('https://www.tiktok.com/@laoban.nusantara', '_blank')}><img src={IconTiktok} alt="Tiktok" className="soc-img" /></div>
               <div className="soc-colored" onClick={() => window.open('https://api.whatsapp.com/send/?phone=%2B6282244503221&text&type=phone_number&app_absent=0', '_blank')}><img src={IconWhatsapp} alt="Whatsapp" className="soc-img" /></div>
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
              <li onClick={() => window.open('https://api.whatsapp.com/send/?phone=%2B6282244503221&text&type=phone_number&app_absent=0', '_blank')} style={{cursor: 'pointer'}}>Hubungi Sales</li>
            </ul>
          </div>
          
          <div className="foot-links">
            <h4>Hubungi Kami</h4>
            <ul className="contact-list contact-modern">
              <li onClick={() => window.location.href = 'mailto:laobankopitiam@gmail.com'} style={{cursor: 'pointer'}}>
                <img src={IconMessage} alt="Email" className="contact-icon" /> 
                <span className="contact-info contact-link">laobankopitiam@gmail.com</span>
              </li>
              <li onClick={() => window.open('https://api.whatsapp.com/send/?phone=%2B6282244503221&text&type=phone_number&app_absent=0', '_blank')} style={{cursor: 'pointer'}}>
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