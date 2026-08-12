import type { Page } from '@/payload-types'

export type LayoutBlock = NonNullable<Page['layout']>[number]

/** A run of consecutive illustrations, shown as one row of marks rather than a stack. */
export type ImageBlock = Extract<LayoutBlock, { blockType: 'imageBlock' }>
export type RichTextBlock = Extract<LayoutBlock, { blockType: 'richText' }>
type LexicalNode = RichTextBlock['content']['root']['children'][number]

export type LogoRow = { kind: 'logos'; id: string; images: ImageBlock[] }
/** A picture immediately followed by its caption, the structure of a speaker listing. */
export type PortraitCard = {
  kind: 'portrait'
  id: string
  image: ImageBlock
  caption: RichTextBlock
}
export type PortraitGrid = { kind: 'portraits'; id: string; cards: PortraitCard[] }
export type Single = { kind: 'block'; id: string; block: LayoutBlock }

export type Grouped = LogoRow | PortraitGrid | Single

const NAME_LENGTH = 60
const CAPTION_LENGTH = 600

function blockId(block: LayoutBlock, index: number): string {
  return block.id ?? `${block.blockType}-${index}`
}

function plainText(node: LexicalNode): string {
  if (typeof node.text === 'string') return node.text
  if (!Array.isArray(node.children)) return ''
  return (node.children as LexicalNode[]).map(plainText).join('')
}

/**
 * A heading opens the section beneath it, so prose that runs from one section into the next has
 * to be cut apart before anything can be paired with the picture it actually belongs to.
 */
function splitAtHeadings(block: RichTextBlock, index: number): RichTextBlock[] {
  const root = block.content.root
  const parts: LexicalNode[][] = [[]]
  for (const child of root.children) {
    if (child.type === 'heading' && parts[parts.length - 1].length > 0) parts.push([])
    parts[parts.length - 1].push(child)
  }
  const filled = parts.filter((part) => part.length > 0)
  if (filled.length < 2) return [block]

  return filled.map((children, part) => ({
    ...block,
    id: `${blockId(block, index)}-part-${part}`,
    content: { ...block.content, root: { ...root, children } },
  }))
}

/**
 * The banner and the body both used to announce the page. Lifting the opening heading out
 * leaves exactly one title, and the caller decides where it goes.
 */
export function takeOpeningTitle(
  blocks: LayoutBlock[],
  title: string | undefined,
): { blocks: LayoutBlock[]; title: string | null } {
  const [first] = blocks
  if (!title || first?.blockType !== 'richText') return { blocks, title: null }
  const [opening, ...rest] = first.content.root.children
  if (opening?.type !== 'heading') return { blocks, title: null }
  const written = plainText(opening).trim()
  if (written.toLowerCase() !== title.trim().toLowerCase()) return { blocks, title: null }
  if (rest.length === 0) return { blocks: blocks.slice(1), title: written }

  const trimmed: RichTextBlock = {
    ...first,
    content: { ...first.content, root: { ...first.content.root, children: rest } },
  }
  return { blocks: [trimmed, ...blocks.slice(1)], title: written }
}

function asImage(block: LayoutBlock | undefined): ImageBlock | null {
  return block?.blockType === 'imageBlock' ? block : null
}

function asCaption(block: LayoutBlock | undefined, limit: number): RichTextBlock | null {
  if (block?.blockType !== 'richText') return null
  if (block.content.root.children.some((child) => child.type === 'heading')) return null
  const written = block.content.root.children.map(plainText).join(' ').trim()
  return written.length > 0 && written.length <= limit ? block : null
}

/**
 * Elementor emitted rosters and logo strips as long alternating runs of pictures and short
 * captions. Read back flat they become one column hundreds of screens tall, so fold each run
 * into the grid it was always meant to be.
 */
/**
 * The old pages titled sections whose content came from a widget, so the title arrived with
 * nothing under it. Where the rebuild renders that section itself, the empty title is noise.
 */
function isOrphanTitle(block: LayoutBlock, titles: string[]): boolean {
  if (block.blockType !== 'richText') return false
  const [only, ...rest] = block.content.root.children
  if (rest.length > 0 || only?.type !== 'heading') return false
  const written = plainText(only).trim().toLowerCase()
  return titles.some((title) => title.trim().toLowerCase() === written)
}

export function groupBlocks(input: LayoutBlock[], renderedElsewhere: string[] = []): Grouped[] {
  const blocks: LayoutBlock[] = input
    .flatMap<LayoutBlock>((block, index) =>
      block.blockType === 'richText' ? splitAtHeadings(block, index) : [block],
    )
    .filter((block) => !isOrphanTitle(block, renderedElsewhere))
  const grouped: Grouped[] = []
  let index = 0

  while (index < blocks.length) {
    const cards: PortraitCard[] = []
    for (;;) {
      const image = asImage(blocks[index])
      const caption = image ? asCaption(blocks[index + 1], CAPTION_LENGTH) : null
      if (!image || !caption) break
      cards.push({ kind: 'portrait', id: blockId(image, index), image, caption })
      index += 2
    }
    // A picture on its own only reads as a portrait when what follows it is a name.
    const isGrid = cards.length > 1 || (cards.length === 1 && asCaption(cards[0].caption, NAME_LENGTH))
    if (cards.length > 0 && isGrid) {
      grouped.push({ kind: 'portraits', id: cards[0].id, cards })
      continue
    }
    if (cards.length > 0) {
      for (const card of cards) {
        grouped.push({ kind: 'block', id: card.id, block: card.image })
        grouped.push({ kind: 'block', id: `${card.id}-caption`, block: card.caption })
      }
      continue
    }

    const images: ImageBlock[] = []
    for (;;) {
      const image = asImage(blocks[index])
      if (!image) break
      images.push(image)
      index += 1
    }
    if (images.length > 1) {
      grouped.push({ kind: 'logos', id: blockId(images[0], index), images })
      continue
    }
    if (images.length === 1) {
      grouped.push({ kind: 'block', id: blockId(images[0], index), block: images[0] })
      continue
    }

    grouped.push({ kind: 'block', id: blockId(blocks[index], index), block: blocks[index] })
    index += 1
  }

  return grouped
}
