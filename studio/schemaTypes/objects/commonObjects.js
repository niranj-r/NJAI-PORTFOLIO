import { defineType, defineField, defineArrayMember } from 'sanity';

export const richTextOf = [
  defineArrayMember({
    type: 'block',
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'Heading 3', value: 'h3' },
      { title: 'Heading 4', value: 'h4' },
      { title: 'Quote', value: 'blockquote' },
    ],
  }),
];

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      description: 'Short description for accessibility and SEO.',
      type: 'string',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      subtitle: 'alt',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || subtitle || 'Image',
        subtitle: title && subtitle ? subtitle : undefined,
        media,
      };
    },
  },
});

export const colorPaletteItem = defineType({
  name: 'colorPaletteItem',
  title: 'Color Palette Item',
  type: 'object',
  fields: [
    defineField({
      name: 'colorName',
      title: 'Color Name',
      type: 'string',
    }),
    defineField({
      name: 'hex',
      title: 'HEX Code',
      description: 'e.g. #FF4D00',
      type: 'string',
    }),
    defineField({
      name: 'rgb',
      title: 'RGB',
      description: 'e.g. rgb(255, 77, 0)',
      type: 'string',
    }),
    defineField({
      name: 'cmyk',
      title: 'CMYK',
      description: 'e.g. 0, 70, 100, 0',
      type: 'string',
    }),
    defineField({
      name: 'colorRole',
      title: 'Color Role',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'Primary' },
          { title: 'Secondary', value: 'Secondary' },
          { title: 'Accent', value: 'Accent' },
          { title: 'Neutral / Background', value: 'Neutral' },
        ],
      },
    }),
    defineField({
      name: 'usageGuidelines',
      title: 'Usage Guidelines',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'selectionRationale',
      title: 'Selection Rationale',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'colorName',
      hex: 'hex',
      role: 'colorRole',
    },
    prepare({ title, hex, role }) {
      return {
        title: title || hex || 'Color',
        subtitle: [hex, role].filter(Boolean).join(' • '),
      };
    },
  },
});

export const typographyItem = defineType({
  name: 'typographyItem',
  title: 'Typography',
  type: 'object',
  fields: [
    defineField({
      name: 'fontFamily',
      title: 'Font Family',
      type: 'string',
    }),
    defineField({
      name: 'fontWeight',
      title: 'Font Weight(s)',
      description: 'e.g. 300, 400, 600, 700',
      type: 'string',
    }),
    defineField({
      name: 'typefaceRole',
      title: 'Typeface Role',
      description: 'e.g. Primary Headings, Body Copy, Supporting / Mono',
      type: 'string',
    }),
    defineField({
      name: 'fontPreview',
      title: 'Font Preview Text',
      description: 'Sample text rendered as a live specimen preview.',
      type: 'string',
    }),
    defineField({
      name: 'usageGuidelines',
      title: 'Usage Guidelines',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'selectionRationale',
      title: 'Selection Rationale',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'fontFamily',
      subtitle: 'typefaceRole',
    },
  },
});

export const technologyItem = defineType({
  name: 'technologyItem',
  title: 'Technology',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Technology Name',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'e.g. Frontend, Backend, Database, Cloud, DevOps',
      type: 'string',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Optional Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'icon',
    },
  },
});

export const keyFeatureItem = defineType({
  name: 'keyFeatureItem',
  title: 'Key Feature',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Feature Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'icon',
      title: 'Icon (optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'image',
      title: 'Supporting Image (optional)',
      type: 'galleryImage',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'image.image',
    },
  },
});

export const researchFindingItem = defineType({
  name: 'researchFindingItem',
  title: 'Research Finding',
  type: 'object',
  fields: [
    defineField({
      name: 'researchMethod',
      title: 'Research Method',
      type: 'string',
    }),
    defineField({
      name: 'finding',
      title: 'Finding',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'insight',
      title: 'Insight',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'supportingImage',
      title: 'Supporting Image',
      type: 'galleryImage',
    }),
  ],
  preview: {
    select: {
      title: 'finding',
      subtitle: 'researchMethod',
      media: 'supportingImage.image',
    },
  },
});

export const userSurveyItem = defineType({
  name: 'userSurveyItem',
  title: 'User Survey',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Survey Title',
      type: 'string',
    }),
    defineField({
      name: 'methodology',
      title: 'Methodology',
      type: 'string',
    }),
    defineField({
      name: 'participantCount',
      title: 'Participant Count',
      type: 'string',
    }),
    defineField({
      name: 'findings',
      title: 'Findings',
      type: 'array',
      of: richTextOf,
    }),
    defineField({
      name: 'supportingVisuals',
      title: 'Supporting Charts / Images',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryImage' })],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'participantCount',
    },
  },
});

export const userPersonaItem = defineType({
  name: 'userPersonaItem',
  title: 'User Persona',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Persona Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'goals',
      title: 'Goals',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'needs',
      title: 'Needs',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'painPoints',
      title: 'Pain Points',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'image',
      title: 'Persona Image',
      type: 'galleryImage',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      media: 'image.image',
    },
  },
});

