import React from 'react';
import { FiArrowLeft, FiArrowDown } from 'react-icons/fi';
import "../styles/ServiceDetailPage.css";

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
          Web <br /> Design <br /> <em>& Framer</em>
        </h1>
        <p className="sd-hero-subtitle">
          Premium web design, development, and SEO<br />services to help your business stand out.
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
          <p>CLIENTS</p>
          <h2>150+</h2>
        </div>
        <div className="sd-stat">
          <p>PROJECTS</p>
          <h2>300+</h2>
        </div>
        <div className="sd-stat">
          <p>HAPPY CLIENTS</p>
          <h2>100%</h2>
        </div>
        <div className="sd-stat">
          <p>FOLLOWERS</p>
          <h2>100K</h2>
        </div>
      </div>

      {/* Details Sections */}
      <div className="sd-sections-container">
        
        {/* Section 1 */}
        <div className="sd-section-block">
          <div className="sd-section-header">
            <span className="sd-section-category">WEBDESIGN</span>
            <h2 className="sd-section-title">Transforming Your Ideas into Reality</h2>
          </div>
          <div className="sd-section-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000" 
              alt="Idea to Reality" 
              className="sd-section-image" 
            />
          </div>
          <div className="sd-features-list">
             <div className="sd-feature-row">
               <div className="sd-feature-label">CONCEPT</div>
               <p className="sd-feature-text">I take time to understand your business needs and audience to develop a unique concept for your website. I'll create wireframes that serve as the foundation for your site's design and functionality.</p>
             </div>
             <div className="sd-feature-row">
               <div className="sd-feature-label">UX / UI DESIGN</div>
               <p className="sd-feature-text">I'll design a user-friendly interface that is visually appealing and engages your target audience. Your website will be created to meet your brand's needs and goals while ensuring a seamless user experience.</p>
             </div>
             <div className="sd-feature-row">
               <div className="sd-feature-label">PROTOTYPE</div>
               <p className="sd-feature-text">With an interactive prototype, you'll have the ability to test your website's functionality before it goes live. This will ensure that your website's design and user experience are optimized for your audience's needs and preferences.</p>
             </div>
          </div>
        </div>
        
        {/* Section 2 */}
        <div className="sd-section-block">
          <div className="sd-section-header">
            <span className="sd-section-category">DEVELOPMENT</span>
            <h2 className="sd-section-title">Developing High-Performance<br/>Websites and Web Applications</h2>
          </div>
          <div className="sd-section-image-wrapper">
             <img 
               src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=1000" 
               alt="High Performance" 
               className="sd-section-image" 
             />
          </div>
          <div className="sd-features-list">
             <div className="sd-feature-row">
               <div className="sd-feature-label">FRAMER</div>
               <p className="sd-feature-text">I specialize in developing web applications using Framer. From custom animations to complex interactions, I bring your web app to life.</p>
             </div>
             <div className="sd-feature-row">
               <div className="sd-feature-label">CMS INTEGRATION</div>
               <p className="sd-feature-text">I can help you streamline your content management process by integrating a CMS into your website. Say goodbye to manual updates and hello to efficiency.</p>
             </div>
             <div className="sd-feature-row">
               <div className="sd-feature-label">WEB DESIGN SYSTEM</div>
               <p className="sd-feature-text">I use a modular design approach to create a web design system that ensures consistency throughout your website. This results in a professional and cohesive online presence.</p>
             </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="sd-section-block">
          <div className="sd-section-header">
            <span className="sd-section-category">SEO & CONTENT</span>
            <h2 className="sd-section-title">Boosting Your Website's Organic<br/>Search Traffic</h2>
          </div>
          <div className="sd-section-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1605236453806-6ff3685e219e?auto=format&fit=crop&q=80&w=1000" 
              alt="Search Traffic Phone" 
              className="sd-section-image" 
            />
          </div>
          <div className="sd-features-list">
             <div className="sd-feature-row">
               <div className="sd-feature-label">RESEARCH</div>
               <p className="sd-feature-text">I conduct thorough research to identify the best keywords and strategies to improve your website's search engine ranking.</p>
             </div>
             <div className="sd-feature-row">
               <div className="sd-feature-label">SEO RANKING</div>
               <p className="sd-feature-text">My SEO services are designed to improve your website's visibility on search engines, increasing your organic traffic and driving more leads and sales.</p>
             </div>
             <div className="sd-feature-row">
               <div className="sd-feature-label">SEO SUPPORT</div>
               <p className="sd-feature-text">With ongoing SEO support, I ensure that your website stays up-to-date with the latest SEO best practices, keeping you ahead of the competition.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceDetailPage;
