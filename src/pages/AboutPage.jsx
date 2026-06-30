import React, { useState, useEffect } from "react";
import "../styles/AboutPage.css";
import heroImgDark from "../assets/frame10.png";
import heroImgLight from "../assets/frame10-light.png";
import aboutImg from "../assets/frame30.png";
import nameImg from "../assets/name.png";

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
    <div className="about-container">
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
          <h3 className="about-card-title">NIRANJ R</h3>
          <h2 className="about-card-heading">
            Your Partner in Bringing Your Web Design Vision to Life
          </h2>

          <p className="about-card-text">
            I'm a UI/UX Designer and Frontend Developer passionate about creating immersive,
            intuitive digital experiences. My approach blends design thinking and visual
            storytelling, where every interaction feels intentional and every layout flows with
            purpose.
          </p>

          <p className="about-card-text">
            I love transforming ideas into interfaces that connect with people — balancing form,
            function, and emotion. From wireframes to final pixels, I focus on clarity,
            consistency, and that subtle spark that makes a design memorable.
          </p>

          <p className="about-card-text">
            Driven by curiosity and a love for detail, I’m constantly exploring new tools, trends,
            and technologies to push creative boundaries and craft experiences that truly stand out.
          </p>

          <img src={aboutImg} alt="Niranj Portrait" className="about-card-img" />
        </div>
      </section>

      <div className="about-social-section">
        <div className="about-socials">
          <a href="#!" className="about-social-btn">
            <i className="fab fa-instagram about-icon"></i>
            <span className="about-social-text">INSTAGRAM</span>
            <span className="about-arrow">↗</span>
          </a>

          <a href="#!" className="about-social-btn">
            <i className="fab fa-twitter about-icon"></i>
            <span className="about-social-text">TWITTER</span>
            <span className="about-arrow">↗</span>
          </a>

          <a href="#!" className="about-social-btn">
            <i className="fab fa-facebook-f about-icon"></i>
            <span className="about-social-text">FACEBOOK</span>
            <span className="about-arrow">↗</span>
          </a>

          <a href="#!" className="about-social-btn">
            <i className="fab fa-github about-icon"></i>
            <span className="about-social-text">GITHUB</span>
            <span className="about-arrow">↗</span>
          </a>

          <a href="#!" className="about-social-btn">
            <i className="fab fa-linkedin about-icon"></i>
            <span className="about-social-text">LINKEDIN</span>
            <span className="about-arrow">↗</span>
          </a>

          <a href="#!" className="about-social-btn">
            <i className="fab fa-pinterest about-icon"></i>
            <span className="about-social-text">PINTEREST</span>
            <span className="about-arrow">↗</span>
          </a>
        </div>
      </div>

    </div>
  );
}
