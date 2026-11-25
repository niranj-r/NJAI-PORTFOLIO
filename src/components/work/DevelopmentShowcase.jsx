import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { getImageUrl } from '../../utils/getImageUrl';
import {
  hasContent,
  RichContent,
  DetailSection,
  DetailCard,
  TextOrRichCard,
  ImageItemGrid,
  MetricsRow,
  DeliverablesList,
  VideoBlock,
} from './WorkSharedBlocks';

const normalizeLegacyTechStack = (techStack) => {
  if (!techStack) return [];
  if (Array.isArray(techStack)) {
    return techStack.map((item) => ({
      name: item.name,
      category: item.category,
      icon: item.icon,
      description: item.description,
      items: item.items || item.technologies,
    }));
  }
  return Object.keys(techStack).map((cat) => ({
    category: cat,
    items: techStack[cat] || [],
  }));
};

const DevelopmentShowcase = ({ project }) => {
  const dev = project.developmentDetails || {};

  // Support both structured developmentDetails and legacy flat fields (e.g., works.json)
  const problemStatement = dev.problemStatement || project.challenge;
  const clientRequirements = dev.clientRequirements || project.userRequirements;
  const targetUsers = dev.targetUsers;
  const projectScope = dev.projectScope || project.goal;
  const functionalReqs = dev.functionalRequirements;
  const nonFunctionalReqs = dev.nonFunctionalRequirements;

  const proposedSolution = dev.proposedSolution || project.solution;
  const techStack = dev.technologyStack || project.techStack;
  const methodology = dev.developmentMethodology;
  const devProcess = dev.developmentProcess || project.developmentProcess;
  const architecture = dev.systemArchitecture || project.architecture;
  const keyFeatures = dev.keyFeatures || project.features;
  const challengesAndSolutions = dev.challengesAndSolutions;

  const testingAndQa = dev.testingAndQa;
  const performanceOptimisation = dev.performanceOptimisation;
  const securityConsiderations = dev.securityConsiderations;
  const deliverables = dev.finalDeliverables || project.deliverables;
  const screenshots = dev.finalScreenshots;
  const demoVideo = dev.demoVideo;
  const liveUrl = dev.liveUrl || project.websiteUrl;
  const repositoryUrl = dev.repositoryUrl || project.githubUrl;

  const outcome = dev.projectOutcome || project.outputOfWork || project.result;
  const impact = dev.impactAndResults;
  const metrics = dev.metrics || project.metrics || project.statistics;
  const futureEnhancements = dev.futureEnhancements;

  const normalizedTech = normalizeLegacyTechStack(techStack);
  const isLegacyGroupedTech = normalizedTech.length > 0 && Array.isArray(normalizedTech[0]?.items);

  return (
    <>
      <DetailSection
        label="REQUIREMENTS & DISCOVERY"
        title={<>Understanding Scope<br />&amp; User Needs.</>}
        style={{ marginTop: '4rem' }}
      >
        <TextOrRichCard title="Problem Statement" value={problemStatement} />
        <TextOrRichCard title="Client / User Requirements" value={clientRequirements} />
        <TextOrRichCard title="Target Users" value={targetUsers} />
        <TextOrRichCard title="Project Scope &amp; Goals" value={projectScope} />
        <TextOrRichCard title="Functional Requirements" value={functionalReqs} />
        <TextOrRichCard title="Non-Functional Requirements" value={nonFunctionalReqs} />
      </DetailSection>

      <DetailSection
        label="SOLUTION & IMPLEMENTATION"
        title={<>Architecture, Stack<br />&amp; Engineering.</>}
        style={{ marginTop: '4rem' }}
      >
        <TextOrRichCard title="Proposed Solution" value={proposedSolution} />
        {hasContent(methodology) && (
          <DetailCard title="Development Methodology">
            <p className="wd-card-text">{methodology}</p>
          </DetailCard>
        )}
        {hasContent(devProcess) && (
          <DetailCard title="Development Process">
            {Array.isArray(devProcess) && typeof devProcess[0] === 'string' ? (
              <div className="wd-tags-list">
                {devProcess.map((step, i) => (
                  <span className="wd-tag" key={i}>{`${i + 1}. ${step}`}</span>
                ))}
              </div>
            ) : (
              <RichContent value={devProcess} />
            )}
          </DetailCard>
        )}
        {hasContent(architecture) && (
          <DetailCard title="System Architecture">
            {typeof architecture === 'string' || Array.isArray(architecture) ? (
              <RichContent value={architecture} />
            ) : (
              <>
                <RichContent value={architecture.description} />
                {architecture.diagram?.image && (
                  <div className="wd-gallery-item" style={{ marginTop: '1.5rem' }}>
                    <img
                      src={getImageUrl(architecture.diagram)}
                      alt={architecture.diagram.alt || 'System Architecture Diagram'}
                      className="wd-gallery-image"
                    />
                    {architecture.diagram.caption && (
                      <span className="wd-gallery-caption">{architecture.diagram.caption}</span>
                    )}
                  </div>
                )}
              </>
            )}
          </DetailCard>
        )}
        {normalizedTech.length > 0 && (
          isLegacyGroupedTech ? (
            normalizedTech.map((group, idx) => (
              <DetailCard key={idx} title={`${group.category} Stack`}>
                <div className="wd-tags-list">
                  {group.items.map((tech, i) => (
                    <span className="wd-tag" key={i}>{tech}</span>
                  ))}
                </div>
              </DetailCard>
            ))
          ) : (
            <DetailCard title="Technology Stack">
              <div className="wd-tech-grid">
                {normalizedTech.map((tech, idx) => {
                  const iconUrl = getImageUrl(tech.icon);
                  return (
                    <div className="wd-tech-card" key={tech._key || idx}>
                      {iconUrl && <img src={iconUrl} alt={tech.name} className="wd-tech-icon" />}
                      <div>
                        <span className="wd-tech-name">{tech.name}</span>
                        {tech.category && <span className="wd-tech-category">{tech.category}</span>}
                        {tech.description && <p className="wd-tech-desc">{tech.description}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </DetailCard>
          )
        )}
        {hasContent(keyFeatures) && (
          Array.isArray(keyFeatures) && typeof keyFeatures[0] === 'string' ? (
            <DetailCard title="Key Features">
              <RichContent value={keyFeatures} />
            </DetailCard>
          ) : (
            <DetailCard title="Key Features">
              <div className="wd-features-grid">
                {keyFeatures.map((feat, idx) => {
                  const iconUrl = getImageUrl(feat.icon);
                  const featImg = getImageUrl(feat.image?.image || feat.image);
                  return (
                    <div className="wd-feature-card" key={feat._key || idx}>
                      <div className="wd-feature-header">
                        {iconUrl && <img src={iconUrl} alt={feat.title} className="wd-tech-icon" />}
                        <h4 className="wd-feature-title">{feat.title}</h4>
                      </div>
                      {feat.description && <p className="wd-card-text">{feat.description}</p>}
                      {featImg && (
                        <img
                          src={featImg}
                          alt={feat.image?.alt || feat.title}
                          className="wd-feature-image"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </DetailCard>
          )
        )}
        {hasContent(challengesAndSolutions) && (
          <DetailCard title="Challenges &amp; Solutions">
            <div className="wd-stacked-list">
              {challengesAndSolutions.map((item, idx) => (
                <div className="wd-cs-card" key={item._key || idx}>
                  {item.challenge && (
                    <p className="wd-card-text"><strong>Challenge:</strong> {item.challenge}</p>
                  )}
                  {item.solution && (
                    <p className="wd-card-text" style={{ marginTop: '0.5rem' }}><strong>Solution:</strong> {item.solution}</p>
                  )}
                  {item.result && (
                    <p className="wd-card-text" style={{ marginTop: '0.5rem' }}><strong>Result:</strong> {item.result}</p>
                  )}
                </div>
              ))}
            </div>
          </DetailCard>
        )}
        <TextOrRichCard title="Responsibilities" value={project.responsibilities} />
        <TextOrRichCard title="Lessons Learned" value={project.lessonsLearned} />
      </DetailSection>

      <DetailSection
        label="TESTING & DELIVERY"
        title={<>Quality, Performance<br />&amp; Deployment.</>}
        style={{ marginTop: '4rem' }}
      >
        <TextOrRichCard title="Testing &amp; Quality Assurance" value={testingAndQa} />
        <TextOrRichCard title="Performance Optimisation" value={performanceOptimisation} />
        <TextOrRichCard title="Security Considerations" value={securityConsiderations} />
        <DeliverablesList items={deliverables} />
        <VideoBlock video={demoVideo} />
        {(liveUrl || repositoryUrl) && (
          <DetailCard title="Project Links">
            <div className="wd-links-row">
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noreferrer" className="wd-external-link-btn">
                  <span>Live Project</span>
                  <FiExternalLink />
                </a>
              )}
              {repositoryUrl && (
                <a href={repositoryUrl} target="_blank" rel="noreferrer" className="wd-external-link-btn wd-external-link-btn--secondary">
                  <span>Source Repository</span>
                  <FiExternalLink />
                </a>
              )}
            </div>
          </DetailCard>
        )}
      </DetailSection>

      <ImageItemGrid items={screenshots} altPrefix={`${project.title} Screenshot`} />

      <DetailSection
        label="RESULTS & OUTCOME"
        title={<>Measurable Impact<br />&amp; Next Steps.</>}
        style={{ marginTop: '4rem' }}
      >
        <TextOrRichCard title="Project Outcome" value={outcome} />
        <TextOrRichCard title="Impact and Results" value={impact} />
        <TextOrRichCard title="Future Enhancements" value={futureEnhancements} />
      </DetailSection>

      <MetricsRow metrics={metrics} />
    </>
  );
};

export default DevelopmentShowcase;

