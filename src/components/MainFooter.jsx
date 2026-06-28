import React from 'react';
import { FiInstagram, FiTwitter, FiDribbble, FiArrowUpRight, FiArrowUp } from 'react-icons/fi';
import { FaBehance } from 'react-icons/fa';
import './MainFooter.css';

const MainFooter = () => {
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
            <a href="#!" className="social-list-item">
              <span className="social-icon-circle"><FiInstagram /></span>
              <span className="social-label">INSTAGRAM</span>
            </a>
            <a href="#!" className="social-list-item">
              <span className="social-icon-circle"><FiTwitter /></span>
              <span className="social-label">TWITTER</span>
            </a>
            <a href="#!" className="social-list-item">
              <span className="social-icon-circle"><FiDribbble /></span>
              <span className="social-label">DRIBBBLE</span>
            </a>
            <a href="#!" className="social-list-item">
              <span className="social-icon-circle"><FaBehance /></span>
              <span className="social-label">BEHANCE</span>
            </a>
          </div>
        </div>

        {/* Pages Column */}
        <div className="footer-column links-column">
          <h3 className="column-title">Pages</h3>
          <ul className="footer-links">
            <li><a href="#!">HOME</a></li>
            <li><a href="#!">SERVICES</a></li>
            <li><a href="#!">ABOUT</a></li>
            <li><a href="#!">CONTACT</a></li>
          </ul>
          <button className="footer-btn">
            MORE TEMPLATES <FiArrowUpRight className="footer-btn-icon"/>
          </button>
        </div>

        {/* CMS Column */}
        <div className="footer-column links-column">
          <h3 className="column-title">CMS</h3>
          <ul className="footer-links">
            <li><a href="#!">WORK</a></li>
            <li><a href="#!">WORK SINGLE</a></li>
            <li><a href="#!">BLOG</a></li>
            <li><a href="#!">BLOG POST</a></li>
          </ul>
        </div>

        {/* Utility Pages Column */}
        <div className="footer-column links-column">
          <h3 className="column-title">Utility Pages</h3>
          <ul className="footer-links">
            <li><a href="#!">404 ERROR PAGE</a></li>
            <li><a href="#!">PASSWORD PROTECTED</a></li>
            <li><a href="#!">STYLEGUIDE</a></li>
            <li><a href="#!">LICENSING</a></li>
            <li><a href="#!">CHANGELOG</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Line */}
      <div className="footer-bottom">
        <div className="copyright">
          © 2024 Made by Niranj R. All rights reserved.
        </div>
        <div className="to-top" onClick={scrollToTop}>
          <span className="to-top-text">TO TOP</span>
          <div className="to-top-circle">
            <FiArrowUp />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
