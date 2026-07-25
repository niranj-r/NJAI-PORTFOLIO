import React from 'react';
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowUpRight, FiMail } from 'react-icons/fi';
import { FaInstagram, FaLinkedinIn, FaGithub, FaWhatsapp } from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6';
import "../styles/ContactPage.css";
import heroImgDark from '../assets/hero.webp';
import heroImgLight from '../assets/hero-light.webp';

const ContactPage = ({ onBack, theme }) => {
  const heroImage = theme === 'light' ? heroImgLight : heroImgDark;
  return (
    <motion.div 
      className="contact-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="contact-header-controls">
        <button className="contact-back-button" onClick={onBack}>
          <FiArrowLeft /> Back to Home
        </button>
      </div>

      <div className="contact-container">
        {/* Left Side: Image */}
        <motion.div 
          className="contact-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img 
            src={heroImage} 
            alt="Portrait" 
            className="contact-portrait" 
          />
        </motion.div>
        
        {/* Right Side: Form & Socials */}
        <div className="contact-right">
          <motion.div 
            className="contact-form-block"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <span className="contact-label">CONTACT</span>
            <h2 className="contact-title">Let's get in touch.</h2>
            
            <form className="contact-form">
              <input type="text" placeholder="NAME" className="contact-input" />
              <input type="email" placeholder="EMAIL" className="contact-input" />
              <textarea placeholder="MESSAGE" className="contact-textarea" rows="4"></textarea>
              <button type="button" className="contact-submit">SEND MESSAGE</button>
            </form>
          </motion.div>
          
          <motion.div 
            className="contact-socials-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <a href="https://www.instagram.com/cre.a.tor_nj/" target="_blank" rel="noopener noreferrer" className="contact-social-item">
              <FaInstagram className="social-icon" />
              <span className="social-text">INSTAGRAM</span>
              <FiArrowUpRight className="social-arrow" />
            </a>
            <a href="https://www.linkedin.com/in/niranj-r/" target="_blank" rel="noopener noreferrer" className="contact-social-item">
              <FaLinkedinIn className="social-icon" />
              <span className="social-text">LINKEDIN</span>
              <FiArrowUpRight className="social-arrow" />
            </a>
            <a href="https://github.com/niranj-r" target="_blank" rel="noopener noreferrer" className="contact-social-item">
              <FaGithub className="social-icon" />
              <span className="social-text">GITHUB</span>
              <FiArrowUpRight className="social-arrow" />
            </a>
            <a href="mailto:niranj.njai@gmail.com" className="contact-social-item">
              <FiMail className="social-icon" />
              <span className="social-text">EMAIL</span>
              <FiArrowUpRight className="social-arrow" />
            </a>
            <a href="https://wa.me/919567655760" target="_blank" rel="noopener noreferrer" className="contact-social-item">
              <FaWhatsapp className="social-icon" />
              <span className="social-text">WHATSAPP</span>
              <FiArrowUpRight className="social-arrow" />
            </a>
            <a href="https://www.threads.com/@cre.a.tor_nj" target="_blank" rel="noopener noreferrer" className="contact-social-item">
              <FaThreads className="social-icon" />
              <span className="social-text">THREADS</span>
              <FiArrowUpRight className="social-arrow" />
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
