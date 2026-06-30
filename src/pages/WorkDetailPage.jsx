import React from 'react';
import { FiArrowDown, FiArrowLeft } from 'react-icons/fi';
import "../styles/WorkDetailPage.css";

const WorkDetailPage = ({ onBack, projectTitle }) => {
  return (
    <div className="work-detail-page">
      <div className="wd-header-controls">
        <div className="wd-back-button" onClick={onBack}>
          <span className="icon-circle"><FiArrowLeft /></span>
          <span className="button-text">BACK TO WORK</span>
        </div>
      </div>

      <div className="wd-hero">
        <h1 className="wd-hero-title">{projectTitle || 'Space'}</h1>
        <p className="wd-hero-subtitle">Modern and visually appealing website that<br/>reflected the client's brand.</p>
        
        <div className="wd-stats-row">
          <div className="wd-stat-box">
            <span className="wd-stat-label">CLIENT</span>
            <span className="wd-stat-value">PAWEL GOLA</span>
          </div>
          <div className="wd-stat-box">
            <span className="wd-stat-label">TIMELINE</span>
            <span className="wd-stat-value">3 WEEKS</span>
          </div>
          <div className="wd-stat-box">
            <span className="wd-stat-label">SERVICES</span>
            <span className="wd-stat-value">TEMPLATE</span>
          </div>
          <div className="wd-stat-box">
            <span className="wd-stat-label">WEBSITE</span>
            <span className="wd-stat-value">GOLA.IO</span>
          </div>
        </div>

        <div className="wd-scroll-btn">
          <div className="wd-scroll-circle"><FiArrowDown /></div>
          <span>MORE DETAILS</span>
        </div>

        <div className="wd-hero-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=1200" 
            alt="Project Laptop" 
            className="wd-hero-image"
          />
        </div>
      </div>

      <div className="wd-details-section">
        <div className="wd-details-left">
          <span className="wd-about-label">ABOUT</span>
          <h2 className="wd-about-title">Concept, Design, and<br/>Development. All-in-one.</h2>
        </div>
        <div className="wd-details-right">
          <div className="wd-detail-card">
            <h3 className="wd-card-title">Challenge</h3>
            <p className="wd-card-text">
              Our client was struggling to attract and retain customers due to an outdated and non-responsive website that didn't align with their brand identity.
            </p>
          </div>
          <div className="wd-detail-card">
            <h3 className="wd-card-title">Goal</h3>
            <p className="wd-card-text">
              Our goal was to create a modern and visually appealing website that reflected the client's brand and delivered a seamless user experience. The website needed to be responsive, easy to navigate, and optimized for search engines to improve their online visibility.
            </p>
          </div>
          <div className="wd-detail-card">
            <h3 className="wd-card-title">Result</h3>
            <p className="wd-card-text">
              Our team developed a custom website design that was not only visually stunning but also user-friendly and optimized for search engines. The client's website now showcases their products and services in a professional and engaging manner, and has seen a significant increase in organic traffic and customer engagement. The client is thrilled with the final result and has received positive feedback from their customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetailPage;
