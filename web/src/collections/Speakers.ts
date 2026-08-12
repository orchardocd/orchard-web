import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

export const Speakers: CollectionConfig = {
  slug: 'speakers',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'slug'],
    group: 'About',
    description: 'Speakers listed on the conference pages.',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField,
    { name: 'role', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
