import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'alt',
    group: 'Media',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe the image for screen reader users. Leave a single space only if the image is purely decorative.',
      },
    },
    {
      name: 'credit',
      type: 'text',
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: false,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: undefined, position: 'centre' },
      { name: 'card', width: 768, height: undefined, position: 'centre' },
      { name: 'wide', width: 1400, height: undefined, position: 'centre' },
    ],
  },
}
