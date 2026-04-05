import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

// --- IMPORT ASSETS (Jalur Diperbaiki) ---
import HeroImg1 from '../../assets/Image/image1.png';
import HeroImg2 from '../../assets/Image/image2.png';
import HeroImg3 from '../../assets/Image/image3.png';
import HeroImg4 from '../../assets/Image/image4.png';

// Ikon Sosmed & Logo (Di dalam 'icons customer/')
import IconInstagram from '../../assets/icons customer/Instagram.png';
import IconTiktok from '../../assets/icons customer/Tiktok.png';
import IconWhatsapp from '../../assets/icons customer/Whatsapp.png';
import LogoLaoban from '../../assets/icons customer/Logo Laoban.png';

// Ikon Kontak & Menu (Asumsi di dalam 'Icons/' langsung)
// JIKA ERROR LAGI DI BAGIAN INI: Coba ganti '../../assets/Icons/' menjadi '../../assets/icons customer/'
import IconMessage from '../../assets/Icons/Message.png'; 
import IconCall from '../../assets/Icons/Call.png'; 
import IconMainDish from '../../assets/Icons/Main Dish.png'; 
import IconSnack from '../../assets/Icons/Snack.png'; 
import IconDimsum from '../../assets/Icons/Dimsum.png'; 
import IconHotDrink from '../../assets/Icons/Hot Drink.png'; 
import IconColdDrink from '../../assets/Icons/Cold Drink.png'; 
import IconIceDessert from '../../assets/Icons/Ice & Dessert.png'; 
import IconFrame from '../../assets/Icons/Frame.png'; 

export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="landing-container">
      
      {/* ================= 1. NAVBAR ================= */}
      <nav className="navbar">
        <div className="logo-box">
          <img src={LogoLaoban} alt="Logo Laoban" className="logo-img" />
        </div>
        <div className="nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>Home</a>
          
          {/* FIX: Tambahin navigasi untuk About */}
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
            <button className="btn-red" onClick={() => navigate('/order')}>Lihat Menu Pilihan</button>
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

      {/* ================= 3. MARQUEE & STATS ================= */}
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
        <div className="stat-divider"></div>
        <div className="stat-box">
          <h2>34</h2>
          <h3>KOTA & KABUPATEN</h3>
          <p>Sabang - Makassar</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-box">
          <h2>6+</h2>
          <h3>TAHUN PENGALAMAN</h3>
          <p>Berdiri sejak 2018</p>
        </div>
        <div className="stat-divider"></div>
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
          <a href="#" className="link-red">Baca Selengkapnya &rarr;</a>
        </div>
      </section>

      {/* ================= 5. MENU SECTION ================= */}
      <section className="menu-section">
        <div className="center-title">
          <p className="label-red">OUR MENU</p>
          <h2 className="title-dark">Menu Perguruan Laoban</h2>
        </div>

        <div className="menu-tabs">
          <div className="tab active">
            <div className="icon">
              <img src={IconMainDish} alt="Main Dish" className="tab-img" />
            </div>
            <span>Main Dish</span>
          </div>
          <div className="tab">
            <div className="icon">
              <img src={IconSnack} alt="Snack" className="tab-img" />
            </div>
            <span>Snack</span>
          </div>
          <div className="tab">
            <div className="icon">
              <img src={IconDimsum} alt="Dimsum" className="tab-img" />
            </div>
            <span>Dimsum</span>
          </div>
          <div className="tab">
            <div className="icon">
              <img src={IconHotDrink} alt="Hot Drink" className="tab-img" />
            </div>
            <span>Hot Drink</span>
          </div>
          <div className="tab">
            <div className="icon">
              <img src={IconColdDrink} alt="Cold Drink" className="tab-img" />
            </div>
            <span>Cold Drink</span>
          </div>
          <div className="tab">
            <div className="icon">
              <img src={IconIceDessert} alt="Ice & Dessert" className="tab-img" />
            </div>
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

      {/* ================= 7. CTA SECTION ================= */}
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

      {/* ================= 8. FOOTER ================= */}
      <footer className="footer">
        <div className="foot-grid">
          <div className="foot-brand">
            <img src={LogoLaoban} alt="Logo Laoban" className="logo-img" style={{marginBottom: '15px'}} />
            <p>Menyajikan hidangan dan minuman khas Kopitiam Nusantara dengan bahan premium, kebersihan terjaga, dan resep rahasia Uncle Osh.</p>
            <div className="socials">
               <div className="soc-icon"><img src={IconInstagram} alt="Instagram" className="soc-img" /></div>
               <div className="soc-icon"><img src={IconTiktok} alt="Tiktok" className="soc-img" /></div>
               <div className="soc-icon"><img src={IconWhatsapp} alt="Whatsapp" className="soc-img" /></div>
            </div>
          </div>
          
          <div className="foot-links">
            <h4>Navigasi</h4>
            <ul>
              <li onClick={() => navigate('/home')} style={{cursor: 'pointer'}}>Home</li>
              <li>Tentang Kami</li>
              <li onClick={() => navigate('/menu')} style={{cursor: 'pointer'}}>Menu Pergnięan</li>
              <li>Daftar Cabang</li>
            </ul>
          </div>
          
          <div className="foot-links">
            <h4>Kemitraan</h4>
            <ul><li>Info Franchise</li><li>Proposal Bisnis</li><li>Hubungi Sales</li></ul>
          </div>
          
          <div className="foot-links">
            <h4>Hubungi Kami</h4>
            <ul className="contact-list">
              <li>
                <img src={IconMessage} alt="Email" className="contact-icon" /> 
                <span style={{color: 'var(--c-dark)', fontWeight: '500'}}>hello@laobannusantara.com</span>
              </li>
              <li>
                <img src={IconCall} alt="Phone" className="contact-icon" /> 
                <span style={{color: 'var(--c-dark)', fontWeight: '600'}}>+62 812 3456 7890</span>
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