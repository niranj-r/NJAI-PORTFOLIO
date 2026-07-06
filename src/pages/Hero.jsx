import React from 'react';
import { motion } from 'framer-motion';
import { FiTwitter, FiInstagram, FiGithub, FiLinkedin } from 'react-icons/fi';
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
            <a href="#!" className="social-circle"><FiTwitter /></a>
            <a href="#!" className="social-circle"><FiInstagram /></a>
            <a href="#!" className="social-circle"><FiGithub /></a>
            <a href="#!" className="social-circle"><FiLinkedin /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
