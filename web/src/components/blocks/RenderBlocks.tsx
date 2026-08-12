import { cn } from '@/lib/cn'
import { RichText } from '@/components/RichText'
import { ButtonLink, type ButtonVariant } from '@/components/ui/Button'
import { MediaImage } from '@/components/ui/Media'
import { Accordion } from '@/components/blocks/Accordion'
import { DocumentLink } from '@/components/blocks/DocumentLink'
import { groupBlocks, takeOpeningTitle, type LayoutBlock } from '@/components/blocks/groupBlocks'
import { TITLE_CLASSES } from '@/components/layout/Banner'
import { EmbedFrame } from '@/components/blocks/EmbedFrame'
import { VideoPlayer } from '@/components/blocks/VideoEmbed'

export type { LayoutBlock }

function BlockTable({ block }: { block: Extract<LayoutBlock, { blockType: 'tableBlock' }> }) {
  const rows = block.rows ?? []
  if (rows.length === 0) return null
  const [head, ...body] = rows

  return (
    <div className="my-4 w-full overflow-x-auto">
      <table className="w-full border-collapse text-left text-base">
        <caption className="sr-only">{block.caption || 'Table'}</caption>
        <thead>
          <tr>
            {(head.cells ?? []).map((cell, index) => (
              <th
                key={cell.id ?? index}
                scope="col"
                className="border-b-2 border-brand px-4 py-3 font-bold text-ink"
              >
                {cell.value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={row.id ?? rowIndex} className="border-b border-line">
              {(row.cells ?? []).map((cell, index) => (
                <td key={cell.id ?? index} className="px-4 py-3 text-body">
                  {cell.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function mediaKey(value: unknown): string | null {
  if (typeof value === 'number') return String(value)
  if (value && typeof value === 'object' && 'id' in value)
    return String((value as { id: unknown }).id)
  return null
}

function Block({
  block,
  isFirst,
  seen,
}: {
  block: LayoutBlock
  isFirst: boolean
  seen: Set<string>
}) {
  switch (block.blockType) {
    case 'richText':
      return (
        <RichText data={block.content} className={isFirst ? '[&>*:first-child]:mt-0' : undefined} />
      )
    case 'imageBlock': {
      const key = mediaKey(block.image)
      if (key !== null) {
        if (seen.has(key)) return null
        seen.add(key)
      }
      return (
        <figure className="my-4 w-full">
          <MediaImage media={block.image} className="rounded-lg" />
          {block.caption ? (
            <figcaption className="mt-3 text-sm text-faint">{block.caption}</figcaption>
          ) : null}
        </figure>
      )
    }
    case 'videoBlock':
      return <VideoPlayer block={block} className="my-6" />
    case 'embedBlock':
      return <EmbedFrame url={block.url} title={block.title} className="my-6" />
    case 'documentBlock':
      return <DocumentLink block={block} />
    case 'buttonBlock':
      return (
        <div className="my-4">
          <ButtonLink href={block.href} variant={(block.variant as ButtonVariant) ?? 'primary'}>
            {block.label}
          </ButtonLink>
        </div>
      )
    case 'tableBlock':
      return <BlockTable block={block} />
    case 'accordionBlock':
      return <Accordion items={block.items ?? []} />
    default:
      return null
  }
}

export function RenderBlocks({
  blocks,
  className,
  alreadyShown = [],
  title,
  showTitle = false,
  renderedElsewhere,
}: {
  blocks: LayoutBlock[] | null | undefined
  className?: string
  /** Illustrations the page has already rendered, so none of them appears twice. */
  alreadyShown?: unknown[]
  /** The page title, when the body opens by repeating it. */
  title?: string
  /** Whether this is where the surviving copy of that title should be shown. */
  showTitle?: boolean
  /** Section titles the page renders itself further down, so the body need not announce them. */
  renderedElsewhere?: string[]
}) {
  if (!blocks || blocks.length === 0) return null

  const seen = new Set(alreadyShown.map(mediaKey).filter((key): key is string => key !== null))
  const opening = takeOpeningTitle(blocks, title)
  const grouped = groupBlocks(opening.blocks, renderedElsewhere)

  return (
    <div className={cn('flex w-full flex-col', className)}>
      {showTitle && opening.title ? (
        <h1 className={cn('mx-auto mb-10 w-full max-w-measure', TITLE_CLASSES, 'text-ink')}>
          {opening.title}
        </h1>
      ) : null}
      {grouped.map((entry, index) => {
        if (entry.kind === 'logos') {
          const images = entry.images.filter((image) => {
            const key = mediaKey(image.image)
            if (key === null) return true
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          if (images.length === 0) return null
          return (
            <ul key={entry.id} className="my-6 flex w-full flex-wrap items-center gap-10">
              {images.map((image, imageIndex) => (
                <li key={image.id ?? imageIndex}>
                  <MediaImage
                    media={image.image}
                    className="h-16 w-auto max-w-none object-contain"
                    sizes="200px"
                  />
                </li>
              ))}
            </ul>
          )
        }

        if (entry.kind === 'portraits') {
          return (
            <ul
              key={entry.id}
              className={cn(
                'my-6 grid w-full items-start gap-8',
                entry.cards.length < 3
                  ? 'mx-auto max-w-measure grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
              )}
            >
              {entry.cards.map((card) => (
                <li key={card.id} className="flex flex-col gap-3">
                  <MediaImage
                    media={card.image.image}
                    className="aspect-square w-full rounded-lg object-cover"
                    sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw"
                  />
                  <RichText
                    data={card.caption.content}
                    className="[&>*:first-child]:mt-0 [&_p]:my-0 [&_p]:text-base [&_strong]:text-ink"
                  />
                </li>
              ))}
            </ul>
          )
        }

        return (
          <div key={entry.id} className="mx-auto w-full max-w-measure">
            <Block block={entry.block} isFirst={index === 0 && !showTitle} seen={seen} />
          </div>
        )
      })}
    </div>
  )
}
