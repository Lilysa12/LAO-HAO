import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

// --- IMPORT ASSETS GAMBAR HERO ---
import HeroImg1 from '../../../assets/image/image1.png';
import HeroImg2 from '../../../assets/image/image2.png';
import HeroImg3 from '../../../assets/image/image3.png';
import HeroImg4 from '../../../assets/image/image4.png';

// --- IMPORT ASSETS GAMBAR ABOUT LOKAL ---
import ImgAbout1 from '../../../assets/Home/NIC_1506.jpg';
import ImgAbout2 from '../../../assets/Home/NIC_9077.jpg';

// --- IMPORT GAMBAR GRID INSTAGRAM ---
import Grid1 from '../../../assets/home/img1.png';
import Grid2 from '../../../assets/home/img2.png';
import Grid3 from '../../../assets/home/img3.png';
import Grid4 from '../../../assets/home/img4.png';
import Grid5 from '../../../assets/home/img5.png';
import Grid6 from '../../../assets/home/img6.png';
import Grid7 from '../../../assets/home/img7.png';
import Grid8 from '../../../assets/home/img8.png';
import Grid9 from '../../../assets/home/img9.png';

// --- IMPORT GAMBAR PETA STATIC ---
import BgHero from '../../../assets/icons/icons-partner/image1.png'; 

// --- IMPORT ICONS & LOGO ---
import LogoLaoban from '../../../assets/icons/LogoLaoban.png';
import IconInstagram from '../../../assets/icons/Instagram.png';
import IconWhatsapp from '../../../assets/icons/Whatsapp.png';
import IconFacebook from '../../../assets/icons/icons-customer/facebook.png'; 
import IconTiktok from '../../../assets/icons/Tiktok.png';

import IconMainDish from '../../../assets/icons/MainDish.png';
import IconSnack from '../../../assets/icons/Snack.png';
import IconDimsum from '../../../assets/icons/Dimsum.png';
import IconHotDrink from '../../../assets/icons/HotDrink.png';
import IconColdDrink from '../../../assets/icons/ColdDrink.png';
import IconIceDessert from '../../../assets/icons/Ice&Dessert.png';

import IconMessage from '../../../assets/icons/Message.png'; 
import IconCall from '../../../assets/icons/Call.png'; 
import IconKemitraan from '../../../assets/icons/kemitraan.png'; 

