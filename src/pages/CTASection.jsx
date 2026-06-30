import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import "../styles/CTASection.css";

const CTASection = () => {
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
        <span className="cta-small-heading">PROJECT IN MIND?</span>
        <h2 className="cta-large-heading">
          Let's make your <br /> <em>Website shine</em>
        </h2>
        <p className="cta-subtitle">
          Premium web design, webflow, and SEO services to <br /> help your business stand out.
        </p>
        <button className="cta-button">
          GET IN TOUCH <FiArrowUpRight className="cta-btn-icon"/>
        </button>
      </div>
    </div>
  );
};

export default CTASection;
