import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { client, urlFor } from '../lib/sanity';
import "../styles/SelectedWork.css";

const SelectedWork = ({ onNavClick, onProjectClick }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const query = '*[_type == "work"] | order(_createdAt desc)[0...4]';
        const data = await client.fetch(query);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching works:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="selected-work-container" id="projects">
      {/* Header */}
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

      {/* Projects Grid */}
      <div className="projects-grid">
        {loading ? (
          <div style={{ color: '#fff', padding: '2rem' }}>Loading works...</div>
        ) : (
          projects.map((project, index) => (
            <motion.div 
              className="project-card" 
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              onClick={() => {
                if (onProjectClick) onProjectClick(project.title);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="project-image-wrapper">
                {project.image && (
                  <img 
                    src={urlFor(project.image).url()} 
                    alt={project.title} 
                    className="project-image" 
                  />
                )}
                <div className="hover-overlay">
                  <div className="hover-icon"><FiArrowUpRight /></div>
                </div>
              </div>
              <div className="project-info">
                <span className="project-name">{project.title}</span>
                <span className="project-category">{project.category}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectedWork;
