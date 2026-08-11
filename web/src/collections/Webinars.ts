import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug.js'

export const Webinars: CollectionConfig = {
  slug: 'webinars',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
    group: 'Research',
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    { name: 'url', type: 'text', required: true, admin: { description: 'YouTube video URL.' } },
    { name: 'description', type: 'textarea' },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
