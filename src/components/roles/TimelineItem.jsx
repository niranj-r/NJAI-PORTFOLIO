import React from 'react';
import { motion } from 'framer-motion';

/**
 * Single editorial timeline node matching the alternating left/right layout of SkillsTimeline.
 */
const TimelineItem = ({ item, index }) => {
  const alignment = index % 2 === 0 ? 'right' : 'left';

  const card = (
    <article className="roles-timeline-card">
      <div className="roles-card-meta">
        <span className="roles-card-org">{item.organization}</span>
        <span className="roles-card-duration">{item.duration}</span>
      </div>

      <h3 className="roles-card-title">{item.title}</h3>
      <p className="roles-card-description">{item.description}</p>

      {Array.isArray(item.highlights) && item.highlights.length > 0 && (
        <ul className="roles-card-highlights">
          {item.highlights.map((point, idx) => (
            <li key={`${item.id}-pt-${idx}`}>{point}</li>
          ))}
        </ul>
      )}
    </article>
  );

  return (
    <motion.div
      className={`roles-timeline-item ${alignment}`}
      initial={{ opacity: 0, x: alignment === 'left' ? -36 : 36 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="roles-timeline-half left-half">
        {alignment === 'left' && card}
      </div>

      <div className="roles-timeline-circle" aria-hidden="true">
        {item.id}
      </div>

      <div className="roles-timeline-half right-half">
        {alignment === 'right' && card}
      </div>
    </motion.div>
  );
};

export default TimelineItem;
