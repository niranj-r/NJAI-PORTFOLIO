import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    { role: 'model', parts: [{ text: "Hi! I'm Niranjan's AI assistant. Ask me anything about his projects, skills, or experience." }] }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');

    // Add user message to history
    const newHistory = [...history, { role: 'user', parts: [{ text: userMessage }] }];
    setHistory(newHistory);
    setIsLoading(true);

    try {
      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          // Don't send the very first welcome message back as context to save tokens, though gemini handles it fine
          history: newHistory.slice(1, -1),
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Add model response
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: data.reply }] }]);
    } catch (error) {
      console.error('Chat error:', error);
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting right now. Please try again later." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className={`chatbot-fab ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiMessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">N</div>
                <div>
                  <h3>Chat with Niranj</h3>
                  <span className="chatbot-status">Online</span>
                </div>
              </div>
              <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                <FiX size={20} />
              </button>
            </div>

            <div className="chatbot-messages">
              {history.map((msg, index) => (
                <div key={index} className={`chatbot-message-wrapper ${msg.role === 'user' ? 'user' : 'model'}`}>
                  {msg.role === 'model' && index !== 0 && <div className="chatbot-avatar-small">N</div>}
                  <div className={`chatbot-message ${msg.role === 'user' ? 'user' : 'model'}`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="chatbot-message-wrapper model">
                  <div className="chatbot-avatar-small">N</div>
                  <div className="chatbot-message model typing">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chatbot-input-area" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Ask me anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
              />
              <button type="submit" disabled={!message.trim() || isLoading}>
                <FiSend size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
