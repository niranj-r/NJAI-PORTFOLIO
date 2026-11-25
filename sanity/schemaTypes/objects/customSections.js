import { defineType, defineField, defineArrayMember } from 'sanity';
import { richTextOf } from './commonObjects';

export const sectionHeadingBlock = defineType({
  name: 'sectionHeadingBlock',
  title: 'Section Heading',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow Label', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'eyebrow' },
  },
});

export const richTextSectionBlock = defineType({
  name: 'richTextSectionBlock',
  title: 'Rich Text Block',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Optional Heading', type: 'string' }),
    defineField({
      name: 'body',
      title: 'Rich Text Content',
      type: 'array',
      of: richTextOf,
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Rich Text Block' };
    },
  },
});

export const fullWidthImageBlock = defineType({
  name: 'fullWidthImageBlock',
  title: 'Full-Width Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'galleryImage',
    }),
  ],
  preview: {
    select: { title: 'image.caption', subtitle: 'image.alt', media: 'image.image' },
    prepare({ title, subtitle, media }) {
      return { title: title || subtitle || 'Full-Width Image', media };
    },
  },
});

export const imageGridBlock = defineType({
  name: 'imageGridBlock',
  title: 'Image Grid',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Grid Heading (optional)', type: 'string' }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'string',
      initialValue: '2',
      options: {
        list: [
          { title: '2 Columns', value: '2' },
          { title: '3 Columns', value: '3' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryImage' })],
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'images.0.image' },
    prepare({ title, media }) {
      return { title: title || 'Image Grid', media };
    },
  },
});

export const imageTextBlock = defineType({
  name: 'imageTextBlock',
  title: 'Image & Text Section',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Text', type: 'array', of: richTextOf }),
    defineField({ name: 'image', title: 'Image', type: 'galleryImage' }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      initialValue: 'right',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'image.image' },
    prepare({ title, media }) {
      return { title: title || 'Image & Text Section', media };
    },
  },
});

export const videoSectionBlock = defineType({
  name: 'videoSectionBlock',
  title: 'Video Section',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Video Title', type: 'string' }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (YouTube, Vimeo, or direct MP4)',
      type: 'url',
    }),
    defineField({
      name: 'videoFile',
      title: 'Or Upload Video File',
      type: 'file',
      options: { accept: 'video/*' },
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'videoUrl' },
    prepare({ title, subtitle }) {
      return { title: title || 'Video Section', subtitle };
    },
  },
});

export const metricsSectionBlock = defineType({
  name: 'metricsSectionBlock',
  title: 'Statistics & Metrics',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Section Heading (optional)', type: 'string' }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      of: [defineArrayMember({ type: 'projectMetricItem' })],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Statistics & Metrics' };
    },
  },
});

export const quoteSectionBlock = defineType({
  name: 'quoteSectionBlock',
  title: 'Quote / Testimonial',
  type: 'object',
  fields: [
    defineField({
      name: 'testimonial',
      title: 'Quote / Testimonial',
      type: 'testimonialItem',
    }),
  ],
  preview: {
    select: { title: 'testimonial.clientName', subtitle: 'testimonial.feedback' },
    prepare({ title, subtitle }) {
      return { title: title || 'Quote / Testimonial', subtitle };
    },
  },
});

export const beforeAfterSectionBlock = defineType({
  name: 'beforeAfterSectionBlock',
  title: 'Before & After Comparisons',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Section Heading (optional)', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Comparisons',
      type: 'array',
      of: [defineArrayMember({ type: 'beforeAfterItem' })],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Before & After Comparisons' };
    },
  },
});

export const customContentBlock = defineType({
  name: 'customContentBlock',
  title: 'Custom Content Section',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Section Label', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'array', of: richTextOf }),
    defineField({
      name: 'images',
      title: 'Supporting Images',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryImage' })],
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'label' },
    prepare({ title, subtitle }) {
      return { title: title || subtitle || 'Custom Content Section', subtitle };
    },
  },
});

export const customSectionSchemas = [
  sectionHeadingBlock,
  richTextSectionBlock,
  fullWidthImageBlock,
  imageGridBlock,
  imageTextBlock,
  videoSectionBlock,
  metricsSectionBlock,
  quoteSectionBlock,
  beforeAfterSectionBlock,
  customContentBlock,
];

