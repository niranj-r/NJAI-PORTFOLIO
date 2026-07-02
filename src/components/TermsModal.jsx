import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiArrowUpRight } from 'react-icons/fi';
import '../styles/UtilityModals.css';

const TermsModal = ({ isOpen, onClose }) => {
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
          <h2>Terms of Service</h2>
          <p>Basic rules and guidelines for engaging with my portfolio and the content within it.</p>
        </div>

        <div className="modal-cards-grid">
          <div className="modal-card">
            <span className="modal-card-number">01</span>
            <h3>Content Usage</h3>
            <p>All projects, code snippets, and designs showcased here remain the intellectual property of their respective owners or myself. Feel free to draw inspiration, but please don't copy the portfolio design directly.</p>
          </div>

          <div className="modal-card">
            <span className="modal-card-number">02</span>
            <h3>Fair Use</h3>
            <p>This portfolio is intended for professional networking and showcasing capabilities. Any misuse of the contact forms for spam, solicitation, or malicious purposes is strictly prohibited.</p>
          </div>

          <div className="modal-card">
            <span className="modal-card-number">03</span>
            <h3>Disclaimer</h3>
            <p>The information provided is for general informational purposes. While I strive to keep everything accurate and up to date, I make no representations or warranties of any kind about the completeness or accuracy of the content.</p>
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

export default TermsModal;
