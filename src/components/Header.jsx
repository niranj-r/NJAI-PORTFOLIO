import React from "react";
import "./Header.css";
import logo from "../assets/logo.png"; // 🔸 replace with your logo path

export default function Header({ onNavClick }) {
  return (
    <header className="header-container">
      <nav className="header-nav">
        <ul className="header-menu">
          <li>
            <a 
              href="#about" 
              onClick={(e) => {
                if (onNavClick) {
                  e.preventDefault();
                  onNavClick('about');
                }
              }}
            >
              about
            </a>
          </li>
          <li>
            <a href="#projects">projects</a>
          </li>
          <li className="header-logo">
            <a 
              href="#home"
              onClick={(e) => {
                if (onNavClick) {
                  e.preventDefault();
                  onNavClick('home');
                }
              }}
              style={{ display: 'inline-flex', cursor: 'pointer' }}
            >
              <img src={logo} alt="Logo" />
            </a>
          </li>
          <li><a href="#skills">skills</a></li>
          <li>
            <a 
              href="#blog"
              onClick={(e) => {
                if (onNavClick) {
                  e.preventDefault();
                  onNavClick('blog');
                }
              }}
            >
              blog
            </a>
          </li>
          <li>
            <a 
              href="#contact"
              onClick={(e) => {
                if (onNavClick) {
                  e.preventDefault();
                  onNavClick('contact');
                }
              }}
            >
              contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
