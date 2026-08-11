import type { CollectionConfig } from 'payload'

import { contentBlocks } from '../blocks/index.js'
import { slugField } from '../fields/slug.js'

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
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'role', type: 'text' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea' },
    {
      name: 'bio',
      type: 'blocks',
      blocks: contentBlocks,
    },
  ],
}
