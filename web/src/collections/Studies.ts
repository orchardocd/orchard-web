import type { CollectionConfig } from 'payload'

import { contentBlocks } from '@/blocks/index'
import { seoFields, slugField } from '@/fields/slug'

export const Studies: CollectionConfig = {
  slug: 'studies',
  labels: { singular: 'Study', plural: 'Studies' },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'slug'],
    group: 'Research',
    description: 'Studies people can take part in, shown under Participate in Research.',
  },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'excerpt', type: 'textarea' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    {
      name: 'layout',
      type: 'blocks',
      blocks: contentBlocks,
    },
    seoFields,
  ],
}
