import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ASSETS, NAVIGATION_ITEMS } from '../data/constants';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      setIsMenuOpen(false);
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <>
      <div className="scroll-progress-bar">
        <div 
          className="scroll-progress-fill"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo" onClick={() => window.location.href = '/'}>
            <img src={ASSETS.LOGO} alt="Logo" className="navbar-logo-img" />
            <span className="navbar-logo-text">KafeKoding</span>
          </div>
          
          <div className="navbar-menu">
            {NAVIGATION_ITEMS.map(item => (
              <button key={item} onClick={() => scrollTo(item)} className="navbar-menu-item">{item}</button>
            ))}
            <a href="/daftar" className="navbar-cta">Gabung</a>
          </div>

          <button className="navbar-mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="mobile-menu">
          {NAVIGATION_ITEMS.map(item => (
            <button key={item} onClick={() => scrollTo(item)} className="mobile-menu-item">{item}</button>
          ))}
          <a href="/daftar" className="mobile-menu-cta">Daftar</a>
        </div>
      )}
    </>
  );
};

export default Navbar;