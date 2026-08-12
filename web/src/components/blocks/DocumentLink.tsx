import type { Page } from '@/payload-types'

type Block = Extract<NonNullable<Page['layout']>[number], { blockType: 'documentBlock' }>

export function DocumentLink({ block }: { block: Block }) {
  const document = typeof block.document === 'object' ? block.document : null
  if (!document?.url) return null

  return (
    <p className="max-w-measure">
      <a
        href={document.url}
        className="inline-flex items-center gap-2 rounded border-2 border-brand px-6 py-3 font-bold text-brand-link no-underline hover:bg-mist"
      >
        <span aria-hidden="true">↓</span>
        {block.label || document.title}
        <span className="sr-only"> (opens document)</span>
      </a>
    </p>
  )
}
