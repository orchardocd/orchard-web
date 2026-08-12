import { cn } from '@/lib/cn'
import type { Page } from '@/payload-types'
import { RichText } from '@/components/RichText'
import { ButtonLink, type ButtonVariant } from '@/components/ui/Button'
import { Image } from '@/components/ui/Media'
import { Accordion } from '@/components/blocks/Accordion'
import { DocumentLink } from '@/components/blocks/DocumentLink'
import { VideoEmbed, VideoPlayer } from '@/components/blocks/VideoEmbed'

export type LayoutBlock = NonNullable<Page['layout']>[number]

function BlockTable({ block }: { block: Extract<LayoutBlock, { blockType: 'tableBlock' }> }) {
  const rows = block.rows ?? []
  if (rows.length === 0) return null
  const [head, ...body] = rows

  return (
    <div className="mx-auto max-w-4xl overflow-x-auto">
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

export function RenderBlocks({
  blocks,
  className,
}: {
  blocks: LayoutBlock[] | null | undefined
  className?: string
}) {
  if (!blocks || blocks.length === 0) return null

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      {blocks.map((block, index) => {
        const key = block.id ?? `${block.blockType}-${index}`
        switch (block.blockType) {
          case 'richText':
            return <RichText key={key} data={block.content} />
          case 'imageBlock':
            return (
              <figure key={key} className="mx-auto max-w-4xl">
                <Image media={block.image} className="rounded-lg" />
                {block.caption ? (
                  <figcaption className="mt-3 text-sm text-faint">{block.caption}</figcaption>
                ) : null}
              </figure>
            )
          case 'videoBlock':
            return <VideoPlayer key={key} block={block} />
          case 'embedBlock':
            return <VideoEmbed key={key} url={block.url} title={block.title} />
          case 'documentBlock':
            return <DocumentLink key={key} block={block} />
          case 'buttonBlock':
            return (
              <div key={key} className="max-w-measure">
                <ButtonLink href={block.href} variant={(block.variant as ButtonVariant) ?? 'primary'}>
                  {block.label}
                </ButtonLink>
              </div>
            )
          case 'tableBlock':
            return <BlockTable key={key} block={block} />
          case 'accordionBlock':
            return <Accordion key={key} items={block.items ?? []} />
          default:
            return null
        }
      })}
    </div>
  )
}
