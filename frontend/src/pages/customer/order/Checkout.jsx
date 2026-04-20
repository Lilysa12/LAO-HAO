import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";

// --- IMPORT ASSETS ---
import LogoLaoban from "../../../assets/icons/icons-customer/logoLaoban.png";
import IconInstagram from "../../../assets/icons/icons-customer/instagram.png";
import IconWhatsapp from "../../../assets/icons/icons-customer/whatsapp.png";
import IconTiktok from "../../../assets/icons/icons-customer/tiktok.png";
import IconFacebook from "../../../assets/icons/icons-customer/facebook.png";
import IconLink from "../../../assets/icons/icons-customer/link.png";
import Loading from '../../../components/Loading'; // <--- IMPORT LOADING

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // STATE UNTUK LOADING
  const [isLoading, setIsLoading] = useState(false);

  // =========================================================
  // LOGIKA GROUPING CART (Meringkas item yang sama)
  // =========================================================
  const initialCart = location.state?.cart || [];
  const groupedCart = initialCart.reduce((acc, item) => {
    const existing = acc.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  const [cart, setCart] = useState(groupedCart);
  const appliedVoucher = location.state?.appliedVoucher || null;

  const parsePrice = (p) => {
    if (typeof p === "number") return p;
    return parseInt(p?.toString().replace(/[^0-9]/g, ""), 10) || 0;
  };

  const updateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const handleBackToMenu = () => {
    const flatCart = [];
    cart.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const { quantity, ...originalItem } = item;
        flatCart.push(originalItem);
      }
    });
    navigate("/order-list", { state: { cart: flatCart } });
  };

  // =========================================================
  // KALKULASI TOTAL & DISKON
  // =========================================================
  const subtotal = cart.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0,
  );
  const tax = Math.round(subtotal * 0.1);

  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === "percent") {
      discountAmount = (subtotal * appliedVoucher.amount) / 100;
    } else if (appliedVoucher.type === "fixed") {
      discountAmount = appliedVoucher.amount;
    }
  }
  if (discountAmount > subtotal) discountAmount = subtotal;

  const totalPayment = subtotal + tax - discountAmount;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // =========================================================
  // LOGIKA SIMPAN KE HISTORY DENGAN LOADING
  // =========================================================
  const handleProceedToPayment = () => {
    if (cart.length === 0) return;

    // 1. Tampilkan Loading
    setIsLoading(true);

    // Simulasi proses (1.5 detik) agar animasi loading terlihat cantik
    setTimeout(() => {
      const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

      // 2. Siapkan data pesanan
      const newOrder = {
        id: `#LH-${Math.floor(100000 + Math.random() * 900000)}`,
        title: cart[0]?.name + (cart.length > 1 ? ' dkk' : ''),
        date: new Date().toISOString(),
        totalItems: totalQuantity,
        totalPrice: totalPayment,
        status: 'SELESAI',
        image: cart[0]?.image_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&q=80',
        items: cart
      };

      // 3. Simpan ke Session Storage
      const existingHistory = JSON.parse(sessionStorage.getItem('laoban_order_history')) || [];
      const updatedHistory = [newOrder, ...existingHistory];
      sessionStorage.setItem('laoban_order_history', JSON.stringify(updatedHistory));

      // 4. Selesaikan loading dan pindah halaman
      setIsLoading(false);
      navigate("/payment", {
        state: {
          subtotal, 
          tax, 
          discountAmount, 
          totalPayment, 
          cart,
        },
      });
    }, 1500);
  };

  // JIKA SEDANG LOADING, TAMPILKAN KOMPONEN LOADING
  if (isLoading) {
    return <Loading text="Sedang memproses pesananmu..." />;
  }

  return (
    <div className="co-container">
      <header className="co-header">
        <div
          className="co-logo-box"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          <img src={LogoLaoban} alt="Logo Laoban" className="co-logo" />
        </div>
      </header>

      <div className="co-top-bar">
        <button className="co-back-btn efek-klik" onClick={handleBackToMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="24"
            height="24"
          >
            <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
          </svg>
        </button>
        <h2 className="co-page-title">Pesanan Anda</h2>
      </div>

      <main className="co-main-layout">
        <section className="co-left-column">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div className="co-item-card" key={item.id}>
                <div className="co-item-header">
                  <div className="co-item-img-frame">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div className="co-item-info">
                    <h3>{item.name}</h3>
                    <p className="co-item-price">
                      {formatRupiah(parsePrice(item.price))}
                    </p>
                  </div>
                  <div className="co-qty-control">
                    <button
                      className="co-qty-btn"
                      onClick={() => updateQty(item.id, -1)}
                    >
                      -
                    </button>
                    <span className="co-qty-num">{item.quantity}</span>
                    <button
                      className="co-qty-btn text-red"
                      onClick={() => updateQty(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  className="co-notes-input"
                  placeholder="Tambah catatan (opsional)"
                />
              </div>
            ))
          ) : (
            <div className="co-empty-state">
              <p>Keranjang Anda kosong.</p>
              <button className="co-btn-add-initial" onClick={handleBackToMenu}>
                Pilih Menu
              </button>
            </div>
          )}

          <div
            className="co-add-more-btn efek-klik-kartu"
            onClick={handleBackToMenu}
          >
            <span className="co-add-icon">+</span>
            <span className="co-add-text">Tambah Menu Lain</span>
          </div>
        </section>

        <section className="co-right-column">
          <div className="co-promo-card yellow-tint">
            <div className="co-promo-icon text-yellow">⭐</div>
            <div className="co-promo-text">
              <h4>Kumpulkan Poin Lao-Hao</h4>
              <p>Dapat {Math.floor(subtotal / 1000)} poin dari pesanan ini</p>
            </div>
          </div>

          <div
            className="co-promo-card efek-klik-kartu"
            onClick={() => navigate("/voucher", { state: { cart, subtotal } })}
          >
            <div
              className={`co-promo-icon ${appliedVoucher ? "text-green" : "text-red"}`}
            >
              %
            </div>
            <div className="co-promo-text">
              <h4>
                {appliedVoucher
                  ? appliedVoucher.title
                  : "Promo/ Diskon Voucher"}
              </h4>
              <p>
                {appliedVoucher
                  ? `Berhasil! Hemat ${formatRupiah(discountAmount)}`
                  : "Masukan promo atau kode voucher disini!"}
              </p>
            </div>
          </div>

          <div className="co-summary-card">
            <div className="co-summary-row">
              <span className="co-sum-label">Subtotal</span>
              <span className="co-sum-value">{formatRupiah(subtotal)}</span>
            </div>

            {appliedVoucher && (
              <div className="co-summary-row text-green-row">
                <span className="co-sum-label text-green-row">
                  Diskon Promo
                </span>
                <span className="co-sum-value text-green-row">
                  - {formatRupiah(discountAmount)}
                </span>
              </div>
            )}

            <div className="co-summary-row">
              <span className="co-sum-label">Pajak Restoran (10%)</span>
              <span className="co-sum-value">{formatRupiah(tax)}</span>
            </div>
            <div className="co-divider"></div>
            <div className="co-summary-row total-row">
              <span className="co-sum-label-bold">Total Pembayaran</span>
              <span className="co-sum-total">{formatRupiah(totalPayment)}</span>
            </div>
            
            <button
              className="co-btn-pay efek-klik"
              disabled={cart.length === 0}
              onClick={handleProceedToPayment}
              style={{ opacity: cart.length === 0 ? 0.5 : 1 }}
            >
              Pilih Pembayaran
            </button>
          </div>
        </section>
      </main>

      <footer className="co-footer">
        <div className="co-socials">
          <div className="co-soc-circle">
            <img src={IconInstagram} alt="IG" />
          </div>
          <div className="co-soc-circle">
            <img src={IconWhatsapp} alt="WA" />
          </div>
          <div className="co-soc-circle">
            <img src={IconFacebook} alt="FB" />
          </div>
          <div className="co-soc-circle">
            <img src={IconLink} alt="Link" />
          </div>
          <div className="co-soc-circle">
            <img src={IconTiktok} alt="Tiktok" />
          </div>
        </div>
        <div className="co-copyright">© Copyright Laoban Nusantara.</div>
      </footer>
    </div>
  );
}