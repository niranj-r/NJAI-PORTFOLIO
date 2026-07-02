import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import "../styles/Services.css";

import logo1 from '../assets/logos/CODEINFINITY.svg';
import logo2 from '../assets/logos/NJ.svg';
import logo3 from '../assets/logos/aure.svg';
import logo4 from '../assets/logos/creatorscup.svg';
import logo5 from '../assets/logos/gene.svg';
import logo6 from '../assets/logos/litup.svg';
import logo7 from '../assets/logos/verdea.svg'
import logo8 from '../assets/logos/voidzero.svg'
import logo9 from '../assets/logos/ntrio.svg'
import logo10 from '../assets/logos/urflow.svg'
import logo11 from '../assets/logos/theSixCustoms.svg'

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
};

const Services = ({ onServiceClick }) => {
  return (
    <div className="services-container" id="services">
      {/* Logos Section */}
      <div className="logos-marquee-container">
        <motion.div
          className="logos-section marquee-track-logos"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
        >
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="logo-item"><img src={logo1} alt="CodeInfinity" /></div>
              <div className="logo-item"><img src={logo2} alt="NJ" /></div>
              <div className="logo-item"><img src={logo3} alt="Aure" /></div>
              <div className="logo-item"><img src={logo4} alt="Creators Cup" /></div>
              <div className="logo-item"><img src={logo5} alt="Gene" /></div>
              <div className="logo-item"><img src={logo6} alt="Litup" /></div>
              <div className="logo-item"><img src={logo7} alt="Verdea" /></div>
              <div className="logo-item"><img src={logo8} alt="Voidzero" /></div>
              <div className="logo-item"><img src={logo9} alt="ntrio" /></div>
              <div className="logo-item"><img src={logo10} alt="Urflow" /></div>
              <div className="logo-item"><img src={logo11} alt="theSixCustoms" /></div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* Services Cards */}
      <motion.div
        className="services-cards"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.15 }}
      >
        <motion.div variants={cardVariants} transition={{ duration: 0.6, ease: "easeOut" }} className="service-card" onClick={onServiceClick} style={{ cursor: 'pointer' }}>
          <div className="service-number">01</div>
          <h3 className="service-title">WEB DESIGN</h3>
          <p className="service-description">
            Visually stunning web designs that captivate your audience by blending your brand voice and customer needs.
          </p>
          <div className="service-button">
            <span className="icon-circle"><FiArrowUpRight /></span>
            <span className="button-text">ABOUT WEBDESIGN</span>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} transition={{ duration: 0.6, ease: "easeOut" }} className="service-card" onClick={onServiceClick} style={{ cursor: 'pointer' }}>
          <div className="service-number">02</div>
          <h3 className="service-title">DEVELOPMENT</h3>
          <p className="service-description">
            Get custom web development solutions that are tailored to your specifications, designed to deliver a flawless user experience.
          </p>
          <div className="service-button">
            <span className="icon-circle"><FiArrowUpRight /></span>
            <span className="button-text">ABOUT WEBFLOW</span>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} transition={{ duration: 0.6, ease: "easeOut" }} className="service-card" onClick={onServiceClick} style={{ cursor: 'pointer' }}>
          <div className="service-number">03</div>
          <h3 className="service-title">CONTENT & SEO</h3>
          <p className="service-description">
            Proven SEO strategies that enhance your online performance, bringing you to the forefront of organic search results.
          </p>
          <div className="service-button">
            <span className="icon-circle"><FiArrowUpRight /></span>
            <span className="button-text">ABOUT SEO</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Services;
