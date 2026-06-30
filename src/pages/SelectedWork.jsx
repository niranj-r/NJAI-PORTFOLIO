import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import "../styles/SelectedWork.css";

const projects = [
  {
    id: 1,
    title: 'Space',
    category: 'WEBDESIGN',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 2,
    title: 'Nova',
    category: 'WEBDESIGN',
    image: 'https://images.unsplash.com/photo-1611791485440-24e8fc1d116f?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 3,
    title: 'Sonic',
    category: 'WEBDESIGN',
    image: 'https://images.unsplash.com/photo-1605236453806-6ff3685e219e?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 4,
    title: 'Solar',
    category: 'WEBDESIGN',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=1000'
  }
];

const SelectedWork = ({ onNavClick, onProjectClick }) => {
  return (
    <div className="selected-work-container">
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
        {projects.map((project) => (
          <div 
            className="project-card" 
            key={project.id}
            onClick={() => {
              if (onProjectClick) onProjectClick(project.title);
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="project-image-wrapper">
              <img src={project.image} alt={project.title} className="project-image" />
              <div className="hover-overlay">
                <div className="hover-icon"><FiArrowUpRight /></div>
              </div>
            </div>
            <div className="project-info">
              <span className="project-name">{project.title}</span>
              <span className="project-category">{project.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedWork;
