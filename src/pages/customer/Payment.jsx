import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

// --- IMPORT ASSETS (Jalur sudah diperbaiki) ---
import LogoLaoban from '../../assets/icons/icons-customer/logoLaoban.png';
import IconInstagram from '../../assets/icons/icons-customer/instagram.png';
import IconWhatsapp from '../../assets/icons/icons-customer/whatsapp.png';
import IconFacebook from '../../assets/icons/icons-customer/facebook.png';
import IconLink from '../../assets/icons/icons-customer/link.png';
import IconTiktok from '../../assets/icons/icons-customer/tiktok.png';

// Import Icon Payment (Jalur sudah diperbaiki)
import IconTunai from '../../assets/icons/icons-customer/tunai.png';
import IconQris from '../../assets/icons/icons-customer/qris.png';
import IconGopay from '../../assets/icons/icons-customer/gopay.png';

export default function Payment() {
  const navigate = useNavigate();
  // State untuk menyimpan metode pembayaran yang dipilih (Default: QRIS)
  const [selectedMethod, setSelectedMethod] = useState('qris');

  return (
    <div className="pay-container">
      
      {/* ================= HEADER ================= */}
      <header className="pay-header">
        <div className="pay-logo-box">
          <img src={LogoLaoban} alt="Logo Laoban" className="pay-logo" />
        </div>
        <nav className="pay-nav-links">
          <a href="#" className="active">Home</a>
          <a href="#">About</a>
          <a href="#">Menu</a>
          <a href="#">Our Partner</a>
          <a href="#">Partnership</a>
        </nav>
        <div style={{ width: '100px' }}></div>
      </header>

      {/* ================= TOP BAR (BACK & TITLE) ================= */}
      <div className="pay-top-bar">
        <button className="pay-back-btn efek-klik" onClick={() => navigate(-1)}>
          &lt;
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
              className={`pay-method-card ${selectedMethod === 'tunai' ? 'active' : ''}`}
              onClick={() => setSelectedMethod('tunai')}
            >
              <img src={IconTunai} alt="Tunai" className="pay-method-icon" />
              <span className="pay-method-name">Bayar di kasir</span>
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
              className={`pay-method-card ${selectedMethod === 'qris' ? 'active' : ''}`}
              onClick={() => setSelectedMethod('qris')}
            >
              <img src={IconQris} alt="QRIS" className="pay-method-icon" />
              <span className="pay-method-name">QRIS</span>
              <div className="pay-radio-circle">
                <div className="pay-radio-dot"></div>
              </div>
            </div>

            {/* Opsi GoPay */}
            <div 
              className={`pay-method-card ${selectedMethod === 'gopay' ? 'active' : ''}`}
              onClick={() => setSelectedMethod('gopay')}
            >
              <img src={IconGopay} alt="GoPay" className="pay-method-icon" />
              <span className="pay-method-name">GoPay</span>
              <div className="pay-radio-circle">
                <div className="pay-radio-dot"></div>
              </div>
            </div>
          </div>

          {/* --- SUMMARY & BUTTON --- */}
          <div className="pay-summary-box">
            <div className="pay-total-row">
              <span className="pay-total-label">Total Akhir</span>
              <span className="pay-total-value">Rp 42.000</span>
            </div>
            
            <button 
              className="pay-btn-submit efek-klik"
              onClick={() => {
                alert(`Pesanan Berhasil Diproses dengan metode: ${selectedMethod.toUpperCase()}`);
                navigate('/'); // Kembali ke Home setelah bayar
              }}
            >
              Bayar Sekarang 
              {/* Icon Check SVG sederhana */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px'}}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </button>
          </div>

        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="pay-footer">
        <div className="pay-socials">
          <div className="pay-soc-circle"><img src={IconInstagram} alt="Instagram" /></div>
          <div className="pay-soc-circle"><img src={IconWhatsapp} alt="Whatsapp" /></div>
          <div className="pay-soc-circle"><img src={IconFacebook} alt="Facebook" /></div>
          <div className="pay-soc-circle"><img src={IconLink} alt="Link" /></div>
          <div className="pay-soc-circle"><img src={IconTiktok} alt="Tiktok" /></div>
        </div>
        <div className="pay-copyright">
          © Copyright Laoban Nusantara.
        </div>
      </footer>

    </div>
  );
}