import type { Field } from 'payload'

import { seoFields, slugField } from '@/fields/slug'

/** Fields shared by every dated, article-shaped collection. */
export function articleFields(extra: Field[] = []): Field[] {
  return [
    { name: 'title', type: 'text', required: true },
    slugField,
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    ...extra,
    { name: 'excerpt', type: 'textarea' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    seoFields,
  ]
}
