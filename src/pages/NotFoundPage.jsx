import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import heroDark from '../assets/404hero.webp';
import heroLight from '../assets/404heroLight.webp';
import heroDarkMobile from '../assets/404heroMobile.webp';
import heroLightMobile from '../assets/404heroLightMobile.webp';
import '../styles/NotFoundPage.css';

const NotFoundPage = ({ theme, onNavClick }) => {
  const heroImgDesktop = theme === 'light' ? heroLight : heroDark;
  const heroImgMobile = theme === 'light' ? heroLightMobile : heroDarkMobile;

  return (
    <motion.div 
      className="not-found-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Image Anchored to Right/Bottom */}
      <div className="not-found-hero-bg">
        <picture>
          <source media="(max-width: 992px)" srcSet={heroImgMobile} />
          <motion.img 
            src={heroImgDesktop} 
            alt="404 Graphic" 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          />
        </picture>
      </div>

      {/* Foreground Content */}
      <div className="not-found-content">
        <h1 className="not-found-404">404</h1>
        
        <h2 className="not-found-title">PAGE NOT FOUND</h2>
        
        <p className="not-found-subtitle">
          Looks like you've taken a wrong turn.<br/>
          Let's get you back on track.
        </p>
        
        <button 
          className="not-found-btn-outline" 
          onClick={() => onNavClick('home')}
        >
          <FiArrowLeft className="btn-icon-left" />
          <span>GO HOME</span>
        </button>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;
