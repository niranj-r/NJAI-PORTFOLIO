/**
 * Resolves the canonical work type ('development' | 'ui-ux' | 'branding')
 * from the revised schema (category/subcategory) or legacy fields.
 */
export const getWorkType = (project) => {
  if (!project) return 'development';

  const cat = (project.category || '').toLowerCase().trim();
  const sub = (project.subcategory || '').toLowerCase().trim();

  if (cat === 'design') {
    if (sub === 'branding' || sub === 'brand') return 'branding';
    if (sub === 'ui-ux' || sub === 'ui' || sub === 'uiux') return 'ui-ux';
    return 'ui-ux';
  }
  if (cat === 'development' || cat === 'dev') return 'development';

  const explicitType = (project.workType || '').toLowerCase().trim();
  if (explicitType === 'branding' || explicitType === 'brand') return 'branding';
  if (explicitType === 'ui' || explicitType === 'ui-ux' || explicitType === 'uiux') return 'ui-ux';
  if (explicitType === 'development' || explicitType === 'dev') return 'development';

  const combined = `${project.workCategory || ''} ${project.category || ''} ${project.projectType || ''}`.toLowerCase();
  if (combined.includes('brand')) return 'branding';
  if (combined.includes('ui') || combined.includes('ux') || combined.includes('design')) return 'ui-ux';

  return 'development';
};

/**
 * Resolves the top-level category ('development' | 'design') for a project.
 */
export const getWorkCategory = (project) => {
  if (!project) return 'development';
  const explicitCategory = (project.category || project.workCategory || '').toLowerCase().trim();
  if (explicitCategory === 'design') return 'design';
  if (explicitCategory === 'development' || explicitCategory === 'dev') return 'development';

  const workType = getWorkType(project);
  return workType === 'ui-ux' || workType === 'branding' ? 'design' : 'development';
};

/**
 * Returns a human-readable label for a project's category & subcategory.
 */
export const getWorkBadgeLabel = (project) => {
  const workType = getWorkType(project);
  if (workType === 'branding') return 'DESIGN • BRANDING';
  if (workType === 'ui-ux') return 'DESIGN • UI/UX DESIGN';
  return 'DEVELOPMENT';
};

export const getProjectCardImage = (project) => {
  return project?.coverImage?.image || project?.coverImage || project?.image || null;
};

export const getProjectCardImageAlt = (project) => {
  return project?.coverImage?.alt || project?.title || 'Project';
};

export const getProjectCardDescription = (project) => {
  if (!project) return '';
  if (project.shortDescription) return project.shortDescription;
  if (typeof project.overview === 'string' && project.overview) return project.overview;
  if (project.challenge) return project.challenge;
  if (project.category && project.category !== 'development' && project.category !== 'design') {
    return project.category;
  }
  return '';
};

export const getWorkIdentifier = (project) => {
  return project?.slug || project?._id || project?.title || '';
};
