import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// --- IMPORT ICONS ---
import LogoLaoban from '../../assets/icons/icons-customer/logoLaoban.png';
import IconInstagram from '../../assets/icons/icons-customer/instagram.png';
import IconWhatsapp from '../../assets/icons/icons-customer/whatsapp.png';
import IconFacebook from '../../assets/icons/icons-customer/facebook.png';
import IconLink from '../../assets/icons/icons-customer/link.png';
import IconTiktok from '../../assets/icons/icons-customer/tiktok.png';

// --- IMPORT GAMBAR SLIDER (8 Gambar NIC_ dari folder Home) ---
import Slide1 from '../../assets/home/nic_1497.jpg';
import Slide2 from '../../assets/home/nic_1941.jpg';
import Slide3 from '../../assets/home/nic_4125.jpg';
import Slide4 from '../../assets/home/nic_4272.jpg';
import Slide5 from '../../assets/home/nic_7913.jpg';
import Slide6 from '../../assets/home/nic_8374.jpg';
import Slide7 from '../../assets/home/nic_8421.jpg';
import Slide8 from '../../assets/home/nic_9028.jpg';

// --- IMPORT GAMBAR GRID INSTAGRAM (Sesuai folder Abang yang baru .png) ---
import Grid1 from '../../assets/home/img1.png';
import Grid2 from '../../assets/home/img2.png';
import Grid3 from '../../assets/home/img3.png';
import Grid4 from '../../assets/home/img4.png';
import Grid5 from '../../assets/home/img5.png';
import Grid6 from '../../assets/home/img6.png';
import Grid7 from '../../assets/home/img7.png';
import Grid8 from '../../assets/home/img8.png';
import Grid9 from '../../assets/home/img9.png';

