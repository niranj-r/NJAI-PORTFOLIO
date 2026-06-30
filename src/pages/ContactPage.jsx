import React from 'react';
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import { FaInstagram, FaTwitter, FaFacebookF, FaBehance, FaDribbble, FaPinterestP } from 'react-icons/fa';
import "../styles/ContactPage.css";
import heroImage from '../assets/hero.png';

const ContactPage = ({ onBack }) => {
  return (
    <div className="contact-page">
      <div className="contact-header-controls">
        <button className="contact-back-button" onClick={onBack}>
          <FiArrowLeft /> Back to Home
        </button>
      </div>

      <div className="contact-container">
        {/* Left Side: Image */}
        <div className="contact-left">
          <img 
            src={heroImage} 
            alt="Portrait" 
            className="contact-portrait" 
          />
        </div>
        
        {/* Right Side: Form & Socials */}
        <div className="contact-right">
          <div className="contact-form-block">
            <span className="contact-label">CONTACT</span>
            <h2 className="contact-title">Let's get in touch.</h2>
            
            <form className="contact-form">
              <input type="text" placeholder="NAME" className="contact-input" />
              <input type="email" placeholder="EMAIL" className="contact-input" />
              <textarea placeholder="MESSAGE" className="contact-textarea" rows="4"></textarea>
              <button type="button" className="contact-submit">SEND MESSAGE</button>
            </form>
          </div>
          
          <div className="contact-socials-grid">
            <a href="#!" className="contact-social-item">
              <FaInstagram className="social-icon" />
              <span className="social-text">INSTAGRAM</span>
              <FiArrowUpRight className="social-arrow" />
            </a>
            <a href="#!" className="contact-social-item">
              <FaTwitter className="social-icon" />
              <span className="social-text">TWITTER</span>
              <FiArrowUpRight className="social-arrow" />
            </a>
            <a href="#!" className="contact-social-item">
              <FaFacebookF className="social-icon" />
              <span className="social-text">FACEBOOK</span>
              <FiArrowUpRight className="social-arrow" />
            </a>
            <a href="#!" className="contact-social-item">
              <FaBehance className="social-icon" />
              <span className="social-text">BEHANCE</span>
              <FiArrowUpRight className="social-arrow" />
            </a>
            <a href="#!" className="contact-social-item">
              <FaDribbble className="social-icon" />
              <span className="social-text">DRIBBBLE</span>
              <FiArrowUpRight className="social-arrow" />
            </a>
            <a href="#!" className="contact-social-item">
              <FaPinterestP className="social-icon" />
              <span className="social-text">PINTEREST</span>
              <FiArrowUpRight className="social-arrow" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
