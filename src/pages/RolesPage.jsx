import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import { ROLE_CATEGORIES, ROLES_TIMELINE_DATA } from '../data/rolesTimeline';
import TimelineItem from '../components/roles/TimelineItem';
import '../styles/RolesPage.css';

const RolesPage = () => {
  const [activeCategory, setActiveCategory] = useState(ROLE_CATEGORIES[0].id);
  const tabRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentCategory =
    ROLE_CATEGORIES.find((cat) => cat.id === activeCategory) || ROLE_CATEGORIES[0];
  const currentEntries = ROLES_TIMELINE_DATA[activeCategory] || [];

  const handleTabKeyDown = (e, idx) => {
    let nextIdx = null;
    if (e.key === 'ArrowRight') {
      nextIdx = (idx + 1) % ROLE_CATEGORIES.length;
    } else if (e.key === 'ArrowLeft') {
      nextIdx = (idx - 1 + ROLE_CATEGORIES.length) % ROLE_CATEGORIES.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = ROLE_CATEGORIES.length - 1;
    }

    if (nextIdx !== null) {
      e.preventDefault();
      setActiveCategory(ROLE_CATEGORIES[nextIdx].id);
      tabRefs.current[nextIdx]?.focus();
    }
  };

  const scrollToTimeline = () => {
    const el = document.getElementById('roles-timeline-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.main
      className="roles-page-container"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {/* Dedicated Editorial Introduction */}
      <header className="roles-intro">
        <span className="roles-eyebrow">MY JOURNEY</span>
        <h1 className="roles-heading">
          Roles <br /><em>&amp; Milestones</em>
        </h1>
        <p className="roles-subtitle">
          A chronological record of academic grounding, hands-on engineering practice, and
          community leadership — ordered from the present work back to where it began.
        </p>

        <button
          type="button"
          className="roles-scroll-arrow"
          onClick={scrollToTimeline}
          aria-label="Scroll to journey timeline"
        >
          <FiArrowDown />
        </button>

        {/* Category Switcher */}
        <div
          className="roles-tab-bar"
          role="tablist"
          aria-label="Journey timeline categories"
        >
          {ROLE_CATEGORIES.map((category, idx) => {
            const isSelected = activeCategory === category.id;
            return (
              <button
                key={category.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                id={`roles-tab-${category.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls="roles-timeline-tabpanel"
                tabIndex={isSelected ? 0 : -1}
                className={`roles-tab-btn${isSelected ? ' active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Switchable Timeline Content */}
      <section
        id="roles-timeline-section"
        className="roles-timeline-section"
        aria-label={currentCategory.label}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            id="roles-timeline-tabpanel"
            role="tabpanel"
            aria-labelledby={`roles-tab-${activeCategory}`}
            className="roles-tabpanel"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <div className="roles-timeline-wrapper">
              <div className="roles-timeline-line" aria-hidden="true" />
              {currentEntries.map((item, idx) => (
                <TimelineItem
                  key={`${activeCategory}-${item.id}`}
                  item={item}
                  index={idx}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>
    </motion.main>
  );
};

export default RolesPage;
