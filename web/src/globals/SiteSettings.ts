import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'announcement',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'text', type: 'text' },
        { name: 'linkLabel', type: 'text' },
        { name: 'linkHref', type: 'text' },
      ],
    },
    {
      name: 'donateUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'registryUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'text', required: true },
        { name: 'address', type: 'textarea', required: true },
        { name: 'mapUrl', type: 'text' },
        { name: 'charityNumber', type: 'text', required: true },
        { name: 'charityRegisterUrl', type: 'text' },
      ],
    },
    {
      name: 'social',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'X / Twitter', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Homepage statistics',
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
        { name: 'signupUrl', type: 'text' },
      ],
    },
  ],
}
