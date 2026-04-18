import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../../supabase";
import "./Payment.css";

// --- IMPORT ASSETS ---
import LogoLaoban from "../../../assets/icons/icons-customer/logoLaoban.png";
import IconInstagram from "../../../assets/icons/icons-customer/instagram.png";
import IconWhatsapp from "../../../assets/icons/icons-customer/whatsapp.png";
import IconFacebook from "../../../assets/icons/icons-customer/facebook.png";
import IconLink from "../../../assets/icons/icons-customer/link.png";
import IconTiktok from "../../../assets/icons/icons-customer/tiktok.png";

import IconTunai from "../../../assets/icons/icons-customer/tunai.png";
import IconQris from "../../../assets/icons/icons-customer/qris.png";
import IconGopay from "../../../assets/icons/icons-customer/gopay.png";
import IconShopee from "../../../assets/icons/icons-customer/shopee.png";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState("qris");
  const [isSubmitting, setIsSubmitting] = useState(false); // State biar ga klik double

  // =========================================================
  // TANGKAP HARGA DINAMIS DARI HALAMAN CHECKOUT
  // =========================================================
  const subtotal = location.state?.subtotal || 0;
  const discountAmount = location.state?.discountAmount || 0;
  const tax = location.state?.tax || 0;
  const totalPayment = location.state?.totalPayment || 0;
  const cart = location.state?.cart || [];
  const customerName = location.state?.customerName || "Laoban";

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleConfirmPayment = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const orderId = `LHO-${Math.floor(10000 + Math.random() * 90000)}`;
      const storedName = localStorage.getItem("customerName") || "Guest";
      const storedPhone = localStorage.getItem("phoneNumber") || "-";
      const storedTable = localStorage.getItem("tableNumber") || "1";

      // SIMPAN KE SUPABASE
      const { error: supabaseError } = await supabase.from("orders").insert([
        {
          order_id: orderId,
          customer_name: storedName,
          phone_number: storedPhone,
          table_number: storedTable,
          items: cart,
          total_payment: totalPayment,
          payment_method: selectedMethod,
          status: "pending", // Biarkan pending dulu sampai dibayar
        },
      ]);

      if (supabaseError) throw supabaseError;

      // 2. MINTA TOKEN KE LARAVEL
      const response = await fetch("http://127.0.0.1:8000/api/midtrans/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          total_price: totalPayment,
          customer_name: storedName,
          phone: storedPhone,
        }),
      });

      const data = await response.json();

      if (data.token) {
        // 3. MUNCULKAN POPUP MIDTRANS
        window.snap.pay(data.token, {
          onSuccess: function (result) {
            console.log("Sukses:", result);
            navigate("/status", { state: { orderId, status: "success" } });
          },
          onPending: function (result) {
            console.log("Pending:", result);
            navigate("/status", { state: { orderId, status: "pending" } });
          },
          onError: function (result) {
            console.error("Error:", result);
            alert("Pembayaran Gagal!");
          },
          onClose: function () {
            alert("Kamu menutup popup sebelum menyelesaikan pembayaran");
          },
        });
      } else {
        throw new Error("Gagal mendapatkan token dari server");
      }
    } catch (error) {
      console.error("Error Detail:", error);
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pay-container">
      {/* ================= HEADER (Hanya Desktop) ================= */}
      <header className="pay-header">
        <div
          className="pay-logo-box"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          <img src={LogoLaoban} alt="Logo Laoban" className="pay-logo" />
        </div>
      </header>

      {/* ================= TOP BAR ================= */}
      <div className="pay-top-bar">
        {/* REVISI IKON BACK SESUAI PERMINTAAN */}
        <button className="pay-back-btn efek-klik" onClick={() => navigate(-1)}>
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
        <h2 className="pay-page-title">Pembayaran</h2>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="pay-main-layout">
        <div className="pay-content-wrapper">
          {/* --- SECTION: TUNAI/CASH --- */}
          <div className="pay-section">
            <h4 className="pay-section-label">TUNAI/CASH</h4>

            <div
              className={`pay-method-card ${selectedMethod === "tunai" ? "active" : ""}`}
              onClick={() => setSelectedMethod("tunai")}
            >
              <div className="pay-method-left">
                <div className="pay-icon-box">
                  <img
                    src={IconTunai}
                    alt="Tunai"
                    className="pay-method-icon"
                  />
                </div>
                <span className="pay-method-name">Bayar di kasir</span>
              </div>
              <div className="pay-radio-circle">
                <div className="pay-radio-dot"></div>
              </div>
            </div>
          </div>

          {/* --- SECTION: E-WALLET & QRIS --- */}
          <div className="pay-section">
            <h4 className="pay-section-label">E-WALLET & QRIS</h4>

            {/* Opsi QRIS */}
            <div
              className={`pay-method-card ${selectedMethod === "qris" ? "active" : ""}`}
              onClick={() => setSelectedMethod("qris")}
            >
              <div className="pay-method-left">
                <div className="pay-icon-box">
                  <img src={IconQris} alt="QRIS" className="pay-method-icon" />
                </div>
                <span className="pay-method-name">QRIS</span>
              </div>
              <div className="pay-radio-circle">
                <div className="pay-radio-dot"></div>
              </div>
            </div>

            {/* Opsi GoPay */}
            <div
              className={`pay-method-card ${selectedMethod === "gopay" ? "active" : ""}`}
              onClick={() => setSelectedMethod("gopay")}
            >
              <div className="pay-method-left">
                <div className="pay-icon-box">
                  <img
                    src={IconGopay}
                    alt="GoPay"
                    className="pay-method-icon"
                  />
                </div>
                <span className="pay-method-name">GoPay</span>
              </div>
              <div className="pay-radio-circle">
                <div className="pay-radio-dot"></div>
              </div>
            </div>

            {/* Opsi ShopeePay */}
            <div
              className={`pay-method-card ${selectedMethod === "shopee" ? "active" : ""}`}
              onClick={() => setSelectedMethod("shopee")}
            >
              <div className="pay-method-left">
                <div className="pay-icon-box">
                  <img
                    src={IconShopee}
                    alt="ShopeePay"
                    className="pay-method-icon"
                  />
                </div>
                <span className="pay-method-name">ShopeePay</span>
              </div>
              <div className="pay-radio-circle">
                <div className="pay-radio-dot"></div>
              </div>
            </div>
          </div>

          {/* --- SUMMARY & BUTTON DINAMIS --- */}
          <div className="pay-summary-box">
            <div className="pay-summary-row">
              <span className="pay-sum-label">Subtotal</span>
              <span className="pay-sum-value">{formatRupiah(subtotal)}</span>
            </div>

            {/* TAMPILKAN DISKON JIKA ADA */}
            {discountAmount > 0 && (
              <div className="pay-summary-row" style={{ color: "#d32f2f" }}>
                <span className="pay-sum-label">Diskon Voucher</span>
                <span className="pay-sum-value">
                  -{formatRupiah(discountAmount)}
                </span>
              </div>
            )}

            <div className="pay-summary-row">
              <span className="pay-sum-label">Pajak Restoran (10%)</span>
              <span className="pay-sum-value">{formatRupiah(tax)}</span>
            </div>

            <div className="pay-summary-row total-row">
              <span className="pay-sum-label-bold">Total Pembayaran</span>
              <span className="pay-sum-total">
                {formatRupiah(totalPayment)}
              </span>
            </div>

            <button
              className={`pay-btn-submit ${isSubmitting ? "btn-disabled" : "efek-klik"}`}
              // INI KUNCINYA: Pakai handleConfirmPayment, jangan navigate langsung
              onClick={handleConfirmPayment}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Konfirmasi Pembayaran"}
            </button>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="pay-footer">
        <div className="pay-socials">
          <div className="pay-soc-circle">
            <img src={IconInstagram} alt="Instagram" />
          </div>
          <div className="pay-soc-circle">
            <img src={IconWhatsapp} alt="Whatsapp" />
          </div>
          <div className="pay-soc-circle">
            <img src={IconFacebook} alt="Facebook" />
          </div>
          <div className="pay-soc-circle">
            <img src={IconLink} alt="Link" />
          </div>
          <div className="pay-soc-circle">
            <img src={IconTiktok} alt="Tiktok" />
          </div>
        </div>
        <div className="pay-copyright">© Copyright Laoban Nusantara.</div>
      </footer>
    </div>
  );
}
