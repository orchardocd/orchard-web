import type { GlobalConfig } from 'payload'

const linkFields = [
  { name: 'label', type: 'text' as const, required: true },
  { name: 'href', type: 'text' as const, required: true },
]

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'main',
      type: 'array',
      label: 'Main navigation',
      fields: [
        ...linkFields,
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown items',
          fields: linkFields,
        },
      ],
    },
    {
      name: 'footer',
      type: 'array',
      label: 'Footer columns',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'links', type: 'array', fields: linkFields },
      ],
    },
  ],
}
