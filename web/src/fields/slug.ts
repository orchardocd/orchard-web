import type { Field } from 'payload'

export const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL path segment. Lowercase words separated by hyphens.',
  },
}

export const titledContentFields: Field[] = [
  { name: 'title', type: 'text', required: true },
  { name: 'content', type: 'richText' },
]

export const seoFields: Field = {
  name: 'meta',
  type: 'group',
  label: 'SEO',
  fields: [
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
