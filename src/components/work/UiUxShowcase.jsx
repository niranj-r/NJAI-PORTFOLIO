import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { getImageUrl } from '../../utils/getImageUrl';
import {
  hasContent,
  RichContent,
  DetailSection,
  DetailCard,
  renderTextCard,
  renderColorSwatches,
  renderTypography,
  renderDeliverables,
  renderBeforeAfter,
  ImageItemGrid,
  RichMediaSection,
  MetricsRow,
} from './WorkSharedBlocks';

const UiUxShowcase = ({ project }) => {
  const ui = project.uiUxDetails || {};

  const designBrief = ui.designBrief || project.uiDesign;
  const problemStatement = ui.problemStatement || project.challenge;
  const clientRequirements = ui.clientRequirements;
  const designGoals = ui.designGoals || project.goal;
  const targetAudience = ui.targetAudience;

  const validSurveys = (ui.userSurveys || []).filter(
    (s) => s && (s.title || s.methodology || s.participantCount || hasContent(s.findings) || hasContent(s.supportingVisuals))
  );
  const validPersonas = (ui.userPersonas || []).filter(
    (p) => p && (p.name || p.description || hasContent(p.goals) || hasContent(p.needs) || hasContent(p.painPoints) || getImageUrl(p.image))
  );
  const validFindings = (ui.researchFindings || []).filter(
    (f) => f && (f.researchMethod || f.finding || f.insight || getImageUrl(f.supportingImage))
  );
  const validIterations = (ui.designIterations || []).filter(
    (it) =>
      it &&
      (getImageUrl(it.previousDesign) || getImageUrl(it.revisedDesign) || it.feedback || it.changesMade)
  );

  const desktopScreens = (ui.responsiveScreens?.desktop || []).filter((i) => Boolean(getImageUrl(i?.image || i)));
  const tabletScreens = (ui.responsiveScreens?.tablet || []).filter((i) => Boolean(getImageUrl(i?.image || i)));
  const mobileScreens = (ui.responsiveScreens?.mobile || []).filter((i) => Boolean(getImageUrl(i?.image || i)));

  return (
    <>
      {/* 1. Design Brief & Discovery */}
      <DetailSection
        label="DESIGN BRIEF & DISCOVERY"
        title={<>Problem Framing<br />&amp; Design Goals.</>}
        style={{ marginTop: '4rem' }}
      >
        {renderTextCard('Design Brief', designBrief, 'brief')}
        {renderTextCard('Problem Statement', problemStatement, 'prob')}
        {renderTextCard('Client Requirements', clientRequirements, 'req')}
        {renderTextCard('Design Goals', designGoals, 'goals')}
        {renderTextCard('Target Audience', targetAudience, 'aud')}
      </DetailSection>

      {/* 2. UX Research */}
      <DetailSection
        label="UX RESEARCH"
        title={<>User Surveys, Personas<br />&amp; Insights.</>}
        style={{ marginTop: '4rem' }}
      >
        {renderTextCard('Research Methodology', ui.researchMethodology, 'rmeth')}
        {validSurveys.map((survey, idx) => (
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
        {renderTextCard('User Interviews', ui.userInterviews, 'interviews')}
        {renderTextCard('Competitor Analysis', ui.competitorAnalysis, 'comp')}
        {renderTextCard('User Pain Points', ui.userPainPoints, 'pain')}
        {validPersonas.length > 0 && (
          <DetailCard key="personas" title="User Personas">
            <div className="wd-personas-grid">
              {validPersonas.map((persona, idx) => {
                const avatar = getImageUrl(persona.image?.image || persona.image);
                return (
                  <div className="wd-persona-card" key={persona._key || idx}>
                    <div className="wd-persona-header">
                      {avatar && <img src={avatar} alt={persona.name || 'Persona'} className="wd-persona-avatar" />}
                      {persona.name && <h4 className="wd-feature-title">{persona.name}</h4>}
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
        {validFindings.length > 0 && (
          <DetailCard key="findings" title="Key Research Findings &amp; Insights">
            <div className="wd-stacked-list">
              {validFindings.map((finding, idx) => {
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
        {renderTextCard('Design Approach', ui.designApproach, 'approach')}
        {renderTextCard('Visual Design Direction', ui.visualDesignDirection, 'vdir')}
        {renderTextCard('Design Decision Rationale', ui.designRationale, 'rat')}
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
        {renderColorSwatches(ui.colorPalette, 'Color Palette', 'colors')}
        {renderTextCard('Color Selection Rationale', ui.colorSelectionRationale, 'colrat')}
        {renderTypography(ui.typography)}
        {renderTextCard('Typography Selection Rationale', ui.typographySelectionRationale, 'typrat')}
        {ui.prototypeUrl && (
          <DetailCard key="proto" title="Interactive Prototype">
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

      <DetailSection
        label="RESPONSIVE DESIGN"
        title={<>Desktop, Tablet<br />&amp; Mobile.</>}
        style={{ marginTop: '4rem' }}
      >
        {desktopScreens.length > 0 && (
          <DetailCard key="desk" title="Desktop Screens">
            <ImageItemGrid items={desktopScreens} standalone={false} altPrefix="Desktop Screen" />
          </DetailCard>
        )}
        {tabletScreens.length > 0 && (
          <DetailCard key="tab" title="Tablet Screens">
            <ImageItemGrid items={tabletScreens} standalone={false} altPrefix="Tablet Screen" />
          </DetailCard>
        )}
        {mobileScreens.length > 0 && (
          <DetailCard key="mob" title="Mobile Screens">
            <ImageItemGrid items={mobileScreens} standalone={false} columns={3} altPrefix="Mobile Screen" />
          </DetailCard>
        )}
      </DetailSection>

      {/* 5. Testing & Improvements */}
      <DetailSection
        label="TESTING & IMPROVEMENTS"
        title={<>Usability Testing<br />&amp; What Changed.</>}
        style={{ marginTop: '4rem' }}
      >
        {renderTextCard('Usability Testing', ui.usabilityTesting, 'utest')}
        {renderTextCard('User Feedback', ui.userFeedback, 'ufeedback')}
        {validIterations.map((iter, idx) => {
          const prevImg = getImageUrl(iter.previousDesign?.image || iter.previousDesign);
          const revImg = getImageUrl(iter.revisedDesign?.image || iter.revisedDesign);
          return (
            <DetailCard key={iter._key || idx} title={`Design Iteration ${idx + 1}`}>
              {(prevImg || revImg) && (
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
              )}
              {iter.feedback && <p className="wd-card-text" style={{ marginTop: '1rem' }}><strong>Feedback:</strong> {iter.feedback}</p>}
              {iter.changesMade && <p className="wd-card-text" style={{ marginTop: '0.5rem' }}><strong>Changes Made:</strong> {iter.changesMade}</p>}
            </DetailCard>
          );
        })}
        {renderBeforeAfter(ui.beforeAfterComparisons)}
        {renderTextCard('Changes Made', ui.changesMade, 'changes')}
        {renderTextCard('Reasons for Changes', ui.reasonsForChanges, 'reasons')}
        {renderTextCard('Accessibility Considerations', ui.accessibilityConsiderations, 'a11y')}
      </DetailSection>

      {/* 6. Final Outcome */}
      <ImageItemGrid items={ui.finalUiDesigns} altPrefix="Final UI Design" />
      <ImageItemGrid items={ui.finalMockups} altPrefix="Final Design Mockup" />

      <DetailSection
        label="FINAL OUTCOME"
        title={<>Final Designs<br />&amp; Usability Impact.</>}
        style={{ marginTop: '4rem' }}
      >
        {renderTextCard('Final Design Outcome', ui.finalOutcome || project.result, 'final')}
        {renderTextCard('Results and Impact', ui.resultsAndImpact, 'impact')}
        {renderDeliverables(ui.finalDeliverables || project.deliverables, 'Final Deliverables', 'deliv')}
      </DetailSection>

      <MetricsRow metrics={ui.usabilityMetrics} />
    </>
  );
};

export default UiUxShowcase;