export const challengeSolutionItem = defineType({
  name: 'challengeSolutionItem',
  title: 'Challenge & Solution',
  type: 'object',
  fields: [
    defineField({
      name: 'challenge',
      title: 'Challenge',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'solution',
      title: 'Solution',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'result',
      title: 'Result',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'challenge',
      subtitle: 'result',
    },
  },
});

export const beforeAfterItem = defineType({
  name: 'beforeAfterItem',
  title: 'Before & After Comparison',
  type: 'object',
  fields: [
    defineField({
      name: 'beforeImage',
      title: 'Before Image',
      type: 'galleryImage',
    }),
    defineField({
      name: 'afterImage',
      title: 'After Image',
      type: 'galleryImage',
    }),
    defineField({
      name: 'descriptionOfChanges',
      title: 'Description of Changes',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'reasonForChanges',
      title: 'Reason for Changes',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'descriptionOfChanges',
      subtitle: 'reasonForChanges',
      media: 'afterImage.image',
    },
  },
});

export const designIterationItem = defineType({
  name: 'designIterationItem',
  title: 'Design Iteration',
  type: 'object',
  fields: [
    defineField({
      name: 'previousDesign',
      title: 'Previous Design',
      type: 'galleryImage',
    }),
    defineField({
      name: 'revisedDesign',
      title: 'Revised Design',
      type: 'galleryImage',
    }),
    defineField({
      name: 'feedback',
      title: 'User / Stakeholder Feedback',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'changesMade',
      title: 'Changes Made',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'changesMade',
      subtitle: 'feedback',
      media: 'revisedDesign.image',
    },
  },
});

export const logoVariationItem = defineType({
  name: 'logoVariationItem',
  title: 'Logo Variation',
  type: 'object',
  fields: [
    defineField({
      name: 'variationName',
      title: 'Variation Name',
      description: 'e.g. Horizontal, Vertical, Monochrome, Inverted',
      type: 'string',
    }),
    defineField({
      name: 'logoImage',
      title: 'Logo Image',
      type: 'galleryImage',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'usageGuidelines',
      title: 'Usage Guidelines',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'variationName',
      subtitle: 'description',
      media: 'logoImage.image',
    },
  },
});

export const brandApplicationItem = defineType({
  name: 'brandApplicationItem',
  title: 'Brand Application',
  type: 'object',
  fields: [
    defineField({
      name: 'applicationName',
      title: 'Application Name',
      type: 'string',
    }),
    defineField({
      name: 'applicationType',
      title: 'Application Type',
      type: 'string',
      options: {
        list: [
          'Business Cards',
          'Stationery',
          'Packaging',
          'Social Media Designs',
          'Digital Applications',
          'Print Applications',
          'Signage',
          'Merchandise',
          'Brand Mockups',
          'Other',
        ],
      },
    }),
    defineField({
      name: 'images',
      title: 'Application Images',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryImage' })],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'applicationName',
      subtitle: 'applicationType',
      media: 'images.0.image',
    },
  },
});

export const projectMetricItem = defineType({
  name: 'projectMetricItem',
  title: 'Project Metric',
  type: 'object',
  fields: [
    defineField({
      name: 'metricName',
      title: 'Metric Name',
      type: 'string',
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
    }),
    defineField({
      name: 'unit',
      title: 'Unit (optional)',
      description: 'e.g. %, ms, Users, Conversion Lift',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'metricName',
      value: 'value',
      unit: 'unit',
    },
    prepare({ title, value, unit }) {
      return {
        title: title || 'Metric',
        subtitle: [value, unit].filter(Boolean).join(' '),
      };
    },
  },
});

export const deliverableItem = defineType({
  name: 'deliverableItem',
  title: 'Deliverable',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Deliverable Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'file',
      title: 'File Attachment (optional)',
      type: 'file',
    }),
    defineField({
      name: 'url',
      title: 'External URL (optional)',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
});

export const testimonialItem = defineType({
  name: 'testimonialItem',
  title: 'Client Testimonial',
  type: 'object',
  fields: [
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
    }),
    defineField({
      name: 'designation',
      title: 'Designation / Role',
      type: 'string',
    }),
    defineField({
      name: 'organisation',
      title: 'Organisation',
      type: 'string',
    }),
    defineField({
      name: 'feedback',
      title: 'Feedback / Quote',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'photo',
      title: 'Client Photo',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
});

export const teamMemberItem = defineType({
  name: 'teamMemberItem',
  title: 'Team Member',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
    },
  },
});

export const reusableObjectSchemas = [
  galleryImage,
  colorPaletteItem,
  typographyItem,
  technologyItem,
  keyFeatureItem,
  researchFindingItem,
  userSurveyItem,
  userPersonaItem,
  challengeSolutionItem,
  beforeAfterItem,
  designIterationItem,
  logoVariationItem,
  brandApplicationItem,
  projectMetricItem,
  deliverableItem,
  testimonialItem,
  teamMemberItem,
];

