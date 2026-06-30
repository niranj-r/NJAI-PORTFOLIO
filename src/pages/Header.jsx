import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import logo from "../assets/logo.png"; // 🔸 replace with your logo path

export default function Header({ onNavClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, viewName, isAnchor = false) => {
    setMobileMenuOpen(false);
    if (onNavClick && viewName) {
      e.preventDefault();
      onNavClick(viewName);
    }
  };

  return (
    <header className={`header-container ${isScrolled ? 'scrolled' : ''}`}>
      <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        
        {/* Brand / Logo (Left) */}
        <div className="header-brand">
          <a 
            href="#home"
            className="brand-logo"
            onClick={(e) => handleLinkClick(e, 'home')}
          >
            <img src={logo} alt="Logo" />
          </a>
          <button 
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Navigation Menu (Center) */}
        <ul className={`header-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <li>
            <a 
              href="#skills"
              onClick={(e) => handleLinkClick(e, null, true)}
            >
              SERVICES
            </a>
          </li>
          <li>
            <a 
              href="#projects"
              onClick={(e) => handleLinkClick(e, null, true)}
            >
              WORK
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              onClick={(e) => handleLinkClick(e, 'about')}
            >
              ABOUT
            </a>
          </li>
          <li>
            <a 
              href="#blog"
              onClick={(e) => handleLinkClick(e, 'blog')}
            >
              BLOG
            </a>
          </li>
        </ul>

        {/* CTA (Right) */}
        <div className={`header-cta ${mobileMenuOpen ? 'open' : ''}`}>
          <a 
            href="#contact"
            className="lets-talk-btn"
            onClick={(e) => handleLinkClick(e, 'contact')}
          >
            <span className="btn-text">Get in touch</span>
            <span className="btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </a>
        </div>

      </nav>
    </header>
  );
}
