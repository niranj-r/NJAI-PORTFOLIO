import React from 'react';
import { PortableText } from '@portabletext/react';
import { FiDownload, FiExternalLink } from 'react-icons/fi';
import { getImageUrl } from '../../utils/getImageUrl';

export const hasContent = (val) => {
  if (val === null || val === undefined || val === false) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (Array.isArray(val)) {
    return val.length > 0 && val.some((item) => hasContent(item));
  }
  if (typeof val === 'object') {
    if (val._type === 'block') {
      return (
        Array.isArray(val.children) &&
        val.children.some((c) => typeof c?.text === 'string' && c.text.trim().length > 0)
      );
    }
    if (val._type === 'galleryImage') {
      return Boolean(getImageUrl(val));
    }
    if (val._type === 'image') {
      return Boolean(getImageUrl(val));
    }
    if (val.asset || val._ref) return true;
    return Object.entries(val)
      .filter(([key]) => !key.startsWith('_'))
      .some(([, v]) => hasContent(v));
  }
  return Boolean(val);
};

export const RichContent = ({ value }) => {
  if (!hasContent(value)) return null;

  if (typeof value === 'string') {
    const paragraphs = value.split('\n\n').filter((p) => p.trim().length > 0);
    if (paragraphs.length === 0) return null;
    return (
      <>
        {paragraphs.map((paragraph, idx) => (
          <p className="wd-card-text" key={idx} style={idx > 0 ? { marginTop: '1rem' } : undefined}>
            {paragraph}
          </p>
        ))}
      </>
    );
  }

  if (Array.isArray(value)) {
    if (typeof value[0] === 'string') {
      const items = value.filter((item) => typeof item === 'string' && item.trim().length > 0);
      if (items.length === 0) return null;
      return (
        <ul className="wd-list">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }
    const nonEmptyBlocks = value.filter((block) => hasContent(block));
    if (nonEmptyBlocks.length === 0) return null;
    return (
      <div className="wd-portable-text">
        <PortableText value={nonEmptyBlocks} />
      </div>
    );
  }

  return null;
};

export const DetailSection = ({ label, title, children, style }) => {
  const validChildren = React.Children.toArray(children).filter(Boolean);
  if (validChildren.length === 0) return null;

  return (
    <div className="wd-details-section" style={style}>
      <div className="wd-details-left">
        {label && <span className="wd-about-label">{label}</span>}
        {title && <h2 className="wd-about-title">{title}</h2>}
      </div>
      <div className="wd-details-right">{validChildren}</div>
    </div>
  );
};

export const DetailCard = ({ title, children }) => {
  const validChildren = React.Children.toArray(children).filter(Boolean);
  if (validChildren.length === 0) return null;
  return (
    <div className="wd-detail-card">
      {title && <h3 className="wd-card-title">{title}</h3>}
      {validChildren}
    </div>
  );
};

export const renderTextCard = (title, value, key) => {
  if (!hasContent(value)) return null;
  return (
    <DetailCard key={key} title={title}>
      <RichContent value={value} />
    </DetailCard>
  );
};

export const TextOrRichCard = ({ title, value }) => renderTextCard(title, value);

export const ImageItemGrid = ({ items, altPrefix = 'Showcase', columns = 2, standalone = true }) => {
  if (!items || items.length === 0) return null;
  const validItems = items.filter((item) => Boolean(getImageUrl(item?.image || item)));
  if (validItems.length === 0) return null;

  const columnClass =
    columns === 3 ? 'wd-gallery-grid--3' : columns === 1 ? 'wd-gallery-grid--1' : '';

  const grid = (
    <div className={`wd-gallery-grid ${columnClass}`}>
      {validItems.map((item, idx) => {
        const imgSource = item?.image || item;
        const caption = item?.caption || item?.label;
        const alt = item?.alt || caption || `${altPrefix} ${idx + 1}`;
        return (
          <div className="wd-gallery-item" key={item?._key || idx}>
            <img
              src={getImageUrl(imgSource)}
              alt={alt}
              className="wd-gallery-image"
            />
            {caption && <span className="wd-gallery-caption">{caption}</span>}
          </div>
        );
      })}
    </div>
  );

  if (!standalone) return grid;

  return (
    <div className="wd-details-section" style={{ marginTop: '2.5rem' }}>
      {grid}
    </div>
  );
};

export const RichMediaSection = ({ label, title, block, defaultCardTitle, altPrefix }) => {
  if (!hasContent(block)) return null;
  const description = block?.description;
  const rawImages = block?.images || (block?.image ? [block.image] : []);
  const validImages = rawImages.filter((item) => Boolean(getImageUrl(item?.image || item)));

  if (!hasContent(description) && validImages.length === 0) return null;

  return (
    <>
      {hasContent(description) && (
        <DetailSection label={label} title={title} style={{ marginTop: '4rem' }}>
          <DetailCard title={defaultCardTitle}>
            <RichContent value={description} />
          </DetailCard>
        </DetailSection>
      )}
      {validImages.length > 0 && <ImageItemGrid items={validImages} altPrefix={altPrefix} />}
    </>
  );
};

export const MetricsRow = ({ metrics }) => {
  const validMetrics = (metrics || []).filter((m) => m && (m.value || m.metricName || m.label));
  if (validMetrics.length === 0) return null;
  return (
    <div className="wd-details-section" style={{ marginTop: '2.5rem' }}>
      <div className="wd-metrics-container">
        {validMetrics.map((metric, idx) => {
          const name = metric.metricName || metric.label;
          const displayVal = [metric.value, metric.unit].filter(Boolean).join(' ');
          return (
            <div className="wd-metric-box" key={metric._key || idx}>
              <span className="wd-metric-value">{displayVal}</span>
              <span className="wd-metric-label">{name}</span>
              {metric.description && <p className="wd-metric-desc">{metric.description}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const renderColorSwatches = (colors, title, key) => {
  const validColors = (colors || []).filter((c) => c && (c.hex || c.colorName || c.name));
  if (validColors.length === 0) return null;
  return (
    <DetailCard key={key} title={title || 'Color Palette'}>
      <div className="wd-swatches-grid">
        {validColors.map((swatch, idx) => {
          const name = swatch.colorName || swatch.name || 'Color';
          const role = swatch.colorRole || swatch.role;
          const usage = swatch.usageGuidelines || swatch.usage;
          return (
            <div className="wd-swatch-card" key={swatch._key || idx}>
              <div
                className="wd-swatch-color"
                style={{ backgroundColor: swatch.hex || '#333333' }}
              />
              <div className="wd-swatch-meta">
                <span className="wd-swatch-name">{name}</span>
                {swatch.hex && <span className="wd-swatch-hex">HEX: {swatch.hex}</span>}
                {swatch.rgb && <span className="wd-swatch-code">RGB: {swatch.rgb}</span>}
                {swatch.cmyk && <span className="wd-swatch-code">CMYK: {swatch.cmyk}</span>}
                {role && <span className="wd-swatch-role">{role}</span>}
                {usage && <p className="wd-swatch-usage">{usage}</p>}
                {swatch.selectionRationale && (
                  <p className="wd-swatch-usage"><em>Why:</em> {swatch.selectionRationale}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DetailCard>
  );
};

export const ColorSwatchGrid = ({ colors, title }) => renderColorSwatches(colors, title);

export const renderTypography = (items) => {
  const validItems = (items || []).filter(
    (item) =>
      item &&
      (item.fontFamily ||
        item.name ||
        item.fontPreview ||
        item.sampleText ||
        item.usageGuidelines ||
        item.selectionRationale ||
        item.rationale)
  );
  if (validItems.length === 0) return null;

  return validItems.map((typeItem, idx) => {
    const fontFamily = typeItem.fontFamily || typeItem.name || `Typeface ${idx + 1}`;
    const role = typeItem.typefaceRole || typeItem.role || fontFamily;
    const weights = typeItem.fontWeight || typeItem.weights;
    const preview =
      typeItem.fontPreview ||
      typeItem.sampleText ||
      'Aa Bb Cc — The quick brown fox jumps over the lazy dog.';
    const usage = typeItem.usageGuidelines;
    const rationale = typeItem.selectionRationale || typeItem.rationale;

    return (
      <DetailCard key={typeItem._key || idx} title={role}>
        <div className="wd-type-specimen">
          <div className="wd-type-header">
            <span className="wd-type-name" style={{ fontFamily }}>{fontFamily}</span>
            {weights && <span className="wd-tag">{weights}</span>}
          </div>
          <p className="wd-type-sample" style={{ fontFamily }}>
            {preview}
          </p>
          {usage && <p className="wd-card-text"><strong>Usage:</strong> {usage}</p>}
          {rationale && <p className="wd-card-text">{rationale}</p>}
        </div>
      </DetailCard>
    );
  });
};

export const TypographyShowcase = ({ items }) => renderTypography(items);

export const renderDeliverables = (items, title = 'Final Deliverables', key) => {
  if (!items || items.length === 0) return null;

  if (typeof items[0] === 'string') {
    return renderTextCard(title, items, key);
  }

  const validItems = items.filter((item) => item && (item.title || item.description || item.file?.asset?.url || item.url));
  if (validItems.length === 0) return null;

  return (
    <DetailCard key={key} title={title}>
      <div className="wd-deliverables-list">
        {validItems.map((item, idx) => {
          const fileUrl = item.file?.asset?.url;
          const externalUrl = item.url;
          const linkUrl = fileUrl || externalUrl;
          return (
            <div className="wd-deliverable-item" key={item._key || idx}>
              <div>
                {item.title && <h4 className="wd-deliverable-title">{item.title}</h4>}
                {item.description && <p className="wd-card-text">{item.description}</p>}
              </div>
              {linkUrl && (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="wd-external-link-btn"
                >
                  <span>{fileUrl ? 'Download' : 'Open'}</span>
                  {fileUrl ? <FiDownload /> : <FiExternalLink />}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </DetailCard>
  );
};

export const DeliverablesList = ({ items, title = 'Final Deliverables' }) =>
  renderDeliverables(items, title);

export const renderBeforeAfter = (items) => {
  const validItems = (items || []).filter((item) => {
    if (!item) return false;
    const beforeImg = getImageUrl(item.beforeImage?.image || item.beforeImage);
    const afterImg = getImageUrl(item.afterImage?.image || item.afterImage);
    return Boolean(beforeImg || afterImg || item.before || item.after || item.descriptionOfChanges || item.reasonForChanges || item.impact);
  });
  if (validItems.length === 0) return null;

  return validItems.map((item, idx) => {
    const beforeImg = getImageUrl(item.beforeImage?.image || item.beforeImage);
    const afterImg = getImageUrl(item.afterImage?.image || item.afterImage);
    const changes = item.descriptionOfChanges || item.after || item.changesMade;
    const reason = item.reasonForChanges || item.impact;

    return (
      <DetailCard key={item._key || idx} title={item.area || `Before & After ${idx + 1}`}>
        {(beforeImg || item.before || afterImg || item.after) && (
          <div className="wd-before-after-grid">
            {(beforeImg || item.before) && (
              <div className="wd-ba-box wd-ba-before">
                <span className="wd-stat-label">BEFORE</span>
                {beforeImg && (
                  <img src={beforeImg} alt={item.beforeImage?.alt || 'Before design'} className="wd-ba-image" />
                )}
                {item.before && <p className="wd-card-text">{item.before}</p>}
              </div>
            )}
            {(afterImg || item.after) && (
              <div className="wd-ba-box wd-ba-after">
                <span className="wd-stat-label">AFTER</span>
                {afterImg && (
                  <img src={afterImg} alt={item.afterImage?.alt || 'After design'} className="wd-ba-image" />
                )}
                {item.after && <p className="wd-card-text">{item.after}</p>}
              </div>
            )}
          </div>
        )}
        {changes && (
          <p className="wd-card-text" style={{ marginTop: '1rem' }}>
            <strong>Changes:</strong> {changes}
          </p>
        )}
        {reason && (
          <p className="wd-card-text" style={{ marginTop: '0.5rem' }}>
            <strong>Why:</strong> {reason}
          </p>
        )}
      </DetailCard>
    );
  });
};

export const BeforeAfterGrid = ({ items }) => renderBeforeAfter(items);

const getEmbedUrl = (url) => {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
};

export const renderVideoBlock = (video, key) => {
  if (!video) return null;
  const fileUrl = video.videoFile?.asset?.url;
  const url = video.videoUrl;
  if (!fileUrl && !url) return null;

  const embedUrl = getEmbedUrl(url);

  return (
    <DetailCard key={key} title={video.title || 'Video Demonstration'}>
      <div className="wd-video-wrapper">
        {fileUrl ? (
          <video controls src={fileUrl} className="wd-video-element" />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            title={video.title || 'Project Video'}
            className="wd-video-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video controls src={url} className="wd-video-element" />
        )}
      </div>
      {video.caption && <p className="wd-gallery-caption" style={{ marginTop: '0.75rem' }}>{video.caption}</p>}
    </DetailCard>
  );
};

export const VideoBlock = ({ video }) => renderVideoBlock(video);

export const TestimonialBlock = ({ testimonial }) => {
  if (!testimonial) return null;
  const quote = testimonial.feedback || testimonial.quote;
  const name = testimonial.clientName || testimonial.author;
  const roleParts = [testimonial.designation || testimonial.position, testimonial.organisation].filter(Boolean);
  if (!quote) return null;

  const photoUrl = getImageUrl(testimonial.photo);

  return (
    <div className="wd-details-section" style={{ marginTop: '3rem' }}>
      <div className="wd-testimonial-box" style={{ width: '100%' }}>
        <p className="wd-testimonial-quote">"{quote}"</p>
        <div className="wd-testimonial-footer">
          {photoUrl && (
            <img src={photoUrl} alt={name || 'Client'} className="wd-testimonial-avatar" />
          )}
          <div>
            {name && <p className="wd-testimonial-author">{name}</p>}
            {roleParts.length > 0 && (
              <p className="wd-testimonial-position">{roleParts.join(' • ')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TeamMembersRow = ({ members }) => {
  const validMembers = (members || []).filter((m) => m && m.name);
  if (validMembers.length === 0) return null;
  return (
    <div className="wd-details-section" style={{ marginTop: '2.5rem' }}>
      <div className="wd-team-strip">
        <span className="wd-about-label" style={{ marginBottom: '1rem' }}>TEAM MEMBERS</span>
        <div className="wd-team-grid">
          {validMembers.map((member, idx) => {
            const avatar = getImageUrl(member.photo);
            return (
              <div className="wd-team-card" key={member._key || idx}>
                {avatar && <img src={avatar} alt={member.name} className="wd-team-avatar" />}
                <div>
                  <span className="wd-team-name">{member.name}</span>
                  {member.role && <span className="wd-team-role">{member.role}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const CustomSectionsRenderer = ({ sections }) => {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="wd-custom-sections">
      {sections.map((block, idx) => {
        const key = block._key || idx;
        switch (block._type) {
          case 'sectionHeadingBlock':
            if (!block.heading && !block.subheading && !block.eyebrow) return null;
            return (
              <div className="wd-details-section" style={{ marginTop: '4rem' }} key={key}>
                <div style={{ width: '100%' }}>
                  {block.eyebrow && <span className="wd-about-label">{block.eyebrow}</span>}
                  {block.heading && <h2 className="wd-about-title">{block.heading}</h2>}
                  {block.subheading && <p className="wd-card-text" style={{ marginTop: '1rem' }}>{block.subheading}</p>}
                </div>
              </div>
            );
          case 'richTextSectionBlock':
            return (
              <DetailSection key={key} label="DETAILS" title={block.heading || ''} style={{ marginTop: '3rem' }}>
                {renderTextCard(null, block.body)}
              </DetailSection>
            );
          case 'fullWidthImageBlock':
            return <ImageItemGrid key={key} items={block.image ? [block.image] : []} columns={1} />;
          case 'imageGridBlock': {
            const validImages = (block.images || []).filter((img) => Boolean(getImageUrl(img?.image || img)));
            if (validImages.length === 0) return null;
            return (
              <React.Fragment key={key}>
                {block.heading && (
                  <div className="wd-details-section" style={{ marginTop: '3rem' }}>
                    <h3 className="wd-section-header" style={{ margin: 0 }}>{block.heading}</h3>
                  </div>
                )}
                <ImageItemGrid
                  items={validImages}
                  columns={block.columns === '3' ? 3 : 2}
                />
              </React.Fragment>
            );
          }
          case 'imageTextBlock': {
            const imgUrl = getImageUrl(block.image?.image || block.image);
            if (!hasContent(block.body) && !imgUrl) return null;
            return (
              <div className="wd-details-section" style={{ marginTop: '4rem' }} key={key}>
                <div className={`wd-image-text-grid ${block.imagePosition === 'left' ? 'wd-image-text-grid--reverse' : ''}`}>
                  {renderTextCard(block.heading, block.body)}
                  {imgUrl && (
                    <div className="wd-gallery-item">
                      <img src={imgUrl} alt={block.image?.alt || block.heading || 'Section'} className="wd-gallery-image" />
                      {block.image?.caption && <span className="wd-gallery-caption">{block.image.caption}</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          }
          case 'videoSectionBlock': {
            const vid = renderVideoBlock(block);
            if (!vid) return null;
            return (
              <div className="wd-details-section" style={{ marginTop: '4rem' }} key={key}>
                <div style={{ width: '100%' }}>{vid}</div>
              </div>
            );
          }
          case 'metricsSectionBlock': {
            const validMetrics = (block.metrics || []).filter((m) => m && (m.value || m.metricName || m.label));
            if (validMetrics.length === 0) return null;
            return (
              <React.Fragment key={key}>
                {block.heading && (
                  <div className="wd-details-section" style={{ marginTop: '3rem' }}>
                    <h3 className="wd-section-header" style={{ margin: 0 }}>{block.heading}</h3>
                  </div>
                )}
                <MetricsRow metrics={validMetrics} />
              </React.Fragment>
            );
          }
          case 'quoteSectionBlock':
            return <TestimonialBlock key={key} testimonial={block.testimonial} />;
          case 'beforeAfterSectionBlock':
            return (
              <DetailSection key={key} label="COMPARISON" title={block.heading || 'Before & After'} style={{ marginTop: '4rem' }}>
                {renderBeforeAfter(block.items)}
              </DetailSection>
            );
          case 'customContentBlock':
            return (
              <React.Fragment key={key}>
                <DetailSection label={block.label || 'SECTION'} title={block.heading || ''} style={{ marginTop: '4rem' }}>
                  {renderTextCard(null, block.body)}
                </DetailSection>
                <ImageItemGrid items={block.images} />
              </React.Fragment>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
