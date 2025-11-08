import React from "react";
import "./Header.css";
import logo from "../assets/logo.png"; // 🔸 replace with your logo path

export default function Header() {
  return (
    <header className="header-container">
      <nav className="header-nav">
        <ul className="header-menu">
          <li><a href="#about">about</a></li>
          <li><a href="#projects">projects</a></li>
          <li className="header-logo">
            <img src={logo} alt="Logo" />
          </li>
          <li><a href="#skills">skills</a></li>
          <li><a href="#contact">contact</a></li>
        </ul>
      </nav>
    </header>
  );
}
