import { MediaImage, type MediaValue } from '@/components/ui/Media'
import { cn } from '@/lib/cn'

/** The old site's spot illustrations, shown as a row beside or under a section. */
export function Illustrations({
  items,
  className,
  size = 'h-24',
}: {
  items: { id?: string | null; image?: MediaValue }[] | null | undefined
  className?: string
  size?: string
}) {
  const images = (items ?? []).filter((item) => item.image)
  if (images.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap items-center gap-6', className)}>
      {images.map((item, index) => (
        <li key={item.id ?? index}>
          <MediaImage media={item.image} className={cn('w-auto', size)} sizes="160px" />
        </li>
      ))}
    </ul>
  )
}
