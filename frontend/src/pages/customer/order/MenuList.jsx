import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MenuList.css';

// --- IMPORT ASSETS LOKAL ---
import LogoLaoban from '../../../assets/icons/icons-customer/logoLaoban.png';
import IconCheckout from '../../../assets/icons/icons-customer/checkout.png';

// =========================================================
// SVG ICONS COMPONENT (Warna dikontrol otomatis oleh CSS)
// =========================================================
const SvgMain = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M14.2683 12.1466L13.4147 13.0002L20.4858 20.0712L19.0716 21.4854L12.0005 14.4144L4.92946 21.4854L3.51525 20.0712L12.854 10.7324C12.2664 9.27549 12.8738 7.17715 14.4754 5.57554C16.428 3.62292 19.119 3.14805 20.4858 4.51488C21.8526 5.88172 21.3778 8.57267 19.4251 10.5253C17.8235 12.1269 15.7252 12.7343 14.2683 12.1466ZM4.22235 3.80777L10.9399 10.5253L8.11144 13.3537L4.22235 9.46463C2.66026 7.90253 2.66026 5.36987 4.22235 3.80777ZM18.0109 9.11107C19.2682 7.85386 19.5274 6.38488 19.0716 5.92909C18.6158 5.47331 17.1468 5.73254 15.8896 6.98975C14.6324 8.24697 14.3732 9.71595 14.829 10.1717C15.2847 10.6275 16.7537 10.3683 18.0109 9.11107Z"></path>
  </svg>
);

const SvgSnack = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M5 3C2.79086 3 1 4.79086 1 7C1 8.48168 1.8052 9.77343 3 10.4646V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V10.4646C22.1948 9.77343 23 8.48168 23 7C23 4.79086 21.2091 3 19 3H5ZM7 20C6.44772 20 6 19.5523 6 19V9.12212L5.33325 8.88645C4.5551 8.61142 4 7.86925 4 7C4 5.89543 4.89543 5 6 5H19C20.1046 5 21 5.89543 21 7C21 7.86925 20.4449 8.61142 19.6668 8.88645L19 9.12212V19C19 19.5523 18.5523 20 18 20H7Z"></path>
  </svg>
);

const SvgDimsum = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M8 1.5C8 0.947715 7.55228 0.5 7 0.5C6.44772 0.5 6 0.947715 6 1.5V2.5C6 2.50686 6.00042 2.51285 6.00081 2.51843C6.00385 2.56193 6.00516 2.58063 5.79289 2.79289L5.77277 2.81298C5.50599 3.07912 5 3.58391 5 4.5V5.5C5 6.05228 5.44772 6.5 6 6.5C6.55228 6.5 7 6.05228 7 5.5V4.5C7 4.49314 6.99958 4.48715 6.99919 4.48157C6.99615 4.43807 6.99484 4.41937 7.20711 4.20711L7.22723 4.18702C7.49401 3.92088 8 3.41609 8 2.5V1.5ZM19 1.5C19 0.947715 18.5523 0.5 18 0.5C17.4477 0.5 17 0.947715 17 1.5V2.5C17 2.50686 17.0004 2.51285 17.0008 2.51843C17.0038 2.56193 17.0052 2.58063 16.7929 2.79289L16.7728 2.81298C16.506 3.07912 16 3.58391 16 4.5V5.5C16 6.05228 16.4477 6.5 17 6.5C17.5523 6.5 18 6.05228 18 5.5V4.5C18 4.49314 17.9996 4.48715 17.9992 4.48157C17.9962 4.43807 17.9948 4.41937 18.2071 4.20711L18.2272 4.18702C18.494 3.92088 19 3.41609 19 2.5V1.5ZM12.5 0.5C13.0523 0.5 13.5 0.947715 13.5 1.5V2.5C13.5 3.41609 12.994 3.92088 12.7272 4.18702L12.7071 4.20711C12.4948 4.41937 12.4962 4.43807 12.4992 4.48157C12.4996 4.48715 12.5 4.49314 12.5 4.5V5.5C12.5 6.05228 12.0523 6.5 11.5 6.5C10.9477 6.5 10.5 6.05228 10.5 5.5V4.5C10.5 3.58391 11.006 3.07912 11.2728 2.81298L11.2929 2.79289C11.5052 2.58063 11.5038 2.56193 11.5008 2.51843C11.5004 2.51285 11.5 2.50686 11.5 2.5V1.5C11.5 0.947715 11.9477 0.5 12.5 0.5ZM4 10H20C20 14.4183 16.4183 18 12 18C7.58172 18 4 14.4183 4 10ZM3 8C2.44772 8 2 8.44771 2 9V10C2 14.1006 4.46819 17.6248 8 19.1679V20C8 20.5523 8.44772 21 9 21H15C15.5523 21 16 20.5523 16 20V19.1679C19.5318 17.6248 22 14.1006 22 10V9C22 8.44772 21.5523 8 21 8H3Z"></path>
  </svg>
);

