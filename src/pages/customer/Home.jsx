import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

// --- IMPORT ASSETS GAMBAR ---
import HeroImg1 from '../../assets/image/image1.png';
import HeroImg2 from '../../assets/image/image2.png';
import HeroImg3 from '../../assets/image/image3.png';
import HeroImg4 from '../../assets/image/image4.png';

// --- IMPORT GAMBAR GRID INSTAGRAM ---
import Grid1 from '../../assets/home/img1.png';
import Grid2 from '../../assets/home/img2.png';
import Grid3 from '../../assets/home/img3.png';
import Grid4 from '../../assets/home/img4.png';
import Grid5 from '../../assets/home/img5.png';
import Grid6 from '../../assets/home/img6.png';
import Grid7 from '../../assets/home/img7.png';
import Grid8 from '../../assets/home/img8.png';
import Grid9 from '../../assets/home/img9.png';

// --- IMPORT ICONS & LOGO Jalur Fix Anti-Error ---
import LogoLaoban from '../../assets/icons/LogoLaoban.png';
import IconInstagram from '../../assets/icons/Instagram.png';
import IconWhatsapp from '../../assets/icons/Whatsapp.png';
import IconFacebook from '../../assets/icons/icons-customer/facebook.png'; 
import IconLink from '../../assets/icons/icons-customer/Link.png'; 
import IconTiktok from '../../assets/icons/Tiktok.png';

import IconMainDish from '../../assets/icons/MainDish.png';
import IconSnack from '../../assets/icons/Snack.png';
import IconDimsum from '../../assets/icons/Dimsum.png';
import IconHotDrink from '../../assets/icons/HotDrink.png';
import IconColdDrink from '../../assets/icons/ColdDrink.png';
import IconIceDessert from '../../assets/icons/Ice&Dessert.png';

import IconMessage from '../../assets/icons/Message.png'; 
import IconCall from '../../assets/icons/Call.png'; 
import IconFrame from '../../assets/icons/Frame.png'; 

