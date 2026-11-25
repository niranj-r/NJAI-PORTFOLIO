import React, { useState, useEffect, useRef } from 'react';
import { FiArrowLeft, FiSend, FiX, FiMessageSquare, FiUpload } from 'react-icons/fi';
import MuseumScene from '../components/museum/MuseumScene';
import { loadMuseumKnowledge, askMuseumNpc } from '../components/museum/museumRag';
import '../styles/NotFoundPage.css';

const QUICK_PROMPTS = [
  'What works have you built?',
  'Tell me about your blogs',
  'What are your skills & services?',
  'How can I contact Niranj?',
];

const NotFoundPage = ({ onNavClick }) => {
  const [, setZone] = useState('ENTRANCE HALL');
  const [activeTerminalRoom, setActiveTerminalRoom] = useState(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isNearNpc, setIsNearNpc] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [knowledge, setKnowledge] = useState(null);
  const [customNpcSkinUrl, setCustomNpcSkinUrl] = useState(null);
  const [customNpcGlbUrl, setCustomNpcGlbUrl] = useState(null);
  const [uploadedAssetName, setUploadedAssetName] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'npc',
      text: "Hi! I'm Niranj's assistant in The Lost Wing. Ask me anything about my works, blogs, skills, services, or contact details.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const blobUrlsRef = useRef([]);

  useEffect(() => {
    let active = true;
    loadMuseumKnowledge().then((data) => {
      if (active) setKnowledge(data);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const urls = blobUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyE' && isNearNpc && !isChatOpen) {
        e.preventDefault();
        setIsChatOpen(true);
      } else if (e.code === 'Escape' && isChatOpen) {
        e.preventDefault();
        setIsChatOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNearNpc, isChatOpen]);

  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isChatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isReplying]);

  const handleNpcAssetUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const lower = file.name.toLowerCase();
    const objectUrl = URL.createObjectURL(file);
    blobUrlsRef.current.push(objectUrl);

    if (lower.endsWith('.glb') || lower.endsWith('.gltf')) {
      setCustomNpcGlbUrl(objectUrl);
      setCustomNpcSkinUrl(null);
      setUploadedAssetName(file.name);
    } else if (lower.endsWith('.png') || lower.endsWith('.webp') || lower.endsWith('.jpg')) {
      setCustomNpcSkinUrl(objectUrl);
      setCustomNpcGlbUrl(null);
      setUploadedAssetName(file.name);
    }
    e.target.value = '';
  };

  const sendQuestion = async (rawText) => {
    const query = rawText.trim();
    if (!query || isReplying) return;

    const nextHistory = [...messages, { role: 'user', text: query }];
    setMessages(nextHistory);
    setInput('');
    setIsReplying(true);

    try {
      const kb = knowledge || (await loadMuseumKnowledge());
      if (!knowledge) setKnowledge(kb);
      const reply = await askMuseumNpc({
        knowledge: kb,
        message: query,
        history: nextHistory,
      });
      setMessages((prev) => [...prev, { role: 'npc', text: reply }]);
    } finally {
      setIsReplying(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendQuestion(input);
  };

  return (
    <div className="not-found-container">
      <div className="not-found-canvas-wrapper">
        <MuseumScene
          activeTerminalRoom={activeTerminalRoom}
          isChatOpen={isChatOpen}
          isNearNpc={isNearNpc}
          isNpcTalking={isChatOpen || isReplying}
          customNpcSkinUrl={customNpcSkinUrl}
          customNpcGlbUrl={customNpcGlbUrl}
          onZoneChange={setZone}
          onTerminalRoomChange={setActiveTerminalRoom}
          onPointerLockChange={setIsPointerLocked}
          onNearNpcChange={setIsNearNpc}
          onInteractNpc={() => setIsChatOpen(true)}
        />
      </div>

      {/* Hidden File Input for .GLB / .PNG Character Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf,.png"
        onChange={handleNpcAssetUpload}
        style={{ display: 'none' }}
      />

      {/* Subtle Center Crosshair */}
      <div className="not-found-crosshair" aria-hidden="true" />

      {/* Top HUD */}
      <div className="not-found-top-hud">
        <span className="not-found-hint">
          {isChatOpen
            ? 'Dialogue Active • Type your question or press ESC to Resume Walking'
            : isPointerLocked
              ? 'WASD / Arrows to Walk • Mouse to Look • ESC to Release Cursor'
              : 'Click or Drag Canvas to Look • WASD / Arrows to Walk • Talk to the Guide'}
        </span>
      </div>

      {/* In-Game Proximity Prompt */}
      {isNearNpc && !isChatOpen && (
        <div className="npc-interact-prompt-wrap">
          <button
            type="button"
            className="npc-interact-prompt"
            onClick={() => setIsChatOpen(true)}
          >
            <FiMessageSquare size={15} />
            <span>Chat with Niranj</span>
          </button>
        </div>
      )}

      {/* Website-Styled Chatbot Dialogue Screen */}
      {isChatOpen && (
        <div className="npc-dialogue-backdrop">
          <div className="npc-dialogue-panel" role="dialog" aria-label="Chat with Niranj">
            <div className="npc-dialogue-header">
              <div className="npc-dialogue-title-group">
                <div className="npc-avatar">N</div>
                <div>
                  <h3 className="npc-dialogue-name">Chat with Niranj</h3>
                  <span className="npc-dialogue-meta">
                    <span className="npc-online-dot" />
                    {knowledge
                      ? `Online • ${knowledge.counts.works} Works • ${knowledge.counts.blogs} Blogs`
                      : 'Syncing...'}
                  </span>
                </div>
              </div>
            </div>

            <div className="npc-dialogue-messages">
              {messages.map((msg, idx) => (
                <div
                  key={`npc-msg-${idx}`}
                  className={`npc-msg-row ${msg.role === 'user' ? 'user' : 'model'}`}
                >
                  {msg.role !== 'user' && <div className="npc-avatar-small">N</div>}
                  <div className={`npc-msg ${msg.role === 'user' ? 'user' : 'model'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isReplying && (
                <div className="npc-msg-row model">
                  <div className="npc-avatar-small">N</div>
                  <div className="npc-msg model typing">
                    <span className="npc-typing-dot" />
                    <span className="npc-typing-dot" />
                    <span className="npc-typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="npc-quick-chips">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="npc-chip"
                  disabled={isReplying}
                  onClick={() => sendQuestion(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form className="npc-dialogue-form" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="npc-dialogue-input"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isReplying}
              />
              <button
                type="submit"
                className="npc-dialogue-send"
                disabled={!input.trim() || isReplying}
                aria-label="Send message"
              >
                <FiSend size={17} />
              </button>
            </form>
          </div>
        </div>
      )}

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
