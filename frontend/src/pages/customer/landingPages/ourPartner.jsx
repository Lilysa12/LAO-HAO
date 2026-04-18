import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './ourPartner.css';

// --- IMPORT ASSETS HEADER & FOOTER ---
import LogoLaoban from '../../../assets/icons/icons-customer/LogoLaoban.png'; 
import IconInstagram from '../../../assets/icons/icons-customer/Instagram.png'; 
import IconWhatsapp from '../../../assets/icons/icons-customer/Whatsapp.png'; 
import IconFacebook from '../../../assets/icons/icons-customer/facebook.png'; 
import IconLink from '../../../assets/icons/icons-customer/Link.png'; 
import IconTiktok from '../../../assets/icons/icons-customer/Tiktok.png'; 
import IconMessage from '../../../assets/icons/Message.png'; 
import IconCall from '../../../assets/icons/Call.png'; 

// --- FIX ICON LEAFLET (Mengatasi bug icon hilang di React) ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- DATABASE CABANG LAOBAN ---
const branchData = [
  { id: 1, name: 'Laoban Kopitiam Tebet', city: 'Jakarta Selatan', address: 'Jl. Tebet Barat VIII No. 5', phone: '082266489282', hours: '07.00 - 22.00', mapLink: 'https://www.google.com/maps?q=Laoban+Tebet', lat: -6.240, lng: 106.840, facilities: ['Wifi', 'Indoor', 'Outdoor', 'Parking', 'VIP Room'], img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80' },
  { id: 2, name: 'Laoban Kopitiam SCBD', city: 'Jakarta Selatan', address: 'SCBD Park Lot 6, Jl. Jend. Sudirman', phone: '081234567891', hours: '07.00 - 22.00', mapLink: 'https://www.google.com/maps?q=Laoban+SCBD+Park', lat: -6.225, lng: 106.808, facilities: ['Indoor dining', 'Modern kopitiam', 'Wifi'], img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80' },
  { id: 3, name: 'Laoban Kopitiam Cilandak', city: 'Jakarta Selatan', address: 'Jl. Margasatwa Raya No. 47A', phone: '081234567892', hours: '07.00 - 22.00', mapLink: 'https://www.google.com/maps?q=Laoban+Cilandak', lat: -6.290, lng: 106.810, facilities: ['Wifi', 'Parking Space', 'Outdoor'], img: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80' },
  { id: 4, name: 'Laoban Kopitiam Kelapa Gading', city: 'Jakarta Utara', address: 'Jl. Summagung III Blok N2', phone: '081234567893', hours: '07.00 - 22.00', mapLink: 'https://www.google.com/maps?q=Laoban+Kelapa+Gading', lat: -6.150, lng: 106.900, facilities: ['Wifi', 'Indoor', 'Parking'], img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80' },
  { id: 5, name: 'Laoban Kopitiam Margonda', city: 'Depok', address: 'Jl. Margonda Raya No. 477, Beji', phone: '081234567894', hours: '07.00 - 22.00', mapLink: 'https://www.google.com/maps?q=Laoban+Margonda+Depok', lat: -6.390, lng: 106.830, facilities: ['Wifi', 'Smoking Area', 'Parking'], img: 'https://images.unsplash.com/photo-1521017432531-fbd92076e512?w=600&q=80' },
  { id: 6, name: 'Laoban Kopitiam Kemang Pratama', city: 'Bekasi', address: 'Ruko Kemang Pratama Blok AN No. 6', phone: '081234567895', hours: '07.00 - 22.00', mapLink: 'https://www.google.com/maps?q=Laoban+Kemang+Pratama+Bekasi', lat: -6.240, lng: 107.000, facilities: ['Wifi', 'Indoor', 'Outdoor'], img: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&q=80' },
  { id: 7, name: 'Laoban Kopitiam Suryakencana', city: 'Bogor', address: 'Jl. Suryakencana No. 178, Bogor Tengah', phone: '081234567896', hours: '07.00 - 22.00', mapLink: 'https://www.google.com/maps?q=Laoban+Suryakencana+Bogor', lat: -6.600, lng: 106.800, facilities: ['Heritage Building', 'Wifi', 'Indoor'], img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80' },
  { id: 8, name: 'Laoban Kopitiam Suhat, Malang (Pusat)', city: 'Suhat, Malang', address: 'Jl. Soekarno Hatta No. 123, Lowokwaru', phone: '081234567890', hours: '07.00 - 22.00', mapLink: 'https://www.google.com/maps?q=Laoban+Kalipah+Apo+Bandung', lat: -7.940, lng: 112.620, facilities: ['Free Wifi', 'Parking Space', 'Outdoor Seating', 'Smoking Area'], img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80' },
  { id: 9, name: 'Laoban Kopitiam Binus Malang', city: 'Binus Malang', address: 'Jl. Araya Mansion No. 8', phone: '081234567898', hours: '07.00 - 22.00', mapLink: 'https://www.google.com/maps?q=Laoban+Supratman+Bandung', lat: -7.930, lng: 112.650, facilities: ['Wifi', 'Outdoor Seating', 'Parking'], img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80' },
  { id: 10, name: 'Laoban Kopitiam Wiyung', city: 'Wiyung Surabaya', address: 'Jl. Raya Wiyung No. 499', phone: '081234567901', hours: '07.00 - 22.00', mapLink: 'https://www.google.com/maps?q=Laoban+Wiyung', lat: -7.310, lng: 112.700, facilities: ['Wifi', 'Indoor', 'Parking'], img: 'https://images.unsplash.com/photo-1521017432531-fbd92076e512?w=600&q=80' },
  { id: 11, name: 'Laoban Kopitiam Mulyosari', city: 'Mulyosari Surabaya', address: 'Jl. Raya Mulyosari No. 166', phone: '081234567900', hours: '07.00 - 22.00', mapLink: 'https://www.google.com/maps?q=Laoban+Mulyosari', lat: -7.260, lng: 112.800, facilities: ['Wifi', 'Indoor', 'Smoking Area'], img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80' },
  { id: 12, name: 'Laoban Kopitiam Baratajaya', city: 'Baratajaya Surabaya', address: 'Jl. Barata Jaya XIX No. 61', phone: '081234567899', hours: '07.00 - 22.00', mapLink: 'https://www.google.com/maps?q=Laoban+Gubeng+Surabaya', lat: -7.280, lng: 112.750, facilities: ['Wifi', 'Indoor', 'Parking'], img: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80' },
  { id: 13, name: 'Laoban Kopitiam Cirebon', city: 'Kertawinangun, Cirebon', address: 'Jl. Kertawinangun No. 45', phone: '081805016868', hours: '07.00 - 22.00', mapLink: 'https://www.google.com/maps?q=Laoban+Tegal', lat: -6.730, lng: 108.550, facilities: ['Wifi', 'Indoor', 'Parking'], img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80' },
];

export default function OurPartner() { 
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Filter cabang berdasarkan pencarian
  const filteredBranches = branchData.filter(branch => 
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    branch.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animasi Scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.15 }); 
    const hiddenElements = document.querySelectorAll('.fade-in-up');
    hiddenElements.forEach((el) => observer.observe(el));
    return () => hiddenElements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div className="op-container">
      
      {/* ================= 1. NAVBAR ================= */}
      <nav className="navbar fade-in-up">
        <div className="logo-box" onClick={() => navigate('/home')} style={{cursor: 'pointer'}}>
          <img src={LogoLaoban} alt="Logo Laoban" className="logo-img" />
        </div>
        <div className="nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/menu'); }}>Menu</a>
          <a href="#" onClick={(e) => { e.preventDefault(); }} className="active">Our Partner</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/partnership'); }}>Partnership</a>
        </div>
        <button className="btn-red" onClick={() => navigate('/order')}>Pesan Sekarang</button>
      </nav>

      <main className="op-main-content fade-in-up delay-1">
        
        {/* ================= HEADER TITLE & SEARCH ================= */}
        <section className="op-header-section">
          <h1 className="op-title">Kunjungi Lokasi Kami!</h1>
          <p className="op-subtitle">Temukan kehangatan rasa otentik Kopitiam di cabang terdekat Anda.</p>
          
          <div className="op-search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C757D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Cari kota atau nama cabang..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        {/* ================= MAP SECTION (REACT-LEAFLET) ================= */}
        <section className="op-map-wrapper fade-in-up">
          {/* FIX: scrollWheelZoom={true} agar peta bisa di zoom pakai scroll mouse/touch */}
          <MapContainer center={[-6.200000, 106.816666]} zoom={6} scrollWheelZoom={true} className="op-map-container">
            <TileLayer
              attribution='© OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredBranches.map((branch) => (
              <Marker key={branch.id} position={[branch.lat, branch.lng]}>
                <Popup>
                  <strong style={{color: '#A00500'}}>{branch.name}</strong><br />
                  {branch.city}
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="op-map-widget">
            <div className="op-widget-icon">
              {/* Ikon Store Kuning */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#750300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div className="op-widget-text">
              <span>KEHADIRAN KAMI</span>
              <h4>Total Cabang: {branchData.length} Lokasi</h4>
            </div>
          </div>
        </section>

        {/* ================= CARD SLIDER SECTION ================= */}
        <section className="op-list-section fade-in-up">
          <div className="op-list-header">
            <div className="op-yellow-line-vert"></div>
            <h2>Daftar Cabang Perguruan Laoban</h2>
          </div>

          <div className="op-card-slider">
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch) => (
                <div key={branch.id} className="op-card" onClick={() => setSelectedBranch(branch)}>
                  <div className="op-card-img-wrap">
                    <img src={branch.img} alt={branch.name} className="op-card-img" />
                  </div>
                  <div className="op-card-body">
                    <h3 className="op-card-title">{branch.name}</h3>
                    <p className="op-card-city">{branch.city}</p>
                    <a href={branch.mapLink} target="_blank" rel="noreferrer" className="op-card-link" onClick={(e) => e.stopPropagation()}>
                      🗺️ Lihat di Google Maps
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p style={{textAlign: 'center', width: '100%', color: '#6C757D', gridColumn: '1/-1'}}>Cabang tidak ditemukan.</p>
            )}
          </div>
        </section>
      </main>

      {/* ================= MODAL DETAIL CABANG ================= */}
      {selectedBranch && (
        <div className="op-modal-overlay" onClick={() => setSelectedBranch(null)}>
          <div className="op-modal-box fade-in-up is-visible" onClick={(e) => e.stopPropagation()}>
            
            <button className="op-modal-close" onClick={() => setSelectedBranch(null)}>✕</button>
            
            <div className="op-modal-header-img">
              <img src={selectedBranch.img} alt={selectedBranch.name} />
              <div className="op-badge-open">✓ Buka Sekarang</div>
            </div>

            <div className="op-modal-content">
              <h2 className="op-modal-title">{selectedBranch.name}</h2>
              <p className="op-modal-subtitle">🏬 Pusat Heritage</p>

              <div className="op-modal-grid">
                <div className="op-modal-col">
                  <h5>📍 ALAMAT</h5>
                  <p>{selectedBranch.address},<br/>{selectedBranch.city}</p>
                </div>
                <div className="op-modal-col">
                  <h5>🕒 JAM OPERASIONAL</h5>
                  <p>Senin - Minggu<br/>{selectedBranch.hours}</p>
                  
                  <h5 style={{marginTop: '15px'}}>📞 KONTAK</h5>
                  <p>+62 {selectedBranch.phone}</p>
                </div>
              </div>

              <div className="op-modal-facilities">
                <h5>☕ FASILITAS</h5>
                <div className="op-fac-list">
                  {selectedBranch.facilities.map((fac, idx) => (
                    <span key={idx} className="op-fac-badge">{fac}</span>
                  ))}
                </div>
              </div>

              <div className="op-modal-footer">
                <p>Siap melayani Anda.</p>
                <button className="btn-red" onClick={() => window.open(selectedBranch.mapLink, '_blank')}>
                  ↱ Petunjuk Arah
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER MODERN ================= */}
      <footer className="footer-modern fade-in-up delay-1">
        <div className="foot-grid">
          <div className="foot-brand">
            <img src={LogoLaoban} alt="Logo Laoban" className="logo-img" style={{marginBottom: '15px', cursor: 'pointer'}} onClick={() => navigate('/home')} />
            <p>Menyajikan hidangan dan minuman khas Kopitiam Nusantara dengan bahan premium, kebersihan terjaga, dan resep rahasia Uncle Osh.</p>
            <div className="socials-colored">
               <div className="soc-colored"><img src={IconInstagram} alt="Instagram" className="soc-img" /></div>
               <div className="soc-colored"><img src={IconTiktok} alt="Tiktok" className="soc-img" /></div>
               <div className="soc-colored"><img src={IconWhatsapp} alt="Whatsapp" className="soc-img" /></div>
            </div>
          </div>
          
          <div className="foot-links">
            <h4>Navigasi</h4>
            <ul>
              <li onClick={() => navigate('/home')} style={{cursor: 'pointer'}}>Home</li>
              <li onClick={() => navigate('/about')} style={{cursor: 'pointer'}}>Tentang Kami</li>
              <li onClick={() => navigate('/menu')} style={{cursor: 'pointer'}}>Menu Perguruan</li>
              <li onClick={() => navigate('/our-partner')} style={{cursor: 'pointer'}}>Daftar Cabang</li>
            </ul>
          </div>
          
          <div className="foot-links">
            <h4>Kemitraan</h4>
            <ul>
              <li onClick={() => navigate('/partnership')} style={{cursor: 'pointer'}}>Info Franchise</li>
              <li onClick={() => navigate('/partnership')} style={{cursor: 'pointer'}}>Proposal Bisnis</li>
              <li onClick={() => navigate('/partnership')} style={{cursor: 'pointer'}}>Hubungi Sales</li>
            </ul>
          </div>
          
          <div className="foot-links">
            <h4>Hubungi Kami</h4>
            <ul className="contact-list contact-modern">
              <li><img src={IconMessage} alt="Email" className="contact-icon" /> <span className="contact-info contact-link">hello@laobannusantara.com</span></li>
              <li><img src={IconCall} alt="Phone" className="contact-icon" /> <span className="contact-info contact-bold">+62 812 3456 7890</span></li>
            </ul>
          </div>
        </div>
        
        <div className="foot-bottom">
          <p>© 2026 Laoban by Uncle Osh. All rights reserved.</p>
          <p>Kebijakan Privasi &nbsp;&nbsp;•&nbsp;&nbsp; Syarat & Ketentuan</p>
        </div>
      </footer>

    </div>
  );
}