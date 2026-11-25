import { defineType, defineField, defineArrayMember } from 'sanity';

export const blog = defineType({
  name: 'blog',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading / Excerpt',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Publish Date',
      type: 'date',
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (e.g. 5 MIN)',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'conclusion',
      title: 'Conclusion',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        defineField({ name: 'name', title: 'Name', type: 'string' }),
        defineField({ name: 'role', title: 'Role', type: 'string' }),
        defineField({ name: 'image', title: 'Avatar', type: 'image', options: { hotspot: true } }),
        defineField({
          name: 'socials',
          title: 'Social Links',
          type: 'object',
          fields: [
            defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
            defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
            defineField({ name: 'github', title: 'GitHub', type: 'url' }),
            defineField({ name: 'email', title: 'Email (mailto:...)', type: 'string' }),
            defineField({ name: 'whatsapp', title: 'WhatsApp', type: 'url' }),
            defineField({ name: 'threads', title: 'Threads', type: 'url' }),
          ],
        }),
      ],
    }),
  ],
});

