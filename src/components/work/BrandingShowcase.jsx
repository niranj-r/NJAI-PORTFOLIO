import React from 'react';
import { FiDownload, FiExternalLink } from 'react-icons/fi';
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
  ImageItemGrid,
  RichMediaSection,
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

  const validLogoVariations = (b.logoVariations || []).filter(
    (v) => v && (v.variationName || getImageUrl(v.logoImage?.image || v.logoImage) || v.description || v.usageGuidelines)
  );

  const validBrandValues = (b.brandValues || []).filter((v) => typeof v === 'string' && v.trim().length > 0);

  const validApplications = (b.brandApplications || []).filter(
    (app) => app && (app.applicationName || app.description || hasContent(app.images))
  );

  const guidelinesPdfUrl = b.brandGuidelinesPdf?.asset?.url;

  const hasLogoGrid =
    hasContent(b.logoConstructionAndGrid?.description) ||
    (b.logoConstructionAndGrid?.images || []).some((i) => Boolean(getImageUrl(i?.image || i)));

  const hasClearSpace =
    hasContent(b.logoClearSpace?.description) ||
    Boolean(getImageUrl(b.logoClearSpace?.image));

  const correctImgs = (b.correctIncorrectUsage?.correct || []).filter((i) => Boolean(getImageUrl(i?.image || i)));
  const incorrectImgs = (b.correctIncorrectUsage?.incorrect || []).filter((i) => Boolean(getImageUrl(i?.image || i)));
  const hasCorrectIncorrect =
    hasContent(b.correctIncorrectUsage?.notes) || correctImgs.length > 0 || incorrectImgs.length > 0;

  const hasHierarchy =
    hasContent(b.typographicHierarchy?.description) ||
    Boolean(getImageUrl(b.typographicHierarchy?.image));

  return (
    <>
      {/* 1. Brand Discovery */}
      <DetailSection
        label="BRAND DISCOVERY"
        title={<>Brand Story, Purpose<br />&amp; Research.</>}
        style={{ marginTop: '4rem' }}
      >
        {renderTextCard('Brand Overview', b.brandOverview, 'overview')}
        {renderTextCard('Branding Brief', b.brandingBrief, 'brief')}
        {renderTextCard('Client Requirements', b.clientRequirements, 'req')}
        {renderTextCard('Branding Objectives', b.brandingObjectives, 'obj')}
        {(b.brandMission || b.brandVision) && (
          <DetailCard key="mv" title="Mission &amp; Vision">
            {b.brandMission && <p className="wd-card-text"><strong>Mission:</strong> {b.brandMission}</p>}
            {b.brandVision && (
              <p className="wd-card-text" style={b.brandMission ? { marginTop: '0.75rem' } : undefined}>
                <strong>Vision:</strong> {b.brandVision}
              </p>
            )}
          </DetailCard>
        )}
        {validBrandValues.length > 0 && (
          <DetailCard key="values" title="Brand Values">
            <div className="wd-tags-list">
              {validBrandValues.map((val, i) => (
                <span className="wd-tag" key={i}>{val}</span>
              ))}
            </div>
          </DetailCard>
        )}
        {renderTextCard('Target Audience', b.targetAudience, 'aud')}
        {renderTextCard('Market Research', b.marketResearch, 'market')}
        {renderTextCard('Competitor Analysis', b.competitorAnalysis, 'comp')}
      </DetailSection>

      {/* 2. Brand Strategy */}
      <DetailSection
        label="BRAND STRATEGY"
        title={<>Positioning, Voice<br />&amp; Creative Direction.</>}
        style={{ marginTop: '4rem' }}
      >
        {renderTextCard('Brand Positioning', b.brandPositioning, 'pos')}
        {renderTextCard('Brand Personality', b.brandPersonality, 'pers')}
        {renderTextCard('Brand Voice and Tone', b.brandVoiceAndTone, 'voice')}
        {renderTextCard('Brand Messaging', b.brandMessaging, 'msg')}
        {renderTextCard('Creative Direction', b.creativeDirection, 'cdir')}
      </DetailSection>

      <ImageItemGrid items={b.moodboard} altPrefix="Brand Moodboard" />
      <ImageItemGrid items={b.visualInspiration} altPrefix="Visual Inspiration" />

      {/* 3. Concept Development */}
      <DetailSection
        label="CONCEPT DEVELOPMENT"
        title={<>Sketches, Exploration<br />&amp; Concept Selection.</>}
        style={{ marginTop: '4rem' }}
      >
        {renderTextCard('Concept Exploration', b.conceptExploration, 'cexp')}
        {renderTextCard('Concept Development Process', b.conceptDevelopmentProcess, 'cproc')}
        {renderTextCard('Final Concept Selection', b.finalConceptSelection, 'fcsel')}
        {renderTextCard('Concept Selection Rationale', b.conceptSelectionRationale, 'crat')}
      </DetailSection>

      <ImageItemGrid items={b.initialSketches} altPrefix="Initial Sketch" />
      <ImageItemGrid items={b.alternativeLogoConcepts} altPrefix="Alternative Logo Concept" />

      {/* 4. Logo & Brand Identity */}
      <DetailSection
        label="LOGO & BRAND IDENTITY"
        title={<>Marks, Construction<br />&amp; Usage Rules.</>}
        style={{ marginTop: '4rem' }}
      >
        {renderTextCard('Logo Concept and Rationale', b.logoConceptAndRationale, 'lrat')}
        {hasCoreLogos && (
          <div key="core-logos" className="wd-brand-marks-grid">
            <LogoAssetCard label="PRIMARY LOGO" asset={b.primaryLogo} />
            <LogoAssetCard label="SECONDARY LOGO" asset={b.secondaryLogo} />
            <LogoAssetCard label="BRAND MARK / SYMBOL" asset={b.brandMark} />
            <LogoAssetCard label="WORDMARK" asset={b.wordmark} />
          </div>
        )}
        {validLogoVariations.length > 0 && (
          <DetailCard key="logo-vars" title="Logo Variations">
            <div className="wd-brand-marks-grid">
              {validLogoVariations.map((variation, idx) => {
                const imgUrl = getImageUrl(variation.logoImage?.image || variation.logoImage);
                return (
                  <div className="wd-brand-asset-card" key={variation._key || idx}>
                    {variation.variationName && <span className="wd-stat-label">{variation.variationName}</span>}
                    {imgUrl && (
                      <div className="wd-brand-asset-preview">
                        <img src={imgUrl} alt={variation.logoImage?.alt || variation.variationName || 'Logo variation'} />
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
        {hasLogoGrid && (
          <DetailCard key="logo-grid" title="Logo Construction and Grid">
            <RichContent value={b.logoConstructionAndGrid.description} />
            <ImageItemGrid items={b.logoConstructionAndGrid.images} standalone={false} altPrefix="Logo Grid" />
          </DetailCard>
        )}
        {renderTextCard('Logo Geometry and Proportions', b.logoGeometryAndProportions, 'geom')}
        {hasClearSpace && (
          <DetailCard key="clear-space" title="Logo Clear Space">
            <RichContent value={b.logoClearSpace.description} />
            {b.logoClearSpace.image && (
              <ImageItemGrid items={[b.logoClearSpace.image]} standalone={false} columns={1} altPrefix="Logo Clear Space" />
            )}
          </DetailCard>
        )}
        {hasContent(b.minimumLogoSize) && (
          <DetailCard key="min-size" title="Minimum Logo Size">
            <p className="wd-card-text">{b.minimumLogoSize}</p>
          </DetailCard>
        )}
        {renderTextCard('Logo Usage Guidelines', b.logoUsageGuidelines, 'lguide')}
        {hasCorrectIncorrect && (
          <DetailCard key="ci-usage" title="Correct &amp; Incorrect Logo Usage">
            <RichContent value={b.correctIncorrectUsage.notes} />
            {(correctImgs.length > 0 || incorrectImgs.length > 0) && (
              <div className="wd-before-after-grid" style={{ marginTop: '1rem' }}>
                {correctImgs.length > 0 && (
                  <div className="wd-ba-box wd-ba-after">
                    <span className="wd-stat-label">CORRECT USAGE</span>
                    <ImageItemGrid items={correctImgs} standalone={false} columns={1} altPrefix="Correct Logo Usage" />
                  </div>
                )}
                {incorrectImgs.length > 0 && (
                  <div className="wd-ba-box wd-ba-before">
                    <span className="wd-stat-label">INCORRECT USAGE</span>
                    <ImageItemGrid items={incorrectImgs} standalone={false} columns={1} altPrefix="Incorrect Logo Usage" />
                  </div>
                )}
              </div>
            )}
          </DetailCard>
        )}
      </DetailSection>

      {/* 5. Color Palette */}
      <DetailSection
        label="COLOR PALETTE"
        title={<>Colors, Codes<br />&amp; Rationale.</>}
        style={{ marginTop: '4rem' }}
      >
        {renderColorSwatches(b.primaryColors, 'Primary Colors', 'pcol')}
        {renderColorSwatches(b.secondaryColors, 'Secondary Colors', 'scol')}
        {renderColorSwatches(b.accentColors, 'Accent Colors', 'acol')}
        {renderTextCard('Color Usage Guidelines', b.colorUsageGuidelines, 'cguide')}
        {renderTextCard('Color Selection Rationale', b.colorSelectionRationale, 'crat2')}
      </DetailSection>

      {/* 6. Typography */}
      <DetailSection
        label="TYPOGRAPHY"
        title={<>Typefaces, Hierarchy<br />&amp; Guidelines.</>}
        style={{ marginTop: '4rem' }}
      >
        {renderTypography([b.primaryTypeface, b.secondaryTypeface, b.supportingTypeface])}
        {hasHierarchy && (
          <DetailCard key="hier" title="Typographic Hierarchy">
            <RichContent value={b.typographicHierarchy.description} />
            {b.typographicHierarchy.image && (
              <ImageItemGrid items={[b.typographicHierarchy.image]} standalone={false} columns={1} altPrefix="Typographic Hierarchy" />
            )}
          </DetailCard>
        )}
        {renderTextCard('Typography Usage Guidelines', b.typographyUsageGuidelines, 'tguide')}
        {renderTextCard('Typography Selection Rationale', b.typographySelectionRationale, 'trat')}
      </DetailSection>

      {/* 7. Visual Identity Elements */}
      <RichMediaSection label="GRAPHIC ELEMENTS" title="Graphic Language." block={b.graphicElements} defaultCardTitle="Graphic Elements" altPrefix="Graphic Element" />
      <ImageItemGrid items={b.brandPatterns} altPrefix="Brand Pattern" />
      <ImageItemGrid items={b.shapesAndTextures} altPrefix="Shapes and Textures" />
      <RichMediaSection label="ICONOGRAPHY" title="Brand Icons." block={b.iconography} defaultCardTitle="Iconography" altPrefix="Brand Iconography" />
      <RichMediaSection label="PHOTOGRAPHY DIRECTION" title="Visual Mood &amp; Framing." block={b.photographyDirection} defaultCardTitle="Photography Direction" altPrefix="Photography Sample" />
      <RichMediaSection label="ILLUSTRATION STYLE" title="Custom Illustrations." block={b.illustrationStyle} defaultCardTitle="Illustration Style" altPrefix="Illustration" />
      <DetailSection label="VISUAL CONSISTENCY" title="Maintaining Brand Cohesion." style={{ marginTop: '4rem' }}>
        {renderTextCard('Visual Consistency Guidelines', b.visualConsistencyGuidelines, 'vc')}
      </DetailSection>

      {/* 8. Brand Applications */}
      <DetailSection
        label="BRAND APPLICATIONS"
        title={<>Identity in the<br />Real World.</>}
        style={{ marginTop: '4rem' }}
      >
        {validApplications.map((app, idx) => (
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

      {/* 9. Brand Guidelines & Outcome */}
      <DetailSection
        label="BRAND GUIDELINES & OUTCOME"
        title={<>Brand Book, Deliverables<br />&amp; Impact.</>}
        style={{ marginTop: '4rem' }}
      >
        {renderTextCard('Complete Brand Guidelines / Brand Book', b.brandGuidelinesSummary, 'bbook')}
        {(guidelinesPdfUrl || b.brandGuidelinesUrl) && (
          <DetailCard key="bpdf" title="Brand Guidelines Download &amp; Link">
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
        {renderTextCard('Final Brand Identity', b.finalBrandIdentity?.description, 'fbi')}
        {renderDeliverables(b.finalDeliverables || project.deliverables, 'Final Deliverables', 'bdeliv')}
        {renderTextCard('Brand Outcome', b.brandOutcome || project.result, 'bout')}
        {renderTextCard('Results and Impact', b.resultsAndImpact, 'bimp')}
      </DetailSection>

      <ImageItemGrid items={b.finalBrandIdentity?.images} altPrefix="Final Brand Identity" />
    </>
  );
};

export default BrandingShowcase;
