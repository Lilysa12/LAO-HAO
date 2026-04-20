import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MenuDetail.css';
import Loading from '../../../components/Loading'; // <--- IMPORT LOADING

// --- IMPORT ASSETS LOKAL ---
import LogoLaoban from '../../../assets/icons/icons-customer/logoLaoban.png';
import IconCheckout from '../../../assets/icons/icons-customer/checkout.png';
import IconHistory from '../../../assets/icons/icons-customer/history.png';

// =========================================================
// SVG ICONS COMPONENT
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

export default function MenuDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const customerName = location.state?.customerName || 'Laoban';

  // --- STATE LOADING ---
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState(location.state?.cart || []);
  const [currentItem, setCurrentItem] = useState(location.state?.item || null);
  const activeCategory = currentItem?.category || 'MAIN';

  useEffect(() => {
    // Simulasi loading sebentar saat masuk halaman
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryClick = (categoryCode) => {
    const categoryNames = {
      'MAIN': 'Main Dish',
      'SNACK': 'Snack',
      'DIMSUM': 'Dimsum',
      'DRINK': 'Hot Drink'
    };
    navigate('/order-list', {
      state: {
        category: categoryNames[categoryCode],
        cart: cart
      }
    });
  };

  const handleAddToCart = () => {
    setCart([...cart, currentItem]);
  };

  const parsePrice = (p) => {
    if (typeof p === 'number') return p;
    return parseInt(p?.replace(/[^0-9]/g, ''), 10) || 0;
  };

  const totalItems = cart.length;
  const totalPrice = cart.reduce((total, item) => total + parsePrice(item.price), 0);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // JIKA SEDANG LOADING, TAMPILKAN KOMPONEN LOADING
  if (isLoading) {
    return <Loading text="Melihat menu pilihan..." />;
  }

  return (
    <div className="md-container">
      <p style={{ padding: '10px 60px 0', fontSize: '12px' }}>Pesanan atas nama: <strong>{customerName}</strong></p>
      
      <header className="md-header">
        <div className="md-logo-box" onClick={() => navigate('/home')} style={{cursor: 'pointer'}}>
          <img src={LogoLaoban} alt="Logo Laoban" className="md-logo" />
        </div>
      </header>

      <div className="md-top-bar">
        <div className="md-welcome-text">
          <p className="md-greeting">Hi, {customerName}!</p>
          <h2 className="md-page-title">Pesan Disini</h2>
        </div>
        <div className="md-table-badge">Meja 12</div>
      </div>

      <main className="md-main-layout">
        <aside className="md-sidebar">
          <div className={`md-side-tab ${activeCategory === 'MAIN' ? 'active' : ''}`} onClick={() => handleCategoryClick('MAIN')}>
            <div className="md-st-icon"><SvgMain /></div>
            <span className="md-st-text">MAIN</span>
          </div>
          <div className={`md-side-tab ${activeCategory === 'SNACK' ? 'active' : ''}`} onClick={() => handleCategoryClick('SNACK')}>
            <div className="md-st-icon"><SvgSnack /></div>
            <span className="md-st-text">SNACK</span>
          </div>
          <div className={`md-side-tab ${activeCategory === 'DIMSUM' ? 'active' : ''}`} onClick={() => handleCategoryClick('DIMSUM')}>
            <div className="md-st-icon"><SvgDimsum /></div>
            <span className="md-st-text">DIMSUM</span>
          </div>
          <div className={`md-side-tab ${activeCategory === 'DRINK' ? 'active' : ''}`} onClick={() => handleCategoryClick('DRINK')}>
            <div className="md-st-icon"><SvgDrink /></div>
            <span className="md-st-text">DRINK</span>
          </div>
        </aside>

        <section className="md-content-area">
          <div className="md-closeup-card">
            <div className="md-closeup-img img-frame">
              <img
                src={currentItem.image_url}
                alt={currentItem.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
              />
            </div>
            <div className="md-details-info">
              <h2 className="md-item-title">{currentItem.name}</h2>
              <p className="md-item-desc">{currentItem.description}</p>
              
              <textarea
                className="md-notes-area"
                placeholder="Tambah catatan (opsional)"
              ></textarea>

              <div className="md-action-row">
                <span className="md-price">{formatRupiah(currentItem.price)}</span>
                <button className="md-btn-add efek-klik" onClick={handleAddToCart}>+ Add</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* TOMBOL HISTORY PESANAN (FLOATING) */}
      <div 
        className={`md-history-btn ${cart.length > 0 ? 'with-cart' : ''}`} 
        onClick={() => navigate('/history')} 
        title="History Pesanan"
      >
        <img src={IconHistory} alt="History" />
      </div>

      {cart.length > 0 && (
        <div className="md-checkout-wrapper slide-up-animation">
          <div
            className="md-floating-bar efek-klik-kartu" 
            onClick={() => navigate('/checkout', { state: { cart, totalPrice, customerName } })}
          >
            <div className="md-fb-left">
              <div className="md-cart-box">
                <img src={IconCheckout} alt="Cart" className="md-cart-icon" />
                <div className="md-cart-dot"></div>
              </div>
              <div className="md-cart-text">
                <h4>Total ({totalItems} item)</h4>
                <p>{formatRupiah(totalPrice)}</p>
              </div>
            </div>
            <button className="md-btn-checkout">
              Checkout &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}