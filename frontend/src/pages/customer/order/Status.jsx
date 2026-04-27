import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "./Status.css";
import Loading from '../../../components/Loading'; 

// --- IMPORT PDF MAKER ---
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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
  // LOGIKA UNDUH STRUK PESANAN (PDF FILE)
  // =========================================================
  const handleDownloadStrukPDF = () => {
    const historyOrders = JSON.parse(sessionStorage.getItem('laoban_order_history')) || [];
    const currentOrder = historyOrders.find(o => o.id === orderId) || historyOrders[0];

    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    // Inisialisasi PDF (Format Struk Thermal 80mm)
    // p = portrait, mm = milimeter, [80, 200] = ukuran kertas (lebar 8cm, panjang 20cm)
    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: [80, 200]
    });

    const marginX = 5;
    let cursorY = 10;

    // --- HEADER STRUK ---
    doc.setFont("courier", "bold");
    doc.setFontSize(14);
    doc.text("LAOBAN NUSANTARA", 40, cursorY, { align: "center" });
    cursorY += 4;
    
    doc.setFontSize(10);
    doc.setFont("courier", "normal");
    doc.text("-".repeat(32), 40, cursorY, { align: "center" });
    cursorY += 5;

    // --- INFO PESANAN ---
    doc.setFontSize(9);
    doc.text(`Order ID : ${orderId}`, marginX, cursorY); cursorY += 4;
    doc.text(`Tanggal  : ${new Date().toLocaleString('id-ID')}`, marginX, cursorY); cursorY += 4;
    doc.text(`Meja     : ${tableNumber}`, marginX, cursorY); cursorY += 4;
    doc.text(`Metode   : ${selectedMethod.toUpperCase()}`, marginX, cursorY); cursorY += 4;
    doc.text(`Status   : ${isCash ? 'Menunggu Pembayaran' : 'Lunas (Diproses)'}`, marginX, cursorY); cursorY += 6;

    doc.text("-".repeat(32), 40, cursorY, { align: "center" });
    cursorY += 6;

    // --- DAFTAR ITEM & CATATAN ---
    if (currentOrder && currentOrder.items) {
      currentOrder.items.forEach(item => {
        // Nama Menu & Qty
        doc.setFont("courier", "bold");
        const itemName = `${item.name} (x${item.quantity || 1})`;
        // Jika nama kepanjangan, potong otomatis
        const splitTitle = doc.splitTextToSize(itemName, 70); 
        doc.text(splitTitle, marginX, cursorY);
        cursorY += (splitTitle.length * 4);

        // Cetak Catatan (Jika ada)
        if (item.note && item.note.trim() !== "") {
          doc.setFont("courier", "italic");
          doc.setFontSize(8);
          // Menggunakan warna abu-abu gelap untuk catatan
          doc.setTextColor(80, 80, 80); 
          const splitNote = doc.splitTextToSize(`Catatan: ${item.note}`, 65);
          doc.text(splitNote, marginX + 3, cursorY);
          cursorY += (splitNote.length * 4);
          doc.setTextColor(0, 0, 0); // Kembalikan ke warna hitam
          doc.setFontSize(9);
        }

        // Harga
        doc.setFont("courier", "normal");
        const priceStr = formatRupiah(item.price * (item.quantity || 1));
        doc.text(priceStr, 75, cursorY, { align: "right" });
        cursorY += 6;
      });
    } else {
      doc.setFont("courier", "bold");
      doc.text("Total Pembayaran", marginX, cursorY); cursorY += 6;
    }

    doc.setFont("courier", "normal");
    doc.text("-".repeat(32), 40, cursorY, { align: "center" });
    cursorY += 6;

    // --- TOTAL ---
    doc.setFontSize(10);
    doc.setFont("courier", "bold");
    doc.text("TOTAL", marginX, cursorY);
    const finalTotal = formatRupiah(currentOrder ? currentOrder.totalPrice : totalPayment);
    doc.text(finalTotal, 75, cursorY, { align: "right" });
    cursorY += 8;

    doc.setFontSize(9);
    doc.setFont("courier", "normal");
    doc.text("=".repeat(32), 40, cursorY, { align: "center" });
    cursorY += 6;

    // --- FOOTER ---
    doc.setFontSize(8);
    doc.text("Terima Kasih Atas Kunjungan", 40, cursorY, { align: "center" }); cursorY += 4;
    doc.text("Anda!", 40, cursorY, { align: "center" });

    // Menyimpan dan mendownload PDF
    doc.save(`Struk_Laoban_${orderId}.pdf`);
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

          <button className="st-btn-download efek-klik" onClick={handleDownloadStrukPDF}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Unduh Struk PDF
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
