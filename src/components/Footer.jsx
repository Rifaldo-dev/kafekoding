import React from 'react';
import { Users, Trophy, Code, Star } from 'lucide-react';
import { ASSETS, NAVIGATION_ITEMS } from '../data/constants';
import '../css/footer.css';

const Footer = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <footer className="footer">
      <div className="footer-background">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg" 
          alt="World Map" 
          className="footer-background-img"
        />
      </div>
      
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <img src={ASSETS.LOGO} className="footer-logo-img" alt="Logo" />
            <span className="footer-logo-text">KafeKoding</span>
          </div>
          <p className="footer-tagline">"Kami Memilih Turun Tangan"</p>
          <p className="footer-description">
            Wadah bagi talenta IT Sumatera Barat untuk berdiskusi, berkolaborasi, dan membangun solusi digital melalui aksi nyata.
          </p>
        </div>

        <div className="footer-content">
          
          <div className="footer-section">
            <h4 className="footer-section-title">Markas Besar</h4>
            <div className="footer-section-content">
              <p>Jln. Khatib Sulaiman Dalam No. 1</p>
              <p>RW. 006, RT. 004, Kel. Lolong Belanti</p>
              <p>Koto Padang, Padang</p>
              <p>Sumatera Barat 25136</p>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Navigasi</h4>
            <div className="footer-section-content">
              {NAVIGATION_ITEMS.map(item => (
                <button 
                  key={item} 
                  onClick={() => item === 'blog' ? window.location.href = '/blog' : scrollTo(item)} 
                  className="footer-nav-item"
                >
                  {item}
                </button>
              ))}
              <a 
                href="/daftar" 
                className="footer-nav-item"
              >
                Daftar
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Statistik</h4>
            <div className="footer-section-content">
              <div className="footer-stat-item">
                <Users size={16} className="footer-stat-icon" />
                <span>500+ Anggota Aktif</span>
              </div>
              <div className="footer-stat-item">
                <Trophy size={16} className="footer-stat-icon" />
                <span>12 Mentor Ahli</span>
              </div>
              <div className="footer-stat-item">
                <Code size={16} className="footer-stat-icon" />
                <span>50+ Proyek Selesai</span>
              </div>
              <div className="footer-stat-item">
                <Star size={16} className="footer-stat-icon" />
                <span>100% Gratis</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 KafeKoding Community</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;