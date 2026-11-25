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
  RichMediaSection,
  ColorSwatchGrid,
  TypographyShowcase,
  DeliverablesList,
  BeforeAfterGrid,
  MetricsRow,
} from './WorkSharedBlocks';

const UiUxShowcase = ({ project }) => {
  const ui = project.uiUxDetails || {};

  const designBrief = ui.designBrief || project.uiDesign;
  const problemStatement = ui.problemStatement || project.challenge;
  const clientRequirements = ui.clientRequirements;
  const designGoals = ui.designGoals || project.goal;
  const targetAudience = ui.targetAudience;

  const hasResponsiveScreens =
    hasContent(ui.responsiveScreens?.desktop) ||
    hasContent(ui.responsiveScreens?.tablet) ||
    hasContent(ui.responsiveScreens?.mobile);

  return (
    <>
      {/* 1. Design Brief & Discovery */}
      <DetailSection
        label="DESIGN BRIEF & DISCOVERY"
        title={<>Problem Framing<br />&amp; Design Goals.</>}
        style={{ marginTop: '4rem' }}
      >
        <TextOrRichCard title="Design Brief" value={designBrief} />
        <TextOrRichCard title="Problem Statement" value={problemStatement} />
        <TextOrRichCard title="Client Requirements" value={clientRequirements} />
        <TextOrRichCard title="Design Goals" value={designGoals} />
        <TextOrRichCard title="Target Audience" value={targetAudience} />
      </DetailSection>

      {/* 2. UX Research */}
      <DetailSection
        label="UX RESEARCH"
        title={<>User Surveys, Personas<br />&amp; Insights.</>}
        style={{ marginTop: '4rem' }}
      >
        <TextOrRichCard title="Research Methodology" value={ui.researchMethodology} />
        {hasContent(ui.userSurveys) && ui.userSurveys.map((survey, idx) => (
          <DetailCard key={survey._key || idx} title={survey.title || `User Survey ${idx + 1}`}>
            {(survey.methodology || survey.participantCount) && (
              <div className="wd-inline-meta" style={{ marginBottom: '1rem' }}>
                {survey.participantCount && (
                  <div className="wd-inline-meta-item">
                    <span className="wd-stat-label">PARTICIPANTS</span>
                    <span className="wd-card-text">{survey.participantCount}</span>
                  </div>
                )}
                {survey.methodology && (
                  <div className="wd-inline-meta-item">
                    <span className="wd-stat-label">METHODOLOGY</span>
                    <span className="wd-card-text">{survey.methodology}</span>
                  </div>
                )}
              </div>
            )}
            <RichContent value={survey.findings} />
            <ImageItemGrid items={survey.supportingVisuals} standalone={false} altPrefix="Survey Visual" />
          </DetailCard>
        ))}
        <TextOrRichCard title="User Interviews" value={ui.userInterviews} />
        <TextOrRichCard title="Competitor Analysis" value={ui.competitorAnalysis} />
        <TextOrRichCard title="User Pain Points" value={ui.userPainPoints} />
        {hasContent(ui.userPersonas) && (
          <DetailCard title="User Personas">
            <div className="wd-personas-grid">
              {ui.userPersonas.map((persona, idx) => {
                const avatar = getImageUrl(persona.image?.image || persona.image);
                return (
                  <div className="wd-persona-card" key={persona._key || idx}>
                    <div className="wd-persona-header">
                      {avatar && <img src={avatar} alt={persona.name} className="wd-persona-avatar" />}
                      <h4 className="wd-feature-title">{persona.name}</h4>
                    </div>
                    {persona.description && <p className="wd-card-text">{persona.description}</p>}
                    {hasContent(persona.goals) && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <span className="wd-stat-label">GOALS</span>
                        <RichContent value={persona.goals} />
                      </div>
                    )}
                    {hasContent(persona.needs) && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <span className="wd-stat-label">NEEDS</span>
                        <RichContent value={persona.needs} />
                      </div>
                    )}
                    {hasContent(persona.painPoints) && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <span className="wd-stat-label">PAIN POINTS</span>
                        <RichContent value={persona.painPoints} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </DetailCard>
        )}
        {hasContent(ui.researchFindings) && (
          <DetailCard title="Key Research Findings &amp; Insights">
            <div className="wd-stacked-list">
              {ui.researchFindings.map((finding, idx) => {
                const imgUrl = getImageUrl(finding.supportingImage?.image || finding.supportingImage);
                return (
                  <div className="wd-cs-card" key={finding._key || idx}>
                    {finding.researchMethod && <span className="wd-stat-label">{finding.researchMethod}</span>}
                    {finding.finding && <p className="wd-card-text" style={{ marginTop: '0.4rem' }}><strong>Finding:</strong> {finding.finding}</p>}
                    {finding.insight && <p className="wd-card-text" style={{ marginTop: '0.4rem' }}><strong>Insight:</strong> {finding.insight}</p>}
                    {imgUrl && <img src={imgUrl} alt={finding.supportingImage?.alt || 'Research finding'} className="wd-feature-image" />}
                  </div>
                );
              })}
            </div>
          </DetailCard>
        )}
      </DetailSection>

      <ImageItemGrid items={ui.surveyVisuals} altPrefix="Survey Results Visual" />
      <RichMediaSection label="USER JOURNEY MAPPING" title="Mapping the Experience." block={ui.userJourneyMapping} defaultCardTitle="User Journey Mapping" altPrefix="User Journey Map" />
      <RichMediaSection label="INFORMATION ARCHITECTURE" title="Structuring Content &amp; Navigation." block={ui.informationArchitecture} defaultCardTitle="Information Architecture" altPrefix="IA Diagram" />
      <RichMediaSection label="USER FLOWS" title="End-to-End Flows." block={ui.userFlows} defaultCardTitle="User Flows" altPrefix="User Flow" />

      {/* 3. Ideation & Design Process */}
      <DetailSection
        label="IDEATION & PROCESS"
        title={<>Exploration, Flows<br />&amp; Design Rationale.</>}
        style={{ marginTop: '4rem' }}
      >
        <TextOrRichCard title="Design Approach" value={ui.designApproach} />
        <TextOrRichCard title="Visual Design Direction" value={ui.visualDesignDirection} />
        <TextOrRichCard title="Design Decision Rationale" value={ui.designRationale} />
      </DetailSection>

      <ImageItemGrid items={ui.initialSketches} altPrefix="Initial Sketch" />
      <ImageItemGrid items={ui.wireframes} altPrefix="Wireframe" />
      <ImageItemGrid items={ui.moodboard} altPrefix="Moodboard" />

      {/* 4. Visual Design & Design System */}
      <DetailSection
        label="VISUAL DESIGN & SYSTEM"
        title={<>Colors, Type, Components<br />&amp; Screens.</>}
        style={{ marginTop: '4rem' }}
      >
        <ColorSwatchGrid colors={ui.colorPalette} title="Color Palette" />
        <TextOrRichCard title="Color Selection Rationale" value={ui.colorSelectionRationale} />
        <TypographyShowcase items={ui.typography} />
        <TextOrRichCard title="Typography Selection Rationale" value={ui.typographySelectionRationale} />
        {ui.prototypeUrl && (
          <DetailCard title="Interactive Prototype">
            <a href={ui.prototypeUrl} target="_blank" rel="noreferrer" className="wd-external-link-btn">
              <span>Open Prototype / Figma</span>
              <FiExternalLink />
            </a>
          </DetailCard>
        )}
      </DetailSection>

      <RichMediaSection label="ICONOGRAPHY" title="Icon System." block={ui.iconography} defaultCardTitle="Iconography" altPrefix="Iconography" />
      <RichMediaSection label="UI COMPONENTS" title="Component Library." block={ui.uiComponents} defaultCardTitle="UI Components" altPrefix="UI Components" />
      <RichMediaSection label="DESIGN SYSTEM" title="Unified Design Tokens &amp; Guidelines." block={ui.designSystem} defaultCardTitle="Design System" altPrefix="Design System" />
      <ImageItemGrid items={ui.highFidelityDesigns} altPrefix="High-Fidelity Design" />

      {hasResponsiveScreens && (
        <DetailSection
          label="RESPONSIVE DESIGN"
          title={<>Desktop, Tablet<br />&amp; Mobile.</>}
          style={{ marginTop: '4rem' }}
        >
          {hasContent(ui.responsiveScreens?.desktop) && (
            <DetailCard title="Desktop Screens">
              <ImageItemGrid items={ui.responsiveScreens.desktop} standalone={false} altPrefix="Desktop Screen" />
            </DetailCard>
          )}
          {hasContent(ui.responsiveScreens?.tablet) && (
            <DetailCard title="Tablet Screens">
              <ImageItemGrid items={ui.responsiveScreens.tablet} standalone={false} altPrefix="Tablet Screen" />
            </DetailCard>
          )}
          {hasContent(ui.responsiveScreens?.mobile) && (
            <DetailCard title="Mobile Screens">
              <ImageItemGrid items={ui.responsiveScreens.mobile} standalone={false} columns={3} altPrefix="Mobile Screen" />
            </DetailCard>
          )}
        </DetailSection>
      )}

      {/* 5. Testing & Improvements */}
      <DetailSection
        label="TESTING & IMPROVEMENTS"
        title={<>Usability Testing<br />&amp; What Changed.</>}
        style={{ marginTop: '4rem' }}
      >
        <TextOrRichCard title="Usability Testing" value={ui.usabilityTesting} />
        <TextOrRichCard title="User Feedback" value={ui.userFeedback} />
        {hasContent(ui.designIterations) && ui.designIterations.map((iter, idx) => {
          const prevImg = getImageUrl(iter.previousDesign?.image || iter.previousDesign);
          const revImg = getImageUrl(iter.revisedDesign?.image || iter.revisedDesign);
          return (
            <DetailCard key={iter._key || idx} title={`Design Iteration ${idx + 1}`}>
              <div className="wd-before-after-grid">
                {prevImg && (
                  <div className="wd-ba-box wd-ba-before">
                    <span className="wd-stat-label">PREVIOUS DESIGN</span>
                    <img src={prevImg} alt={iter.previousDesign?.alt || 'Previous design'} className="wd-ba-image" />
                  </div>
                )}
                {revImg && (
                  <div className="wd-ba-box wd-ba-after">
                    <span className="wd-stat-label">REVISED DESIGN</span>
                    <img src={revImg} alt={iter.revisedDesign?.alt || 'Revised design'} className="wd-ba-image" />
                  </div>
                )}
              </div>
              {iter.feedback && <p className="wd-card-text" style={{ marginTop: '1rem' }}><strong>Feedback:</strong> {iter.feedback}</p>}
              {iter.changesMade && <p className="wd-card-text" style={{ marginTop: '0.5rem' }}><strong>Changes Made:</strong> {iter.changesMade}</p>}
            </DetailCard>
          );
        })}
        <BeforeAfterGrid items={ui.beforeAfterComparisons} />
        <TextOrRichCard title="Changes Made" value={ui.changesMade} />
        <TextOrRichCard title="Reasons for Changes" value={ui.reasonsForChanges} />
        <TextOrRichCard title="Accessibility Considerations" value={ui.accessibilityConsiderations} />
      </DetailSection>

      {/* 6. Final Outcome */}
      <ImageItemGrid items={ui.finalUiDesigns} altPrefix="Final UI Design" />
      <ImageItemGrid items={ui.finalMockups} altPrefix="Final Design Mockup" />

      <DetailSection
        label="FINAL OUTCOME"
        title={<>Final Designs<br />&amp; Usability Impact.</>}
        style={{ marginTop: '4rem' }}
      >
        <TextOrRichCard title="Final Design Outcome" value={ui.finalOutcome || project.result} />
        <TextOrRichCard title="Results and Impact" value={ui.resultsAndImpact} />
        <DeliverablesList items={ui.finalDeliverables || project.deliverables} />
      </DetailSection>

      <MetricsRow metrics={ui.usabilityMetrics} />
    </>
  );
};

export default UiUxShowcase;

