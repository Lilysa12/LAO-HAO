import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // REVISI: Tambah useSearchParams
import "./InputData.css";

// --- IMPORT ASSETS ---
import ImgHero from "../../../assets/image/Image5.png";
import LogoLaoban from "../../../assets/icons/icons-customer/logoLaoban.png";
import IconInstagram from "../../../assets/icons/icons-customer/instagram.png";
import IconWhatsapp from "../../../assets/icons/icons-customer/whatsapp.png";
import IconFacebook from "../../../assets/icons/icons-customer/facebook.png";
import IconLink from "../../../assets/icons/icons-customer/link.png";
import IconTiktok from "../../../assets/icons/icons-customer/tiktok.png";
import Loading from "../../../components/Loading"; 

// SVG Ikon Pin Lokasi (Merah)
const SvgLocation = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="#A00500"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
  </svg>
);

export default function InputData() {
  const navigate = useNavigate();

  // REVISI: Ambil parameter query string dari URL (?cabang=Malang&meja=12)
  const [searchParams] = useSearchParams();
  const urlCabang = searchParams.get("cabang") || "Malang"; // Fallback ke 'Malang' jika kosong
  const urlMeja = searchParams.get("meja") || "12";         // Fallback ke '12' jika kosong

  // State untuk menangkap input
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // REVISI: Set nilai state awal langsung mengambil dari data URL QR hasil scan
  const [tableNumber, setTableNumber] = useState(urlMeja);
  const [branchName, setBranchName] = useState(urlCabang);

  // REVISI: Sinkronisasi ulang data state jika sewaktu-waktu parameter URL berubah
  useEffect(() => {
    if (searchParams.get("meja")) setTableNumber(searchParams.get("meja"));
    if (searchParams.get("cabang")) setBranchName(searchParams.get("cabang"));
  }, [searchParams]);

  // STATE UNTUK LOADING
  const [isLoading, setIsLoading] = useState(false);

  const handleStartOrder = () => {
    if (!customerName || !phoneNumber) {
      alert("Mohon isi nama dan nomor handphone kamu ya, Laoban!");
      return;
    }

    // 1. Tampilkan Loading
    setIsLoading(true);

    // 2. Simulasi proses pemindahan data (1.5 detik)
    setTimeout(() => {
      // SIMPAN KE MEMORI BROWSER
      localStorage.setItem("customerName", customerName);
      localStorage.setItem("phoneNumber", phoneNumber);
      localStorage.setItem("tableNumber", tableNumber);
      localStorage.setItem("branchName", branchName); // REVISI: Simpan data cabang juga ke memori

      // Matikan Loading dan pindah halaman
      setIsLoading(false);
     navigate(`/order-list${location.search}`, {
  state: {
    customerName,
  },
});
    }, 1500);
  };

  // JIKA SEDANG LOADING, TAMPILKAN KOMPONEN LOADING
  if (isLoading) {
    return <Loading text="Menyiapkan meja untukmu..." />;
  }

  return (
    <div className="id-container">
      {/* ================= HEADER (Desktop Saja) ================= */}
      <header className="id-header">
        <div
          className="id-logo-box"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          <img src={LogoLaoban} alt="Logo Laoban" className="id-logo" />
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="id-main-body">
        {/* --- KOLOM KIRI (GAMBAR) --- */}
        <div className="id-left-col">
          <img src={ImgHero} alt="Menu Laoban" className="id-hero-img" />
        </div>

        {/* --- KOLOM KANAN (TEKS & FORM) --- */}
        <div className="id-right-col">
          <div className="id-text-header">
            <h1 className="id-title">Selamat Datang Para Laoban!</h1>
            <p className="id-subtitle">
              Pesan dan bayar langsung dari mejamu. Masukkan nama untuk memulai.
            </p>
          </div>

          <div className="id-form-card">
            {/* Lokasi & Meja */}
            <div className="id-loc-row">
              <div className="id-loc-left">
                <div className="id-loc-icon-circle">
                  <SvgLocation />
                </div>
                <div className="id-loc-text">
                  <span className="loc-title">Laoban</span>
                  {/* REVISI: Teks nama cabang sekarang berubah secara dinamis sesuai QR */}
                  <span className="loc-subtitle">{branchName}</span>
                </div>
              </div>
              <div className="id-input-group">
                <label>Nomor Meja</label>
                <input
                  type="text"
                  className="id-input-table-readonly"
                  value={`Meja ${tableNumber}`}
                  readOnly
                  style={{
                    backgroundColor: "#f0f0f0",
                    cursor: "not-allowed",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#A00500",
                  }}
                />
              </div>
            </div>

            {/* Input Fields */}
            <form className="id-form">
              <div className="id-input-group">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Masukkan Nama Anda"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="id-input-group">
                <label>No Handphone</label>
                <input
                  type="text"
                  placeholder="Contoh: 089123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="id-input-group">
                <label>Email (opsional)</label>
                <input type="email" placeholder="contoh123@gmail.com" />
              </div>

              <button
                type="button"
                className="id-btn-submit efek-klik"
                onClick={handleStartOrder}
              >
                &gt; Mulai Memesan
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* ================= FOOTER (Desktop Saja) ================= */}
      <footer className="id-footer">
        <div className="id-socials">
          <div className="id-soc-circle">
            <img src={IconInstagram} alt="Instagram" />
          </div>
          <div className="id-soc-circle">
            <img src={IconWhatsapp} alt="Whatsapp" />
          </div>
          <div className="id-soc-circle">
            <img src={IconFacebook} alt="Facebook" />
          </div>
          <div className="id-soc-circle">
            <img src={IconLink} alt="Link" />
          </div>
          <div className="id-soc-circle">
            <img src={IconTiktok} alt="Tiktok" />
          </div>
        </div>
        <div className="id-copyright">© Copyright Laoban Nusantara.</div>
      </footer>
    </div>
  );
}