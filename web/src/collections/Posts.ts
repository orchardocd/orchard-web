import type { CollectionConfig } from 'payload'

import { articleFields } from '@/fields/document'

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
  fields: articleFields([
    { name: 'byline', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
  ]),
}
