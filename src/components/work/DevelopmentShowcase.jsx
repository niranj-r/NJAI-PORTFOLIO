import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { getImageUrl } from '../../utils/getImageUrl';
import {
  hasContent,
  RichContent,
  DetailSection,
  DetailCard,
  renderTextCard,
  renderDeliverables,
  renderVideoBlock,
  ImageItemGrid,
  MetricsRow,
} from './WorkSharedBlocks';

const normalizeLegacyTechStack = (techStack) => {
  if (!techStack) return [];
  if (Array.isArray(techStack)) {
    return techStack
      .filter((item) => item && (item.name || item.items?.length > 0 || item.technologies?.length > 0))
      .map((item) => ({
        _key: item._key,
        name: item.name,
        category: item.category,
        icon: item.icon,
        description: item.description,
        items: item.items || item.technologies,
      }));
  }
  return Object.keys(techStack)
    .filter((cat) => Array.isArray(techStack[cat]) && techStack[cat].length > 0)
    .map((cat) => ({
      category: cat,
      items: techStack[cat],
    }));
};

const DevelopmentShowcase = ({ project }) => {
  const dev = project.developmentDetails || {};

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
  const challengesAndSolutions = (dev.challengesAndSolutions || []).filter(
    (item) => item && (item.challenge || item.solution || item.result)
  );

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

  const validFeatures = Array.isArray(keyFeatures)
    ? keyFeatures.filter((f) => (typeof f === 'string' ? f.trim().length > 0 : f && (f.title || f.description)))
    : [];

  return (
    <>
      <DetailSection
        label="REQUIREMENTS & DISCOVERY"
        title={<>Understanding Scope<br />&amp; User Needs.</>}
        style={{ marginTop: '4rem' }}
      >
        {renderTextCard('Problem Statement', problemStatement, 'prob')}
        {renderTextCard('Client / User Requirements', clientRequirements, 'req')}
        {renderTextCard('Target Users', targetUsers, 'users')}
        {renderTextCard('Project Scope & Goals', projectScope, 'scope')}
        {renderTextCard('Functional Requirements', functionalReqs, 'func')}
        {renderTextCard('Non-Functional Requirements', nonFunctionalReqs, 'nonfunc')}
      </DetailSection>

      <DetailSection
        label="SOLUTION & IMPLEMENTATION"
        title={<>Architecture, Stack<br />&amp; Engineering.</>}
        style={{ marginTop: '4rem' }}
      >
        {renderTextCard('Proposed Solution', proposedSolution, 'sol')}
        {hasContent(methodology) && (
          <DetailCard key="method" title="Development Methodology">
            <p className="wd-card-text">{methodology}</p>
          </DetailCard>
        )}
        {hasContent(devProcess) && (
          <DetailCard key="proc" title="Development Process">
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
          <DetailCard key="arch" title="System Architecture">
            {typeof architecture === 'string' || Array.isArray(architecture) ? (
              <RichContent value={architecture} />
            ) : (
              <>
                <RichContent value={architecture.description} />
                {getImageUrl(architecture.diagram) && (
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
              <DetailCard key={`tech-${idx}`} title={`${group.category} Stack`}>
                <div className="wd-tags-list">
                  {group.items.map((tech, i) => (
                    <span className="wd-tag" key={i}>{tech}</span>
                  ))}
                </div>
              </DetailCard>
            ))
          ) : (
            <DetailCard key="tech-grid" title="Technology Stack">
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
        {validFeatures.length > 0 && (
          typeof validFeatures[0] === 'string' ? (
            renderTextCard('Key Features', validFeatures, 'feat')
          ) : (
            <DetailCard key="feat-grid" title="Key Features">
              <div className="wd-features-grid">
                {validFeatures.map((feat, idx) => {
                  const iconUrl = getImageUrl(feat.icon);
                  const featImg = getImageUrl(feat.image?.image || feat.image);
                  return (
                    <div className="wd-feature-card" key={feat._key || idx}>
                      <div className="wd-feature-header">
                        {iconUrl && <img src={iconUrl} alt={feat.title} className="wd-tech-icon" />}
                        {feat.title && <h4 className="wd-feature-title">{feat.title}</h4>}
                      </div>
                      {feat.description && <p className="wd-card-text">{feat.description}</p>}
                      {featImg && (
                        <img
                          src={featImg}
                          alt={feat.image?.alt || feat.title || 'Feature'}
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
        {challengesAndSolutions.length > 0 && (
          <DetailCard key="cs" title="Challenges &amp; Solutions">
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
        {renderTextCard('Responsibilities', project.responsibilities, 'resp')}
        {renderTextCard('Lessons Learned', project.lessonsLearned, 'lessons')}
      </DetailSection>

      <DetailSection
        label="TESTING & DELIVERY"
        title={<>Quality, Performance<br />&amp; Deployment.</>}
        style={{ marginTop: '4rem' }}
      >
        {renderTextCard('Testing & Quality Assurance', testingAndQa, 'qa')}
        {renderTextCard('Performance Optimisation', performanceOptimisation, 'perf')}
        {renderTextCard('Security Considerations', securityConsiderations, 'sec')}
        {renderDeliverables(deliverables, 'Final Deliverables', 'deliv')}
        {renderVideoBlock(demoVideo, 'video')}
        {(liveUrl || repositoryUrl) && (
          <DetailCard key="links" title="Project Links">
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
        {renderTextCard('Project Outcome', outcome, 'outcome')}
        {renderTextCard('Impact and Results', impact, 'impact')}
        {renderTextCard('Future Enhancements', futureEnhancements, 'future')}
      </DetailSection>

      <MetricsRow metrics={metrics} />
    </>
  );
};

export default DevelopmentShowcase;
