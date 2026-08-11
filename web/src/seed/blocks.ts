import {
  convertHTMLToLexical,
  editorConfigFactory,
  type SanitizedServerEditorConfig,
} from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import type { Payload } from 'payload'

import { rewriteHref, rewriteHtml, type LinkMap } from './links.js'
import type { ContentBlock, SeedLayoutBlock } from './types.js'

const PROSE_TYPES = new Set(['paragraph', 'heading', 'list', 'quote'])

function escapeHtml(value: string): string {
  return value.replace(/&(?!(?:[a-zA-Z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;')
}

function proseToHtml(block: ContentBlock): string {
  switch (block.type) {
    case 'paragraph':
      return `<p>${block.html}</p>`
    case 'heading': {
      const level = Math.min(Math.max(block.level, 2), 4)
      return `<h${level}>${escapeHtml(block.text)}</h${level}>`
    }
    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul'
      return `<${tag}>${block.items.map((item) => `<li>${item}</li>`).join('')}</${tag}>`
    }
    case 'quote':
      return `<blockquote><p>${block.html}</p></blockquote>`
    default:
      return ''
  }
}

export async function createLexicalConverter(payload: Payload) {
  const editorConfig: SanitizedServerEditorConfig = await editorConfigFactory.default({
    config: payload.config,
  })

  return (html: string) =>
    convertHTMLToLexical({
      editorConfig,
      html,
      JSDOM: JSDOM as unknown as new (html: string) => { window: { document: Document } },
    })
}

export type Converter = Awaited<ReturnType<typeof createLexicalConverter>>

export function buildLayout(
  blocks: ContentBlock[],
  mediaIds: Map<string, number>,
  toLexical: Converter,
  links: LinkMap,
): SeedLayoutBlock[] {
  const layout: SeedLayoutBlock[] = []
  let prose: ContentBlock[] = []

  const flush = () => {
    if (prose.length === 0) return
    const html = prose.map(proseToHtml).join('')
    prose = []
    if (html) layout.push({ blockType: 'richText', content: toLexical(rewriteHtml(html, links)) })
  }

  for (const block of blocks) {
    if (PROSE_TYPES.has(block.type)) {
      prose.push(block)
      continue
    }
    flush()
    switch (block.type) {
      case 'image': {
        const image = mediaIds.get(block.image)
        if (image !== undefined) {
          layout.push({ blockType: 'imageBlock', image, caption: block.caption })
        }
        break
      }
      case 'video':
        layout.push({ blockType: 'videoBlock', url: block.url })
        break
      case 'button':
        layout.push({
          blockType: 'buttonBlock',
          label: block.label,
          href: rewriteHref(block.href, links),
          variant: /justgiving|donate/i.test(block.href) ? 'donate' : 'primary',
        })
        break
      case 'embed':
        layout.push({ blockType: 'embedBlock', url: block.url })
        break
      case 'table':
        layout.push({
          blockType: 'tableBlock',
          rows: block.rows.map((cells) => ({ cells: cells.map((value) => ({ value })) })),
        })
        break
      case 'accordion-item': {
        const previous = layout[layout.length - 1]
        const item = {
          title: block.title,
          content: toLexical(
            rewriteHtml(block.blocks.map(proseToHtml).join('') || '<p></p>', links),
          ),
        }
        if (previous && previous.blockType === 'accordionBlock') {
          previous.items.push(item)
        } else {
          layout.push({ blockType: 'accordionBlock', items: [item] })
        }
        break
      }
    }
  }
  flush()
  return layout
}
