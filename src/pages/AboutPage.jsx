import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/AboutPage.css";
import heroImgDark from "../assets/frame10.webp";
import heroImgLight from "../assets/frame10-light.webp";
import aboutImg from "../assets/frame30.webp";
import nameImg from "../assets/name.webp";
import { FaInstagram, FaLinkedinIn, FaGithub, FaWhatsapp } from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6';
import { FiMail } from 'react-icons/fi';

export default function AboutPage({ theme }) {
  const heroImg = theme === 'light' ? heroImgLight : heroImgDark;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div 
      className="about-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* ===== HERO SECTION ===== */}
      <section className="about-hero">
        {!isMobile && (
          <div className="about-left">
            <img src={heroImg} alt="Niranj" className="about-hero-img" />
          </div>
        )}

        <div className="about-right">
          <img
            src={nameImg}
            alt="Niranj R"
            className="about-name"
          />

          <p className="about-subtext">
            Merging Art and Technology to Craft the Next<br />
            Generation of Web Experiences.
          </p>
          <button
            className="about-scroll-btn"
            onClick={() => {
              document
                .getElementById("about-bio")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="about-scroll-circle">↓</span>
            <span className="about-scroll-text">ABOUT ME</span>
          </button>
        </div>
      </section>

      {/* ===== ABOUT BIO SECTION ===== */}
      <section id="about-bio" className="about-bio">
        <div className="about-card">
          <motion.h3 
            className="about-card-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >NIRANJ R</motion.h3>
          
          <motion.h2 
            className="about-card-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            Your Partner in Bringing Your Web Design Vision to Life
          </motion.h2>

          <motion.p 
            className="about-card-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            I'm a UI/UX Designer and Frontend Developer passionate about creating immersive,
            intuitive digital experiences. My approach blends design thinking and visual
            storytelling, where every interaction feels intentional and every layout flows with
            purpose.
          </motion.p>

          <motion.p 
            className="about-card-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            I love transforming ideas into interfaces that connect with people — balancing form,
            function, and emotion. From wireframes to final pixels, I focus on clarity,
            consistency, and that subtle spark that makes a design memorable.
          </motion.p>

          <motion.p 
            className="about-card-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            Driven by curiosity and a love for detail, I’m constantly exploring new tools, trends,
            and technologies to push creative boundaries and craft experiences that truly stand out.
          </motion.p>

          <motion.img 
            src={aboutImg} 
            alt="Niranj Portrait" 
            className="about-card-img" 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </section>

      <div className="about-social-section">
        <motion.div 
          className="about-socials"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <a href="https://www.instagram.com/cre.a.tor_nj/" target="_blank" rel="noopener noreferrer" className="about-social-btn">
            <FaInstagram className="about-icon" />
            <span className="about-social-text">INSTAGRAM</span>
            <span className="about-arrow">↗</span>
          </a>

          <a href="https://www.linkedin.com/in/niranj-r/" target="_blank" rel="noopener noreferrer" className="about-social-btn">
            <FaLinkedinIn className="about-icon" />
            <span className="about-social-text">LINKEDIN</span>
            <span className="about-arrow">↗</span>
          </a>

          <a href="https://github.com/niranj-r" target="_blank" rel="noopener noreferrer" className="about-social-btn">
            <FaGithub className="about-icon" />
            <span className="about-social-text">GITHUB</span>
            <span className="about-arrow">↗</span>
          </a>

          <a href="mailto:niranj.njai@gmail.com" className="about-social-btn">
            <FiMail className="about-icon" />
            <span className="about-social-text">EMAIL</span>
            <span className="about-arrow">↗</span>
          </a>

          <a href="https://wa.me/919567655760" target="_blank" rel="noopener noreferrer" className="about-social-btn">
            <FaWhatsapp className="about-icon" />
            <span className="about-social-text">WHATSAPP</span>
            <span className="about-arrow">↗</span>
          </a>

          <a href="https://www.threads.com/@cre.a.tor_nj" target="_blank" rel="noopener noreferrer" className="about-social-btn">
            <FaThreads className="about-icon" />
            <span className="about-social-text">THREADS</span>
            <span className="about-arrow">↗</span>
          </a>
        </motion.div>
      </div>

    </motion.div>
  );
}
