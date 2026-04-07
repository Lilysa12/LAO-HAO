import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

// --- IMPORT ICONS (FIX JALUR: Sesuai persis dengan huruf besar/kecil di folder) ---
import LogoLaoban from '../../assets/icons/icons-customer/LogoLaoban.png'; // L besar
import IconInstagram from '../../assets/icons/icons-customer/Instagram.png'; // I besar
import IconWhatsapp from '../../assets/icons/icons-customer/Whatsapp.png'; // W besar
import IconFacebook from '../../assets/icons/icons-customer/facebook.png'; // f kecil (khusus ini)
import IconLink from '../../assets/icons/icons-customer/Link.png'; // L besar
import IconTiktok from '../../assets/icons/icons-customer/Tiktok.png'; // T besar

// --- IMPORT GAMBAR ABOUT (FIX JALUR: Sesuaikan dengan nama file) ---
import ImgHistory from '../../assets/home/image1.png'; 
import ImgFounder from '../../assets/home/image2.png'; 

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="ab-container">
      
      {/* ================= HEADER NAVBAR ================= */}
      <header className="ab-header">
        <div className="ab-logo-box" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          <img src={LogoLaoban} alt="Logo Laoban" className="ab-logo" />
        </div>
        <nav className="ab-nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>Home</a>
          <a href="#" className="active">About</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/menu'); }}>Menu</a>
          <a href="#">Our Partner</a>
          <a href="#">Partnership</a>
        </nav>
        <div style={{ width: '100px' }}></div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="ab-main-content">
        
        {/* --- SECTION 1: HISTORY --- */}
        <section className="ab-section ab-history slide-up">
          <div className="ab-text-area">
            <div className="ab-label-wrapper">
              <span className="ab-line"></span>
              <span className="ab-label">ABOUT US</span>
            </div>
            <h1 className="ab-title">HISTORY LAOBAN<br/>NUSANTARA</h1>
            
            <p className="ab-desc">
              Berawal dari kegelisahan sang owner dan istri yang mencari rasa otentik kopitiam untuk warga lokal, LAO BAN terlahir untuk mengungkap bakat masak terpendam sang owner. Melalui survei dari Singapura hingga Malaysia, kami menyempurnakan resep makanan, mengolah bumbu non-asli Indonesia tanpa campuran non-halal tentu menjadi tantangan untuk owner LAO BAN dalam perjalanan mencari jati diri. Mengolah kelapa hingga menjadi selai kaya, hingga kini masih menjadi andalan para laoban menjadi titik klimaks dalam pencarian jati diri LAO BAN.
            </p>
            <p className="ab-desc">
              Hingga pada akhirnya penentuan tgl diputuskan, waktu yg tidak terasa habis untuk merekrut para crew dan tepat pada tgl 20 training pertama bersama 5 crew "babat alas" pun dimulai 3 hari berlalu di hari ke 4 kita memutuskan untuk membuka LAO BAN untuk pertama kali nya. Hari demi hari tidak terasa adrenalin para crew dan owner semakin terguncang bertubi tubi karena derasnya antusias para predator makanan asia.
            </p>
            <p className="ab-desc">
              Hujatan, pujian, review buruk, cust langganan sampai hatters bayaran semua Menjadikan cambuk untuk LAO BAN terpacu jadi semakin besar dan dikenal banyak orang. sebagai pemanfaat situasi dan pembidik jitu tidak afdal jika LAO BAN mecampakkan platform ig dan tiktok.
            </p>
            <p className="ab-desc">
              Perjalanan kisah jatuh bangun warga tiktok yg fyp menjadi kiblat LAO BAN untuk membuat cuplikan cerita singkat proses pendakian kedai ini. Semakin fyp semakin banyak orang kepo dan fomo terhadap LAO BAN dan yg akhirnya bisa membuat LAO BAN buka cabang di kota kota besar lainnya.
            </p>
          </div>
          
          <div className="ab-img-area">
            <img src={ImgHistory} alt="Sejarah Laoban" className="ab-main-img" />
          </div>
        </section>

        {/* --- SECTION 2: FOUNDER --- */}
        <section className="ab-section ab-founder slide-up delay-1">
          <div className="ab-img-area">
            <div className="ab-founder-card">
              <img src={ImgFounder} alt="Alvin Osh" className="ab-founder-img" />
              <div className="ab-founder-info">
                <h3>Alvin Osh</h3>
                <p>CEO</p>
              </div>
            </div>
          </div>

          <div className="ab-text-area founder-text">
            <div className="ab-label-wrapper">
              <span className="ab-label red-text">FOUNDER LAOBAN NUSANTARA</span>
            </div>
            <h1 className="ab-title">ALVIN OSH</h1>
            
            <p className="ab-desc">
              Jadilah bagian dari keluarga besar Laoban Nusantara. Bertumbuh bersama memajukan industri F&B di Indonesia.
            </p>
            <p className="ab-desc">
              Yuk Mampir ke Outlet terdekat kami, Udah Cobain Menu-menu terbaru dari Laoban Nusantara belum???
            </p>
          </div>
        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="ab-footer">
        <div className="ab-socials">
          <div className="ab-soc-circle"><img src={IconInstagram} alt="Instagram" /></div>
          <div className="ab-soc-circle"><img src={IconWhatsapp} alt="Whatsapp" /></div>
          <div className="ab-soc-circle"><img src={IconFacebook} alt="Facebook" /></div>
          <div className="ab-soc-circle"><img src={IconLink} alt="Link" /></div>
          <div className="ab-soc-circle"><img src={IconTiktok} alt="Tiktok" /></div>
        </div>
        
        <div className="ab-footer-logo-box" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          <img src={LogoLaoban} alt="Logo Laoban" className="ab-footer-logo" />
        </div>

        <div className="ab-copyright">
          © Copyright Laoban Nusantara.
        </div>
      </footer>

    </div>
  );
}