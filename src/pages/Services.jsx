import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import "../styles/Services.css";

const Services = ({ onServiceClick }) => {
  return (
    <div className="services-container" id="services">
      {/* Logos Section */}
      <div className="logos-section">
        <div className="logo-item">
          <svg viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg" width="100">
            <rect x="0" y="5" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2"/>
            <rect x="5" y="10" width="10" height="10" rx="1" fill="currentColor"/>
            <text x="30" y="22" fill="currentColor" fontSize="18" fontWeight="bold" letterSpacing="2">LOGO</text>
          </svg>
        </div>
        <div className="logo-item">
          <svg viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg" width="120">
            <circle cx="10" cy="15" r="4" fill="currentColor"/>
            <circle cx="20" cy="8" r="3" fill="currentColor"/>
            <circle cx="20" cy="22" r="3" fill="currentColor"/>
            <circle cx="30" cy="15" r="4" fill="currentColor"/>
            <path d="M10 15L20 8M10 15L20 22M20 8L30 15M20 22L30 15" stroke="currentColor" strokeWidth="2"/>
            <text x="40" y="21" fill="currentColor" fontSize="16" fontWeight="500">logoipsum</text>
          </svg>
        </div>
        <div className="logo-item">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40">
            <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2"/>
            <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2"/>
            <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div className="logo-item">
          <svg viewBox="0 0 50 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="50">
            <path d="M15 18C10.5817 18 7 14.4183 7 10C7 5.58172 10.5817 2 15 2C18.3146 2 21.1573 4.01435 22.3995 7L27.6005 13C28.8427 15.9856 31.6854 18 35 18C39.4183 18 43 14.4183 43 10C43 5.58172 39.4183 2 35 2C31.6854 2 28.8427 4.01435 27.6005 7L22.3995 13C21.1573 15.9856 18.3146 18 15 18Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div className="logo-item">
          <svg viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg" width="100">
            <text x="0" y="22" fill="currentColor" fontSize="16" fontWeight="900" letterSpacing="1">LOGOIPSUM</text>
          </svg>
        </div>
        <div className="logo-item">
          <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" width="30">
            <path d="M5 25V5L25 25V5" stroke="currentColor" strokeWidth="4" strokeLinecap="square"/>
          </svg>
        </div>
      </div>

      {/* Services Cards */}
      <div className="services-cards">
        <div className="service-card" onClick={onServiceClick} style={{ cursor: 'pointer' }}>
          <div className="service-number">01</div>
          <h3 className="service-title">WEB DESIGN</h3>
          <p className="service-description">
            Visually stunning web designs that captivate your audience by blending your brand voice and customer needs.
          </p>
          <div className="service-button">
            <span className="icon-circle"><FiArrowUpRight /></span>
            <span className="button-text">ABOUT WEBDESIGN</span>
          </div>
        </div>

        <div className="service-card" onClick={onServiceClick} style={{ cursor: 'pointer' }}>
          <div className="service-number">02</div>
          <h3 className="service-title">DEVELOPMENT</h3>
          <p className="service-description">
            Get custom web development solutions that are tailored to your specifications, designed to deliver a flawless user experience.
          </p>
          <div className="service-button">
            <span className="icon-circle"><FiArrowUpRight /></span>
            <span className="button-text">ABOUT WEBFLOW</span>
          </div>
        </div>

        <div className="service-card" onClick={onServiceClick} style={{ cursor: 'pointer' }}>
          <div className="service-number">03</div>
          <h3 className="service-title">CONTENT & SEO</h3>
          <p className="service-description">
            Proven SEO strategies that enhance your online performance, bringing you to the forefront of organic search results.
          </p>
          <div className="service-button">
            <span className="icon-circle"><FiArrowUpRight /></span>
            <span className="button-text">ABOUT SEO</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
