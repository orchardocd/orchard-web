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
    <ul className={cn('flex flex-wrap gap-2', className)}>
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
