import React from 'react';
import { motion } from 'framer-motion';
import '../styles/LoadingScreen.css';
import heroImgDark from '../assets/hero.png';
import heroImgLight from '../assets/hero-light.png';

const LoadingScreen = ({ theme }) => {
  const man = theme === 'light' ? heroImgLight : heroImgDark;

  return (
    <motion.div 
      className="loading-screen"
      initial={{ y: 0 }}
      exit={{ y: "-100vh", opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Marquee */}
      <motion.div 
        className="loading-marquee-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="loading-marquee-track">
          <span className="loading-marquee-text">Niranj R</span>
          <span className="loading-marquee-text">Niranj R</span>
          <span className="loading-marquee-text">Niranj R</span>
          <span className="loading-marquee-text">Niranj R</span>
          <span className="loading-marquee-text">Niranj R</span>
          <span className="loading-marquee-text">Niranj R</span>
        </div>
      </motion.div>

      {/* Central Portrait Image */}
      <motion.div 
        className="loading-image-wrapper"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      >
        <img
          src={man}
          alt="Niranj R Portrait"
          className="loading-image"
        />
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
