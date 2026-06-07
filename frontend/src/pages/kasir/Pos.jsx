import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Pos.css";

// --- IMPORT ASSETS ---
import logoLaoban from "../../assets/Icons/icons-admin/logo.svg";
import iconDashboard from "../../assets/Icons/icons-admin/dashboard.svg";
import iconPos from "../../assets/Icons/icons-admin/pos.svg";
import iconPesananDapur from "../../assets/Icons/icons-admin/pesanandapur.svg";
import iconStok from "../../assets/Icons/icons-admin/stok.svg";
import iconLaporan from "../../assets/Icons/icons-admin/laporan.svg";
import iconQrMeja from "../../assets/Icons/icons-admin/QrMeja.svg";
import iconLogout from "../../assets/Icons/icons-admin/logout.svg";

const Pos = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderType, setOrderType] = useState("Takeaway");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/kasir/menus?_t=${new Date().getTime()}`,
      );
      setMenus(response.data);
    } catch (error) {
      console.error("Gagal mengambil menu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const getMenuClass = (path) =>
    location.pathname === path ? "sidebar-item active" : "sidebar-item";
  const getIconClass = (path) =>
    location.pathname === path
      ? "sidebar-icon icon-active-white"
      : "sidebar-icon icon-white";

  // --- FIX: FUNGSI LOGOUT DIPERBAIKI (Hapus Role) ---
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(
        cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)),
      );
    } else {
      setCart([
        ...cart,
        { id: item.id, name: item.name, price: item.price, qty: 1 },
      ]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : item;
        }
        return item;
      }),
    );
  };

  const removeItem = (id) => setCart(cart.filter((item) => item.id !== id));

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxPB1 = subtotal * 0.1;
  const serviceCharge = subtotal * 0.05;
  const grandTotal = subtotal + taxPB1 + serviceCharge;

  const dynamicCategories = [
    "All",
    ...new Set(menus.map((item) => item.category)),
  ];
  const filteredMenu = menus.filter((item) => {
    const matchCat =
      activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCheckout = async (paymentStatus) => {
    if (!customerName.trim()) return alert("Nama pelanggan harus diisi!");
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    if (orderType === "Dine-in" && !tableNumber.trim())
      return alert("Untuk Dine-in, Nomor Meja wajib diisi!");

    setIsProcessing(true);
    const payload = {
  customer_name: customerName,
  table_number: orderType === "Takeaway"
      ? "Takeaway"
      : tableNumber,

  items: cart.map((c) => ({
      name: c.name,
      qty: c.qty,
      price: c.price
  })),

  subtotal: subtotal,
  tax: taxPB1 + serviceCharge,
  total_payment: grandTotal,

  payment_status: paymentStatus,

  status:
      paymentStatus === "LUNAS"
      ? "SELESAI"
      : "OPEN_TABLE"
};

    try {
      await axios.post(`http://127.0.0.1:8000/api/kasir/orders`, payload);
      alert(`Sukses! Pesanan ${customerName} berhasil dibuat.`);
      setCart([]);
      setCustomerName("");
      setTableNumber("");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setIsProcessing(false);
    }
  };

  console.log("Menus:", menus);
  console.log("Filtered:", filteredMenu);

  return (
    <div className="pos-wrapper">
      <aside className="pos-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo-area">
            <img src={logoLaoban} alt="Logo" />
          </div>

          <nav className="sidebar-nav">
            <Link to="/kasir" className={getMenuClass("/kasir")}>
              <img
                src={iconDashboard}
                alt="Denah"
                className={getIconClass("/kasir")}
              />
              <span>Denah Meja</span>
            </Link>
            <Link to="/kasir/pos" className={getMenuClass("/kasir/pos")}>
              <img
                src={iconPos}
                alt="POS"
                className={getIconClass("/kasir/pos")}
              />
              <span>Kasir / POS</span>
            </Link>
            <Link
              to="/kasir/pesanan"
              className={getMenuClass("/kasir/pesanan")}
            >
              <img
                src={iconPesananDapur}
                alt="Dapur"
                className={getIconClass("/kasir/pesanan")}
              />
              <span>Pesanan Dapur</span>
            </Link>
            <Link
              to="/kasir/manajemen-menu"
              className={getMenuClass("/kasir/manajemen-menu")}
            >
              <img
                src={iconStok}
                alt="Menu"
                className={getIconClass("/kasir/manajemen-menu")}
              />
              <span>Manajemen Menu</span>
            </Link>
            <Link to="/kasir/stok" className={getMenuClass("/kasir/stok")}>
              <img
                src={iconStok}
                alt="Stok"
                className={getIconClass("/kasir/stok")}
              />
              <span>Stok Bahan Baku</span>
            </Link>
            <Link
              to="/kasir/laporan"
              className={getMenuClass("/kasir/laporan")}
            >
              <img
                src={iconLaporan}
                alt="Laporan"
                className={getIconClass("/kasir/laporan")}
              />
              <span>Laporan & Riwayat</span>
            </Link>
            <Link
              to="/kasir/qr-meja"
              className={getMenuClass("/kasir/qr-meja")}
            >
              <img
                src={iconQrMeja}
                alt="QR"
                className={getIconClass("/kasir/qr-meja")}
              />
              <span>QR Code Meja</span>
            </Link>
            <div className="sidebar-divider" />

            {/* --- FIX: TOMBOL KEMBALI KE PUSAT SEKARANG MEMICU LOGOUT --- */}
            <button
              onClick={handleLogout}
              className="sidebar-item"
              style={{
                background: "none",
                border: "none",
                textAlign: "left",
                width: "100%",
                cursor: "pointer",
                fontFamily: "inherit",
                color: "white",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={iconDashboard}
                alt="Admin"
                className="sidebar-icon icon-white"
              />
              <span>Kembali ke Pusat</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button
            className="sidebar-logout"
            onClick={handleLogout}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              background: "none",
              border: "none",
              color: "white",
              width: "100%",
              gap: "10px",
            }}
          >
            <img
              src={iconLogout}
              alt="Logout"
              className="sidebar-icon icon-white"
            />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="pos-main">
        <header className="pos-topbar">
          <div className="topbar-breadcrumb">
            <span className="breadcrumb-gray">Cashier Mode / </span>
            <span className="breadcrumb-bold">Pos</span>
          </div>
          <div className="topbar-user">
            <div className="user-text">
              <span className="user-name">Cashier 01</span>
              <span className="user-status">
                <span className="status-dot" /> Online
              </span>
            </div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <div className="pos-layout">
          <div className="pos-menu-section">
            <div className="order-type-toggle">
              <button
                className={`toggle-btn ${orderType === "Takeaway" ? "active" : ""}`}
                onClick={() => setOrderType("Takeaway")}
              >
                Takeaway
              </button>
              <button
                className={`toggle-btn ${orderType === "Dine-in" ? "active" : ""}`}
                onClick={() => setOrderType("Dine-in")}
              >
                Dine-in
              </button>
            </div>

            <div className="search-bar-wrapper">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="search-icon-svg"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Cari menu (ex: Nasi Goreng)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pos-search-input"
              />
            </div>

            <div className="category-filters">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="menu-grid">
              {isLoading ? (
                <p
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Memuat menu...
                </p>
              ) : filteredMenu.length > 0 ? (
                filteredMenu.map((item) => (
                  <div
                    key={item.id}
                    className="menu-card"
                    onClick={() => addToCart(item)}
                  >
                    <div className="menu-img-box">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="menu-info">
                      <h4>{item.name}</h4>
                      <span className="menu-price">
                        {formatRupiah(item.price)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Menu tidak ditemukan.
                </p>
              )}
            </div>
          </div>

          <aside className="pos-cart-section">
            <div className="cart-header">
              <h3>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Pesanan Saat Ini
              </h3>
            </div>

            <div className="customer-info-inputs">
              <div className="input-group-main">
                <label>NAMA PELANGGAN</label>
                <input
                  type="text"
                  placeholder="Ex: Budi"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="input-group-table">
                <label>NO. MEJA</label>
                <input
                  type="text"
                  placeholder="Ex: 12"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  disabled={orderType === "Takeaway"}
                />
              </div>
            </div>

            <div className="cart-items-container">
              {cart.length === 0 ? (
                <div className="empty-cart">Belum ada pesanan</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-top">
                      <span className="cart-item-name">{item.name}</span>
                      <div className="qty-controls">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="qty-btn-minus"
                        >
                          -
                        </button>
                        <span className="qty-number">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="qty-btn-plus"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span className="cart-item-price">
                      {formatRupiah(item.price * item.qty)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="cart-summary-box">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>PB1 (10%)</span>
                <span>{formatRupiah(taxPB1)}</span>
              </div>
              <div className="summary-row">
                <span>Service (5%)</span>
                <span>{formatRupiah(serviceCharge)}</span>
              </div>

              <div className="summary-row grand-total-row">
                <span>GRAND TOTAL</span>
                <span className="total-amount">{formatRupiah(grandTotal)}</span>
              </div>

              <div className="cart-actions">
                <button
                  onClick={() => handleCheckout("BELUM BAYAR")}
                  disabled={isProcessing}
                  className="btn-open-table"
                >
                  Open Table (Bayar Nanti)
                </button>
                <button
                  onClick={() => handleCheckout("LUNAS")}
                  disabled={isProcessing}
                  className="btn-checkout"
                >
                  {isProcessing ? "Memproses..." : "Proses Pembayaran"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Pos;
