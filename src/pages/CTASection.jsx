import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import "../styles/CTASection.css";

const CTASection = ({ onNavClick }) => {
  return (
    <div className="cta-container">
      {/* Marquee Top */}
      <div className="cta-marquee-wrapper">
        <div className="cta-marquee">
          <span>+++ LET'S TALK +++ LET'S TALK +++ LET'S TALK +++ LET'S TALK +++ LET'S TALK +++ LET'S TALK +++ LET'S TALK +++ LET'S TALK </span>
          <span>+++ LET'S TALK +++ LET'S TALK +++ LET'S TALK +++ LET'S TALK +++ LET'S TALK +++ LET'S TALK +++ LET'S TALK +++ LET'S TALK </span>
        </div>
      </div>

      <div className="cta-content">
        <span className="cta-small-heading">HAVE AN IDEA?</span>
        <h2 className="cta-large-heading">
          Let's make your <br /> <em>Idea a Reality</em>
        </h2>
        <p className="cta-subtitle">
          From concept and branding to design and development, every project is crafted with purpose, precision, and attention to detail.
        </p>
        <button
          className="cta-button"
          onClick={() => {
            if (onNavClick) onNavClick('contact');
          }}
        >
          START A CONVERSATION <FiArrowUpRight className="cta-btn-icon" />
        </button>
      </div>
    </div>
  );
};

export default CTASection;
