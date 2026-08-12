import type { Field, GlobalConfig } from 'payload'

import { headingAndBody, illustrations } from '@/fields/slug'

const ctaFields: Field[] = [
  { name: 'ctaLabel', type: 'text', label: 'Link label' },
  { name: 'ctaHref', type: 'text', label: 'Link address' },
]

/** A headline, a link and a picture: the shape of every promoted item on the page. */
const promoFields: Field[] = [
  { name: 'title', type: 'textarea', required: true },
  ...ctaFields,
  { name: 'image', type: 'upload', relationTo: 'media' },
]

/**
 * The landing page is composed of designed sections. Editors supply the words and the
 * pictures; the site decides how they look.
 */
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
    description: 'The landing page. Every field is content, never layout or markup.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: promoFields,
            },
            {
              name: 'highlights',
              type: 'array',
              labels: { singular: 'Highlight', plural: 'Highlights' },
              admin: { description: 'The cards shown under the hero.' },
              fields: promoFields,
            },
          ],
        },
        {
          label: 'About',
          fields: [
            {
              name: 'about',
              type: 'group',
              fields: [
                { name: 'heading', type: 'text', required: true },
                { name: 'intro', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
                {
                  name: 'pillars',
                  type: 'array',
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'body', type: 'textarea', required: true },
                    { name: 'image', type: 'upload', relationTo: 'media' },
                  ],
                },
                { name: 'goalsTitle', type: 'text' },
                { name: 'goalsImage', type: 'upload', relationTo: 'media' },
                { name: 'goalsIntro', type: 'text' },
                {
                  name: 'goals',
                  type: 'array',
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
                { name: 'ctaHeading', type: 'text' },
                ...ctaFields,
                illustrations('ctaImages'),
              ],
            },
            {
              name: 'video',
              type: 'group',
              fields: [
                { name: 'url', type: 'text' },
                { name: 'poster', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Sections',
          fields: [
            {
              name: 'participate',
              type: 'group',
              fields: [...headingAndBody, ...ctaFields, illustrations()],
            },
            {
              name: 'social',
              type: 'group',
              fields: [...headingAndBody, illustrations()],
            },
            {
              name: 'proposals',
              type: 'group',
              label: 'Call for proposals',
              fields: [
                { name: 'heading', type: 'text' },
                {
                  name: 'body',
                  type: 'array',
                  fields: [{ name: 'text', type: 'textarea', required: true }],
                },
                { name: 'quote', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
                ...ctaFields,
              ],
            },
            {
              name: 'blog',
              type: 'group',
              fields: [{ name: 'heading', type: 'text' }, illustrations()],
            },
            {
              name: 'newsletter',
              type: 'group',
              fields: [illustrations()],
            },
            {
              name: 'webinar',
              type: 'group',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'image', type: 'upload', relationTo: 'media' },
                ...ctaFields,
              ],
            },
          ],
        },
      ],
    },
  ],
}
