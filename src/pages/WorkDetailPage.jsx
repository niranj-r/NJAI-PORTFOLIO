import React, { useState, useEffect, useRef } from 'react';
import { FiArrowDown, FiArrowLeft } from 'react-icons/fi';
import { client } from '../lib/sanity';
import { WORK_DETAIL_QUERY } from '../lib/queries';
import mockWorks from '../data/works.json';
import { getImageUrl } from '../utils/getImageUrl';
import {
  getWorkType,
  getWorkBadgeLabel,
  getProjectCardImage,
  getProjectCardImageAlt,
} from '../utils/workHelpers';
import {
  DetailSection,
  renderTextCard,
  ImageItemGrid,
  TeamMembersRow,
  TestimonialBlock,
  CustomSectionsRenderer,
} from '../components/work/WorkSharedBlocks';
import DevelopmentShowcase from '../components/work/DevelopmentShowcase';
import UiUxShowcase from '../components/work/UiUxShowcase';
import BrandingShowcase from '../components/work/BrandingShowcase';
import "../styles/WorkDetailPage.css";

const WorkDetailPage = ({ onBack, projectTitle }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const detailsRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProject = async () => {
      try {
        const data = await client.fetch(WORK_DETAIL_QUERY, { identifier: projectTitle });
        if (data) {
          setProject(data);
        } else {
          const fallback = mockWorks.find(
            (w) => w.slug === projectTitle || w._id === projectTitle || w.title === projectTitle
          );
          setProject(fallback || null);
        }
      } catch (error) {
        console.error("Error fetching project from Sanity, falling back to local data:", error);
        const fallback = mockWorks.find(
          (w) => w.slug === projectTitle || w._id === projectTitle || w.title === projectTitle
        );
        setProject(fallback || null);
      } finally {
        setLoading(false);
      }
    };
    if (projectTitle) fetchProject();
  }, [projectTitle]);

  useEffect(() => {
    if (!project) return undefined;
    const prevTitle = document.title;
    if (project.seoTitle || project.title) {
      document.title = project.seoTitle || `${project.title} — Portfolio`;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute('content');
    if (metaDesc && (project.seoDescription || project.shortDescription)) {
      metaDesc.setAttribute('content', project.seoDescription || project.shortDescription);
    }
    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc !== undefined && prevDesc !== null) {
        metaDesc.setAttribute('content', prevDesc);
      }
    };
  }, [project]);

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)', padding: '5rem', textAlign: 'center' }}>Loading project...</div>;
  }

  if (!project) {
    return <div style={{ color: 'var(--text-secondary)', padding: '5rem', textAlign: 'center' }}>Project not found.</div>;
  }

  const workType = getWorkType(project);
  const clientName = project.clientName || project.client;
  const duration = project.projectDuration || project.timeline;
  const services = project.servicesProvided || project.services;
  const overview = project.projectOverview || project.overview;
  const objectives = project.projectObjectives;
  const coverImage = getProjectCardImage(project);
  const gallery = project.projectGallery || project.gallery;
  const testimonial = project.clientTestimonial || project.testimonial;

  const liveUrl = project.developmentDetails?.liveUrl || project.websiteUrl;
  const repoUrl = project.developmentDetails?.repositoryUrl || project.githubUrl;
  const prototypeUrl = project.uiUxDetails?.prototypeUrl || project.figmaUrl || project.prototypeUrl;

  const handleScrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`work-detail-page ${workType !== 'development' ? 'work-detail-page--design' : ''}`}>
      <div className="wd-header-controls">
        <div className="wd-back-button" onClick={onBack}>
          <span className="icon-circle"><FiArrowLeft /></span>
          <span className="button-text">BACK TO WORK</span>
        </div>
      </div>

      <div className="wd-hero">
        <span className="wd-type-badge">{getWorkBadgeLabel(project)}</span>
        <h1 className="wd-hero-title">{project.title}</h1>
        {(project.shortDescription || project.subtitle || project.projectType) && (
          <p className="wd-hero-subtitle">
            {project.shortDescription || project.subtitle || project.projectType}
          </p>
        )}

        <div className="wd-stats-row">
          {clientName && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">CLIENT</span>
              <span className="wd-stat-value">{clientName}</span>
            </div>
          )}
          {project.industry && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">INDUSTRY</span>
              <span className="wd-stat-value">{project.industry}</span>
            </div>
          )}
          {duration && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">DURATION</span>
              <span className="wd-stat-value">{duration}</span>
            </div>
          )}
          {project.completionDate && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">COMPLETED</span>
              <span className="wd-stat-value">{project.completionDate}</span>
            </div>
          )}
          {project.role && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">ROLE</span>
              <span className="wd-stat-value">{project.role}</span>
            </div>
          )}
          {services && services.length > 0 && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">SERVICES</span>
              <span className="wd-stat-value">
                {Array.isArray(services) ? services.join(', ') : services}
              </span>
            </div>
          )}
          {liveUrl && workType === 'development' && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">
                {project.projectType && project.projectType.toLowerCase().includes('mobile') ? 'APP STORE' : 'LIVE LINK'}
              </span>
              <a href={liveUrl} target="_blank" rel="noreferrer" className="wd-stat-value" style={{ color: 'var(--brand-primary)', textDecoration: 'none' }}>
                VIEW
              </a>
            </div>
          )}
          {repoUrl && workType === 'development' && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">REPOSITORY</span>
              <a href={repoUrl} target="_blank" rel="noreferrer" className="wd-stat-value" style={{ color: 'var(--brand-primary)', textDecoration: 'none' }}>
                VIEW CODE
              </a>
            </div>
          )}
          {prototypeUrl && workType === 'ui-ux' && (
            <div className="wd-stat-box">
              <span className="wd-stat-label">PROTOTYPE</span>
              <a href={prototypeUrl} target="_blank" rel="noreferrer" className="wd-stat-value" style={{ color: 'var(--brand-primary)', textDecoration: 'none' }}>
                OPEN FIGMA
              </a>
            </div>
          )}
        </div>

        <div
          className="wd-scroll-btn"
          onClick={handleScrollToDetails}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleScrollToDetails();
          }}
        >
          <div className="wd-scroll-circle"><FiArrowDown /></div>
          <span>MORE DETAILS</span>
        </div>

        {coverImage && (
          <div className="wd-hero-image-wrapper">
            <img
              src={getImageUrl(coverImage)}
              alt={getProjectCardImageAlt(project)}
              className="wd-hero-image"
            />
            {project.coverImage?.caption && (
              <span className="wd-gallery-caption" style={{ display: 'block', marginTop: '0.6rem', textAlign: 'center' }}>
                {project.coverImage.caption}
              </span>
            )}
          </div>
        )}
      </div>

      <div ref={detailsRef} className="wd-details-container">
        {/* Common Overview & Objectives */}
        <DetailSection label="OVERVIEW" title={<>Project Overview<br />&amp; Objectives.</>}>
          {renderTextCard('Project Overview', overview, 'overview')}
          {renderTextCard('Project Objectives', objectives, 'objectives')}
        </DetailSection>

        <TeamMembersRow members={project.teamMembers} />

        {/* Render ONLY the active category / subcategory showcase */}
        {workType === 'development' && <DevelopmentShowcase project={project} />}
        {workType === 'ui-ux' && <UiUxShowcase project={project} />}
        {workType === 'branding' && <BrandingShowcase project={project} />}

        {/* Dynamic Custom Content Sections */}
        <CustomSectionsRenderer sections={project.customSections} />

        {/* General Project Gallery */}
        <ImageItemGrid items={gallery} altPrefix={`${project.title} Gallery`} />

        {/* Client Testimonial */}
        <TestimonialBlock testimonial={testimonial} />
      </div>
    </div>
  );
};

export default WorkDetailPage;
