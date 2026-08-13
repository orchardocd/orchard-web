import {
  convertHTMLToLexical,
  editorConfigFactory,
  type SanitizedServerEditorConfig,
} from '@payloadcms/richtext-lexical'
// @ts-expect-error jsdom ships no type declarations
import { JSDOM } from 'jsdom'
import type { Payload } from 'payload'

import { rewriteHref, rewriteHtml, type LinkMap } from '@/seed/links'
import type { ContentBlock, SeedAssetIds, SeedBody } from '@/seed/types'

const PROSE_TYPES = new Set(['paragraph', 'heading', 'list', 'quote'])
const VOID_TAGS = new Set(['br', 'hr', 'img', 'input'])
const SENTENCE_END = /[.!?][")\]]?\s*$/

type ListBlock = Extract<ContentBlock, { type: 'list' }>
type UploadCollection = 'media' | 'documents' | 'videos'
type BodyNode = SeedBody['root']['children'][number]

function escapeHtml(value: string): string {
  return value.replace(/&(?!(?:[a-zA-Z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;')
}

function splitOnBreaks(html: string): string[] {
  const parts: string[] = []
  const tag = /<(\/?)([a-z][a-z0-9]*)[^>]*>/gi
  let depth = 0
  let start = 0

  for (let match = tag.exec(html); match !== null; match = tag.exec(html)) {
    const name = match[2].toLowerCase()
    if (name === 'br') {
      const end = match.index + match[0].length
      const before = html.slice(start, match.index).replace(/<[^>]*>/g, '')
      if (depth === 0 && SENTENCE_END.test(before) && !/^\s*[a-z]/.test(html.slice(end))) {
        parts.push(html.slice(start, match.index))
        start = end
      }
      continue
    }
    if (VOID_TAGS.has(name)) continue
    depth = match[1] ? Math.max(depth - 1, 0) : depth + 1
  }

  parts.push(html.slice(start))
  return parts.map((part) => part.trim()).filter((part) => part.length > 0)
}

function listItems(block: ListBlock): string[] {
  return block.items.flatMap(splitOnBreaks)
}

function listHtml(block: ListBlock, nested?: ListBlock): string {
  const tag = block.ordered ? 'ol' : 'ul'
  const inner = nested === undefined ? '' : listHtml(nested)
  const items = listItems(block).map((item, index) => `<li>${item}${index === 0 ? inner : ''}</li>`)
  return `<${tag}>${items.join('')}</${tag}>`
}

function headingLevels(blocks: ContentBlock[]): number[] {
  return blocks.flatMap((block) => {
    if (block.type === 'heading') return [block.level]
    if (block.type === 'accordion-item') return headingLevels(block.blocks)
    return []
  })
}

function headingTier(level: number, levels: number[]): number {
  return Math.min(new Set(levels.filter((value) => value < level)).size + 2, 4)
}

function proseToHtml(block: ContentBlock, levels: number[]): string {
  switch (block.type) {
    case 'paragraph':
      return splitOnBreaks(block.html)
        .map((part) => `<p>${part}</p>`)
        .join('')
    case 'heading': {
      const level = headingTier(block.level, levels)
      return `<h${level}>${escapeHtml(block.text)}</h${level}>`
    }
    case 'list':
      return listHtml(block)
    case 'quote':
      return `<blockquote><p>${block.html}</p></blockquote>`
    default:
      return ''
  }
}

function proseHtml(blocks: ContentBlock[], levels: number[]): string {
  let html = ''
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index]
    const next = blocks.at(index + 1)
    if (block.type === 'list' && next?.type === 'list' && listItems(block).length === 1) {
      html += listHtml(block, next)
      index += 1
      continue
    }
    html += proseToHtml(block, levels)
  }
  return html
}

export async function createLexicalConverter(payload: Payload) {
  const editorConfig: SanitizedServerEditorConfig = await editorConfigFactory.default({
    config: payload.config,
  })

  return (html: string) => convertHTMLToLexical({ editorConfig, html, JSDOM })
}

type Converter = Awaited<ReturnType<typeof createLexicalConverter>>

let nodeCount = 0

function uploadNode(relationTo: UploadCollection, value: number): BodyNode {
  nodeCount += 1
  return {
    type: 'upload',
    version: 3,
    format: '',
    id: nodeCount.toString(16).padStart(24, '0'),
    relationTo,
    value,
    fields: {},
  }
}

function eachRun(
  blocks: ContentBlock[],
  onProse: (html: string) => void,
  onBlock: (block: ContentBlock, levels: number[]) => void,
): void {
  const levels = headingLevels(blocks)
  let prose: ContentBlock[] = []

  const flush = () => {
    if (prose.length === 0) return
    const html = proseHtml(prose, levels)
    prose = []
    if (html) onProse(html)
  }

  for (const block of blocks) {
    if (PROSE_TYPES.has(block.type)) prose.push(block)
    else {
      flush()
      onBlock(block, levels)
    }
  }
  flush()
}

export function buildBody(
  blocks: ContentBlock[],
  assets: SeedAssetIds,
  toLexical: Converter,
  links: LinkMap,
  featuredImage?: number,
): SeedBody {
  const children: BodyNode[] = []
  const write = (html: string) =>
    children.push(...toLexical(rewriteHtml(html, links)).root.children)
  const link = (href: string, label: string) =>
    write(`<p><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></p>`)
  const draw = (relationTo: UploadCollection, key: string | undefined, skip?: number) => {
    const id = key === undefined ? undefined : assets[relationTo].get(key)
    if (id === undefined || id === skip) return false
    children.push(uploadNode(relationTo, id))
    return true
  }

  eachRun(blocks, write, (block) => {
    switch (block.type) {
      case 'image':
        draw('media', block.image, featuredImage)
        break
      case 'video':
        if (!draw('videos', block.file) && block.url) link(block.url, block.url)
        break
      case 'embed':
        link(block.url, block.url)
        break
      case 'button':
        link(rewriteHref(block.href, links), block.label)
        break
      default:
        throw new Error(`A ${block.type} block has no place in a rich text body`)
    }
  })

  return {
    root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 },
  }
}
