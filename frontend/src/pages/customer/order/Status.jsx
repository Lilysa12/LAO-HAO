import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "./Status.css";

// --- IMPORT ASSETS LOKAL ---
import LogoLaoban from "../../../assets/icons/icons-customer/logoLaoban.png";
import IconInstagram from "../../../assets/icons/icons-customer/instagram.png";
import IconWhatsapp from "../../../assets/icons/icons-customer/whatsapp.png";
import IconFacebook from "../../../assets/icons/icons-customer/facebook.png";
import IconLink from "../../../assets/icons/icons-customer/link.png";
import IconTiktok from "../../../assets/icons/icons-customer/tiktok.png";

export default function Status() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil data dari Payment
  const selectedMethod = location.state?.selectedMethod || "qris";
  const totalPayment = location.state?.totalPayment || 0;
  const tableNumber = localStorage.getItem('tableNumber') || "-";

  // Logic pesan dinamis
  const isCash = selectedMethod === "tunai";

  const orderId = `LHO-${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div className="st-container">
      {/* ================= HEADER (Desktop Saja) ================= */}
      <header className="st-header">
        <div
          className="st-logo-box"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          <img src={LogoLaoban} alt="Logo Laoban" className="st-logo" />
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="st-main-layout">
        <div className="st-card">
          {/* Ikon Berubah Warna: Hijau jika lunas (E-wallet), Kuning jika perlu ke kasir (Tunai) */}
          <div
            className="st-icon-big"
            style={{ backgroundColor: isCash ? "#F2C94C" : "#27AE60" }}
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isCash ? (
                <circle cx="12" cy="12" r="10"></circle> // Ikon bulat untuk menunggu
              ) : (
                <polyline points="20 6 9 17 4 12"></polyline> // Ikon centang
              )}
            </svg>
          </div>

          <h1 className="st-title">
            {isCash ? "Pesanan\nDikirim!" : "Pembayaran\nBerhasil!"}
          </h1>

          <p className="st-subtitle">
            {isCash
              ? "Silakan lakukan pembayaran di kasir."
              : "Pesanan langsung diproses dapur."}
          </p>

          {/* Kotak Order ID & Meja */}
          <div className="st-order-box">
            <div className="st-ob-left">
              <span className="st-ob-label">ORDER ID</span>
              <span className="st-ob-value">#{orderId}</span>
            </div>
            <div className="st-ob-divider"></div>
            <div className="st-ob-right">
              <span className="st-ob-label">MEJA</span>
              <span className="st-ob-value-yellow">{tableNumber}</span>
            </div>
          </div>

          {/* Status Tracker */}
          <div className="st-tracker">
            <div className="st-icon-small">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="st-tracker-text">
              <h4>Pesanan Diterima</h4>
              <p>10:42 AM</p>
            </div>
          </div>

          {/* Pesan Deskripsi */}
          <p className="st-desc">
            {isCash ? (
              <>
                Pesananmu sudah kami catat dengan nomor{" "}
                <strong>#{orderId}</strong>.<br />
                Segera ke kasir untuk bayar{" "}
                <strong>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(totalPayment)}
                </strong>{" "}
                ya!
              </>
            ) : (
              <>
                Yeay, pesananmu sudah masuk dapur!
                <br />
                Kami akan segera mengantarkan hidangan hangat langsung ke
                mejamu.
              </>
            )}
          </p>

          {/* REVISI: Tombol Pesan Lagi diarahkan ke /order-list */}
          <button
            className="st-btn-again efek-klik"
            onClick={() => navigate("/order-list")}
          >
            Pesan Lagi
          </button>
        </div>
      </main>

      {/* ================= FOOTER (Desktop Saja) ================= */}
      <footer className="st-footer">
        <div className="st-socials">
          <div className="st-soc-circle">
            <img src={IconInstagram} alt="Instagram" />
          </div>
          <div className="st-soc-circle">
            <img src={IconWhatsapp} alt="Whatsapp" />
          </div>
          <div className="st-soc-circle">
            <img src={IconFacebook} alt="Facebook" />
          </div>
          <div className="st-soc-circle">
            <img src={IconLink} alt="Link" />
          </div>
          <div className="st-soc-circle">
            <img src={IconTiktok} alt="Tiktok" />
          </div>
        </div>
        <div className="st-copyright">© Copyright Laoban Nusantara.</div>
      </footer>
    </div>
  );
}
