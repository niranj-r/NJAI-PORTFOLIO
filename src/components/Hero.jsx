import React from 'react';
import { FiTwitter, FiInstagram, FiGithub, FiLinkedin } from 'react-icons/fi';
import './Hero.css';

const Hero = () => {
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
          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800" 
          alt="Niranj R Portrait" 
          className="hero-image" 
        />
      </div>

      {/* Bottom Content Area */}
      <div className="hero-content">
        <div className="hero-content-left">
          <h2>
            A website that leaves <br/> <em>a lasting impression!</em>
          </h2>
        </div>
        
        <div className="hero-content-right">
          <p>
            Hi, I'm Niranj R - a freelancer specializing in premium web design, development, and SEO services. I'm passionate about creating unique and effective solutions for my clients, and I bring a personal touch to every project. Let's work together to bring your vision to life!
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
