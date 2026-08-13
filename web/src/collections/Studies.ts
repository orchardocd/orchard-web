import type { CollectionConfig } from 'payload'

import { revalidates } from '@/lib/revalidate'

import { articleFields } from '@/fields/document'

export const Studies: CollectionConfig = {
  slug: 'studies',
  hooks: revalidates(['/participate-research'], '/participate-research'),
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
  fields: articleFields(),
}
