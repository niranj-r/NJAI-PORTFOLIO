import { defineType, defineField, defineArrayMember } from 'sanity';
import { richTextOf } from './objects/commonObjects';

const isDesign = ({ document }) => document?.category === 'design';
const isDev = ({ document }) => document?.category === 'development';
const isUiUx = ({ document }) => document?.category === 'design' && document?.subcategory === 'ui-ux';
const isBranding = ({ document }) => document?.category === 'design' && document?.subcategory === 'branding';

export const work = defineType({
  name: 'work',
  title: 'Work & Projects',
  type: 'document',
  groups: [
    { name: 'common', title: 'Common Details', default: true },
    { name: 'development', title: 'Development' },
    { name: 'uiux', title: 'UI/UX Design' },
    { name: 'branding', title: 'Branding' },
    { name: 'sections', title: 'Dynamic Sections' },
    { name: 'seo', title: 'Settings & SEO' },
  ],
  fields: [
    // ========================
    // 2. COMMON FIELDS
    // ========================
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      group: 'common',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'common',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'Select the primary category. Selecting Design reveals the Subcategory dropdown.',
      type: 'string',
      group: 'common',
      initialValue: 'development',
      options: {
        list: [
          { title: 'Development', value: 'development' },
          { title: 'Design', value: 'design' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'subcategory',
      title: 'Design Subcategory',
      description: 'Choose whether this Design project is UI/UX Design or Branding.',
      type: 'string',
      group: 'common',
      hidden: (ctx) => !isDesign(ctx),
      options: {
        list: [
          { title: 'UI/UX Design', value: 'ui-ux' },
          { title: 'Branding', value: 'branding' },
        ],
      },
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Project Description',
      description: 'Concise summary displayed on portfolio cards and listings.',
      type: 'text',
      rows: 3,
      group: 'common',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      description: 'Primary poster/thumbnail image for portfolio cards and the hero banner.',
      type: 'galleryImage',
      group: 'common',
    }),
    defineField({
      name: 'clientName',
      title: 'Client / Organisation Name',
      type: 'string',
      group: 'common',
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      group: 'common',
    }),
    defineField({
      name: 'projectOverview',
      title: 'Project Overview',
      type: 'array',
      of: richTextOf,
      group: 'common',
    }),
    defineField({
      name: 'projectObjectives',
      title: 'Project Objectives',
      type: 'array',
      of: richTextOf,
      group: 'common',
    }),
    defineField({
      name: 'projectDuration',
      title: 'Project Duration',
      description: 'e.g. 3 Months, Dec 2025 – May 2026',
      type: 'string',
      group: 'common',
    }),
    defineField({
      name: 'completionDate',
      title: 'Completion Date',
      type: 'date',
      group: 'common',
    }),
    defineField({
      name: 'servicesProvided',
      title: 'Services Provided',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'common',
    }),
    defineField({
      name: 'teamMembers',
      title: 'Team Members and Roles',
      type: 'array',
      of: [defineArrayMember({ type: 'teamMemberItem' })],
      group: 'common',
    }),
    defineField({
      name: 'projectGallery',
      title: 'Project Gallery',
      description: 'General showcase images for this project.',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryImage' })],
      group: 'common',
    }),
    defineField({
      name: 'clientTestimonial',
      title: 'Client Testimonial',
      type: 'testimonialItem',
      group: 'common',
    }),

    // ========================
    // 3-5. CATEGORY-SPECIFIC OBJECTS
    // ========================
    defineField({
      name: 'developmentDetails',
      title: 'Development Case Study',
      type: 'developmentDetails',
      group: 'development',
      hidden: (ctx) => !isDev(ctx),
    }),
    defineField({
      name: 'uiUxDetails',
      title: 'UI/UX Design Case Study',
      type: 'uiUxDetails',
      group: 'uiux',
      hidden: (ctx) => !isUiUx(ctx),
    }),
    defineField({
      name: 'brandingDetails',
      title: 'Branding Case Study',
      type: 'brandingDetails',
      group: 'branding',
      hidden: (ctx) => !isBranding(ctx),
    }),

    // ========================
    // 7. DYNAMIC CONTENT SECTIONS
    // ========================
    defineField({
      name: 'customSections',
      title: 'Dynamic Content Sections',
      description: 'Add, remove, and reorder custom case study blocks below the main category sections.',
      type: 'array',
      group: 'sections',
      of: [
        defineArrayMember({ type: 'sectionHeadingBlock' }),
        defineArrayMember({ type: 'richTextSectionBlock' }),
        defineArrayMember({ type: 'fullWidthImageBlock' }),
        defineArrayMember({ type: 'imageGridBlock' }),
        defineArrayMember({ type: 'imageTextBlock' }),
        defineArrayMember({ type: 'videoSectionBlock' }),
        defineArrayMember({ type: 'metricsSectionBlock' }),
        defineArrayMember({ type: 'quoteSectionBlock' }),
        defineArrayMember({ type: 'beforeAfterSectionBlock' }),
        defineArrayMember({ type: 'customContentBlock' }),
      ],
    }),

    // ========================
    // SETTINGS & SEO
    // ========================
    defineField({
      name: 'featured',
      title: 'Featured Project',
      description: 'Highlight this project on the Home Selected Work grid.',
      type: 'boolean',
      initialValue: false,
      group: 'seo',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      description: 'Lower numbers appear first in portfolio listings.',
      type: 'number',
      group: 'seo',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      subcategory: 'subcategory',
      legacyWorkType: 'workType',
      media: 'coverImage.image',
      legacyMedia: 'image',
    },
    prepare({ title, category, subcategory, legacyWorkType, media, legacyMedia }) {
      const cat = (category || '').toLowerCase();
      let label = 'Development';
      if (cat === 'design') {
        label = subcategory === 'branding' ? 'Design • Branding' : 'Design • UI/UX';
      } else if (legacyWorkType === 'branding') {
        label = 'Design • Branding';
      } else if (legacyWorkType === 'ui') {
        label = 'Design • UI/UX';
      }
      return {
        title: title || 'Untitled Work',
        subtitle: label,
        media: media || legacyMedia,
      };
    },
  },
});
