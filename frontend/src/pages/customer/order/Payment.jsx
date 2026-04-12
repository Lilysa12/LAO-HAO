import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

// --- IMPORT ASSETS ---
import LogoLaoban from '../../../assets/icons/icons-customer/logoLaoban.png';
import IconInstagram from '../../../assets/icons/icons-customer/instagram.png';
import IconWhatsapp from '../../../assets/icons/icons-customer/whatsapp.png';
import IconFacebook from '../../../assets/icons/icons-customer/facebook.png';
import IconLink from '../../../assets/icons/icons-customer/link.png';
import IconTiktok from '../../../assets/icons/icons-customer/tiktok.png';

import IconTunai from '../../../assets/icons/icons-customer/tunai.png';
import IconQris from '../../../assets/icons/icons-customer/qris.png';
import IconGopay from '../../../assets/icons/icons-customer/gopay.png';

// FIX RAHASIA: Nama variabel impornya diubah jadi IconShopee agar tidak bentrok
import IconShopee from '../../../assets/icons/icons-customer/shopee.png';

export default function Payment() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('qris');

  return (
    <div className="pay-container">
      
      {/* ================= HEADER (Hanya Desktop) ================= */}
      <header className="pay-header">
        <div className="pay-logo-box" onClick={() => navigate('/home')} style={{cursor: 'pointer'}}>
          <img src={LogoLaoban} alt="Logo Laoban" className="pay-logo" />
        </div>
      </header>

      {/* ================= TOP BAR ================= */}
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
              <div className="pay-method-left">
                <div className="pay-icon-box">
                  <img src={IconTunai} alt="Tunai" className="pay-method-icon" />
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
              className={`pay-method-card ${selectedMethod === 'qris' ? 'active' : ''}`}
              onClick={() => setSelectedMethod('qris')}
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
              className={`pay-method-card ${selectedMethod === 'gopay' ? 'active' : ''}`}
              onClick={() => setSelectedMethod('gopay')}
            >
              <div className="pay-method-left">
                <div className="pay-icon-box">
                  <img src={IconGopay} alt="GoPay" className="pay-method-icon" />
                </div>
                <span className="pay-method-name">GoPay</span>
              </div>
              <div className="pay-radio-circle">
                <div className="pay-radio-dot"></div>
              </div>
            </div>

            {/* Opsi ShopeePay */}
            <div 
              className={`pay-method-card ${selectedMethod === 'shopee' ? 'active' : ''}`}
              onClick={() => setSelectedMethod('shopee')}
            >
              <div className="pay-method-left">
                <div className="pay-icon-box">
                  {/* FIX: Menggunakan IconShopee yang sudah diimpor dengan benar */}
                  <img src={IconShopee} alt="ShopeePay" className="pay-method-icon" />
                </div>
                <span className="pay-method-name">ShopeePay</span>
              </div>
              <div className="pay-radio-circle">
                <div className="pay-radio-dot"></div>
              </div>
            </div>
          </div>

          {/* --- SUMMARY & BUTTON --- */}
          <div className="pay-summary-box">
            <div className="pay-summary-row">
              <span className="pay-sum-label">Subtotal</span>
              <span className="pay-sum-value">Rp 57.000</span>
            </div>
            <div className="pay-summary-row">
              <span className="pay-sum-label">Pajak Restoran (10%)</span>
              <span className="pay-sum-value">Rp 5.700</span>
            </div>
            
            <div className="pay-summary-row total-row">
              <span className="pay-sum-label-bold">Total Pembayaran</span>
              <span className="pay-sum-total">Rp 62.700</span>
            </div>

            <button 
              className="pay-btn-submit efek-klik"
              onClick={() => {
                navigate('/status'); // <-- REVISI: Sekarang diarahkan ke halaman /status
              }}
            >
              Pilih Pembayaran
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