export default function Home() {
  const navigate = useNavigate();

  // State untuk melacak gambar grid IG yang sedang disentuh (hovered)
  const [hoveredGridIndex, setHoveredGridIndex] = useState(null);

  // Data Dummy untuk Kartu Info IG yang muncul saat Hover
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
    <div className="home-container">
      
      {/* ================= 1. NAVBAR ================= */}
      <nav className="navbar">
        <div className="logo-box">
          <img src={LogoLaoban} alt="Logo Laoban" className="logo-img" />
        </div>
        <div className="nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/home'); }} className="active">Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/menu'); }}>Menu</a>
          <a href="#">Our Partner</a>
          <a href="#">Partnership</a>
        </div>
        <button className="btn-red" onClick={() => navigate('/order')}>Pesan Sekarang</button>
      </nav>

      {/* ================= 2. HERO SECTION ================= */}
      <section className="hero">
        <div className="hero-text">
          <div className="hero-subtitle">
            <span className="line"></span> 老板 Nusantara · By Uncle Osh <span className="line"></span>
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
            <button className="btn-red" onClick={() => navigate('/menu')}>Lihat Menu Pilihan</button>
            <button className="btn-outline">Gabung Kemitraan</button>
          </div>
        </div>

        <div className="hero-grid">
          <img src={HeroImg1} alt="Menu 1" />
          <img src={HeroImg2} alt="Menu 2" />
          <img src={HeroImg3} alt="Menu 3" />
          <img src={HeroImg4} alt="Menu 4" />
        </div>
      </section>

      {/* ================= 3. MARQUEE & STATS (FIX: Hilangkan garis pembatas) ================= */}
      <div className="red-marquee">
        <span>■ PALEMBANG</span><span>■ CIREBON</span><span>■ BOGOR</span>
        <span>■ BEKASI</span><span>■ TANGERANG</span><span>■ DEPOK</span>
        <span>■ SOLO</span><span>■ MALANG</span><span>■ LOMBOK</span>
        <span>■ PEKANBARU</span><span>■ BALIKPAPAN</span><span>■ SAMARINDA</span>
      </div>

      <section className="stats">
        <div className="stat-box">
          <h2>50+</h2>
          <h3>CABANG AKTIF</h3>
          <p>Di seluruh Indonesia</p>
        </div>
        {/* FIX: `<div className="stat-divider"></div>` dihapus */}
        <div className="stat-box">
          <h2>34</h2>
          <h3>KOTA & KABUPATEN</h3>
          <p>Sabang - Makassar</p>
        </div>
        {/* FIX: `<div className="stat-divider"></div>` dihapus */}
        <div className="stat-box">
          <h2>6+</h2>
          <h3>TAHUN PENGALAMAN</h3>
          <p>Berdiri sejak 2018</p>
        </div>
        {/* FIX: `<div className="stat-divider"></div>` dihapus */}
        <div className="stat-box">
          <h2>1M+</h2>
          <h3>PELANGGAN SETIA</h3>
          <p>Kepercayaan jutaan orang</p>
        </div>
      </section>
      
      <div className="yellow-line"></div>

      {/* ================= 4. ABOUT SECTION ================= */}
      <section className="about">
        <div className="about-img-container">
          <img src="https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&q=80" alt="Jus Jeruk" className="img-orange" />
          <img src="https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80" alt="Es Teh" className="img-tea" />
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
          <a href="#" className="link-red" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>Baca Selengkapnya &rarr;</a>
        </div>
      </section>

      {/* ================= 5. MENU SECTION ================= */}
      <section className="menu-section">
        <div className="center-title">
          <p className="label-red">OUR MENU</p>
          <h2 className="title-dark">Menu Perguruan Laoban</h2>
        </div>

        {/* FIX: Tab Menu dikembalikan ke Desain Awal yg Rapi */}
        <div className="menu-tabs">
          <div className="tab active" onClick={() => navigate('/menu', { state: { category: 'Main Dish' }})} style={{cursor: 'pointer'}}>
            <div className="icon"><img src={IconMainDish} alt="Main Dish" className="tab-img" /></div>
            <span>Main Dish</span>
          </div>
          <div className="tab" onClick={() => navigate('/menu', { state: { category: 'Snack' }})} style={{cursor: 'pointer'}}>
            <div className="icon"><img src={IconSnack} alt="Snack" className="tab-img" /></div>
            <span>Snack</span>
          </div>
          <div className="tab" onClick={() => navigate('/menu', { state: { category: 'Dimsum' }})} style={{cursor: 'pointer'}}>
            <div className="icon"><img src={IconDimsum} alt="Dimsum" className="tab-img" /></div>
            <span>Dimsum</span>
          </div>
          <div className="tab" onClick={() => navigate('/menu', { state: { category: 'Hot Drink' }})} style={{cursor: 'pointer'}}>
            <div className="icon"><img src={IconHotDrink} alt="Hot Drink" className="tab-img" /></div>
            <span>Hot Drink</span>
          </div>
          <div className="tab" onClick={() => navigate('/menu', { state: { category: 'Cold Drink' }})} style={{cursor: 'pointer'}}>
            <div className="icon"><img src={IconColdDrink} alt="Cold Drink" className="tab-img" /></div>
            <span>Cold Drink</span>
          </div>
          <div className="tab" onClick={() => navigate('/menu', { state: { category: 'Ice & Dessert' }})} style={{cursor: 'pointer'}}>
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
          <button className="btn-outline-red" onClick={() => navigate('/menu')}>Lihat Seluruh Menu</button>
        </div>
      </section>

      {/* ================= 6. MAP SECTION ================= */}
      <section className="map-section">
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
          <button className="btn-outline-red">Lihat Detail Cabang</button>
        </div>
      </section>

      {/* ================= 6.5 INSTAGRAM GRID SECTION ================= */}
      <section className="ig-section">
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

      {/* ================= 7. CTA SECTION (FIX: Rapi sesuai Figma) ================= */}
      <section className="cta-section">
        <div className="cta-card">
          <div className="watermark">☕</div>
          <div className="cta-content">
            <h2>Jadilah Bagian dari Kesuksesan<br/>Laoban</h2>
            <p>Sudah 50+ cabang membuktikan kualitas dan profitabilitas bisnis Laoban Nusantara. Kini giliran Anda membuka peluang sukses dan bertumbuh bersama kami.</p>
            <div className="cta-action">
              <button className="btn-yellow" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={IconFrame} alt="Frame Icon" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                Pelajari Kemitraan
              </button>
              <button className="btn-outline-white">Hubungi Tim Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. FOOTER (FIX: Satukan footer putih rapi) ================= */}
      <footer className="footer-modern">
        <div className="foot-grid">
          <div className="foot-brand">
            <img src={LogoLaoban} alt="Logo Laoban" className="logo-img" style={{marginBottom: '15px'}} />
            <p>Menyajikan hidangan dan minuman khas Kopitiam Nusantara dengan bahan premium, kebersihan terjaga, dan resep rahasia Uncle Osh.</p>
            <div className="socials socials-colored">
               <div className="soc-colored"><img src={IconInstagram} alt="Instagram" className="soc-img" /></div>
               <div className="soc-colored"><img src={IconTiktok} alt="Tiktok" className="soc-img" /></div>
               <div className="soc-colored"><img src={IconWhatsapp} alt="Whatsapp" className="soc-img" /></div>
            </div>
          </div>
          
          <div className="foot-links">
            <h4>Navigasi</h4>
            <ul>
              <li onClick={() => navigate('/home')} style={{cursor: 'pointer'}}>Home</li>
              <li onClick={() => navigate('/about')} style={{cursor: 'pointer'}}>Tentang Kami</li>
              <li onClick={() => navigate('/menu')} style={{cursor: 'pointer'}}>Menu Perguruan</li>
              <li>Daftar Cabang</li>
            </ul>
          </div>
          
          <div className="foot-links">
            <h4>Kemitraan</h4>
            <ul><li>Info Franchise</li><li>Proposal Bisnis</li><li>Hubungi Sales</li></ul>
          </div>
          
          <div className="foot-links">
            <h4>Hubungi Kami</h4>
            <ul className="contact-list contact-modern">
              <li>
                <img src={IconMessage} alt="Email" className="contact-icon" /> 
                <span className="contact-info contact-link">hello@laobannusantara.com</span>
              </li>
              <li>
                <img src={IconCall} alt="Phone" className="contact-icon" /> 
                <span className="contact-info contact-bold">+62 812 3456 7890</span>
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