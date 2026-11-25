import React from 'react';
import { FiDownload, FiExternalLink } from 'react-icons/fi';
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
} from './WorkSharedBlocks';

const LogoAssetCard = ({ label, asset }) => {
  const url = getImageUrl(asset?.image || asset);
  if (!url) return null;
  return (
    <div className="wd-brand-asset-card">
      <span className="wd-stat-label">{label}</span>
      <div className="wd-brand-asset-preview">
        <img src={url} alt={asset?.alt || label} />
      </div>
      {asset?.caption && <span className="wd-gallery-caption">{asset.caption}</span>}
    </div>
  );
};

const BrandingShowcase = ({ project }) => {
  const b = project.brandingDetails || {};

  const hasCoreLogos =
    Boolean(getImageUrl(b.primaryLogo)) ||
    Boolean(getImageUrl(b.secondaryLogo)) ||
    Boolean(getImageUrl(b.brandMark)) ||
    Boolean(getImageUrl(b.wordmark));

  const guidelinesPdfUrl = b.brandGuidelinesPdf?.asset?.url;

  return (
    <>
      {/* 1. Brand Discovery */}
      <DetailSection
        label="BRAND DISCOVERY"
        title={<>Brand Story, Purpose<br />&amp; Research.</>}
        style={{ marginTop: '4rem' }}
      >
        <TextOrRichCard title="Brand Overview" value={b.brandOverview} />
        <TextOrRichCard title="Branding Brief" value={b.brandingBrief} />
        <TextOrRichCard title="Client Requirements" value={b.clientRequirements} />
        <TextOrRichCard title="Branding Objectives" value={b.brandingObjectives} />
        {(b.brandMission || b.brandVision) && (
          <DetailCard title="Mission &amp; Vision">
            {b.brandMission && <p className="wd-card-text"><strong>Mission:</strong> {b.brandMission}</p>}
            {b.brandVision && (
              <p className="wd-card-text" style={b.brandMission ? { marginTop: '0.75rem' } : undefined}>
                <strong>Vision:</strong> {b.brandVision}
              </p>
            )}
          </DetailCard>
        )}
        {hasContent(b.brandValues) && (
          <DetailCard title="Brand Values">
            <div className="wd-tags-list">
              {b.brandValues.map((val, i) => (
                <span className="wd-tag" key={i}>{val}</span>
              ))}
            </div>
          </DetailCard>
        )}
        <TextOrRichCard title="Target Audience" value={b.targetAudience} />
        <TextOrRichCard title="Market Research" value={b.marketResearch} />
        <TextOrRichCard title="Competitor Analysis" value={b.competitorAnalysis} />
      </DetailSection>

      {/* 2. Brand Strategy */}
      <DetailSection
        label="BRAND STRATEGY"
        title={<>Positioning, Voice<br />&amp; Creative Direction.</>}
        style={{ marginTop: '4rem' }}
      >
        <TextOrRichCard title="Brand Positioning" value={b.brandPositioning} />
        <TextOrRichCard title="Brand Personality" value={b.brandPersonality} />
        <TextOrRichCard title="Brand Voice and Tone" value={b.brandVoiceAndTone} />
        <TextOrRichCard title="Brand Messaging" value={b.brandMessaging} />
        <TextOrRichCard title="Creative Direction" value={b.creativeDirection} />
      </DetailSection>

      <ImageItemGrid items={b.moodboard} altPrefix="Brand Moodboard" />
      <ImageItemGrid items={b.visualInspiration} altPrefix="Visual Inspiration" />

      {/* 3. Concept Development */}
      <DetailSection
        label="CONCEPT DEVELOPMENT"
        title={<>Sketches, Exploration<br />&amp; Concept Selection.</>}
        style={{ marginTop: '4rem' }}
      >
        <TextOrRichCard title="Concept Exploration" value={b.conceptExploration} />
        <TextOrRichCard title="Concept Development Process" value={b.conceptDevelopmentProcess} />
        <TextOrRichCard title="Final Concept Selection" value={b.finalConceptSelection} />
        <TextOrRichCard title="Concept Selection Rationale" value={b.conceptSelectionRationale} />
      </DetailSection>

      <ImageItemGrid items={b.initialSketches} altPrefix="Initial Sketch" />
      <ImageItemGrid items={b.alternativeLogoConcepts} altPrefix="Alternative Logo Concept" />

      {/* 4. Logo & Brand Identity */}
      <DetailSection
        label="LOGO & BRAND IDENTITY"
        title={<>Marks, Construction<br />&amp; Usage Rules.</>}
        style={{ marginTop: '4rem' }}
      >
        <TextOrRichCard title="Logo Concept and Rationale" value={b.logoConceptAndRationale} />
        {hasCoreLogos && (
          <div className="wd-brand-marks-grid">
            <LogoAssetCard label="PRIMARY LOGO" asset={b.primaryLogo} />
            <LogoAssetCard label="SECONDARY LOGO" asset={b.secondaryLogo} />
            <LogoAssetCard label="BRAND MARK / SYMBOL" asset={b.brandMark} />
            <LogoAssetCard label="WORDMARK" asset={b.wordmark} />
          </div>
        )}
        {hasContent(b.logoVariations) && (
          <DetailCard title="Logo Variations">
            <div className="wd-brand-marks-grid">
              {b.logoVariations.map((variation, idx) => {
                const imgUrl = getImageUrl(variation.logoImage?.image || variation.logoImage);
                return (
                  <div className="wd-brand-asset-card" key={variation._key || idx}>
                    <span className="wd-stat-label">{variation.variationName}</span>
                    {imgUrl && (
                      <div className="wd-brand-asset-preview">
                        <img src={imgUrl} alt={variation.logoImage?.alt || variation.variationName} />
                      </div>
                    )}
                    {variation.description && <p className="wd-card-text">{variation.description}</p>}
                    {variation.usageGuidelines && (
                      <p className="wd-swatch-usage"><strong>Usage:</strong> {variation.usageGuidelines}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </DetailCard>
        )}
        {hasContent(b.logoConstructionAndGrid) && (
          <DetailCard title="Logo Construction and Grid">
            <RichContent value={b.logoConstructionAndGrid.description} />
            <ImageItemGrid items={b.logoConstructionAndGrid.images} standalone={false} altPrefix="Logo Grid" />
          </DetailCard>
        )}
        <TextOrRichCard title="Logo Geometry and Proportions" value={b.logoGeometryAndProportions} />
        {hasContent(b.logoClearSpace) && (
          <DetailCard title="Logo Clear Space">
            <RichContent value={b.logoClearSpace.description} />
            {b.logoClearSpace.image && (
              <ImageItemGrid items={[b.logoClearSpace.image]} standalone={false} columns={1} altPrefix="Logo Clear Space" />
            )}
          </DetailCard>
        )}
        {b.minimumLogoSize && (
          <DetailCard title="Minimum Logo Size">
            <p className="wd-card-text">{b.minimumLogoSize}</p>
          </DetailCard>
        )}
        <TextOrRichCard title="Logo Usage Guidelines" value={b.logoUsageGuidelines} />
        {hasContent(b.correctIncorrectUsage) && (
          <DetailCard title="Correct &amp; Incorrect Logo Usage">
            <RichContent value={b.correctIncorrectUsage.notes} />
            <div className="wd-before-after-grid" style={{ marginTop: '1rem' }}>
              {hasContent(b.correctIncorrectUsage.correct) && (
                <div className="wd-ba-box wd-ba-after">
                  <span className="wd-stat-label">CORRECT USAGE</span>
                  <ImageItemGrid items={b.correctIncorrectUsage.correct} standalone={false} columns={1} altPrefix="Correct Logo Usage" />
                </div>
              )}
              {hasContent(b.correctIncorrectUsage.incorrect) && (
                <div className="wd-ba-box wd-ba-before">
                  <span className="wd-stat-label">INCORRECT USAGE</span>
                  <ImageItemGrid items={b.correctIncorrectUsage.incorrect} standalone={false} columns={1} altPrefix="Incorrect Logo Usage" />
                </div>
              )}
            </div>
          </DetailCard>
        )}
      </DetailSection>

      {/* 5. Color Palette */}
      <DetailSection
        label="COLOR PALETTE"
        title={<>Colors, Codes<br />&amp; Rationale.</>}
        style={{ marginTop: '4rem' }}
      >
        <ColorSwatchGrid colors={b.primaryColors} title="Primary Colors" />
        <ColorSwatchGrid colors={b.secondaryColors} title="Secondary Colors" />
        <ColorSwatchGrid colors={b.accentColors} title="Accent Colors" />
        <TextOrRichCard title="Color Usage Guidelines" value={b.colorUsageGuidelines} />
        <TextOrRichCard title="Color Selection Rationale" value={b.colorSelectionRationale} />
      </DetailSection>

      {/* 6. Typography */}
      <DetailSection
        label="TYPOGRAPHY"
        title={<>Typefaces, Hierarchy<br />&amp; Guidelines.</>}
        style={{ marginTop: '4rem' }}
      >
        <TypographyShowcase items={[b.primaryTypeface, b.secondaryTypeface, b.supportingTypeface]} />
        {hasContent(b.typographicHierarchy) && (
          <DetailCard title="Typographic Hierarchy">
            <RichContent value={b.typographicHierarchy.description} />
            {b.typographicHierarchy.image && (
              <ImageItemGrid items={[b.typographicHierarchy.image]} standalone={false} columns={1} altPrefix="Typographic Hierarchy" />
            )}
          </DetailCard>
        )}
        <TextOrRichCard title="Typography Usage Guidelines" value={b.typographyUsageGuidelines} />
        <TextOrRichCard title="Typography Selection Rationale" value={b.typographySelectionRationale} />
      </DetailSection>

      {/* 7. Visual Identity Elements */}
      <RichMediaSection label="GRAPHIC ELEMENTS" title="Graphic Language." block={b.graphicElements} defaultCardTitle="Graphic Elements" altPrefix="Graphic Element" />
      <ImageItemGrid items={b.brandPatterns} altPrefix="Brand Pattern" />
      <ImageItemGrid items={b.shapesAndTextures} altPrefix="Shapes and Textures" />
      <RichMediaSection label="ICONOGRAPHY" title="Brand Icons." block={b.iconography} defaultCardTitle="Iconography" altPrefix="Brand Iconography" />
      <RichMediaSection label="PHOTOGRAPHY DIRECTION" title="Visual Mood &amp; Framing." block={b.photographyDirection} defaultCardTitle="Photography Direction" altPrefix="Photography Sample" />
      <RichMediaSection label="ILLUSTRATION STYLE" title="Custom Illustrations." block={b.illustrationStyle} defaultCardTitle="Illustration Style" altPrefix="Illustration" />
      {hasContent(b.visualConsistencyGuidelines) && (
        <DetailSection label="VISUAL CONSISTENCY" title="Maintaining Brand Cohesion." style={{ marginTop: '4rem' }}>
          <TextOrRichCard title="Visual Consistency Guidelines" value={b.visualConsistencyGuidelines} />
        </DetailSection>
      )}

      {/* 8. Brand Applications */}
      {hasContent(b.brandApplications) && (
        <DetailSection
          label="BRAND APPLICATIONS"
          title={<>Identity in the<br />Real World.</>}
          style={{ marginTop: '4rem' }}
        >
          {b.brandApplications.map((app, idx) => (
            <DetailCard key={app._key || idx} title={app.applicationName}>
              {app.applicationType && (
                <span className="wd-tag" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                  {app.applicationType}
                </span>
              )}
              {app.description && <p className="wd-card-text">{app.description}</p>}
              <ImageItemGrid items={app.images} standalone={false} altPrefix={app.applicationName} />
            </DetailCard>
          ))}
        </DetailSection>
      )}

      {/* 9. Brand Guidelines & Outcome */}
      <DetailSection
        label="BRAND GUIDELINES & OUTCOME"
        title={<>Brand Book, Deliverables<br />&amp; Impact.</>}
        style={{ marginTop: '4rem' }}
      >
        <TextOrRichCard title="Complete Brand Guidelines / Brand Book" value={b.brandGuidelinesSummary} />
        {(guidelinesPdfUrl || b.brandGuidelinesUrl) && (
          <DetailCard title="Brand Guidelines Download &amp; Link">
            <div className="wd-links-row">
              {guidelinesPdfUrl && (
                <a href={guidelinesPdfUrl} target="_blank" rel="noreferrer" className="wd-external-link-btn">
                  <span>Download Brand Guidelines PDF</span>
                  <FiDownload />
                </a>
              )}
              {b.brandGuidelinesUrl && (
                <a href={b.brandGuidelinesUrl} target="_blank" rel="noreferrer" className="wd-external-link-btn wd-external-link-btn--secondary">
                  <span>View Brand Guidelines</span>
                  <FiExternalLink />
                </a>
              )}
            </div>
          </DetailCard>
        )}
        {hasContent(b.finalBrandIdentity?.description) && (
          <DetailCard title="Final Brand Identity">
            <RichContent value={b.finalBrandIdentity.description} />
          </DetailCard>
        )}
        <DeliverablesList items={b.finalDeliverables || project.deliverables} />
        <TextOrRichCard title="Brand Outcome" value={b.brandOutcome || project.result} />
        <TextOrRichCard title="Results and Impact" value={b.resultsAndImpact} />
      </DetailSection>

      <ImageItemGrid items={b.finalBrandIdentity?.images} altPrefix="Final Brand Identity" />
    </>
  );
};

export default BrandingShowcase;

