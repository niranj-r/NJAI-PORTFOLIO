import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiInstagram, FiFigma, FiArrowRight } from 'react-icons/fi';
import '../styles/UtilityModals.css';

const ConstructionPopup = ({ isOpen, onClose, onContinue }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div 
            className="utility-modal construction-modal"
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
              <h2>🚧 Pardon Our Dust</h2>
              <p>
                The <strong>Works & Projects</strong> section is currently undergoing a creative revamp. 
                I'm brewing something special, so please bear with me!
              </p>
            </div>

            <div className="construction-body">
              <p>
                In the meantime, you can explore my latest designs on Instagram or view the raw Figma files.
              </p>
              <div className="construction-actions">
                <a 
                  href="https://instagram.com/njai.designs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="modal-action-btn"
                >
                  <span className="btn-text">@njai.designs</span>
                  <span className="btn-icon"><FiInstagram size={18} /></span>
                </a>
                <a 
                  href="https://www.figma.com/design/oHO2KPh94qMZ4xIExUT9NK/Portfolio?node-id=532-11531&t=pOlqutC5X8ajqev0-1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="modal-action-btn"
                >
                  <span className="btn-text">Figma File</span>
                  <span className="btn-icon"><FiFigma size={18} /></span>
                </a>
              </div>
            </div>

            <div className="modal-footer construction-footer">
              <button 
                className="modal-action-btn" 
                onClick={onContinue}
              >
                <span className="btn-text">CONTINUE TO SITE</span>
                <span className="btn-icon">
                  <FiArrowRight />
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConstructionPopup;