export default function Home() {
  const navigate = useNavigate();
  const [hoveredGridIndex, setHoveredGridIndex] = useState(null);

  const navigateToTop = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const [cabang, setCabang] = useState(0);
  const [kota, setKota] = useState(0);
  const [tahun, setTahun] = useState(0);
  const [pelanggan, setPelanggan] = useState(0);
  const statsRef = useRef(null); 

  useEffect(() => {
    const animateValue = (setFn, start, end, duration) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setFn(Math.floor(progress * (end - start) + start));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateValue(setCabang, 0, 50, 2000);    
        animateValue(setKota, 0, 34, 2000);      
        animateValue(setTahun, 0, 6, 2000);      
        animateValue(setPelanggan, 0, 1, 2000);  
        observer.disconnect(); 
      }
    }, { threshold: 0.5 }); 

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

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
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.15 }); 

    const hiddenElements = document.querySelectorAll('.fade-in-up');
    hiddenElements.forEach((el) => observer.observe(el));
    return () => hiddenElements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div className="home-container">
      
      {/* ================= 1. NAVBAR ================= */}
      <nav className="navbar fade-in-up">
        <div className="logo-box">
          <img src={LogoLaoban} alt="Logo Laoban" className="logo-img" style={{cursor: 'pointer'}} onClick={() => navigateToTop('/home')} />
        </div>
        <div className="nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/home'); }} className="active">Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/about'); }}>About</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/menu'); }}>Menu</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/our-partner'); }}>Our Partner</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateToTop('/partnership'); }}>Partnership</a>
        </div>
        <button className="btn-red" onClick={() => navigateToTop('/order')}>Pesan Sekarang</button>
      </nav>

      {/* ================= 2. HERO SECTION ================= */}
      <section className="hero fade-in-up delay-1">
        <div className="hero-text">
          <div className="hero-subtitle-left">
            老板 Nusantara · By Uncle Osh
          </div>
          <h1 className="hero-title">
            LAOBAN <br />
            <span className="text-red">NUSANTARA</span>
          </h1>
          
          <div className="badges">
            <span className="badge badge-yellow">🏆 50+ Cabang</span>
            <span className="badge badge-yellow">📍 34 Kota Indonesia</span>
            <span className="badge badge-green">✅ Halal Certified</span>
            <span className="badge badge-red-light">1 Juta+ Pelanggan</span>
          </div>

          <p className="hero-desc">
            Nikmati kehangatan resep rahasia Uncle Osh. Mulai dari kopi sedap hingga mie khas Laoban yang memanjakan lidah, disajikan modern namun tetap menjaga tradisi.
          </p>
          
          <div className="hero-action">
            <button className="btn-red" onClick={() => navigateToTop('/menu')}>Lihat Menu Pilihan</button>
            <button className="btn-outline" onClick={() => navigateToTop('/partnership')}>Gabung Kemitraan</button>
          </div>
        </div>

        <div className="hero-grid">
          <img src={HeroImg1} alt="Menu 1" />
          <img src={HeroImg2} alt="Menu 2" />
          <img src={HeroImg3} alt="Menu 3" />
          <img src={HeroImg4} alt="Menu 4" />
        </div>
      </section>

      {/* ================= 3. MARQUEE CABANG ================= */}
      <div className="red-marquee-container">
        <div className="red-marquee-track">
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> PALEMBANG</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> CIREBON</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> BOGOR</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> BEKASI</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> TANGERANG</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> DEPOK</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> SOLO</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> MALANG</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> LOMBOK</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> PEKANBARU</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> BALIKPAPAN</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> SAMARINDA</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> MANADO</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> PONTIANAK</div>
          
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> PALEMBANG</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> CIREBON</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> BOGOR</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> BEKASI</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> TANGERANG</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> DEPOK</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> SOLO</div>
          <div className="marquee-item"><span className="yellow-box">&#9632;</span> MALANG</div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <section className="stats fade-in-up" ref={statsRef}>
        <div className="stat-box">
          <h2>{cabang}+</h2>
          <h3>CABANG AKTIF</h3>
          <p>Di seluruh Indonesia</p>
        </div>
        <div className="stat-box">
          <h2>{kota}</h2>
          <h3>KOTA & KABUPATEN</h3>
          <p>Sabang - Makassar</p>
        </div>
        <div className="stat-box">
          <h2>{tahun}+</h2>
          <h3>TAHUN PENGALAMAN</h3>
          <p>Berdiri sejak 2018</p>
        </div>
        <div className="stat-box">
          <h2>{pelanggan}M+</h2>
          <h3>PELANGGAN SETIA</h3>
          <p>Kepercayaan jutaan orang</p>
        </div>
      </section>
      
      <div className="yellow-line"></div>

      {/* ================= 4. ABOUT SECTION ================= */}
      <section className="about fade-in-up">
        <div className="about-visual-side">
          <div className="about-shape-bg"></div>
          <img src={ImgAbout1} alt="Kopi Laoban" className="about-img-left" />
          <img src={ImgAbout2} alt="Teh Laoban" className="about-img-right" />
        </div>

        <div className="about-text">
          <p className="label-red">CERITA KAMI</p>
          <h2 className="title-dark">Warisan Rasa dari Uncle Osh</h2>
          <p className="desc-gray">
            Berawal dari kecintaan terhadap budaya ngopi dan menyantap kudapan lezat di sore hari, Laoban hadir mengusung konsep Kopitiam klasik yang dikemas secara modern.
          </p>
          <p className="desc-gray">
            Kami berkomitmen untuk selalu menyajikan kualitas terbaik dengan harga yang bersahabat. Kebersihan, pelayanan ramah, dan cita rasa autentik adalah kunci yang membawa kami terus berekspansi hingga memiliki lebih dari 50 cabang di seluruh Indonesia.
          </p>
          <a href="#" className="link-red" onClick={(e) => { e.preventDefault(); navigateToTop('/about'); }}>
            Baca Selengkapnya &rarr;
          </a>
        </div>
      </section>

      {/* ================= 5. MENU SECTION ================= */}
      <section className="menu-section fade-in-up">
        <div className="center-title">
          <p className="label-red">OUR MENU</p>
          <h2 className="title-dark">Menu Perguruan Laoban</h2>
        </div>

        <div className="menu-tabs static-tabs">
          <div className="tab-static">
            <div className="icon"><img src={IconMainDish} alt="Main Dish" className="tab-img" /></div>
            <span>Main Dish</span>
          </div>
          <div className="tab-static">
            <div className="icon"><img src={IconSnack} alt="Snack" className="tab-img" /></div>
            <span>Snack</span>
          </div>
          <div className="tab-static">
            <div className="icon"><img src={IconDimsum} alt="Dimsum" className="tab-img" /></div>
            <span>Dimsum</span>
          </div>
          <div className="tab-static">
            <div className="icon"><img src={IconHotDrink} alt="Hot Drink" className="tab-img" /></div>
            <span>Hot Drink</span>
          </div>
          <div className="tab-static">
            <div className="icon"><img src={IconColdDrink} alt="Cold Drink" className="tab-img" /></div>
            <span>Cold Drink</span>
          </div>
          <div className="tab-static">
            <div className="icon"><img src={IconIceDessert} alt="Ice & Dessert" className="tab-img" /></div>
            <span>Ice & Dessert</span>
          </div>
        </div>

        <div className="menu-list">
          <div className="menu-card">
            <img src="https://images.unsplash.com/photo-1555126634-323283e090fa?w=300&q=80" alt="Nasi Lemak" />
            <div className="menu-info">
              <h4>Nasi Lemak</h4>
              <p>Nasi dengan rempah santan dengan ayam ungkep bumbu dikombinasikan dengan kacang teri yang memanjakan lidah kalian. Sambelnya juga mantap.</p>
            </div>
          </div>
          <div className="menu-card">
            <img src="https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&q=80" alt="Mie Hainan" />
            <div className="menu-info">
              <h4>Mie Hainan ⭐</h4>
              <p>Mie berbumbu putih rahasia khas laoban yang pastinya sedap dicampur ayam jasio bumbu coklat yang muantab!</p>
            </div>
          </div>
          <div className="menu-card">
            <img src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&q=80" alt="Nasi Mala" />
            <div className="menu-info">
              <h4>Nasi Mala</h4>
              <p>Nasi putih dengan rempah mala sechuan yang rasanya pedas asin gurih. Pecinta pedas? Wajib cobain!</p>
            </div>
          </div>
          <div className="menu-card">
            <div className="img-blank"></div>
            <div className="menu-info">
              <h4>Mie Jasio</h4>
              <p>Mie berbumbu putih rahasia khas laoban yang pastinya sedap dicampur ayam jasio bumbu merah yang tebal dan juicy!</p>
            </div>
          </div>
        </div>

        <div className="center-btn">
          <button className="btn-outline-red" onClick={() => navigateToTop('/menu')}>Lihat Seluruh Menu</button>
        </div>
      </section>

      {/* ================= 6. MAP SECTION (KEMBALI STATIS) ================= */}
      <section className="map-section fade-in-up">
        <h2 className="title-dark center-title">50+ Titik Kenikmatan di Seluruh Nusantara</h2>
        <p className="desc-gray text-center max-w">
          Dari ujung barat hingga timur, Laoban terus melebarkan sayap untuk mendekatkan kehangatan Kopitiam autentik ke kota Anda.
        </p>
        
        <div className="map-box">
          <div className="pin p-1">📍</div>
          <div className="pin p-2">📍</div>
          <div className="popup">
            <h2>54</h2>
            <p>CABANG AKTIF</p>
          </div>
          <div className="pin-red p-3">📍 Jawa</div>
          <div className="pin-red p-4">📍</div>
        </div>
        
        <div className="center-btn">
          <button className="btn-outline-red" onClick={() => navigateToTop('/our-partner')}>Lihat Detail Cabang</button>
        </div>
      </section>

      {/* ================= 6.5 INSTAGRAM GRID SECTION ================= */}
      <section className="ig-section fade-in-up">
        <div className="ig-header-container">
          <p className="label-red text-center">FOLLOW US ON INSTAGRAM!</p>
          <h2 className="title-dark text-center" style={{marginBottom: '50px'}}>@LAOBAN.NUSANTARA</h2>
        </div>
        
        <div className="ig-grid">
          {gridImages.map((image, index) => (
            <div 
              key={index}
              className="ig-item-wrapper"
              onMouseEnter={() => setHoveredGridIndex(index)} 
              onMouseLeave={() => setHoveredGridIndex(null)}    
              onClick={() => window.open(igPostDetails[index].link, '_blank')} 
              style={{ cursor: 'pointer' }}
            >
              <img src={image} alt={`IG ${index + 1}`} className="ig-img" />
              {index === hoveredGridIndex && (
                <div className="ig-overlay-card">
                  <div className="ig-card-header">
                    <span className="ig-card-likes">❤️ {igPostDetails[index].likes} suka</span>
                    <span className="ig-card-date">{igPostDetails[index].date}</span>
                  </div>
                  <div className="ig-card-body">
                    <h4 className="ig-card-food-name">{igPostDetails[index].foodName}</h4>
                    <p className="ig-card-food-desc">{igPostDetails[index].desc}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= 7. CTA SECTION ================= */}
      <section className="cta-section fade-in-up">
        <div className="cta-card">
          <div className="watermark">☕</div>
          <div className="cta-content">
            <h2>Jadilah Bagian dari Kesuksesan<br/>Laoban</h2>
            <p>Sudah 50+ cabang membuktikan kualitas dan profitabilitas bisnis Laoban Nusantara. Kini giliran Anda membuka peluang sukses dan bertumbuh bersama kami.</p>
            <div className="cta-action">
              <button className="btn-yellow" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => navigateToTop('/partnership')}>
                <img src={IconKemitraan} alt="Kemitraan Icon" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                Pelajari Kemitraan
              </button>
              <button className="btn-outline-white" onClick={() => window.open('https://api.whatsapp.com/send/?phone=%2B6282244503221&text&type=phone_number&app_absent=0', '_blank')}>Hubungi Tim Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. FOOTER ================= */}
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
              <li onClick={() => window.open('https://api.whatsapp.com/send/?phone=%2B6282244503221&text&type=phone_number&app_absent=0', '_blank')}>Hubungi Sales</li>
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