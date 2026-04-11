import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Menu.css';

// --- IMPORT ICONS & LOGO ---
import LogoLaoban from '../../../assets/icons/icons-customer/logoLaoban.png';
import IconInstagram from '../../../assets/icons/icons-customer/instagram.png';
import IconWhatsapp from '../../../assets/icons/icons-customer/whatsapp.png';
import IconFacebook from '../../../assets/icons/icons-customer/facebook.png';
import IconLink from '../../../assets/icons/icons-customer/link.png';
import IconTiktok from '../../../assets/icons/icons-customer/tiktok.png';

// --- IMPORT KATEGORI ICONS ---
import IconMainDish from '../../../assets/icons/mainDish.png';
import IconSnack from '../../../assets/icons/snack.png';
import IconDimsum from '../../../assets/icons/dimsum.png';
import IconHotDrink from '../../../assets/icons/hotDrink.png';
import IconColdDrink from '../../../assets/icons/coldDrink.png';
import IconIceDessert from '../../../assets/icons/ice&Dessert.png';

// --- IMPORT GAMBAR SLIDER (Dari Home) ---
import Slide1 from '../../../assets/home/nic_1497.jpg';
import Slide2 from '../../../assets/home/nic_1941.jpg';
import Slide3 from '../../../assets/home/nic_4125.jpg';
import Slide4 from '../../../assets/home/nic_4272.jpg';
import Slide5 from '../../../assets/home/nic_7913.jpg';
import Slide6 from '../../../assets/home/nic_8374.jpg';
import Slide7 from '../../../assets/home/nic_8421.jpg';
import Slide8 from '../../../assets/home/nic_9028.jpg';

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'Main Dish');
  const [hoveredMenuItemIndex, setHoveredMenuItemIndex] = useState(null);

  // State & Logika untuk Slider Utama
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8];

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  // Efek Slider Otomatis (Ganti setiap 3.5 detik)
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 3500);
    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  // Efek menangkap kategori aktif dari halaman sebelumnya
  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category);
    }
  }, [location.state]);

  const categories = [
    { name: 'Main Dish', icon: IconMainDish },
    { name: 'Snack', icon: IconSnack },
    { name: 'Dimsum', icon: IconDimsum },
    { name: 'Hot Drink', icon: IconHotDrink },
    { name: 'Cold Drink', icon: IconColdDrink },
    { name: 'Ice & Dessert', icon: IconIceDessert },
  ];

  // ================= DATABASE MENU LENGKAP =================
  const menuData = {
    'Main Dish': [
      { name: 'Nasi Lemak', desc: 'Nasi dengan rempah santan dengan ayam ungkep bumbu dikombinasikan dengan kacang teri yang memanjakan lidah kalian. Sambelnya juga mantap.', star: false },
      { name: 'Mie Hainan', desc: 'Mie berbumbu putih rahasia khas laoban yang pastinya sedap dicampur ayam jasio bumbu coklat yang muantab!', star: true },
      { name: 'Nasi Mala', desc: 'Nasi putih dengan rempah mala sechuan yang rasanya pedas asin gurih. Pecinta pedas? Wajib cobain!', star: false },
      { name: 'Mie Jasio', desc: 'Mie berbumbu putih rahasia khas laoban yang pastinya sedap dicampur ayam jasio bumbu merah yang tebal dan juicy!', star: false },
      { name: 'Nasi Hainan', desc: 'Nasi berbumbu putih rahasia khas laoban yang pastinya sedap dicampur ayam yang disiram bumbu coklat yang muantab.', star: true },
      { name: 'Bubur Laoban', desc: 'Bubur Special Laoban adalah bubur dengan cita rasa kaldu ayam istimewa yang lezat.', star: true },
      { name: 'Nasi Jasio', desc: 'Nasi berbumbu putih rahasia khas laoban yang pastinya sedap dicampur ayam jasio bumbu merah yang tebal dan juicy!', star: true },
      { name: 'Wonton', desc: 'Wonton kuah putih dengan isian ayam udang yang lembut!', star: false },
      { name: 'Nasi Salted Egg', desc: 'Nasi putih dengan ayam bumbu telor asin yang siap memanjakan lidah + telor sunny side up juga loh!', star: false },
      { name: 'Wonton Mala', desc: 'Wonton dengan bumbu mala pedas dilengkapi dengan isian ayam udang yang lembut.', star: false },
      { name: 'Mie Laksa', desc: 'Mie dengan kaldu seafood gurih dilengkapi dengan bakso sea food, udang, dan telor yang jadi favorit kaum wanita, must try!!', star: true },
    ],
    'Snack': [
      { name: 'Butter Kaya Toast', desc: 'Favorit semua orang karena roti dan selai kayanya home made, harus cobain deh 1x seumur hidup!', star: true },
      { name: 'Peanut Toast', desc: 'Pakai selai kacang kalau dikacangin itu kamu.', star: false },
      { name: 'Choco Toast', desc: 'Solusi para kaum suka badmood!', star: true },
      { name: 'Telur 1/2 matang', desc: 'Lezat, sehat dan bergiji apalagi dicocol kaya toast mantul!', star: false },
      { name: 'Cheesy Toast', desc: 'Ya jelas isinya selai keju kalau selai coklat namanya choco toast.', star: false },
      { name: 'Pisang Goreng Wijen', desc: 'Pisang goreng sepesial laoban pake wijen.', star: true },
    ],
    'Dimsum': [
      { name: 'Siomay Ayam', desc: 'Siomay lezat berisi daging ayam yang lembut dan gurih.', star: true },
      { name: 'Lumpia', desc: 'Gorengan istimewa berisi sayuran dan daging yang gurih. Favorit semua orang!', star: false },
      { name: 'Siomay Volcano', desc: 'Siomay untuk pecinta pedas! pedasnya bikin nampol !', star: true },
      { name: 'Kulit Tahu', desc: 'Lapisan kulit tahu yang renyah dengan isian daging ayam yang gurih.', star: true },
      { name: 'Ceker', desc: 'Ceker ayam dengan bumbu gurih manis tentunya bikin nagih!', star: false },
      { name: 'Mantau', desc: 'Roti khas tiongkok yang digoreng dengan Zuzu kental maniez.', star: false },
      { name: 'Pao Pasir Emas', desc: 'Camilan kukus pao isian telor asin tapi manis!', star: true },
      { name: 'Kaki Naga', desc: 'Bukan kakinya naga beneran ini Olahan daging ayam yang digoreng.', star: true },
      { name: 'Pao Durian', desc: 'Pao dengan tekstur yang lembut berisi lumeran durian yang lezatt.', star: false },
      { name: 'Gyoza', desc: 'Gyoza, hidangan Jepang yg digoreng! Mirip pangsit goreng isi ayam sayur.', star: false },
      { name: 'Ngohiong', desc: 'Jajanan olahan ayam dengan perpaduan 5 bumbu rempah rempah khas cina.', star: false },
    ],
    'Hot Drink': [
      { name: 'Kopi Laoban', desc: 'Kopi blend robusta arabica yg pas! Sruput nendang!', star: true },
      { name: 'Kopi Butter', desc: 'Sensasi kaya rasa kopi susu dengan sentuhan lembut butter yang creamy.', star: true },
      { name: 'Kopi Susu Laoban', desc: 'Rasa kekayaan kopi dan susu kental manis yang menghangatkan.', star: true },
      { name: 'Kopi Jahe', desc: 'Perpaduan kopi dan jahe yang hangat dan menggugah selera para pecinta kehangatan.', star: false },
      { name: 'Teh Laoban', desc: 'Teh asli malaysia dengan aroma yang menenangkan dan menghangatkan.', star: true },
      { name: 'Milo Thailand', desc: 'Milo hangat creamy dengan taburan bubuk milo mirip milo dino di thailand.', star: true },
      { name: 'Teh Tarik', desc: 'Minuman teh yang ditarik dengan susu yang menghangatkan.', star: true },
      { name: 'Kopi Havana', desc: 'Kopi Hitam blend dicampur sirup Havana! Bedanya cuma yang ini panas ya..', star: false },
      { name: 'Coklat Butter', desc: 'Perpaduan lezat antara coklat creamy dan butter yang tentunya pas dilidah. Para pecinta coklat wajib coba sih!', star: false },
      { name: 'Kopi Telor Vietnam', desc: 'Minuman kopi tradisional dengan foam telur lembut yang creamy. Laoban’s Signature!', star: false },
    ],
    'Cold Drink': [
      { name: 'Es Kopi Laoban', desc: 'Kenikmatan ngopi yang segar, meningkatkan semangat dan kesegaran tubuh.', star: true },
      { name: 'Es Kopi Havana', desc: 'Kopi blend hitam dipakein sirup Havana! Havana o nana~', star: false },
      { name: 'Es Kopi Susu Laoban', desc: 'Kesegaran Kopi Susu ala laoban yang memikat.', star: true },
      { name: 'Es Milo Thailand', desc: 'Milo tapi lebih creamy dikasi bubuk milo lagi. Mirip milo dino yg di Thailand', star: true },
      { name: 'Es Teh Laoban', desc: 'Kenikmatan teh khas Laoban yang dingin dan nyegerin.', star: true },
      { name: 'Es Coklat Laoban', desc: 'Es Coklat rahasia dari Uncle Osh! mirip lah sama yg di cafe2 mendunia.', star: false },
      { name: 'Es Teh Tarik', desc: 'Favorit semua orang! teh ditarik dengan susu yang pas menyegarkan!', star: true },
      { name: 'Es Sumo', desc: 'Perpaduan pas antara susu dan sirup mocha yg bikin zeger', star: false },
    ],
    'Ice & Dessert': [
      { name: 'Es ABCD', desc: 'Es nya Upin Ipin, singkatan dari Ais Batu Campur Deh. Isian kacang merah, nangka, es krim vanilla, dan jagung Maniez...', star: true },
      { name: 'Es Coklat Uncle', desc: 'Perpaduan es krim coklat dan toping semangka, choco ball, dan kacang crumble.', star: false },
    ]
  };

  // Tambahkan fallback empty array jika menu belum didefinisikan (agar tidak error map)
  const activeProducts = menuData[activeCategory] || [];

  return (
    <div className="mn-container">
      
      {/* ================= HEADER ================= */}
      <header className="mn-header">
        <div className="mn-logo-box" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          <img src={LogoLaoban} alt="Logo Laoban" className="mn-logo" />
        </div>
        <nav className="mn-nav-links">
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/menu" className="active">Menu</Link>
          <Link to="#">Our Partner</Link>
          <Link to="#">Partnership</Link>
        </nav>
        <div style={{ width: '100px' }}></div>
      </header>

      {/* ================= HERO SECTION (SLIDER BERGESER) ================= */}
      <section className="mn-hero">
        {/* Sisi Kiri: Teks Merah */}
        <div className="mn-hero-left">
          <div className="mn-hero-watermark">LAOBAN</div>
          <div className="mn-hero-content">
            <h1 className="mn-hero-title">LaobanNusantara</h1>
            <p className="mn-hero-subtitle">BY UNCLE OSH</p>
            <button className="mn-btn-white efek-klik" onClick={() => navigate('/order')}>
              Grow Together With Us
            </button>
          </div>
        </div>

        {/* Sisi Kanan: Slider Gambar */}
        <div className="mn-hero-right">
          {slides.map((slide, index) => (
            <img 
              key={index}
              src={slide} 
              alt={`Slide ${index + 1}`} 
              className={`mn-slide-img ${index === currentSlide ? 'active' : ''}`} 
            />
          ))}
          
          <button className="mn-slider-btn left" onClick={prevSlide}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button className="mn-slider-btn right" onClick={nextSlide}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <div className="mn-slider-dots">
            {slides.map((_, index) => (
              <span 
                key={index} 
                className={`mn-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT (KATEGORI MENU) ================= */}
      <main className="mn-main">
        <div className="mn-title-section">
          <p className="mn-label">OUR MENU</p>
          <h1 className="mn-title">Menu Perguruan<br/>Laoban</h1>
        </div>

        {/* Tab Kategori */}
        <div className="mn-tabs">
          {categories.map((cat, index) => (
            <div 
              key={index} 
              className={`mn-tab-item ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <div className="mn-tab-icon-box">
                <img src={cat.icon} alt={cat.name} onError={(e) => e.target.style.display='none'} />
              </div>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Grid Frame Gambar */}
        <div className="mn-square-grid">
          {activeProducts.map((prod, index) => (
            <div 
              key={index} 
              className={`mn-frame-item efek-klik-kartu ${index === hoveredMenuItemIndex ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredMenuItemIndex(index)}
              onMouseLeave={() => setHoveredMenuItemIndex(null)}
            >
              <div className="mn-backend-image-placeholder">
                <p>Gambar {prod.name}</p>
                <span>(Dari Backend)</span>
              </div>

              {index === hoveredMenuItemIndex && (
                <div className="mn-item-overlay">
                  <div className="mn-item-overlay-content">
                    <h4 className="mn-item-food-name">
                      {prod.name} {prod.star && <span>★</span>}
                    </h4>
                    <p className="mn-item-food-desc">{prod.desc}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="mn-footer">
        <div className="mn-socials">
          <div className="mn-soc-circle"><img src={IconInstagram} alt="Instagram" /></div>
          <div className="mn-soc-circle"><img src={IconWhatsapp} alt="Whatsapp" /></div>
          <div className="mn-soc-circle"><img src={IconFacebook} alt="Facebook" /></div>
          <div className="mn-soc-circle"><img src={IconLink} alt="Link" /></div>
          <div className="mn-soc-circle"><img src={IconTiktok} alt="Tiktok" /></div>
        </div>
        
        <div className="mn-footer-logo-box" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          <img src={LogoLaoban} alt="Logo Laoban" className="mn-footer-logo" />
        </div>

        <div className="mn-copyright">
          © Copyright Laoban Nusantara.
        </div>
      </footer>

    </div>
  );
}