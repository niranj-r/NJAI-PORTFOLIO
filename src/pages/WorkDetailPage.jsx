import React, { useState, useEffect } from 'react';
import { FiArrowDown, FiArrowLeft } from 'react-icons/fi';
// import { client, urlFor } from '../lib/sanity';
import mockWorks from '../data/works.json';
import { getImageUrl } from '../utils/getImageUrl';
import "../styles/WorkDetailPage.css";

const WorkDetailPage = ({ onBack, projectTitle }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProject = async () => {
      try {
        // const query = '*[_type == "work" && title == $title][0]';
        // const data = await client.fetch(query, { title: projectTitle });
        const data = await new Promise(resolve =>
          setTimeout(() => resolve(mockWorks.find(w => w.title === projectTitle)), 400)
        );
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
          {project.client && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">CLIENT</span>
              <span className="wd-stat-value">{project.client}</span>
            </div>
          )}
          {project.timeline && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">TIMELINE</span>
              <span className="wd-stat-value">{project.timeline}</span>
            </div>
          )}
          {project.role && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">ROLE</span>
              <span className="wd-stat-value">{project.role}</span>
            </div>
          )}
          {project.services && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">SERVICES</span>
              <span className="wd-stat-value">
                {Array.isArray(project.services) ? project.services.join(', ') : project.services}
              </span>
            </div>
          )}
          {project.websiteUrl && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">WEBSITE</span>
              <a href={project.websiteUrl} target="_blank" rel="noreferrer" className="wd-stat-value" style={{ color: 'var(--brand-primary)', textDecoration: 'none' }}>
                VISIT SITE
              </a>
            </div>
          )}
          {project.githubUrl && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">GITHUB</span>
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="wd-stat-value" style={{ color: 'var(--brand-primary)', textDecoration: 'none' }}>
                VIEW CODE
              </a>
            </div>
          )}
        </div>

        <div className="wd-scroll-btn">
          <div className="wd-scroll-circle"><FiArrowDown /></div>
          <span>MORE DETAILS</span>
        </div>

        <div className="wd-hero-image-wrapper">
          {project.coverImage || project.image ? (
            <img
              src={getImageUrl(project.coverImage || project.image)}
              alt={project.title}
              className="wd-hero-image"
            />
          ) : null}
        </div>
      </div>

      {/* Metrics Section */}
      {project.metrics && project.metrics.length > 0 && (
        <div className="wd-details-section">
          <div className="wd-metrics-container">
            {project.metrics.map((metric, idx) => (
              <div className="wd-metric-box" key={idx}>
                <span className="wd-metric-value">{metric.value}</span>
                <span className="wd-metric-label">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overview & About Section */}
      {(project.overview || project.challenge || project.goal || project.solution || project.result) && (
        <div className="wd-details-section">
          <div className="wd-details-left">
            <span className="wd-about-label">ABOUT</span>
            <h2 className="wd-about-title">Concept, Design, and<br />Development. All-in-one.</h2>
          </div>
          <div className="wd-details-right">
            {project.overview && (
              <div className="wd-detail-card">
                <h3 className="wd-card-title">Overview</h3>
                <p className="wd-card-text">{project.overview}</p>
              </div>
            )}
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
            {project.solution && (
              <div className="wd-detail-card">
                <h3 className="wd-card-title">Solution</h3>
                <p className="wd-card-text">{project.solution}</p>
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

      {/* Tech Stack & Features */}
      {(project.features || project.techStack) && (
        <div className="wd-details-section" style={{ marginTop: '4rem' }}>
          <div className="wd-details-left">
            <span className="wd-about-label">TECHNOLOGY</span>
            <h2 className="wd-about-title">Features &<br />Tech Stack.</h2>
          </div>
          <div className="wd-details-right">
            {project.features && (
              <div className="wd-detail-card">
                <h3 className="wd-card-title">Key Features</h3>
                <ul className="wd-list">
                  {project.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.techStack && Object.keys(project.techStack).map((category, idx) => (
              <div className="wd-detail-card" key={idx}>
                <h3 className="wd-card-title" style={{ textTransform: 'capitalize' }}>{category} Stack</h3>
                <div className="wd-tags-list">
                  {project.techStack[category].map((tech, i) => (
                    <span className="wd-tag" key={i}>{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="wd-details-section">
          <div className="wd-gallery-grid">
            {project.gallery.map((img, idx) => (
              <img 
                key={idx}
                src={getImageUrl(img)}
                alt={`${project.title} Gallery ${idx + 1}`}
                className="wd-gallery-image"
              />
            ))}
          </div>
        </div>
      )}

      {/* Testimonial */}
      {project.testimonial && (
        <div className="wd-details-section">
          <div className="wd-testimonial-box" style={{ width: '100%' }}>
            <p className="wd-testimonial-quote">"{project.testimonial.quote}"</p>
            <p className="wd-testimonial-author">{project.testimonial.author}</p>
            <p className="wd-testimonial-position">{project.testimonial.position}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkDetailPage;
