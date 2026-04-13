import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Voucher.css';

export default function Voucher() {
  const navigate = useNavigate();
  const location = useLocation();

  // Tangkap data keranjang dari Checkout
  const cart = location.state?.cart || [];
  const subtotal = location.state?.subtotal || 0;

  // =========================================================
  // DATA MASTER VOUCHER
  // =========================================================
  const voucherList = [
    {
      id: 'V1',
      type: 'percent',
      amount: 10,
      title: 'Diskon Semua Menu',
      desc: 'Min. belanja Rp 50.000',
      minSpend: 50000,
      categoryReq: null, // Berlaku untuk semua
      badgeText: 'Berlaku s.d. 30 Nov 2026',
      badgeClass: 'badge-red',
      bgClass: 'bg-darkred',
      leftText: '10%',
      leftSub: 'DISKON'
    },
    {
      id: 'V2',
      type: 'percent',
      amount: 5,
      title: 'Diskon Khusus Dimsum',
      desc: 'Min. belanja Rp 30.000',
      minSpend: 30000,
      categoryReq: 'DIMSUM', // HANYA BISA JIKA ADA DIMSUM
      badgeText: 'Berlaku s.d. 25 Nov 2026',
      badgeClass: 'badge-orange',
      bgClass: 'bg-olive',
      leftText: '5%',
      leftSub: 'DISKON'
    },
    {
      id: 'V3',
      type: 'fixed',
      amount: 15000,
      title: 'Potongan Pengguna Baru',
      desc: 'Min. belanja Rp 100.000',
      minSpend: 100000,
      categoryReq: null,
      badgeText: 'Berlaku s.d. 12 Des 2026',
      badgeClass: 'badge-green',
      bgClass: 'bg-darkgreen',
      leftText: '15rb',
      leftSub: 'POTONGAN'
    }
  ];

  // =========================================================
  // LOGIKA VALIDASI SMART VOUCHER
  // =========================================================
  const checkEligibility = (voucher) => {
    // Cek minimal belanja
    if (subtotal < voucher.minSpend) {
      return { eligible: false, reason: `Minimal belanja Rp ${voucher.minSpend.toLocaleString('id-ID')} belum terpenuhi.` };
    }
    // Cek syarat kategori menu (Contoh: Harus ada Dimsum)
    if (voucher.categoryReq) {
      const hasCategory = cart.some(item => item.category === voucher.categoryReq);
      if (!hasCategory) {
        return { eligible: false, reason: `Promo ini khusus untuk pesanan menu ${voucher.categoryReq}.` };
      }
    }
    return { eligible: true };
  };

  const handleClaim = (voucher) => {
    const status = checkEligibility(voucher);
    if (!status.eligible) {
      alert(status.reason); // Tampilkan alasan kenapa ditolak
      return;
    }
    // Jika lolos, bawa voucher kembali ke Checkout
    navigate('/checkout', { state: { cart: cart, appliedVoucher: voucher } });
  };

  return (
    <div className="vo-container">
      
      <div className="vo-top-bar">
        <button className="vo-back-btn efek-klik" onClick={() => navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
          </svg>
        </button>
        <h2 className="vo-page-title">Pilih Voucher</h2>
      </div>

      <div className="vo-content">
        
        <div className="vo-search-box">
          <svg className="vo-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929L20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2ZM10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4Z"></path>
          </svg>
          <input type="text" placeholder="Cari voucher Laoban..." className="vo-search-input" />
        </div>

        <div className="vo-points-card">
          <div className="vo-points-left">
            <div className="vo-points-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="#000000">
                <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
              </svg>
            </div>
            <div className="vo-points-text">
              <span>POIN KAMU</span>
              <strong>1.250 pts</strong>
            </div>
          </div>
          <button className="vo-btn-tukarkan efek-klik">Tukarkan</button>
        </div>

        {/* LIST VOUCHER DENGAN SPACING LEBIH LEGA */}
        <div className="vo-list">
          {voucherList.map((voucher) => {
            const isEligible = checkEligibility(voucher).eligible;
            
            return (
              <div className="vo-card" key={voucher.id}>
                <div className={`vo-card-left ${voucher.bgClass} ${!isEligible ? 'disabled-bg' : ''}`}>
                  <strong>{voucher.leftText}</strong>
                  <span>{voucher.leftSub}</span>
                </div>
                <div className="vo-card-right">
                  <div className="vo-card-text">
                    <h4>{voucher.title}</h4>
                    <p>{voucher.desc}</p>
                  </div>
                  <div className="vo-card-bottom">
                    <span className={`vo-badge ${voucher.badgeClass}`}>{voucher.badgeText}</span>
                    
                    <button 
                      className={`vo-btn-klaim ${!isEligible ? 'btn-disabled' : 'efek-klik'}`} 
                      onClick={() => handleClaim(voucher)}
                    >
                      Klaim
                    </button>
                    
                  </div>
                </div>
              </div>
            );
          })}

          <div className="vo-promo-banner efek-klik-kartu">
            <span className="vo-banner-tag">PROMO SPESIAL</span>
            <h3>Nikmati Diskon Hingga 20% di Jam Istirahat</h3>
          </div>

        </div>
      </div>
    </div>
  );
}