export default function Home() {
  const navigate = useNavigate();
  
  // State untuk Slider Utama (8 Slide)
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8];

  // State untuk melacak gambar grid yang sedang disentuh (hovered)
  const [hoveredGridIndex, setHoveredGridIndex] = useState(null);

  // Fungsi Next & Prev Slider
  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  // Efek Slider Otomatis (Ganti setiap 3.5 detik)
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 3500);
    return () => clearInterval(slideInterval); // Bersihkan interval saat komponen dibongkar
  }, [currentSlide]);

  // Data Dummy untuk Kartu Info yang muncul saat Hover
  const igPostDetails = [
    { likes: '83,2RB', foodName: 'Pandan Malacca Kopi - Es', desc: 'Es kopi kreamer santan gurih & manis berpadu pandan s...', date: '19 Januari', link: 'https://www.instagram.com/p/DAxK-KTS5PZ/' },
    { likes: '75,1RB', foodName: 'Kopi Tarik Laoban - Es/Panas', desc: 'Kopi tarik khas laoban yang pekat...', date: '18 Januari', link: 'https://www.instagram.com/p/DAun-KRS6PZ/' },
    { likes: '62,8RB', foodName: 'Es Teh Tarik Laoban', desc: 'Teh tarik khas laoban yang ditarik...', date: '17 Januari', link: 'https://www.instagram.com/p/DAsn-KQS7PZ/' },
    { likes: '55,5RB', foodName: 'Kopitiam Vibes', desc: 'Menikmati sore di Laoban Nusantara...', date: '16 Januari', link: 'https://www.instagram.com/p/DAqn-KPS8PZ/' },
    { likes: '91,0RB', foodName: 'Mie Khas Laoban', desc: 'Tekstur mie yang kenyal dengan bumbu...', date: '15 Januari', link: 'https://www.instagram.com/p/DAon-KNS9PZ/' },
    { likes: '48,2RB', foodName: 'Menu Perguruan', desc: 'Pilihan menu utama yang muantab...', date: '14 Januari', link: 'https://www.instagram.com/p/DAmn-KMS0PZ/' },
    { likes: '77,9RB', foodName: 'Suasana Kafe', desc: 'Interior klasik modern yang bikin betah...', date: '13 Januari', link: 'https://www.instagram.com/p/DAkn-KLS1PZ/' },
    { likes: '88,1RB', foodName: 'Pecinta Pedas?', desc: 'Nasi Mala yang pedas asin gurih...', date: '12 Januari', link: 'https://www.instagram.com/p/DAin-KKS2PZ/' },
    { likes: '95,4RB', foodName: 'Nasi Hainan Uncle Osh', desc: 'Nasi berbumbu putih rahasia...', date: '11 Januari', link: 'https://www.instagram.com/p/DAgn-KJS3PZ/' },
  ];

  const gridImages = [Grid1, Grid2, Grid3, Grid4, Grid5, Grid6, Grid7, Grid8, Grid9];

  return (
    <div className="hm-container">
      
      {/* ================= HEADER NAVBAR ================= */}
      <header className="hm-header">
        <div className="hm-logo-box">
          <img src={LogoLaoban} alt="Logo Laoban" className="hm-logo" />
        </div>
        <nav className="hm-nav-links">
          {/* Tambahin navigasi untuk Home biar bisa di-refresh/balik */}
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/home'); }} className="active">Home</a>
          
          {/* FIX: Tambahin navigasi untuk About */}
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About</a>
          
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/menu'); }}>Menu</a>
          <a href="#">Our Partner</a>
          <a href="#">Partnership</a>
        </nav>
        <div style={{ width: '100px' }}></div>
      </header>

      {/* ================= HERO SECTION (SLIDER) ================= */}
      <section className="hm-hero">
        
        {/* Sisi Kiri: Teks Merah */}
        <div className="hm-hero-left">
          <div className="hm-hero-watermark">LAOBAN</div>
          
          <div className="hm-hero-content">
            <h1 className="hm-hero-title">LaobanNusantara</h1>
            <p className="hm-hero-subtitle">BY UNCLE OSH</p>
            <button className="hm-btn-white efek-klik" onClick={() => navigate('/order')}>
              Grow Together With Us
            </button>
          </div>
        </div>

        {/* Sisi Kanan: Slider Gambar */}
        <div className="hm-hero-right">
          {slides.map((slide, index) => (
            <img 
              key={index}
              src={slide} 
              alt={`Slide ${index + 1}`} 
              className={`hm-slide-img ${index === currentSlide ? 'active' : ''}`} 
            />
          ))}
          
          {/* Tombol Panah Kiri & Kanan (Versi Bulat Merah SVG) */}
          <button className="hm-slider-btn left" onClick={prevSlide}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button className="hm-slider-btn right" onClick={nextSlide}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Titik Indikator Bawah (Dots untuk 8 slide) */}
          <div className="hm-slider-dots">
            {slides.map((_, index) => (
              <span 
                key={index} 
                className={`hm-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INSTAGRAM GRID SECTION ================= */}
      <section className="hm-ig-section">
        
        {/* Teks Header Instagram (Sesuai Desain Gambar ke-3) */}
        <div className="hm-ig-header-container">
          <p className="hm-ig-subtitle">FOLLOW US ON INSTAGRAM!</p>
          <h2 className="hm-ig-title">@LAOBAN.NUSANTARA</h2>
        </div>
        
        <div className="hm-ig-grid">
          {gridImages.map((image, index) => (
            <div 
              key={index}
              className="hm-ig-item-wrapper efek-klik-kartu"
              onMouseEnter={() => setHoveredGridIndex(index)} // Saat disentuh
              onMouseLeave={() => setHoveredGridIndex(null)}    // Saat dilepas
              onClick={() => window.open(igPostDetails[index].link, '_blank')} // Saat diklik, buka tab baru
              style={{ cursor: 'pointer' }}
            >
              <img src={image} alt={`IG ${index + 1}`} className="hm-ig-img" />

              {/* Kartu Info yang muncul saat Hover (overlay) */}
              {index === hoveredGridIndex && (
                <div className="hm-ig-overlay-card">
                  <div className="hm-card-header">
                    <span className="hm-card-likes">❤️ {igPostDetails[index].likes} suka</span>
                    <span className="hm-card-date">{igPostDetails[index].date}</span>
                  </div>
                  <div className="hm-card-body">
                    <h4 className="hm-card-food-name">{igPostDetails[index].foodName}</h4>
                    <p className="hm-card-food-desc">{igPostDetails[index].desc}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="hm-footer">
        {/* Kiri: Sosmed */}
        <div className="hm-socials">
          <div className="hm-soc-circle"><img src={IconInstagram} alt="Instagram" /></div>
          <div className="hm-soc-circle"><img src={IconWhatsapp} alt="Whatsapp" /></div>
          <div className="hm-soc-circle"><img src={IconFacebook} alt="Facebook" /></div>
          <div className="hm-soc-circle"><img src={IconLink} alt="Link" /></div>
          <div className="hm-soc-circle"><img src={IconTiktok} alt="Tiktok" /></div>
        </div>
        
        {/* Tengah: Logo Putih */}
        <div className="hm-footer-logo-box">
          <img src={LogoLaoban} alt="logoLaoban" className="hm-footer-logo" />
        </div>

        {/* Kanan: Copyright */}
        <div className="hm-copyright">
          © Copyright Laoban Nusantara.
        </div>
      </footer>

    </div>
  );
}