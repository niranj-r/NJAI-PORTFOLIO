import React, { useState, useEffect } from "react";
import imgProfileDark from "../assets/frame20.webp";
import imgProfileLight from "../assets/frame20-light.webp";
import heroImgLight from "../assets/hero-light.webp";
import svgPaths from "../svg-osuecvsjzq";
import "../styles/Frame2.css";
import "../styles/Hero.css"; // Ensure marquee styles are available

export default function Frame2({ theme }) {
  const imgProfile = theme === 'light' ? imgProfileLight : imgProfileDark;

  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ['UI/UX Designer', 'UI/UX Developer', 'Full Stack Developer', 'SEO Analyst'];

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex(prev => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <div className="frame-container">

      {theme === 'dark' ? (
        <>
          {/* === Main central layered circle system === */}
          <div className="frame-main-circle">
            {/* Dark gradient base circle */}
            <svg viewBox="0 0 788 788" className="frame-main-svg">
              <defs>
                <linearGradient id="f2-grad-1" x1="609.375" x2="320.625" y1="61.125" y2="774">
                  <stop offset="0" stopColor="var(--bg-secondary)" />
                  <stop offset="1" stopColor="var(--bg-primary)" />
                </linearGradient>
              </defs>
              <circle cx="393.75" cy="393.75" r="393.75" fill="url(#f2-grad-1)" />
            </svg>
            {/* Glowing ellipse 
        <div className="ellipse">
          <div className="frame-glow-ellipse"></div>
        </div>
        */}

            {/* Orange stroke outer ring */}
            <svg viewBox="0 0 645 645" className="frame-ring-outer">
              <circle cx="322.11" cy="322.11" r="321.681" className="frame-ring-stroke" />
            </svg>

            {/* Large exclusion blend circle */}
            <svg viewBox="0 0 696 696" className="frame-ring-exclusion">
              <defs>
                <linearGradient id="f2-grad-2" x1="538.313" x2="283.236" y1="53.9969" y2="683.741">
                  <stop stopColor="var(--f2-ring-1)" />
                  <stop offset="1" stopColor="var(--f2-ring-2)" />
                </linearGradient>
              </defs>
              <circle cx="347.833" cy="347.833" r="347.833" fill="url(#f2-grad-2)" />
            </svg>

            {/* Inner orange glowing circle */}
            <div className="frame-inner-circle-wrapper">
              <svg viewBox="0 0 894 894" className="frame-inner-circle">

                <circle cx="446.554" cy="446.554" r="298.354" fill="url(#f2-grad-3)" />
              </svg>
            </div>
          </div>

          {/* Profile image */}
          <img src={imgProfile} alt="Profile" className="frame-profile" />

          {/* Text block */}
          <div className="frame-text">
            <p className="frame-hi">Hi I am</p>
            <h1 className="frame-name">
              NIRANJ
              <br />
              R
            </h1>
          </div>

          {/* Animated arrow */}
          <div className="frame-arrows">
            <svg viewBox="0 0 184 76" className="frame-arrow-svg">
              <path d={svgPaths.pa8d96f2} className="frame-arrow-path" />
            </svg>
            <svg viewBox="0 0 184 76" className="frame-arrow-svg arrow-2">
              <path d={svgPaths.pa8d96f2} className="frame-arrow-path" />
            </svg>
          </div>
          <div className="frame-arrows">
            <svg viewBox="0 0 184 76" className="frame-arrow-svg">
              <path d={svgPaths.pa8d96f2} className="frame-arrow-path" />
            </svg>
            <svg viewBox="0 0 184 76" className="frame-arrow-svg arrow-2">
              <path d={svgPaths.pa8d96f2} className="frame-arrow-path" />
            </svg>
          </div>
        </>
      ) : (
        <>
          {/* Light Mode Specific Central Element (Matches Hero section) */}
          <div className="hero-marquee" style={{ pointerEvents: 'none', top: '50%' }}>
            <div className="marquee-track">
              <span className="marquee-text">Niranj R</span>
              <span className="marquee-text">Niranj R</span>
              <span className="marquee-text">Niranj R</span>
              <span className="marquee-text">Niranj R</span>
              <span className="marquee-text">Niranj R</span>
              <span className="marquee-text">Niranj R</span>
            </div>
          </div>

          <div className="hero-image-wrapper" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -45%)', width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
            <img
              src={heroImgLight}
              alt="Niranj R Portrait"
              className="hero-image"
              style={{ width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain', mixBlendMode: 'normal' }}
            />
          </div>
        </>
      )}

      {/* Socials bottom left */}
      <div className="frame-socials">
        <a href="#!" className="frame-icon"><i className="fab fa-linkedin"></i></a>
        <a href="#!" className="frame-icon"><i className="fab fa-instagram"></i></a>
        <a href="#!" className="frame-icon"><i className="fab fa-github"></i></a>

        <a href="mailto:example@gmail.com" className="frame-icon frame-gmail">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 14"
            className="gmail-svg"
          >
            <g>
              <path d="M1.2243 13.464H4.07856V6.53338L0 3.47168V12.24C0 12.9186 0.549394 13.464 1.2243 13.464Z" />
              <path d="M13.8711 13.464H16.7253C17.4003 13.464 17.9497 12.9148 17.9497 12.24V3.47168L13.8711 6.52953V13.464Z" />
              <path d="M13.8711 1.22825V6.52936L17.9497 3.47151V1.83849C17.9497 0.327439 16.2229 -0.537619 15.013 0.370552L13.8711 1.22825Z" />
              <path d="M4.07422 6.53348V1.22852L8.97109 4.90046L13.868 1.22852V6.53348L8.97109 10.2016L4.07422 6.53348Z" />
              <path d="M0 1.84191V3.47493L4.07856 6.53278V1.22816L2.93665 0.37397C1.72672 -0.534201 0 0.330857 0 1.84191Z" />
            </g>
          </svg>
        </a>
      </div>


      {/* Role bottom right */}
      <div className="frame-role">
        {roles[roleIndex]}
      </div>
    </div>
  );
}
