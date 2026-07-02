import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiArrowUpRight } from 'react-icons/fi';
import '../styles/UtilityModals.css';

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="utility-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <FiX />
        </button>

        <div className="modal-header">
          <h2>Privacy Policy</h2>
          <p>We believe in keeping the web clean, beautiful, and secure. Here is exactly how this website handles your visit.</p>
        </div>

        <div className="modal-cards-grid">
          <div className="modal-card">
            <span className="modal-card-number">01</span>
            <h3>Zero Active Tracking</h3>
            <p>As a personal portfolio, this space is designed for showcasing work, not harvesting data. We do not actively collect, store, or sell any personally identifiable information. You are free to browse in complete privacy.</p>
          </div>

          <div className="modal-card">
            <span className="modal-card-number">02</span>
            <h3>Minimal Cookie Footprint</h3>
            <p>We use only the most essential session markers to keep the site running smoothly. Anonymous analytics (via Vercel) help us understand overall traffic patterns without ever identifying who you are.</p>
          </div>

          <div className="modal-card">
            <span className="modal-card-number">03</span>
            <h3>Your Digital Rights</h3>
            <p>Your data belongs to you. Because we don't collect personal information, there is nothing to delete—but if you have any privacy concerns, you can reach out directly via the contact section.</p>
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-last-updated">LAST UPDATED: 3 JULY 2026</div>
          <button className="modal-action-btn" onClick={onClose}>
            <span className="btn-text">GOT IT</span>
            <span className="btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyModal;
