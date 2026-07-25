import React from 'react';
import { FiArrowUpRight, FiArrowUp, FiSun, FiMoon, FiMail } from 'react-icons/fi';
import { FaInstagram, FaLinkedinIn, FaGithub, FaWhatsapp } from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6';
import "../styles/MainFooter.css";

const MainFooter = ({ theme, toggleTheme, customColor, handleColorChange, onOpenPrivacy, onOpenTerms, onNavClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="main-footer">
      <div className="footer-content-grid">

        {/* Logo and Socials Column */}
        <div className="footer-column logo-column">
          <h2 className="footer-logo">niranj.</h2>
          <div className="footer-socials-list">
            <a href="https://www.instagram.com/cre.a.tor_nj/" target="_blank" rel="noopener noreferrer" className="social-list-item">
              <span className="social-icon-circle"><FaInstagram /></span>
              <span className="social-label">INSTAGRAM</span>
            </a>
            <a href="https://www.linkedin.com/in/niranj-r/" target="_blank" rel="noopener noreferrer" className="social-list-item">
              <span className="social-icon-circle"><FaLinkedinIn /></span>
              <span className="social-label">LINKEDIN</span>
            </a>
            <a href="https://github.com/niranj-r" target="_blank" rel="noopener noreferrer" className="social-list-item">
              <span className="social-icon-circle"><FaGithub /></span>
              <span className="social-label">GITHUB</span>
            </a>
            <a href="mailto:niranj.njai@gmail.com" className="social-list-item">
              <span className="social-icon-circle"><FiMail /></span>
              <span className="social-label">EMAIL</span>
            </a>
            <a href="https://wa.me/919567655760" target="_blank" rel="noopener noreferrer" className="social-list-item">
              <span className="social-icon-circle"><FaWhatsapp /></span>
              <span className="social-label">WHATSAPP</span>
            </a>
          </div>
        </div>

        {/* Pages Column */}
        <div className="footer-column links-column">
          <h3 className="column-title">Pages</h3>
          <ul className="footer-links">
            <li><a href="#!" onClick={(e) => { e.preventDefault(); onNavClick?.('home'); }}>HOME</a></li>
            <li><a href="#!" onClick={(e) => { e.preventDefault(); onNavClick?.('home'); }}>SERVICES</a></li>
            <li><a href="#!" onClick={(e) => { e.preventDefault(); onNavClick?.('about'); }}>ABOUT</a></li>
            <li><a href="#!" onClick={(e) => { e.preventDefault(); onNavClick?.('contact'); }}>CONTACT</a></li>
          </ul>
          <button className="footer-btn">
            CoDEVELOPER <FiArrowUpRight className="footer-btn-icon" />
          </button>
        </div>

        {/* CMS Column */}
        <div className="footer-column links-column">
          <h3 className="column-title">CMS</h3>
          <ul className="footer-links">
            <li><a href="#!" onClick={(e) => { e.preventDefault(); onNavClick?.('work'); }}>WORK</a></li>
            <li><a href="#!" onClick={(e) => { e.preventDefault(); onNavClick?.('blog'); }}>BLOG</a></li>
          </ul>
        </div>

        {/* Utility Pages Column */}
        <div className="footer-column links-column">
          <h3 className="column-title">Miscellaneous</h3>
          <ul className="footer-links">
            <li><a href="#!" onClick={(e) => { e.preventDefault(); onNavClick?.('404'); }}>404 ERROR PAGE</a></li>
            <li><a href="#!" onClick={(e) => { e.preventDefault(); onNavClick?.('specialMentions'); }}>SPECIAL MENTIONS</a></li>
            <li><a href="#!" onClick={(e) => { e.preventDefault(); onOpenPrivacy?.(); }}>PRIVACY POLICY</a></li>
            <li><a href="#!" onClick={(e) => { e.preventDefault(); onOpenTerms?.(); }}>TERMS & CONDITIONS</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Line */}
      <div className="footer-bottom">
        <div className="copyright">
          © 2026 Made by Niranj R. All rights reserved.
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {/*<div className="theme-toggle" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="to-top-text">CHOOSE COLOR</span>
            <div className="to-top-circle" style={{ position: 'relative' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: theme === 'dark' ? '#FF4D00' : customColor }}></div>
              <input 
                type="color" 
                value={theme === 'dark' ? '#FF4D00' : customColor} 
                onChange={handleColorChange}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  padding: 0,
                  border: 'none'
                }}
                title="Choose Color for Light Mode"
              />
            </div>
          </div>*/}

          <div className="theme-toggle" onClick={toggleTheme} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="to-top-text">{theme === 'light' ? 'DARK MODE' : 'LIGHT MODE'}</span>
            <div className="to-top-circle">
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </div>
          </div>

          <div className="to-top" onClick={scrollToTop}>
            <span className="to-top-text">TO TOP</span>
            <div className="to-top-circle">
              <FiArrowUp />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
