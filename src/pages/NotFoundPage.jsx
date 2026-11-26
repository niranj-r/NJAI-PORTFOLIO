import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import MuseumScene from '../components/museum/MuseumScene';
import CuratorDialogue from '../components/museum/CuratorDialogue';
import '../styles/NotFoundPage.css';

const JOYSTICK_MAX_RADIUS = 38;

const NotFoundPage = ({ onNavClick }) => {
  const [, setZone] = useState('ENTRANCE HALL');
  const [activeTerminalRoom, setActiveTerminalRoom] = useState(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [nearCurator, setNearCurator] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [isMobileControls, setIsMobileControls] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.innerWidth <= 900 ||
      window.matchMedia?.('(pointer: coarse)').matches ||
      navigator.maxTouchPoints > 0
    );
  });
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });

  const touchMoveRef = useRef({ forward: 0, strafe: 0 });
  const joystickRef = useRef(null);
  const joystickPointerIdRef = useRef(null);

  useEffect(() => {
    const updateDeviceControls = () => {
      const mobile =
        window.innerWidth <= 900 ||
        window.matchMedia?.('(pointer: coarse)').matches ||
        navigator.maxTouchPoints > 0;
      setIsMobileControls(mobile);
    };
    window.addEventListener('resize', updateDeviceControls);
    return () => window.removeEventListener('resize', updateDeviceControls);
  }, []);

  const resetJoystick = useCallback(() => {
    joystickPointerIdRef.current = null;
    touchMoveRef.current.forward = 0;
    touchMoveRef.current.strafe = 0;
    setKnobOffset({ x: 0, y: 0 });
  }, []);

  const openDialogue = useCallback(() => {
    resetJoystick();
    setDialogueOpen(true);
  }, [resetJoystick]);

  const closeDialogue = useCallback(() => {
    setDialogueOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyE' && nearCurator && !dialogueOpen) {
        e.preventDefault();
        openDialogue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearCurator, dialogueOpen, openDialogue]);

  const updateJoystickFromClient = (clientX, clientY) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist > JOYSTICK_MAX_RADIUS) {
      dx = (dx / dist) * JOYSTICK_MAX_RADIUS;
      dy = (dy / dist) * JOYSTICK_MAX_RADIUS;
    }

    setKnobOffset({ x: dx, y: dy });
    const normX = dx / JOYSTICK_MAX_RADIUS;
    const normY = -dy / JOYSTICK_MAX_RADIUS;

    touchMoveRef.current.strafe = Math.abs(normX) < 0.12 ? 0 : normX;
    touchMoveRef.current.forward = Math.abs(normY) < 0.12 ? 0 : normY;
  };

  const handleJoystickPointerDown = (e) => {
    e.stopPropagation();
    if (joystickPointerIdRef.current !== null) return;
    joystickPointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateJoystickFromClient(e.clientX, e.clientY);
  };

  const handleJoystickPointerMove = (e) => {
    if (joystickPointerIdRef.current !== e.pointerId) return;
    e.stopPropagation();
    updateJoystickFromClient(e.clientX, e.clientY);
  };

  const handleJoystickPointerUp = (e) => {
    if (joystickPointerIdRef.current !== e.pointerId) return;
    e.stopPropagation();
    resetJoystick();
  };

  return (
    <div className="not-found-container">
      <div className="not-found-canvas-wrapper">
        <MuseumScene
          activeTerminalRoom={activeTerminalRoom}
          isDialogueOpen={dialogueOpen}
          touchMoveRef={touchMoveRef}
          onSceneReady={() => setSceneReady(true)}
          onZoneChange={setZone}
          onTerminalRoomChange={setActiveTerminalRoom}
          onPointerLockChange={setIsPointerLocked}
          onCuratorNearChange={setNearCurator}
          onCuratorInteract={openDialogue}
        />
      </div>

      {!sceneReady && (
        <div className="not-found-scene-loader" role="status" aria-live="polite">
          <span className="not-found-scene-loader-text">Entering The Lost Wing...</span>
        </div>
      )}

      {/* Subtle Center Crosshair */}
      {!dialogueOpen && <div className="not-found-crosshair" aria-hidden="true" />}

      {/* Top HUD */}
      <div className="not-found-top-hud">
        <span className="not-found-hint">
          {dialogueOpen
            ? 'Speaking with The Curator'
            : isMobileControls
              ? 'Left Stick to Walk • Drag Screen to Look'
              : isPointerLocked
                ? 'WASD / Arrows to Walk • Mouse to Look • ESC to Release Cursor'
                : 'Click or Drag Canvas to Look • WASD / Arrows to Walk'}
        </span>
      </div>

      {/* Proximity Interaction Prompt (Desktop E + Mobile Tap) */}
      {nearCurator && !dialogueOpen && (
        <div className="curator-prompt-wrap">
          <button
            type="button"
            className="curator-prompt-btn"
            onClick={openDialogue}
          >
            {isMobileControls ? 'Tap to interact' : 'Press E to interact'}
          </button>
        </div>
      )}

      {/* Mobile Virtual Joystick */}
      {!dialogueOpen && (
        <div
          ref={joystickRef}
          className={`not-found-touch-joystick${isMobileControls ? ' is-visible' : ''}`}
          aria-label="Virtual movement joystick"
          onPointerDown={handleJoystickPointerDown}
          onPointerMove={handleJoystickPointerMove}
          onPointerUp={handleJoystickPointerUp}
          onPointerCancel={handleJoystickPointerUp}
        >
          <div className="touch-joystick-ring">
            <div
              className="touch-joystick-knob"
              style={{ transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)` }}
            />
          </div>
          <span className="touch-joystick-label">MOVE</span>
        </div>
      )}

      {/* Branching Dialogue Interface */}
      {dialogueOpen && (
        <CuratorDialogue
          onClose={closeDialogue}
          onExitToHome={() => onNavClick('home')}
        />
      )}

      {/* Bottom Return Button */}
      {!dialogueOpen && (
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
      )}
    </div>
  );
};

export default NotFoundPage;
