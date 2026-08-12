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

export const headingAndBody: Field[] = [
  { name: 'heading', type: 'text' },
  { name: 'body', type: 'textarea' },
]

export function illustrations(name = 'images'): Field {
  return {
    name,
    type: 'array',
    label: 'Illustrations',
    fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
  }
}

export const seoFields: Field = {
  name: 'meta',
  type: 'group',
  label: 'SEO',
  fields: [
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
