import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import MuseumScene from '../components/museum/MuseumScene';
import '../styles/NotFoundPage.css';

const NotFoundPage = ({ onNavClick }) => {
  const [zone, setZone] = useState('ENTRANCE HALL');
  const [activeTerminalRoom, setActiveTerminalRoom] = useState(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  return (
    <div className="not-found-container">
      <div className="not-found-canvas-wrapper">
        <MuseumScene
          activeTerminalRoom={activeTerminalRoom}
          onZoneChange={setZone}
          onTerminalRoomChange={setActiveTerminalRoom}
          onPointerLockChange={setIsPointerLocked}
        />
      </div>

      {/* Subtle Center Crosshair */}
      <div className="not-found-crosshair" aria-hidden="true" />

      {/* Top HUD */}
      <div className="not-found-top-hud">
        <span className="not-found-badge">
          {activeTerminalRoom ? `404 — ${zone}` : zone}
        </span>
        <span className="not-found-hint">
          {isPointerLocked
            ? 'WASD / Arrows to Walk • Mouse to Look • ESC to Release Cursor'
            : 'Click or Drag Canvas to Look • WASD / Arrows to Walk'}
        </span>
      </div>

      {/* Bottom Return Button */}
      <div className="not-found-overlay">
        <button
          type="button"
          className="not-found-btn-outline"
          onClick={() => onNavClick('home')}
        >
          <FiArrowLeft className="btn-icon-left" />
          <span>Return to Homepage</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
