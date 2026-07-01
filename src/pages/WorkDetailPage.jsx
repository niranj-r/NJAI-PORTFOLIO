import React, { useState, useEffect } from 'react';
import { FiArrowDown, FiArrowLeft } from 'react-icons/fi';
import { client, urlFor } from '../lib/sanity';
import "../styles/WorkDetailPage.css";

const WorkDetailPage = ({ onBack, projectTitle }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const query = '*[_type == "work" && title == $title][0]';
        const data = await client.fetch(query, { title: projectTitle });
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    if (projectTitle) fetchProject();
  }, [projectTitle]);

  if (loading) {
    return <div style={{ color: '#fff', padding: '5rem', textAlign: 'center' }}>Loading project...</div>;
  }

  if (!project) {
    return <div style={{ color: '#fff', padding: '5rem', textAlign: 'center' }}>Project not found.</div>;
  }

  return (
    <div className="work-detail-page">
      <div className="wd-header-controls">
        <div className="wd-back-button" onClick={onBack}>
          <span className="icon-circle"><FiArrowLeft /></span>
          <span className="button-text">BACK TO WORK</span>
        </div>
      </div>

      <div className="wd-hero">
        <h1 className="wd-hero-title">{project.title}</h1>
        <p className="wd-hero-subtitle">{project.category || 'Website Project'}</p>
        
        <div className="wd-stats-row">
          <div className="wd-stat-box">
            <span className="wd-stat-label">CLIENT</span>
            <span className="wd-stat-value">{project.client || 'N/A'}</span>
          </div>
          <div className="wd-stat-box">
            <span className="wd-stat-label">TIMELINE</span>
            <span className="wd-stat-value">{project.timeline || 'N/A'}</span>
          </div>
          <div className="wd-stat-box">
            <span className="wd-stat-label">SERVICES</span>
            <span className="wd-stat-value">{project.services || 'N/A'}</span>
          </div>
          {project.websiteUrl && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">WEBSITE</span>
              <a href={project.websiteUrl} target="_blank" rel="noreferrer" className="wd-stat-value" style={{ color: '#FF4D00', textDecoration: 'none' }}>
                VISIT SITE
              </a>
            </div>
          )}
        </div>

        <div className="wd-scroll-btn">
          <div className="wd-scroll-circle"><FiArrowDown /></div>
          <span>MORE DETAILS</span>
        </div>

        <div className="wd-hero-image-wrapper">
          {project.image && (
            <img 
              src={urlFor(project.image).url()} 
              alt={project.title} 
              className="wd-hero-image"
            />
          )}
        </div>
      </div>

      {(project.challenge || project.goal || project.result) && (
        <div className="wd-details-section">
          <div className="wd-details-left">
            <span className="wd-about-label">ABOUT</span>
            <h2 className="wd-about-title">Concept, Design, and<br/>Development. All-in-one.</h2>
          </div>
          <div className="wd-details-right">
            {project.challenge && (
              <div className="wd-detail-card">
                <h3 className="wd-card-title">Challenge</h3>
                <p className="wd-card-text">{project.challenge}</p>
              </div>
            )}
            {project.goal && (
              <div className="wd-detail-card">
                <h3 className="wd-card-title">Goal</h3>
                <p className="wd-card-text">{project.goal}</p>
              </div>
            )}
            {project.result && (
              <div className="wd-detail-card">
                <h3 className="wd-card-title">Result</h3>
                <p className="wd-card-text">{project.result}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkDetailPage;
