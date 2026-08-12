import { SOCIAL_LABELS } from '@/lib/social'
import { cn } from '@/lib/cn'
import type { SiteSetting } from '@/payload-types'

export function SocialLinks({
  items,
  className,
  linkClassName,
}: {
  items: SiteSetting['social']
  className?: string
  linkClassName: string
}) {
  return (
    <ul className={cn('grid grid-cols-2 gap-2 sm:flex sm:flex-wrap', className)}>
      {(items ?? []).map((item) => (
        <li key={item.id ?? item.url}>
          <a href={item.url} className={linkClassName}>
            {SOCIAL_LABELS[item.platform] ?? item.platform}
          </a>
        </li>
      ))}
    </ul>
  )
}
