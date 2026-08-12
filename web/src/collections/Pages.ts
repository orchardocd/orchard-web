import type { CollectionConfig } from 'payload'

import { contentBlocks } from '@/blocks/index'
import { seoFields, slugField } from '@/fields/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    {
      name: 'intro',
      type: 'textarea',
      admin: { description: 'Short lede shown under the page title.' },
    },
    {
      name: 'hero',
      type: 'array',
      labels: { singular: 'Hero slide', plural: 'Hero slides' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'richText' },
        { name: 'ctaLabel', type: 'text' },
        { name: 'ctaHref', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: contentBlocks,
    },
    seoFields,
  ],
}
