import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: 'Rich text', plural: 'Rich text' },
  fields: [{ name: 'content', type: 'richText', required: true }],
}

export const ImageBlock: Block = {
  slug: 'imageBlock',
  interfaceName: 'ImageBlock',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
  ],
}

export const VideoBlock: Block = {
  slug: 'videoBlock',
  interfaceName: 'VideoBlock',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [
    { name: 'url', type: 'text', required: true },
    { name: 'title', type: 'text' },
  ],
}

export const ButtonBlock: Block = {
  slug: 'buttonBlock',
  interfaceName: 'ButtonBlock',
  labels: { singular: 'Button', plural: 'Buttons' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'href', type: 'text', required: true },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Donate', value: 'donate' },
      ],
    },
  ],
}

export const EmbedBlock: Block = {
  slug: 'embedBlock',
  interfaceName: 'EmbedBlock',
  labels: { singular: 'Embed', plural: 'Embeds' },
  fields: [
    { name: 'url', type: 'text', required: true },
    { name: 'title', type: 'text' },
  ],
}

export const TableBlock: Block = {
  slug: 'tableBlock',
  interfaceName: 'TableBlock',
  labels: { singular: 'Table', plural: 'Tables' },
  fields: [
    { name: 'caption', type: 'text' },
    {
      name: 'rows',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'cells',
          type: 'array',
          required: true,
          fields: [{ name: 'value', type: 'text' }],
        },
      ],
    },
  ],
}

export const AccordionBlock: Block = {
  slug: 'accordionBlock',
  interfaceName: 'AccordionBlock',
  labels: { singular: 'Accordion', plural: 'Accordions' },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'richText', required: true },
      ],
    },
  ],
}

export const contentBlocks: Block[] = [
  RichTextBlock,
  ImageBlock,
  VideoBlock,
  ButtonBlock,
  EmbedBlock,
  TableBlock,
  AccordionBlock,
]
