import React, { useState, useEffect } from 'react';

const DIALOGUE_NODES = {
  root: {
    text: 'Welcome to our collection of missing things.',
    choices: [
      { label: 'Who are you?', next: 'curator' },
      { label: 'Where is the missing page?', next: 'missing_page' },
      { label: 'What is this museum?', next: 'museum' },
      { label: 'How do I exit?', next: 'exit' },
      { label: 'Leave', action: 'close' },
    ],
  },
  curator: {
    text: 'I am The Curator. I keep watch over every broken link, forgotten route, and unbuilt gallery that drifts here.',
    choices: [
      { label: 'Why the porcelain mask?', next: 'curator_mask' },
      { label: 'Ask something else', next: 'root' },
      { label: 'Leave', action: 'close' },
    ],
  },
  curator_mask: {
    text: 'A collection of absences does not require a face. Only patience, stillness, and someone to greet those who wander off the map.',
    choices: [
      { label: 'Ask something else', next: 'root' },
      { label: 'Leave', action: 'close' },
    ],
  },
  missing_page: {
    text: 'The address you requested no longer exists—or perhaps it has not been painted yet. Follow any corridor to its end if you wish to see what remains.',
    choices: [
      { label: 'Do all three paths lead to the same place?', next: 'three_paths' },
      { label: 'Ask something else', next: 'root' },
      { label: 'Leave', action: 'close' },
    ],
  },
  three_paths: {
    text: 'Left, forward, or through the winding dark—each path measures a different distance, yet every wall ends in the same 404.',
    choices: [
      { label: 'Ask something else', next: 'root' },
      { label: 'Leave', action: 'close' },
    ],
  },
  museum: {
    text: 'This is The Lost Wing. Concrete, red signal lamps, and quiet rooms reserved for works that slipped between routes.',
    choices: [
      { label: 'Why are some frames empty?', next: 'museum_frames' },
      { label: 'Ask something else', next: 'root' },
      { label: 'Leave', action: 'close' },
    ],
  },
  museum_frames: {
    text: 'What hangs here depends on what the builder leaves behind. Even an empty frame records the shape of something missing.',
    choices: [
      { label: 'Ask something else', next: 'root' },
      { label: 'Leave', action: 'close' },
    ],
  },
  exit: {
    text: 'You may walk the wing for as long as you like. Whenever you wish to return to the world above, use the door back to the homepage.',
    choices: [
      { label: 'Return to Homepage', action: 'home' },
      { label: 'Stay and explore', action: 'close' },
      { label: 'Ask something else', next: 'root' },
    ],
  },
};

const CuratorDialogue = ({ onClose, onExitToHome }) => {
  const [nodeId, setNodeId] = useState('root');
  const node = DIALOGUE_NODES[nodeId] || DIALOGUE_NODES.root;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChoice = (choice) => {
    if (choice.action === 'close') {
      onClose();
      return;
    }
    if (choice.action === 'home') {
      onExitToHome();
      return;
    }
    if (choice.next) {
      setNodeId(choice.next);
    }
  };

  return (
    <div
      className="curator-dialogue-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Conversation with The Curator"
    >
      <div className="curator-dialogue-box">
        <div className="curator-dialogue-header">
          <span className="curator-dialogue-speaker">THE CURATOR</span>
          <button
            type="button"
            className="curator-dialogue-close"
            onClick={onClose}
            aria-label="Close dialogue"
          >
            ESC / CLOSE
          </button>
        </div>

        <p className="curator-dialogue-text">{node.text}</p>

        <div className="curator-dialogue-choices">
          {node.choices.map((choice) => (
            <button
              key={choice.label}
              type="button"
              className="curator-choice-btn"
              onClick={() => handleChoice(choice)}
            >
              <span className="curator-choice-marker">&gt;</span>
              <span>{choice.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CuratorDialogue;
