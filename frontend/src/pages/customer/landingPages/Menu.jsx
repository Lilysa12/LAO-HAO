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

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  // State Kategori Aktif
  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'Main Dish');
  const [hoveredMenuItemIndex, setHoveredMenuItemIndex] = useState(null);

  // Slider Logic
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [Slide1, Slide2, Slide3, Slide4];

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 3500);
    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  // Tangkap kategori dari routing halaman Home
  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category);
    }
  }, [location.state]);

  // Daftar Kategori (Dikembalikan menjadi 6 kategori)
  const categories = [
    { name: 'Main Dish', icon: IconMainDish },
    { name: 'Snack', icon: IconSnack },
    { name: 'Dimsum', icon: IconDimsum },
    { name: 'Hot Drink', icon: IconHotDrink },
    { name: 'Cold Drink', icon: IconColdDrink },
    { name: 'Ice & Dessert', icon: IconIceDessert },
  ];

  // ================= DATABASE MENU LENGKAP & TERSORTIR =================
  const menuData = [
    // --- MAIN DISH ---
    { id: 1, category: 'Main Dish', name: 'Nasi Lemak', desc: 'Rempah santan dengan ayam ungkep bumbu dikombinasikan dengan kacang teri yang memanjakan lidah.', price: 'Rp 30.000' },
    { id: 2, category: 'Main Dish', name: 'Nasi Hainan', desc: 'Nasi berbumbu putih rahasia khas laoban dipadu ayam jasio bumbu coklat yang muantab!', price: 'Rp 29.000' },
    { id: 3, category: 'Main Dish', name: 'Nasi Ayam', desc: 'Nasi hangat dengan ayam panggang khas Laoban.', price: 'Rp 28.000' },
    { id: 4, category: 'Main Dish', name: 'Nasi Ayam Mala', desc: 'Nasi putih dengan ayam bumbu mala sechuan yang rasanya pedas asin gurih. Wajib cobain!', price: 'Rp 34.000' },
    { id: 5, category: 'Main Dish', name: 'Nasi Ayam Salted Egg', desc: 'Ayam dengan sauce salted egg seperti di singapoh lengkap dengan telur sunny side up.', price: 'Rp 29.000' },
    { id: 6, category: 'Main Dish', name: 'Nasi Telor Hongkong', desc: 'Nasi dengan sajian telur ala Hongkong yang tebal dan gurih.', price: 'Rp 26.000' },
    { id: 7, category: 'Main Dish', name: 'Bubur Spesial Laoban', desc: 'Bubur khas Laoban yang bisa bikin pagimu ceria.', price: 'Rp 20.000' },
    { id: 8, category: 'Main Dish', name: 'Bubur Jasio', desc: 'Nikmatnya perpaduan bubur yang gurih dengan topping Ayam Jasio.', price: 'Rp 22.000' },
    { id: 9, category: 'Main Dish', name: 'Mee Curry Uncle', desc: 'Mie kenyal dengan kuah kari Penang khas Laoban yang creamy, gurih, dan berempah.', price: 'Rp 32.000' },
    { id: 10, category: 'Main Dish', name: 'Mie Ayam Jasio', desc: 'Mie kuning tipis diaduk bumbu gurih disajikan dengan daging ayam jasio yang tebal & juicy.', price: 'Rp 31.000' },
    { id: 11, category: 'Main Dish', name: 'Mie Laksa', desc: 'Mie dengan kaldu seafood gurih dilengkapi bakso seafood, udang, dan telur.', price: 'Rp 26.000' },
    { id: 12, category: 'Main Dish', name: 'Mie Ayam Mala', desc: 'Perpaduan mie kuning kenyal yang diaduk dengan bumbu mala yang pedas gurih.', price: 'Rp 31.000' },
    { id: 13, category: 'Main Dish', name: 'Mie Ayam Hainan', desc: 'Mie kuning yang diaduk dengan bumbu gurih disajikan dengan daging ayam hainan.', price: 'Rp 30.000' },
    { id: 14, category: 'Main Dish', name: 'Wonton Ori', desc: 'Wonton berisi daging ayam, disiram kuah kaldu khas Laoban. Comfort food banget!', price: 'Rp 27.000' },
    { id: 15, category: 'Main Dish', name: 'Wonton Mala', desc: 'Wonton lembut dipadu kuah Mala pedas ala Laoban. Pecinta pedas wajib coba!', price: 'Rp 27.000' },

    // --- SNACK ---
    { id: 16, category: 'Snack', name: 'Butter Kaya Toast', desc: 'Favorite semua orang karena roti dan selai kayanya homemade. Wajib coba!', price: 'Rp 20.000' },
    { id: 17, category: 'Snack', name: 'Choco Toast', desc: 'Jelas isinya selai coklat lumer, solusi para kaum suka badmood!', price: 'Rp 18.000' },
    { id: 18, category: 'Snack', name: 'Peanut Toast', desc: 'Roti panggang dengan selai kacang tanah gurih.', price: 'Rp 18.000' },
    { id: 19, category: 'Snack', name: 'Sugar Butter Toast', desc: 'Mirip kaya toast, tapi pakainya taburan gula. Krenyes-krenyes gitu deh!', price: 'Rp 16.000' },
    { id: 20, category: 'Snack', name: 'Blueberry Cheese Toast', desc: 'Roti susu panggang lembut paduan blueberry sauce dan cream cheese.', price: 'Rp 22.000' },
    { id: 21, category: 'Snack', name: 'Malaysia Milk Toast', desc: 'Roti susu panggang lembut paduan olesan selai kaya dan selai kacang.', price: 'Rp 23.000' },
    { id: 22, category: 'Snack', name: 'Roti Es Uncle', desc: 'Roti bakar dengan es krim creamy ala singapore (Pilihan: Vanila / Coklat).', price: 'Rp 18.000' },
    { id: 23, category: 'Snack', name: 'Pisang Goreng Wijen Kaya', desc: 'Pisang goreng renyah bertabur wijen dengan cocolan manis.', price: 'Rp 22.000' },
    { id: 24, category: 'Snack', name: 'Telur Kampung 1/2 Matang', desc: 'Penambah protein dan gizi agar makin pintar cari cuan!', price: 'Rp 12.000' },
    { id: 25, category: 'Snack', name: 'Kulit Crispy Original', desc: 'Kulit ayam krispi original yang super renyah.', price: 'Rp 15.000' },
    { id: 26, category: 'Snack', name: 'Kulit Crispy Mala', desc: 'Kulit ayam krispi dibalut bumbu mala pedas khas Laoban.', price: 'Rp 18.000' },
    { id: 27, category: 'Snack', name: 'Kulit Crispy Salted Egg', desc: 'Kulit ayam krispi dengan balutan saus telur asin gurih.', price: 'Rp 20.000' },

    // --- DIMSUM ---
    { id: 28, category: 'Dimsum', name: 'Udang Keju', desc: 'Olahan udang goreng dengan isian keju lumer di dalamnya.', price: 'Rp 16.000' },
    { id: 29, category: 'Dimsum', name: 'Mantau Goreng', desc: 'Roti mantau digoreng garing di luar, empuk di dalam.', price: 'Rp 19.000' },
    { id: 30, category: 'Dimsum', name: 'Gyoza', desc: 'Pangsit ala Jepang isian daging ayam dan sayuran.', price: 'Rp 19.000' },
    { id: 31, category: 'Dimsum', name: 'Bola Naga', desc: 'Dimsum goreng berbentuk bola naga yang renyah.', price: 'Rp 20.000' },
    { id: 32, category: 'Dimsum', name: 'Pao Goreng Ayam Jasio', desc: 'Bakpao goreng krispi (isi 2) dengan isian ayam jasio merah.', price: 'Rp 18.000' },
    { id: 33, category: 'Dimsum', name: 'Pao Goreng Ayam Kecap', desc: 'Bakpao goreng (isi 2) dengan isian ayam kecap gurih.', price: 'Rp 18.000' },
    { id: 34, category: 'Dimsum', name: 'Kulit Tahu', desc: 'Olahan dimsum dibalut kulit tahu yang digoreng krispi.', price: 'Rp 22.000' },
    { id: 35, category: 'Dimsum', name: 'Cakue Udang Ayam', desc: 'Cakue renyah dengan isian adonan udang dan ayam lezat.', price: 'Rp 18.000' },
    { id: 36, category: 'Dimsum', name: 'Kaki Naga', desc: 'Kudapan goreng kaki naga udang ayam favorit. Gak ada duanya!', price: 'Rp 19.000' },
    { id: 37, category: 'Dimsum', name: 'Lumpia', desc: 'Lumpia goreng isian udang dan ayam cincang.', price: 'Rp 19.000' },
    { id: 38, category: 'Dimsum', name: 'Roti Udang Ayam', desc: 'Roti tawar goreng dengan olesan adonan udang ayam.', price: 'Rp 19.000' },
    { id: 39, category: 'Dimsum', name: 'Pao Durian', desc: 'Bakpao kukus super lembut dengan isian selai durian asli.', price: 'Rp 20.000' },
    { id: 40, category: 'Dimsum', name: 'Pao Pasir Emas', desc: 'Bakpao kukus lumer isian telur asin (salted egg yolk).', price: 'Rp 16.000' },
    { id: 41, category: 'Dimsum', name: 'Siomay Volcano', desc: 'Siomay ayam kukus dengan saus pedas volcano.', price: 'Rp 18.000' },
    { id: 42, category: 'Dimsum', name: 'Ceker Ayam', desc: 'Ceker ayam merah bumbu dimsum yang meresap sampai tulang.', price: 'Rp 18.000' },
    { id: 43, category: 'Dimsum', name: 'Siomay Ayam', desc: 'Siomay kukus ayam original klasik.', price: 'Rp 18.000' },
    { id: 44, category: 'Dimsum', name: 'Egg Tart', desc: 'Pie susu telur (egg tart) panggang yang manis dan lembut.', price: 'Rp 20.000' },

    // --- HOT DRINK ---
    { id: 46, category: 'Hot Drink', name: 'Kopi Laoban', desc: 'Kopi hitam otentik rasa Kopitiam.', price: 'Rp 12.000' },
    { id: 47, category: 'Hot Drink', name: 'Teh Tarik', desc: 'Teh susu perpaduan khas yang ditarik sempurna.', price: 'Rp 18.000' },
    { id: 48, category: 'Hot Drink', name: 'Teh Laoban', desc: 'Teh hitam wangi khas Laoban.', price: 'Rp 12.000' },
    { id: 49, category: 'Hot Drink', name: 'Kopi Butter', desc: 'Kopi panas dengan potongan mentega gurih.', price: 'Rp 18.000' },
    { id: 50, category: 'Hot Drink', name: 'Kopi Telor Vietnam', desc: 'Kopi dengan buih kocokan telur manis khas Vietnam.', price: 'Rp 21.000' },

    // --- COLD DRINK ---
    { id: 45, category: 'Cold Drink', name: 'Kopi Susu Laoban', desc: 'Es kopi susu gula aren andalan khas Laoban.', price: 'Rp 18.000' },
    { id: 51, category: 'Cold Drink', name: 'Matcha Biscoff', desc: 'Minuman matcha green tea dingin dengan olesan selai Biscoff.', price: 'Rp 22.000' },
    { id: 52, category: 'Cold Drink', name: 'Es Sumo', desc: 'Es segar pelepas dahaga ukuran jumbo.', price: 'Rp 28.000' },
    { id: 53, category: 'Cold Drink', name: 'Es Lychee Tea', desc: 'Teh rasa leci dengan buah leci asli yang menyegarkan.', price: 'Rp 18.000' },
    { id: 54, category: 'Cold Drink', name: 'Lychee Yakult', desc: 'Perpaduan manis leci dan segarnya probiotik Yakult dingin.', price: 'Rp 18.000' },
    { id: 55, category: 'Cold Drink', name: 'Matcha Yuzu', desc: 'Matcha Jepang dingin dengan sentuhan segar sirup Yuzu citrus.', price: 'Rp 20.000' },
    { id: 56, category: 'Cold Drink', name: 'Kopi Susu Havana', desc: 'Es kopi susu racikan sirup havana Laoban.', price: 'Rp 20.000' },

    // --- ICE & DESSERT ---
    { id: 57, category: 'Ice & Dessert', name: 'Es ABCD', desc: 'Es serut campur sirup manis ala melayu penutup makan.', price: 'Rp 24.000' }
  ];

  // Filter menu berdasarkan tab kategori yang sedang di-klik
  const activeProducts = menuData.filter(product => product.category === activeCategory);

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

      {/* ================= HERO SECTION ================= */}
      <section className="mn-hero">
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

        {/* Tab Kategori Dinamis */}
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
          {activeProducts.length > 0 ? (
            activeProducts.map((prod) => (
              <div 
                key={prod.id} 
                className={`mn-frame-item efek-klik-kartu ${prod.id === hoveredMenuItemIndex ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredMenuItemIndex(prod.id)}
                onMouseLeave={() => setHoveredMenuItemIndex(null)}
              >
                <div className="mn-backend-image-placeholder">
                  <p>Gambar {prod.name}</p>
                  <span>(Dari Backend)</span>
                </div>

                {prod.id === hoveredMenuItemIndex && (
                  <div className="mn-item-overlay">
                    <div className="mn-item-overlay-content">
                      <h4 className="mn-item-food-name">{prod.name}</h4>
                      <p className="mn-item-food-desc">{prod.desc}</p>
                      {/* Harga Menu Muncul Disini */}
                      <span className="mn-item-food-price">{prod.price}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888'}}>
              Belum ada menu di kategori ini.
            </div>
          )}
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