import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

export const People: CollectionConfig = {
  slug: 'people',
  labels: { singular: 'Person', plural: 'People' },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'group', 'slug'],
    group: 'About',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField,
    {
      name: 'group',
      type: 'select',
      required: true,
      options: [
        { label: 'Trustees', value: 'trustees' },
        { label: 'Team', value: 'team' },
        { label: 'Scientific Advisory Board', value: 'scientific-advisory-board' },
        { label: 'Ambassadors', value: 'ambassadors' },
        { label: 'Partners', value: 'partners' },
        { label: 'College members', value: 'college' },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'role', type: 'text' },
    { name: 'website', type: 'text' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea' },
  ],
}
