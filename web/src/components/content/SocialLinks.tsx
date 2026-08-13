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
    <ul className={cn('flex flex-wrap gap-2', className)}>
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
