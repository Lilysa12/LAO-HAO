import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../../supabase";
import "./Payment.css";

// --- IMPORT KOMPONEN LOADING ---
import Loading from "../../../components/Loading";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // =========================================================
  // FUNGSI TRIGGER MIDTRANS SNAP
  // =========================================================
  const triggerMidtransPayment = async (orderId, storedName, storedPhone) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/midtrans/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          total: totalPayment,
          name: storedName,
          phone: storedPhone,
          payment_type: selectedMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Gagal ambil token");
      if (!data.token) throw new Error("Token Midtrans kosong");

      window.snap.pay(data.token, {
        onSuccess: () => {
          navigate("/status", { state: { status: "success", selectedMethod } });
        },
        onPending: () => {
          navigate("/status", { state: { status: "pending", selectedMethod } });
        },
        onError: () => {
          alert("Pembayaran gagal");
          setIsSubmitting(false);
        },
        onClose: () => setIsSubmitting(false),
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // FUNGSI UTAMA SAAT TOMBOL KONFIRMASI DIKLIK
  // =========================================================
  const handleConfirmPayment = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Bikin 1 Order ID untuk Supabase & Midtrans
      const orderId = `LHO-${Math.floor(10000 + Math.random() * 90000)}`;

      const storedName = localStorage.getItem("customerName") || "Guest";
      const storedPhone = localStorage.getItem("phoneNumber") || "-";
      const storedTable = localStorage.getItem("tableNumber") || "12";

      // 2. Simpan order ke Supabase dengan status pending
      const { error } = await supabase.from("orders").insert([
        {
          order_id: orderId,
          customer_name: storedName,
          phone_number: storedPhone,
          table_number: storedTable,
          items: cart,
          total_payment: totalPayment,
          payment_method: selectedMethod,
          status: "pending",
        },
      ]);

      if (error) throw error;

      // 3. Cek Metode Pembayaran
      if (selectedMethod === "tunai") {
        // Kalau tunai, langsung selesai
        alert("Order berhasil dibuat! Silakan bayar di kasir.");
        navigate("/status", { state: { status: "success", selectedMethod } });
        setIsSubmitting(false);
      } else {
        // Kalau QRIS/GoPay/ShopeePay, panggil Midtrans Snap
        await triggerMidtransPayment(orderId, storedName, storedPhone);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pay-container">
      <header className="pay-header">
        <div
          className="pay-logo-box"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          <img src={LogoLaoban} alt="Logo Laoban" className="pay-logo" />
        </div>
      </header>

      <div className="pay-top-bar">
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

      <main className="pay-main-layout">
        <div className="pay-content-wrapper">
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

          <div className="pay-section">
            <h4 className="pay-section-label">E-WALLET & QRIS</h4>
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

          <div className="pay-summary-box">
            <div className="pay-summary-row">
              <span className="pay-sum-label">Subtotal</span>
              <span className="pay-sum-value">{formatRupiah(subtotal)}</span>
            </div>

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
              className={`pay-btn-submit efek-klik`}
              onClick={handleConfirmPayment}
            >
              Konfirmasi Pembayaran
            </button>
          </div>
        </div>
      </main>

      <footer className="pay-footer">
        <div className="pay-socials">
          <a
            href="https://www.instagram.com/laoban.nusantara/"
            target="_blank"
            rel="noopener noreferrer"
            className="pay-soc-circle"
          >
            <img src={IconInstagram} alt="Instagram" />
          </a>
          <a
            href="https://api.whatsapp.com/send/?phone=%2B6282244503221&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="pay-soc-circle"
          >
            <img src={IconWhatsapp} alt="Whatsapp" />
          </a>
          <a
            href="https://www.facebook.com/laoban.nusantara/"
            target="_blank"
            rel="noopener noreferrer"
            className="pay-soc-circle"
          >
            <img src={IconFacebook} alt="Facebook" />
          </a>
          <div className="pay-soc-circle">
            <img src={IconLink} alt="Link" />
          </div>
          <a
            href="https://www.tiktok.com/@laoban.nusantara"
            target="_blank"
            rel="noopener noreferrer"
            className="pay-soc-circle"
          >
            <img src={IconTiktok} alt="Tiktok" />
          </a>
        </div>
        <div className="pay-copyright">© Copyright Laoban Nusantara.</div>
      </footer>
    </div>
  );
}
