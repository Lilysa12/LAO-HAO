import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Menu.css";

// --- IMPORT ASSETS HEADER & FOOTER ---
import LogoLaoban from "../../../assets/icons/icons-customer/LogoLaoban.png";
import IconInstagram from "../../../assets/icons/icons-customer/Instagram.png";
import IconWhatsapp from "../../../assets/icons/icons-customer/Whatsapp.png";
import IconFacebook from "../../../assets/icons/icons-customer/facebook.png";
import IconTiktok from "../../../assets/icons/icons-customer/Tiktok.png";
import IconMessage from "../../../assets/icons/Message.png";
import IconCall from "../../../assets/icons/Call.png";

// --- IMPORT KATEGORI ICONS ---
import IconMainDish from "../../../assets/icons/mainDish.png";
import IconSnack from "../../../assets/icons/snack.png";
import IconDimsum from "../../../assets/icons/dimsum.png";
import IconHotDrink from "../../../assets/icons/hotDrink.png";
import IconColdDrink from "../../../assets/icons/coldDrink.png";
import IconIceDessert from "../../../assets/icons/ice&Dessert.png";

// --- IMPORT GAMBAR SLIDER ---
import Slide1 from "../../../assets/home/nic_1497.jpg";
import Slide2 from "../../../assets/home/nic_1941.jpg";
import Slide3 from "../../../assets/home/nic_4125.jpg";
import Slide4 from "../../../assets/home/nic_4272.jpg";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE BARU ---
  const [menuData, setMenuData] = useState([]); // Awalnya kosong
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    location.state?.category || "Main Dish",
  );
  const [hoveredMenuItemIndex, setHoveredMenuItemIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- AMBIL DATA DARI BACKEND ---
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/menus"); // Pastikan route ini ada di Laravel
        if (!response.ok) throw new Error("Gagal ambil data");
        const data = await response.json();
        setMenuData(data);
      } catch (err) {
        console.error("Error Fetch Menu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  // Filter tetap jalan otomatis karena pake state menuData
  const activeProducts = menuData.filter(
    (product) => product.category === activeCategory,
  );

  const navigateToTop = (path) => {
    setIsMobileMenuOpen(false); // Tutup overlay menu HP jika sedang buka
    navigate(path);
    window.scrollTo(0, 0);
  };

  const slides = [Slide1, Slide2, Slide3, Slide4];

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 3500);
    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15 },
    );

    const hiddenElements = document.querySelectorAll(".fade-in-up");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category);
    }
  }, [location.state]);

  const categories = [
    { name: "Main Dish", icon: IconMainDish },
    { name: "Snack", icon: IconSnack },
    { name: "Dimsum", icon: IconDimsum },
    { name: "Hot Drink", icon: IconHotDrink },
    { name: "Cold Drink", icon: IconColdDrink },
    { name: "Ice & Dessert", icon: IconIceDessert },
  ];

  return (
    <div className="mn-container">
      {/* ================= HEADER NAVBAR (FIX MOBILE HAMBURGER) ================= */}
      <nav className="navbar fade-in-up">
        <div
          className="logo-box"
          onClick={() => navigateToTop("/home")}
          style={{ cursor: "pointer" }}
        >
          <img src={LogoLaoban} alt="Logo Laoban" className="logo-img" />
        </div>

        {/* --- MENU OVERLAY MOBILE / DESKTOP LINKS --- */}
        <div className={`nav-links ${isMobileMenuOpen ? "mobile-active" : ""}`}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigateToTop("/home");
            }}
          >
            Home
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigateToTop("/about");
            }}
          >
            About
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
            }}
            className="active"
          >
            Menu
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigateToTop("/our-partner");
            }}
          >
            Our Partner
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigateToTop("/partnership");
            }}
          >
            Partnership
          </a>

          {/* Tombol Pesan Khusus Tampil di Overlay Menu HP */}
          <button
            className="btn-red mobile-only-btn"
            onClick={() => navigateToTop("/order")}
          >
            Pesan Sekarang
          </button>
        </div>

        <div className="nav-actions">
          {/* Tombol Pesan Desktop */}
          <button
            className="btn-red desktop-only-btn"
            onClick={() => navigateToTop("/order")}
          >
            Pesan Sekarang
          </button>

          {/* --- HAMBURGER TOGGLE --- */}
          <div
            className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="mn-hero">
        <div className="mn-hero-left">
          <div className="mn-hero-watermark">LAOBAN</div>
          <div className="mn-hero-content">
            <p className="mn-hero-subtitle-top">MENU</p>
            <h1 className="mn-hero-title">LaobanNusantara</h1>
            <p className="mn-hero-subtitle">BY UNCLE OSH</p>
          </div>
        </div>

        <div className="mn-hero-right">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide}
              alt={`Slide ${index + 1}`}
              className={`mn-slide-img ${index === currentSlide ? "active" : ""}`}
            />
          ))}
          <div className="mn-slider-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`mn-dot ${index === currentSlide ? "active" : ""}`}
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
          <h1 className="mn-title">
            Menu Perguruan
            <br />
            Laoban
          </h1>
        </div>

        {/* Tab Kategori Dinamis */}
        <div className="mn-tabs">
          {categories.map((cat, index) => (
            <div
              key={index}
              className={`mn-tab-item ${activeCategory === cat.name ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <div className="mn-tab-icon-box">
                <img
                  src={cat.icon}
                  alt={cat.name}
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Grid Frame Gambar (DIBUAT KOTAK RAPI DI MOBILE) */}
        <div className="mn-square-grid">
          {loading ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "50px",
              }}
            >
              <p>Lagi nyiapin menu lezat...</p>
            </div>
          ) : activeProducts.length > 0 ? (
            activeProducts.map((prod) => (
              <div
                key={prod.id}
                className={`mn-frame-item efek-klik-kartu ${prod.id === hoveredMenuItemIndex ? "hovered" : ""}`}
                onMouseEnter={() => setHoveredMenuItemIndex(prod.id)}
                onMouseLeave={() => setHoveredMenuItemIndex(null)}
              >
                {/* Tampilkan Gambar dari Backend atau Placeholder */}
                {prod.image_url ? (
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="mn-product-img-backend"
                  />
                ) : (
                  <div className="mn-backend-image-placeholder">
                    <p>{prod.name}</p>
                    <span>Laoban Nusantara</span>
                  </div>
                )}

                {prod.id === hoveredMenuItemIndex && (
                  <div className="mn-item-overlay">
                    <div className="mn-item-overlay-content">
                      <h4 className="mn-item-food-name">{prod.name}</h4>
                      <p className="mn-item-food-desc">
                        {prod.description || prod.desc}
                      </p>
                      <span className="mn-item-food-price">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(prod.price)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px",
                color: "#888",
              }}
            >
              Belum ada menu di kategori ini.
            </div>
          )}
        </div>
      </main>

      {/* ================= FOOTER MODERN (FIX CENTER MOBILE) ================= */}
      <footer className="footer-modern fade-in-up delay-1">
        <div className="foot-grid">
          <div className="foot-brand">
            <img
              src={LogoLaoban}
              alt="Logo Laoban"
              className="logo-img"
              style={{ marginBottom: "15px", cursor: "pointer" }}
              onClick={() => navigateToTop("/home")}
            />
            <p>
              Menyajikan hidangan dan minuman khas Kopitiam Nusantara dengan
              bahan premium, kebersihan terjaga, dan resep rahasia Uncle Osh.
            </p>

            <div className="socials socials-colored unified-socmed">
              <div
                className="soc-colored"
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/laoban.nusantara/",
                    "_blank",
                  )
                }
              >
                <img src={IconInstagram} alt="Instagram" className="soc-img" />
              </div>
              <div
                className="soc-colored"
                onClick={() =>
                  window.open(
                    "https://www.tiktok.com/@laoban.nusantara",
                    "_blank",
                  )
                }
              >
                <img src={IconTiktok} alt="Tiktok" className="soc-img" />
              </div>
              <div
                className="soc-colored"
                onClick={() =>
                  window.open(
                    "https://api.whatsapp.com/send/?phone=%2B6282244503221&text&type=phone_number&app_absent=0",
                    "_blank",
                  )
                }
              >
                <img src={IconWhatsapp} alt="Whatsapp" className="soc-img" />
              </div>
              <div
                className="soc-colored"
                onClick={() =>
                  window.open(
                    "https://www.facebook.com/laoban.nusantara/",
                    "_blank",
                  )
                }
              >
                <img src={IconFacebook} alt="Facebook" className="soc-img" />
              </div>
            </div>
          </div>

          <div className="foot-links">
            <h4>Navigasi</h4>
            <ul>
              <li
                onClick={() => navigateToTop("/home")}
                style={{ cursor: "pointer" }}
              >
                Home
              </li>
              <li
                onClick={() => navigateToTop("/about")}
                style={{ cursor: "pointer" }}
              >
                Tentang Kami
              </li>
              <li
                onClick={() => navigateToTop("/menu")}
                style={{ cursor: "pointer" }}
              >
                Menu Perguruan
              </li>
              <li
                onClick={() => navigateToTop("/our-partner")}
                style={{ cursor: "pointer" }}
              >
                Daftar Cabang
              </li>
            </ul>
          </div>

          <div className="foot-links">
            <h4>Kemitraan</h4>
            <ul>
              <li
                onClick={() => navigateToTop("/partnership")}
                style={{ cursor: "pointer" }}
              >
                Info Franchise
              </li>
              <li
                onClick={() =>
                  window.open(
                    "https://api.whatsapp.com/send/?phone=%2B6282244503221&text&type=phone_number&app_absent=0",
                    "_blank",
                  )
                }
                style={{ cursor: "pointer" }}
              >
                Hubungi Sales
              </li>
            </ul>
          </div>

          <div className="foot-links">
            <h4>Hubungi Kami</h4>
            <ul className="contact-list contact-modern">
              <li
                onClick={() =>
                  (window.location.href = "mailto:laobankopitiam@gmail.com")
                }
                style={{ cursor: "pointer" }}
              >
                <img src={IconMessage} alt="Email" className="contact-icon" />
                <span className="contact-info contact-link">
                  laobankopitiam@gmail.com
                </span>
              </li>
              <li
                onClick={() =>
                  window.open(
                    "https://api.whatsapp.com/send/?phone=%2B6282244503221&text&type=phone_number&app_absent=0",
                    "_blank",
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <img src={IconCall} alt="Phone" className="contact-icon" />
                <span className="contact-info contact-bold">
                  +62 822 4450 3221
                </span>
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
