import React from 'react';
import { motion } from 'framer-motion';
import { FiMail } from 'react-icons/fi';
import { FaInstagram, FaLinkedinIn, FaGithub, FaWhatsapp } from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6';
import "../styles/Hero.css";
import heroImgDark from '../assets/hero.webp';
import heroImgLight from '../assets/hero-light.webp';

const Hero = ({ theme }) => {
  const man = theme === 'light' ? heroImgLight : heroImgDark;
  return (
    <div className="hero-container">
      {/* Background Marquee */}
      <div className="hero-marquee">
        <div className="marquee-track">
          <span className="marquee-text">Niranj R</span>
          <span className="marquee-text">Niranj R</span>
          <span className="marquee-text">Niranj R</span>
          <span className="marquee-text">Niranj R</span>
          <span className="marquee-text">Niranj R</span>
          <span className="marquee-text">Niranj R</span>
        </div>
      </div>

      {/* Central Portrait Image */}
      <div className="hero-image-wrapper">
        <img
          src={man}
          alt="Niranj R Portrait"
          className="hero-image"
        />
      </div>

      {/* Bottom Content Area */}
      <div className="hero-content">
        <div className="hero-content-left">
          <motion.h2
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
          >
            Built with intention. <br /> <em>Designed to be remembered.</em>
          </motion.h2>
        </div>

        <div className="hero-content-right">
          <p>
            Every project is shaped through the intersection of design, development, and strategic thinking. From intuitive interfaces and scalable web applications to cohesive brand identities, the goal is to create digital experiences that are purposeful, memorable, and built to stand the test of time.
          </p>
          <div className="hero-socials">
            <a href="https://www.instagram.com/cre.a.tor_nj/" target="_blank" rel="noopener noreferrer" className="social-circle"><FaInstagram /></a>
            <a href="https://www.linkedin.com/in/niranj-r/" target="_blank" rel="noopener noreferrer" className="social-circle"><FaLinkedinIn /></a>
            <a href="https://github.com/niranj-r" target="_blank" rel="noopener noreferrer" className="social-circle"><FaGithub /></a>
            <a href="mailto:niranj.njai@gmail.com" className="social-circle"><FiMail /></a>
            <a href="https://wa.me/919567655760" target="_blank" rel="noopener noreferrer" className="social-circle"><FaWhatsapp /></a>
            <a href="https://www.threads.com/@cre.a.tor_nj" target="_blank" rel="noopener noreferrer" className="social-circle"><FaThreads /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
