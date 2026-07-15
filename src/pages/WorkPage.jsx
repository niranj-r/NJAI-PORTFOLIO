import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { FiArrowUpRight } from 'react-icons/fi';
import { client, urlFor } from '../lib/sanity';
import "../styles/SelectedWork.css";
import "../styles/WorkPage.css";

const WorkPage = ({ onProjectClick }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const query = '*[_type == "work"] | order(_createdAt desc)';
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
    <motion.div
      className="work-page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="work-page-header">
        <h1 className="work-page-title">Work<br /><em>& Projects</em></h1>
        <p className="work-page-subtitle">Some of my latest projects & works, see how I can<br />help bring your ideas to life.</p>
      </div>

      <div className="selected-work-container" style={{ paddingTop: '2rem', backgroundColor: 'transparent' }}>
        {/* Projects Grid reused from SelectedWork */}
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
    </motion.div>
  );
};

export default WorkPage;
