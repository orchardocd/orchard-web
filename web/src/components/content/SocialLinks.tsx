import { cn } from '@/lib/cn'
import type { SocialProfile } from '@/lib/site'

export function SocialLinks({
  items,
  className,
  linkClassName,
}: {
  items: SocialProfile[]
  className?: string
  linkClassName: string
}) {
  return (
    <ul className={cn('grid grid-cols-2 gap-2 sm:flex sm:flex-wrap', className)}>
      {items.map((item) => (
        <li key={item.url}>
          <a href={item.url} className={linkClassName}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
