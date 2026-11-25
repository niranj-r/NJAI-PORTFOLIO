import React, { useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import { FiArrowUpRight } from 'react-icons/fi';
import { client } from '../lib/sanity';
import { ALL_WORKS_QUERY } from '../lib/queries';
import mockWorks from '../data/works.json';
import { getImageUrl } from '../utils/getImageUrl';
import {
  getWorkCategory,
  getWorkType,
  getWorkBadgeLabel,
  getWorkIdentifier,
  getProjectCardImage,
  getProjectCardImageAlt,
  getProjectCardDescription,
} from '../utils/workHelpers';
import "../styles/SelectedWork.css";
import "../styles/WorkPage.css";

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Work' },
  { id: 'development', label: 'Development' },
  { id: 'design', label: 'Design' }
];

const DESIGN_TYPE_FILTERS = [
  { id: 'all', label: 'All Design' },
  { id: 'ui-ux', label: 'UI / UX Design' },
  { id: 'branding', label: 'Branding' }
];

const WorkPage = ({ onProjectClick }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDesignType, setActiveDesignType] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await client.fetch(ALL_WORKS_QUERY);
        setProjects(Array.isArray(data) && data.length > 0 ? data : mockWorks);
      } catch (error) {
        console.error("Error fetching works from Sanity, falling back to local data:", error);
        setProjects(mockWorks);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (activeCategory === 'all') return true;
      const category = getWorkCategory(project);
      if (category !== activeCategory) return false;
      if (activeCategory === 'design' && activeDesignType !== 'all') {
        return getWorkType(project) === activeDesignType;
      }
      return true;
    });
  }, [projects, activeCategory, activeDesignType]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId !== 'design') {
      setActiveDesignType('all');
    }
  };

  return (
    <motion.div
      className="work-page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="work-page-header">
        <h1 className="work-page-title">Work<br /><em>&amp; Projects</em></h1>
        <p className="work-page-subtitle">Some of my latest projects &amp; works, see how I can<br />help bring your ideas to life.</p>

        <div className="wp-filter-bar">
          <div className="wp-filter-group">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`wp-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {activeCategory === 'design' && (
            <div className="wp-filter-group wp-subfilter-group">
              {DESIGN_TYPE_FILTERS.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className={`wp-filter-btn wp-subfilter-btn ${activeDesignType === type.id ? 'active' : ''}`}
                  onClick={() => setActiveDesignType(type.id)}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="selected-work-container" style={{ paddingTop: '2rem', backgroundColor: 'transparent' }}>
        <div className="projects-grid">
          {loading ? (
            <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Loading works...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="wp-empty-state">
              No projects published in this category yet.
            </div>
          ) : (
            filteredProjects.map((project, index) => {
              const cardImage = getProjectCardImage(project);
              const cardDesc = getProjectCardDescription(project);
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
                  <div className="project-info wp-project-info">
                    <span className="wp-project-badge">{getWorkBadgeLabel(project)}</span>
                    <h3 className="wp-project-name">
                      {project.title}
                    </h3>
                    {cardDesc && (
                      <p className="wp-project-desc">
                        {cardDesc}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WorkPage;
