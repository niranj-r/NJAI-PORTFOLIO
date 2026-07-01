import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'work',
  title: 'Work / Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
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
          {title: 'Branding', value: 'BRANDING'},
          {title: 'Other', value: 'OTHER'},
        ],
      },
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'string',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'string',
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'challenge',
      title: 'Challenge',
      type: 'text',
    }),
    defineField({
      name: 'goal',
      title: 'Goal',
      type: 'text',
    }),
    defineField({
      name: 'result',
      title: 'Result',
      type: 'text',
    }),
  ],
})
