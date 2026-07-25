import React from 'react';
import { FiArrowLeft, FiArrowDown } from 'react-icons/fi';
import "../styles/ServiceDetailPage.css";
import imgDesignExperience from '../assets/Services/DESIGN&EXPERIENCE.webp';
import imgDevelopment from '../assets/Services/DEVELOPMENT.webp';
import imgBrandIdentity from '../assets/Services/BRANDING.webp';

const ServiceDetailPage = ({ onBack }) => {
  return (
    <div className="service-detail-page">
      <div className="sd-header-controls">
        <button className="sd-back-button" onClick={onBack}>
          <FiArrowLeft /> Back to Home
        </button>
      </div>

      {/* Hero Section */}
      <div className="sd-hero">
        <h1 className="sd-hero-title">
          Dev <br /> Design <br /> <em>& Branding</em>
        </h1>
        <p className="sd-hero-subtitle">
          Designing brands. Building products. <br />Creating digital experiences that connect, engage, and endure.
        </p>
        <div className="sd-hero-scroll">
          <div className="scroll-icon-circle"><FiArrowDown /></div>
          <span className="scroll-text">MY SERVICES</span>
        </div>
        <div className="sd-hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=1200"
            alt="Web Design Laptop"
            className="sd-hero-image"
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="sd-stats-row">
        <div className="sd-stat">
          <p>PROJECTS</p>
          <h2>30+</h2>
        </div>
        <div className="sd-stat">
          <p>YEARS OF CREATING</p>
          <h2>3+</h2>
        </div>
        <div className="sd-stat">
          <p>DESIGN HOURS</p>
          <h2>2200+</h2>
        </div>
        <div className="sd-stat">
          <p>LINES OF CODE</p>
          <h2>250K+</h2>
        </div>
      </div>

      {/* Details Sections */}
      <div className="sd-sections-container">

        {/* Section 1 */}
        <div className="sd-section-block">
          <div className="sd-section-header">
            <span className="sd-section-category">DESIGN & EXPERIENCE</span>
            <h2 className="sd-section-title">Designing Experiences That<br />People Remember</h2>
          </div>
          <div className="sd-section-image-wrapper">
            <img
              src={imgDesignExperience}
              alt="Idea to Reality"
              className="sd-section-image"
            />
          </div>
          <div className="sd-features-list">
            <div className="sd-feature-row">
              <div className="sd-feature-label">DISCOVERY</div>
              <p className="sd-feature-text">Every project starts with understanding the goals, audience, and challenges behind the idea. Research, planning, and information architecture create a strong foundation before design begins.</p>
            </div>
            <div className="sd-feature-row">
              <div className="sd-feature-label">UX / UI DESIGN</div>
              <p className="sd-feature-text">Great design puts clarity, accessibility, and usability front and center. Every screen is crafted to look beautiful and work flawlessly, making the entire experience feel completely natural.</p>
            </div>
            <div className="sd-feature-row">
              <div className="sd-feature-label">PROTOTYPE</div>
              <p className="sd-feature-text">Prototypes turn ideas into reality before the coding even starts. They are the perfect way to test, tweak, and perfect the experience so that every detail hits the mark.</p>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="sd-section-block">
          <div className="sd-section-header">
            <span className="sd-section-category">DEVELOPMENT</span>
            <h2 className="sd-section-title">Building Fast, Scalable<br />Digital Products</h2>
          </div>
          <div className="sd-section-image-wrapper">
            <img
              src={imgDevelopment}
              alt="High Performance"
              className="sd-section-image"
            />
          </div>
          <div className="sd-features-list">
            <div className="sd-feature-row">
              <div className="sd-feature-label">PERFORMANCE MEETS PRECISION</div>
              <p className="sd-feature-text">Building great digital products takes more than just writing clean code. Every solution needs to be accessible, easy to scale, and built to last, ensuring a flawless experience on any device.</p>
            </div>
            <div className="sd-feature-row">
              <div className="sd-feature-label">FRONT-END DEVELOPMENT</div>
              <p className="sd-feature-text">I build responsive interfaces using a modern, component-driven approach to ensure they load fast, feel smooth, and perform consistently.</p>
            </div>
            <div className="sd-feature-row">
              <div className="sd-feature-label">OPTIMIZATION</div>
              <p className="sd-feature-text">True optimization is about removing the friction. It means fine-tuning every asset and streamlining the code so the final product loads instantly, runs smoothly, and feels completely effortless.</p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="sd-section-block">
          <div className="sd-section-header">
            <span className="sd-section-category">BRAND IDENTITY</span>
            <h2 className="sd-section-title">Building Brands That Leave an<br />Impression</h2>
          </div>
          <div className="sd-section-image-wrapper">
            <img
              src={imgBrandIdentity}
              alt="Search Traffic Phone"
              className="sd-section-image"
            />
          </div>
          <div className="sd-features-list">
            <div className="sd-feature-row">
              <div className="sd-feature-label">MORE THAN JUST A LOGO</div>
              <p className="sd-feature-text">A strong brand communicates personality, values, and purpose. Every visual element is thoughtfully designed to create recognition, consistency, and meaningful connections across every touchpoint.</p>
            </div>
            <div className="sd-feature-row">
              <div className="sd-feature-label">BRAND STRATEGY</div>
              <p className="sd-feature-text">A clear creative direction is established by understanding the brand's vision, audience, positioning, and personality before visual exploration begins.</p>
            </div>
            <div className="sd-feature-row">
              <div className="sd-feature-label">VISUAL IDENTITY</div>
              <p className="sd-feature-text">Logos, typography, color systems, and supporting graphic elements come together to create a distinctive identity that remains consistent across digital and print experiences.</p>
            </div>
            <div className="sd-feature-row">
              <div className="sd-feature-label">BRAND SYSTEMS</div>
              <p className="sd-feature-text">Comprehensive design systems and brand guidelines ensure consistency across websites, social media, presentations, marketing materials, and every future brand interaction.</p>
            </div>
          </div>
        </div>

      </div>
    </div >
  );
};

export default ServiceDetailPage;
