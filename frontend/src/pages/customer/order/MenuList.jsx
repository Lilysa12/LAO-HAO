import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuList.css';

// --- IMPORT ASSETS LOGO & IKON CHECKOUT ---
import LogoLaoban from '../../../assets/icons/icons-customer/logoLaoban.png';
import IconCheckout from '../../../assets/icons/icons-customer/checkout.png';

// --- IMPORT ICONS UNTUK FOOTER ---
import IconInstagram from '../../../assets/icons/icons-customer/instagram.png';
import IconWhatsapp from '../../../assets/icons/icons-customer/whatsapp.png';
import IconFacebook from '../../../assets/icons/icons-customer/facebook.png';
import IconLink from '../../../assets/icons/icons-customer/link.png';
import IconTiktok from '../../../assets/icons/icons-customer/tiktok.png';

export default function MenuList() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('MAIN');

  // =========================================================
  // DATA LENGKAP MENU LAOBAN NUSANTARA (Sesuai Katalog PDF)
  // =========================================================
  const allFoodItems = [
    // --- MAIN DISH ---
    { id: 1, category: 'MAIN', name: 'Nasi Lemak', desc: 'Rempah santan dengan ayam ungkep bumbu dikombinasikan dengan kacang teri yang memanjakan lidah.', price: 'Rp 30.000' },
    { id: 2, category: 'MAIN', name: 'Nasi Hainan', desc: 'Nasi berbumbu putih rahasia khas laoban dipadu ayam jasio bumbu coklat yang muantab!', price: 'Rp 29.000' },
    { id: 3, category: 'MAIN', name: 'Nasi Ayam', desc: 'Nasi hangat dengan ayam panggang khas Laoban.', price: 'Rp 28.000' },
    { id: 4, category: 'MAIN', name: 'Nasi Ayam Mala', desc: 'Nasi putih dengan ayam bumbu mala sechuan yang rasanya pedas asin gurih. Wajib cobain!', price: 'Rp 34.000' },
    { id: 5, category: 'MAIN', name: 'Nasi Ayam Salted Egg', desc: 'Ayam dengan sauce salted egg seperti di singapoh lengkap dengan telur sunny side up.', price: 'Rp 29.000' },
    { id: 6, category: 'MAIN', name: 'Nasi Telor Hongkong', desc: 'Nasi dengan sajian telur ala Hongkong yang tebal dan gurih.', price: 'Rp 26.000' },
    { id: 7, category: 'MAIN', name: 'Bubur Spesial Laoban', desc: 'Bubur khas Laoban yang bisa bikin pagimu ceria.', price: 'Rp 20.000' },
    { id: 8, category: 'MAIN', name: 'Bubur Jasio', desc: 'Nikmatnya perpaduan bubur yang gurih dengan topping Ayam Jasio.', price: 'Rp 22.000' },
    { id: 9, category: 'MAIN', name: 'Mee Curry Uncle', desc: 'Mie kenyal dengan kuah kari Penang khas Laoban yang creamy, gurih, dan berempah.', price: 'Rp 32.000' },
    { id: 10, category: 'MAIN', name: 'Mie Ayam Jasio', desc: 'Mie kuning tipis diaduk bumbu gurih disajikan dengan daging ayam jasio yang tebal & juicy.', price: 'Rp 31.000' },
    { id: 11, category: 'MAIN', name: 'Mie Laksa', desc: 'Mie dengan kaldu seafood gurih dilengkapi bakso seafood, udang, dan telur.', price: 'Rp 26.000' },
    { id: 12, category: 'MAIN', name: 'Mie Ayam Mala', desc: 'Perpaduan mie kuning kenyal yang diaduk dengan bumbu mala yang pedas gurih.', price: 'Rp 31.000' },
    { id: 13, category: 'MAIN', name: 'Mie Ayam Hainan', desc: 'Mie kuning yang diaduk dengan bumbu gurih disajikan dengan daging ayam hainan.', price: 'Rp 30.000' },
    { id: 14, category: 'MAIN', name: 'Wonton Ori', desc: 'Wonton berisi daging ayam, disiram kuah kaldu khas Laoban. Comfort food banget!', price: 'Rp 27.000' },
    { id: 15, category: 'MAIN', name: 'Wonton Mala', desc: 'Wonton lembut dipadu kuah Mala pedas ala Laoban. Pecinta pedas wajib coba!', price: 'Rp 27.000' },

    // --- SNACK ---
    { id: 16, category: 'SNACK', name: 'Butter Kaya Toast', desc: 'Favorite semua orang karena roti dan selai kayanya homemade. Wajib coba!', price: 'Rp 20.000' },
    { id: 17, category: 'SNACK', name: 'Choco Toast', desc: 'Jelas isinya selai coklat lumer, solusi para kaum suka badmood!', price: 'Rp 18.000' },
    { id: 18, category: 'SNACK', name: 'Peanut Toast', desc: 'Roti panggang dengan selai kacang tanah gurih.', price: 'Rp 18.000' },
    { id: 19, category: 'SNACK', name: 'Sugar Butter Toast', desc: 'Mirip kaya toast, tapi pakainya taburan gula. Krenyes-krenyes gitu deh!', price: 'Rp 16.000' },
    { id: 20, category: 'SNACK', name: 'Blueberry Cheese Toast', desc: 'Roti susu panggang lembut paduan blueberry sauce dan cream cheese.', price: 'Rp 22.000' },
    { id: 21, category: 'SNACK', name: 'Malaysia Milk Toast', desc: 'Roti susu panggang lembut paduan olesan selai kaya dan selai kacang.', price: 'Rp 23.000' },
    { id: 22, category: 'SNACK', name: 'Roti Es Uncle', desc: 'Roti bakar dengan es krim creamy ala singapore (Pilihan: Vanila / Coklat).', price: 'Rp 18.000' },
    { id: 23, category: 'SNACK', name: 'Pisang Goreng Wijen Kaya', desc: 'Pisang goreng renyah bertabur wijen dengan cocolan manis.', price: 'Rp 22.000' },
    { id: 24, category: 'SNACK', name: 'Telur Kampung 1/2 Matang', desc: 'Penambah protein dan gizi agar makin pintar cari cuan!', price: 'Rp 12.000' },
    { id: 25, category: 'SNACK', name: 'Kulit Crispy Original', desc: 'Kulit ayam krispi original yang super renyah.', price: 'Rp 15.000' },
    { id: 26, category: 'SNACK', name: 'Kulit Crispy Mala', desc: 'Kulit ayam krispi dibalut bumbu mala pedas khas Laoban.', price: 'Rp 18.000' },
    { id: 27, category: 'SNACK', name: 'Kulit Crispy Salted Egg', desc: 'Kulit ayam krispi dengan balutan saus telur asin gurih.', price: 'Rp 20.000' },

    // --- DIMSUM ---
    { id: 28, category: 'DIMSUM', name: 'Udang Keju', desc: 'Olahan udang goreng dengan isian keju lumer di dalamnya.', price: 'Rp 16.000' },
    { id: 29, category: 'DIMSUM', name: 'Mantau Goreng', desc: 'Roti mantau digoreng garing di luar, empuk di dalam.', price: 'Rp 19.000' },
    { id: 30, category: 'DIMSUM', name: 'Gyoza', desc: 'Pangsit ala Jepang isian daging ayam dan sayuran.', price: 'Rp 19.000' },
    { id: 31, category: 'DIMSUM', name: 'Bola Naga', desc: 'Dimsum goreng berbentuk bola naga yang renyah.', price: 'Rp 20.000' },
    { id: 32, category: 'DIMSUM', name: 'Pao Goreng Ayam Jasio', desc: 'Bakpao goreng krispi (isi 2) dengan isian ayam jasio merah.', price: 'Rp 18.000' },
    { id: 33, category: 'DIMSUM', name: 'Pao Goreng Ayam Kecap', desc: 'Bakpao goreng (isi 2) dengan isian ayam kecap gurih.', price: 'Rp 18.000' },
    { id: 34, category: 'DIMSUM', name: 'Kulit Tahu', desc: 'Olahan dimsum dibalut kulit tahu yang digoreng krispi.', price: 'Rp 22.000' },
    { id: 35, category: 'DIMSUM', name: 'Cakue Udang Ayam', desc: 'Cakue renyah dengan isian adonan udang dan ayam lezat.', price: 'Rp 18.000' },
    { id: 36, category: 'DIMSUM', name: 'Kaki Naga', desc: 'Kudapan goreng kaki naga udang ayam favorit. Gak ada duanya!', price: 'Rp 19.000' },
    { id: 37, category: 'DIMSUM', name: 'Lumpia', desc: 'Lumpia goreng isian udang dan ayam cincang.', price: 'Rp 19.000' },
    { id: 38, category: 'DIMSUM', name: 'Roti Udang Ayam', desc: 'Roti tawar goreng dengan olesan adonan udang ayam.', price: 'Rp 19.000' },
    { id: 39, category: 'DIMSUM', name: 'Pao Durian', desc: 'Bakpao kukus super lembut dengan isian selai durian asli.', price: 'Rp 20.000' },
    { id: 40, category: 'DIMSUM', name: 'Pao Pasir Emas', desc: 'Bakpao kukus lumer isian telur asin (salted egg yolk).', price: 'Rp 16.000' },
    { id: 41, category: 'DIMSUM', name: 'Siomay Volcano', desc: 'Siomay ayam kukus dengan saus pedas volcano.', price: 'Rp 18.000' },
    { id: 42, category: 'DIMSUM', name: 'Ceker Ayam', desc: 'Ceker ayam merah bumbu dimsum yang meresap sampai tulang.', price: 'Rp 18.000' },
    { id: 43, category: 'DIMSUM', name: 'Siomay Ayam', desc: 'Siomay kukus ayam original klasik.', price: 'Rp 18.000' },
    { id: 44, category: 'DIMSUM', name: 'Egg Tart', desc: 'Pie susu telur (egg tart) panggang yang manis dan lembut.', price: 'Rp 20.000' },

    // --- DRINK ---
    { id: 45, category: 'DRINK', name: 'Kopi Susu Laoban', desc: 'Es kopi susu gula aren andalan khas Laoban.', price: 'Rp 18.000' },
    { id: 46, category: 'DRINK', name: 'Kopi Laoban', desc: 'Kopi hitam otentik rasa Kopitiam.', price: 'Rp 12.000' },
    { id: 47, category: 'DRINK', name: 'Teh Tarik', desc: 'Teh susu perpaduan khas yang ditarik sempurna.', price: 'Rp 18.000' },
    { id: 48, category: 'DRINK', name: 'Teh Laoban', desc: 'Teh hitam wangi khas Laoban.', price: 'Rp 12.000' },
    { id: 49, category: 'DRINK', name: 'Kopi Butter', desc: 'Kopi panas dengan potongan mentega gurih.', price: 'Rp 18.000' },
    { id: 50, category: 'DRINK', name: 'Kopi Telor Vietnam', desc: 'Kopi dengan buih kocokan telur manis khas Vietnam.', price: 'Rp 21.000' },
    { id: 51, category: 'DRINK', name: 'Matcha Biscoff', desc: 'Minuman matcha green tea dengan olesan selai Biscoff.', price: 'Rp 22.000' },
    { id: 52, category: 'DRINK', name: 'Es Sumo', desc: 'Es segar pelepas dahaga ukuran jumbo.', price: 'Rp 28.000' },
    { id: 53, category: 'DRINK', name: 'Es Lychee Tea', desc: 'Teh rasa leci dengan buah leci asli yang menyegarkan.', price: 'Rp 18.000' },
    { id: 54, category: 'DRINK', name: 'Lychee Yakult', desc: 'Perpaduan manis leci dan segarnya probiotik Yakult.', price: 'Rp 18.000' },
    { id: 55, category: 'DRINK', name: 'Matcha Yuzu', desc: 'Matcha Jepang dengan sentuhan segar sirup Yuzu citrus.', price: 'Rp 20.000' },
    { id: 56, category: 'DRINK', name: 'Kopi Susu Havana', desc: 'Es kopi susu racikan sirup havana Laoban.', price: 'Rp 20.000' },
    { id: 57, category: 'DRINK', name: 'Es ABCD', desc: 'Es serut campur sirup manis ala melayu penutup makan.', price: 'Rp 24.000' }
  ];

  // Filter menu (Tanpa ALL)
  const displayedItems = allFoodItems.filter(item => item.category === activeCategory);

  return (
    <div className="ml-container">
      
      {/* ================= HEADER (DIAM STATIS) ================= */}
      <header className="ml-header">
        <div className="ml-logo-box" onClick={() => navigate('/home')} style={{cursor: 'pointer'}}>
          <img src={LogoLaoban} alt="Logo Laoban" className="ml-logo" />
        </div>
      </header>

      {/* ================= TOP BAR (DIAM STATIS) ================= */}
      <div className="ml-top-bar">
        <div className="ml-welcome-text">
          <p className="ml-greeting">Hi, Budi!</p>
          <h2 className="ml-page-title">Pilih Menu</h2>
        </div>
        <div className="ml-table-badge">
          Meja 12
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="ml-main-layout">
        
        {/* Sidebar Kategori (DIAM STATIS / STICKY) */}
        <aside className="ml-sidebar">
          <div className={`ml-side-tab ${activeCategory === 'MAIN' ? 'active' : ''}`} onClick={() => setActiveCategory('MAIN')}>
            <div className="ml-st-icon">$</div>
            <span className="ml-st-text">MAIN</span>
          </div>
          <div className={`ml-side-tab ${activeCategory === 'SNACK' ? 'active' : ''}`} onClick={() => setActiveCategory('SNACK')}>
            <div className="ml-st-icon">☐</div>
            <span className="ml-st-text">SNACK</span>
          </div>
          <div className={`ml-side-tab ${activeCategory === 'DIMSUM' ? 'active' : ''}`} onClick={() => setActiveCategory('DIMSUM')}>
            <div className="ml-st-icon">◯</div>
            <span className="ml-st-text">DIMSUM</span>
          </div>
          <div className={`ml-side-tab ${activeCategory === 'DRINK' ? 'active' : ''}`} onClick={() => setActiveCategory('DRINK')}>
            <div className="ml-st-icon">☕</div>
            <span className="ml-st-text">DRINK</span>
          </div>
        </aside>

        {/* List Menu Makanan (HANYA INI YANG PUNYA ANIMASI MUNCUL) */}
        <section className="ml-content-area">
          <div className="ml-food-list">
            {displayedItems.length > 0 ? (
              displayedItems.map((item, index) => (
                <div 
                  key={`${activeCategory}-${item.id}`} 
                  className="ml-card-row animate-slide-up" 
                  onClick={() => navigate('/detail')} 
                  style={{cursor: 'pointer', animationDelay: `${index * 0.08}s`}}
                >
                  {/* Frame Kosong Placeholder */}
                  <div className="ml-card-img img-frame">Gambar<br/>{item.name}</div>

                  <div className="ml-card-details">
                    <div className="ml-details-top">
                      <h3>{item.name}</h3>
                      <p>{item.desc}</p>
                    </div>
                    <div className="ml-details-bottom">
                      <span className="ml-price">{item.price}</span>
                      <button className="ml-btn-add" onClick={(e) => { e.stopPropagation(); alert('Ditambahkan ke keranjang!'); }}>+ Add</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{textAlign: 'center', color: '#6C757D', marginTop: '50px'}}>Belum ada menu di kategori ini.</p>
            )}
          </div>
        </section>

      </main> 

      {/* ================= CHECKOUT BAR (FIXED, 100% DIAM TIDAK BERGERAK) ================= */}
      <div className="ml-checkout-wrapper">
        <div 
          className="ml-floating-bar efek-klik-kartu" 
          onClick={() => navigate('/checkout')}
        >
          <div className="ml-fb-left">
            <div className="ml-cart-box">
              <img src={IconCheckout} alt="Cart" className="ml-cart-icon" />
              <div className="ml-cart-dot"></div>
            </div>
            <div className="ml-cart-text">
              <h4>Total (2 item)</h4>
              <p>Rp 57.000</p>
            </div>
          </div>
          <button 
            className="ml-btn-checkout" 
            onClick={(e) => {
              e.stopPropagation();
              navigate('/checkout');
            }}
          >
            Checkout &gt;
          </button>
        </div>
      </div>

      {/* ================= FOOTER (DIAM STATIS) ================= */}
      <footer className="ml-footer">
        <div className="ml-socials">
          <div className="ml-soc-circle"><img src={IconInstagram} alt="Instagram" /></div>
          <div className="ml-soc-circle"><img src={IconWhatsapp} alt="Whatsapp" /></div>
          <div className="ml-soc-circle"><img src={IconFacebook} alt="Facebook" /></div>
          <div className="ml-soc-circle"><img src={IconLink} alt="Link" /></div>
          <div className="ml-soc-circle"><img src={IconTiktok} alt="Tiktok" /></div>
        </div>
        <div className="ml-copyright">
          © Copyright Laoban Nusantara.
        </div>
      </footer>

    </div>
  );
}