const SvgDrink = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 5h-2V5h2v3zM4 19h16v2H4z"/>
  </svg>
);

export default function MenuList() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeCategory, setActiveCategory] = useState('MAIN');
  
  // FIX: Tangkap cart dari MenuDetail (jika ada navigasi balik), atau mulai kosong
  const [cart, setCart] = useState(location.state?.cart || []);

  useEffect(() => {
    // Sinkronisasi data keranjang dari Menu Detail saat back
    if (location.state?.cart) {
      setCart(location.state.cart);
    }
    // Sinkronisasi Kategori Aktif
    if (location.state?.category) {
      const mapCat = {
        'Main Dish': 'MAIN', 'Snack': 'SNACK', 'Dimsum': 'DIMSUM',
        'Hot Drink': 'DRINK', 'Cold Drink': 'DRINK', 'Ice & Dessert': 'DRINK'
      };
      setActiveCategory(mapCat[location.state.category] || 'MAIN');
    }
  }, [location.state]);

  const allFoodItems = [
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

  const displayedItems = allFoodItems.filter(item => item.category === activeCategory);

  const handleAddToCart = (e, item) => {
    e.stopPropagation(); 
    setCart([...cart, item]);
  };

  const totalPrice = cart.reduce((total, item) => {
    const numericPrice = parseInt(item.price.replace(/[^0-9]/g, ''), 10);
    return total + numericPrice;
  }, 0);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="ml-container">
      <header className="ml-header">
        <div className="ml-logo-box" onClick={() => navigate('/home')} style={{cursor: 'pointer'}}>
          <img src={LogoLaoban} alt="Logo Laoban" className="ml-logo" />
        </div>
      </header>

      <div className="ml-top-bar">
        <div className="ml-welcome-text">
          <p className="ml-greeting">Hi, Budi!</p>
          <h2 className="ml-page-title">Pilih Menu</h2>
        </div>
        <div className="ml-table-badge">Meja 12</div>
      </div>

      <main className="ml-main-layout">
        
        <aside className="ml-sidebar">
          <div className={`ml-side-tab ${activeCategory === 'MAIN' ? 'active' : ''}`} onClick={() => setActiveCategory('MAIN')}>
            <div className="ml-st-icon"><SvgMain /></div>
            <span className="ml-st-text">MAIN</span>
          </div>
          <div className={`ml-side-tab ${activeCategory === 'SNACK' ? 'active' : ''}`} onClick={() => setActiveCategory('SNACK')}>
            <div className="ml-st-icon"><SvgSnack /></div>
            <span className="ml-st-text">SNACK</span>
          </div>
          <div className={`ml-side-tab ${activeCategory === 'DIMSUM' ? 'active' : ''}`} onClick={() => setActiveCategory('DIMSUM')}>
            <div className="ml-st-icon"><SvgDimsum /></div>
            <span className="ml-st-text">DIMSUM</span>
          </div>
          <div className={`ml-side-tab ${activeCategory === 'DRINK' ? 'active' : ''}`} onClick={() => setActiveCategory('DRINK')}>
            <div className="ml-st-icon"><SvgDrink /></div>
            <span className="ml-st-text">DRINK</span>
          </div>
        </aside>

        <section className="ml-content-area">
          <div className="ml-food-list">
            {displayedItems.length > 0 ? (
              displayedItems.map((item, index) => (
                <div 
                  key={`${activeCategory}-${item.id}`} 
                  className="ml-card-row animate-slide-up" 
                  onClick={() => navigate('/detail', { state: { item: item, cart: cart } })} 
                  style={{cursor: 'pointer', animationDelay: `${index * 0.08}s`}}
                >
                  <div className="ml-card-img img-frame">Gambar<br/>{item.name}</div>
                  <div className="ml-card-details">
                    <div className="ml-details-top">
                      <h3>{item.name}</h3>
                      <p>{item.desc}</p>
                    </div>
                    <div className="ml-details-bottom">
                      <span className="ml-price">{item.price}</span>
                      <button className="ml-btn-add" onClick={(e) => handleAddToCart(e, item)}>+ Add</button>
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

      {cart.length > 0 && (
        <div className="ml-checkout-wrapper slide-up-animation">
          <div className="ml-floating-bar efek-klik-kartu" onClick={() => navigate('/checkout', { state: { cart, totalPrice } })}>
            <div className="ml-fb-left">
              <div className="ml-cart-box">
                <img src={IconCheckout} alt="Cart" className="ml-cart-icon" />
                <div className="ml-cart-dot"></div>
              </div>
              <div className="ml-cart-text">
                <h4>Total ({cart.length} item)</h4>
                <p>{formatRupiah(totalPrice)}</p>
              </div>
            </div>
            <button 
              className="ml-btn-checkout" 
              onClick={(e) => {
                e.stopPropagation();
                navigate('/checkout', { state: { cart, totalPrice } });
              }}
            >
              Checkout &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}