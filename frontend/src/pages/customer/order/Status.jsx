import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "./Status.css";
import Loading from '../../../components/Loading'; // <--- IMPORT LOADING

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

  // --- STATE LOADING ---
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data dari Payment (State Routing)
  const selectedMethod = location.state?.selectedMethod || "qris";
  const totalPayment = location.state?.totalPayment || 0;
  const passedOrderId = location.state?.orderId;
  const tableNumber = localStorage.getItem('tableNumber') || "12";

  const isCash = selectedMethod === "tunai";
  
  // Jika tidak ada orderId dari payment, fallback generate baru
  const orderId = passedOrderId || `LHO-${Math.floor(10000 + Math.random() * 90000)}`;

  useEffect(() => {
    // Simulasi loading sebentar agar transisi dari Payment halus
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // =========================================================
  // LOGIKA UNDUH STRUK PESANAN (TXT FILE)
  // =========================================================
  const handleDownloadStruk = () => {
    const historyOrders = JSON.parse(sessionStorage.getItem('laoban_order_history')) || [];
    const currentOrder = historyOrders.find(o => o.id === orderId) || historyOrders[0];

    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    let strukText = `========================================\n`;
    strukText += `            LAOBAN NUSANTARA            \n`;
    strukText += `========================================\n`;
    strukText += `Order ID : ${orderId}\n`;
    strukText += `Tanggal  : ${new Date().toLocaleString('id-ID')}\n`;
    strukText += `Meja     : ${tableNumber}\n`;
    strukText += `Metode   : ${selectedMethod.toUpperCase()}\n`;
    strukText += `Status   : ${isCash ? 'Menunggu Pembayaran Kasir' : 'Lunas (Diproses)'}\n`;
    strukText += `----------------------------------------\n`;
    
    if (currentOrder && currentOrder.items) {
      currentOrder.items.forEach(item => {
        strukText += `${item.name} (x${item.quantity || 1})\n`;
        strukText += `   ${formatRupiah(item.price)}\n`;
      });
    } else {
      strukText += `Total Pembayaran\n`;
    }
    
    strukText += `----------------------------------------\n`;
    strukText += `TOTAL    : ${formatRupiah(currentOrder ? currentOrder.totalPrice : totalPayment)}\n`;
    strukText += `========================================\n`;
    strukText += `      Terima Kasih Atas Kunjungan       \n`;
    strukText += `                 Anda!                  \n`;
    strukText += `========================================\n`;

    const blob = new Blob([strukText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Struk_Laoban_${orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // JIKA SEDANG LOADING, TAMPILKAN KOMPONEN LOADING
  if (isLoading) {
    return <Loading text="Menyelesaikan pesananmu..." />;
  }

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
          <div
            className="st-icon-big"
            style={{ backgroundColor: isCash ? "#F2C94C" : "#356E4E" }}
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
                <circle cx="12" cy="12" r="10"></circle>
              ) : (
                <polyline points="20 6 9 17 4 12"></polyline> 
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

          <div className="st-order-box">
            <div className="st-ob-left">
              <span className="st-ob-label">ORDER ID</span>
              <span className="st-ob-value">{orderId}</span>
            </div>
            <div className="st-ob-divider"></div>
            <div className="st-ob-right">
              <span className="st-ob-label">MEJA</span>
              <span className="st-ob-value-yellow">{tableNumber}</span>
            </div>
          </div>

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
              <p>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          <p className="st-desc">
            {isCash ? (
              <>
                Pesananmu sudah kami catat dengan nomor{" "}
                <strong>{orderId}</strong>.<br />
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
                Yeay, pesananmu sudah masuk dapur!<br />
                Kami akan segera mengantarkan hidangan hangat langsung ke mejamu.
              </>
            )}
          </p>

          <button className="st-btn-download efek-klik" onClick={handleDownloadStruk}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Unduh Struk
          </button>

          <span className="st-link-again" onClick={() => navigate("/order-list")}>
            Pesan Lagi
          </span>
        </div>
      </main>

      <footer className="st-footer">
        <div className="st-socials">
          <div className="st-soc-circle"><img src={IconInstagram} alt="Instagram" /></div>
          <div className="st-soc-circle"><img src={IconWhatsapp} alt="Whatsapp" /></div>
          <div className="st-soc-circle"><img src={IconFacebook} alt="Facebook" /></div>
          <div className="st-soc-circle"><img src={IconLink} alt="Link" /></div>
          <div className="st-soc-circle"><img src={IconTiktok} alt="Tiktok" /></div>
        </div>
        <div className="st-copyright">© Copyright Laoban Nusantara.</div>
      </footer>
    </div>
  );
}