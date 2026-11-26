import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import heroDark from '../assets/404hero.webp';
import heroLight from '../assets/404heroLight.webp';
import heroDarkMobile from '../assets/404heroMobile.webp';
import heroLightMobile from '../assets/404heroLightMobile.webp';
import '../styles/NotFoundPage.css';

const MuseumScene = lazy(() => import('../components/museum/MuseumScene'));
const CuratorDialogue = lazy(() => import('../components/museum/CuratorDialogue'));

const checkIsLaptopInteractive = () => {
  if (typeof window === 'undefined') return true;
  const wideEnough = window.innerWidth >= 1024;
  const hasFinePointer = window.matchMedia
    ? window.matchMedia('(hover: hover) and (pointer: fine)').matches
    : true;
  return wideEnough && hasFinePointer;
};

const StockNotFound = ({ theme, onNavClick }) => {
  const heroImgDesktop = theme === 'light' ? heroLight : heroDark;
  const heroImgMobile = theme === 'light' ? heroLightMobile : heroDarkMobile;

  return (
    <motion.div
      className="stock-not-found-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Image Anchored to Right/Bottom */}
      <div className="stock-not-found-hero-bg">
        <picture>
          <source media="(max-width: 992px)" srcSet={heroImgMobile} />
          <motion.img
            src={heroImgDesktop}
            alt="404 Graphic"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          />
        </picture>
      </div>

      {/* Foreground Content */}
      <div className="stock-not-found-content">
        <h1 className="stock-not-found-404">404</h1>
        <h2 className="stock-not-found-title">PAGE NOT FOUND</h2>
        <p className="stock-not-found-subtitle">
          Looks like you&apos;ve taken a wrong turn.
          <br />
          Let&apos;s get you back on track.
        </p>

        <button
          type="button"
          className="stock-not-found-btn-outline"
          onClick={() => onNavClick('home')}
        >
          <span className="btn-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </span>
          <span className="btn-text">Go Home</span>
        </button>
      </div>
    </motion.div>
  );
};

const NotFoundPage = ({ theme, onNavClick }) => {
  const [isLaptop, setIsLaptop] = useState(checkIsLaptopInteractive);
  const [, setZone] = useState('ENTRANCE HALL');
  const [activeTerminalRoom, setActiveTerminalRoom] = useState(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [nearCurator, setNearCurator] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const nextIsLaptop = checkIsLaptopInteractive();
      setIsLaptop(nextIsLaptop);
      if (!nextIsLaptop) {
        setSceneReady(false);
        setDialogueOpen(false);
        setNearCurator(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openDialogue = useCallback(() => {
    setDialogueOpen(true);
  }, []);

  const closeDialogue = useCallback(() => {
    setDialogueOpen(false);
  }, []);

  useEffect(() => {
    if (!isLaptop) return undefined;
    const handleKeyDown = (e) => {
      if (e.code === 'KeyE' && nearCurator && !dialogueOpen) {
        e.preventDefault();
        openDialogue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLaptop, nearCurator, dialogueOpen, openDialogue]);

  if (!isLaptop) {
    return <StockNotFound theme={theme} onNavClick={onNavClick} />;
  }

  return (
    <div className="not-found-container">
      <div className="not-found-canvas-wrapper">
        <Suspense fallback={null}>
          <MuseumScene
            activeTerminalRoom={activeTerminalRoom}
            isDialogueOpen={dialogueOpen}
            onSceneReady={() => setSceneReady(true)}
            onZoneChange={setZone}
            onTerminalRoomChange={setActiveTerminalRoom}
            onPointerLockChange={setIsPointerLocked}
            onCuratorNearChange={setNearCurator}
            onCuratorInteract={openDialogue}
          />
        </Suspense>
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
            ? 'Speaking with The Curator • ESC to Resume'
            : isPointerLocked
              ? 'WASD / Arrows to Walk • Mouse to Look • ESC to Release Cursor'
              : 'Click or Drag Canvas to Look • WASD / Arrows to Walk'}
        </span>
      </div>

      {/* Proximity Interaction Prompt */}
      {nearCurator && !dialogueOpen && (
        <div className="curator-prompt-wrap">
          <button
            type="button"
            className="curator-prompt-btn"
            onClick={openDialogue}
          >
            Press E to interact
          </button>
        </div>
      )}

      {/* Branching Dialogue Interface */}
      {dialogueOpen && (
        <Suspense fallback={null}>
          <CuratorDialogue
            onClose={closeDialogue}
            onExitToHome={() => onNavClick('home')}
          />
        </Suspense>
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
