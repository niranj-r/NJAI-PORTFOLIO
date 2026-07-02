import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowUpRight, FiArrowRight } from 'react-icons/fi';
import '../styles/UtilityModals.css';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookie_consent');
    if (!hasConsented) {
      // Small delay before showing
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="cookie-banner-overlay">
          <motion.div
            className="cookie-banner"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="cookie-header">
              <h3>WE VALUE YOUR PRIVACY</h3>
              <button className="cookie-close" onClick={handleDecline}>
                <FiX />
              </button>
            </div>
            
            <p className="cookie-text">
              We use strictly essential cookies and anonymous analytics to understand our audience and improve the experience.
            </p>
            
            <div className="cookie-actions">
              <button className="modal-action-btn" onClick={handleAccept}>
                <span className="btn-text">ACCEPT</span>
                <span className="btn-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </button>
              
              <button className="modal-action-btn" onClick={handleDecline} style={{ opacity: 0.7, border: '1px solid var(--border-extra-faint)' }}>
                <span className="btn-text" style={{ color: 'var(--text-secondary)' }}>DECLINE</span>
                <span className="btn-icon" style={{ backgroundColor: 'var(--bg-accent)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
