import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../../supabase";
import "./Voucher.css";
import Loading from '../../../components/Loading'; 

export default function Voucher() {
  const navigate = useNavigate();
  const location = useLocation();

  // Tangkap data keranjang dari Checkout
  const cart = location.state?.cart || [];
  const subtotal = location.state?.subtotal || 0;

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("vouchers").select("*");
        if (error) throw error;
        setVouchers(data || []);
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        // Berikan sedikit delay biar animasi loadingnya kelihatan halus
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };
    fetchVouchers();
  }, []);

  // =========================================================
  // LOGIKA VALIDASI SMART VOUCHER
  // =========================================================
  const checkEligibility = (voucher) => {
    // Cek minimal belanja
    if (subtotal < voucher.min_spend) {
      return {
        eligible: false,
        reason: `Minimal belanja Rp ${voucher.min_spend.toLocaleString("id-ID")} belum terpenuhi.`,
      };
    }
    // Cek syarat kategori menu
    if (voucher.category_req) {
      const hasCategory = cart.some(
        (item) =>
          item.category?.toUpperCase() === voucher.category_req.toUpperCase(),
      );
      if (!hasCategory) {
        return {
          eligible: false,
          reason: `Promo ini khusus untuk pesanan menu ${voucher.category_req}.`,
        };
      }
    }
    return { eligible: true };
  };

  const handleClaim = (voucher) => {
    const status = checkEligibility(voucher);
    if (!status.eligible) {
      alert(status.reason);
      return;
    }
    // Jika lolos, bawa voucher kembali ke Checkout
    navigate("/checkout", { state: { cart: cart, appliedVoucher: voucher } });
  };

  // =========================================================
  // TAMPILKAN LOADING JIKA SEDANG FETCH DATA
  // =========================================================
  if (loading) {
    return <Loading text="Mencari promo spesial untukmu..." />;
  }

  return (
    <div className="vo-container">
      <div className="vo-top-bar">
        <button className="vo-back-btn efek-klik" onClick={() => navigate(-1)}>
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
        <h2 className="vo-page-title">Pilih Voucher</h2>
      </div>

      <div className="vo-content">
        <div className="vo-search-box">
          <svg
            className="vo-search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929L20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2ZM10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4Z"></path>
          </svg>
          <input
            type="text"
            placeholder="Cari voucher Laoban..."
            className="vo-search-input"
          />
        </div>

        {/* FITUR POIN SUDAH DIHAPUS DARI SINI */}

        <div className="vo-list">
          {vouchers.map((voucher) => {
            const isEligible = checkEligibility(voucher).eligible;
            const leftText =
              voucher.type === "percent"
                ? `${voucher.amount}%`
                : `${voucher.amount / 1000}rb`;
            const leftSub = voucher.type === "percent" ? "DISKON" : "POTONGAN";

            return (
              <div className="vo-card" key={voucher.id}>
                <div
                  className={`vo-card-left ${voucher.bg_class} ${!isEligible ? "disabled-bg" : ""}`}
                >
                  <strong>{leftText}</strong>
                  <span>{leftSub}</span>
                </div>
                <div className="vo-card-right">
                  <div className="vo-card-text">
                    <h4>{voucher.title}</h4>
                    <p>{voucher.description}</p>
                  </div>
                  <div className="vo-card-bottom">
                    <span className={`vo-badge ${voucher.badge_class}`}>
                      s.d.{" "}
                      {voucher.expiry_date
                        ? new Date(voucher.expiry_date).toLocaleDateString(
                            "id-ID",
                          )
                        : "-"}
                    </span>

                    <button
                      className={`vo-btn-klaim ${!isEligible ? "btn-disabled" : "efek-klik"}`}
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
