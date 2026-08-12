import type { CollectionConfig } from 'payload'

export const Videos: CollectionConfig = {
  slug: 'videos',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Media',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['video/mp4', 'video/webm'],
  },
}
