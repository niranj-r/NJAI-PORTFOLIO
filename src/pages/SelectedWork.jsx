import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { client } from '../lib/sanity';
import { SELECTED_WORKS_QUERY } from '../lib/queries';
import mockWorks from '../data/works.json';
import { getImageUrl } from '../utils/getImageUrl';
import {
  getWorkBadgeLabel,
  getWorkIdentifier,
  getProjectCardImage,
  getProjectCardImageAlt,
} from '../utils/workHelpers';
import "../styles/SelectedWork.css";

const SelectedWork = ({ onNavClick, onProjectClick }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await client.fetch(SELECTED_WORKS_QUERY);
        setProjects(Array.isArray(data) && data.length > 0 ? data : mockWorks.slice(0, 4));
      } catch (error) {
        console.error("Error fetching works from Sanity, falling back to local data:", error);
        setProjects(mockWorks.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="selected-work-container" id="projects">
      <div className="selected-work-header">
        <h2 className="selected-work-title">
          Selected <em>Work</em>
        </h2>
        <div
          className="see-all-button"
          onClick={() => {
            if (onNavClick) onNavClick('work');
          }}
          style={{ cursor: 'pointer' }}
        >
          <span className="icon-circle"><FiArrowUpRight /></span>
          <span className="button-text">SEE ALL</span>
        </div>
      </div>

      <div className="projects-grid">
        {loading ? (
          <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Loading works...</div>
        ) : (
          projects.map((project, index) => {
            const cardImage = getProjectCardImage(project);
            return (
              <motion.div
                className="project-card"
                key={project._id || project.slug || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                onClick={() => {
                  if (onProjectClick) onProjectClick(getWorkIdentifier(project));
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="project-image-wrapper">
                  {cardImage && (
                    <img
                      src={getImageUrl(cardImage)}
                      alt={getProjectCardImageAlt(project)}
                      className="project-image"
                    />
                  )}
                  <div className="hover-overlay">
                    <div className="hover-icon"><FiArrowUpRight /></div>
                  </div>
                </div>
                <div className="project-info">
                  <span className="project-name">{project.title}</span>
                  <span className="project-category">{getWorkBadgeLabel(project)}</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SelectedWork;
