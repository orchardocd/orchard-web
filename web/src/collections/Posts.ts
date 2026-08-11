import type { CollectionConfig } from 'payload'

import { contentBlocks } from '../blocks/index.js'
import { seoFields, slugField } from '../fields/slug.js'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'slug'],
    group: 'Content',
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
    { name: 'byline', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { position: 'sidebar' },
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
