import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name / Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date Published',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Web Design', value: 'WEBDESIGN'},
          {title: 'Development', value: 'DEVELOPMENT'},
          {title: 'SEO', value: 'SEO'},
          {title: 'Other', value: 'OTHER'},
        ],
      },
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (e.g. "5 MIN")',
      type: 'string',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      description: 'Used under the title and as a short summary on the blog cards.',
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'conclusion',
      title: 'Conclusion',
      type: 'text',
    }),
  ],
})
