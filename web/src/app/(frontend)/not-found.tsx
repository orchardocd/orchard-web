import { BannerPage } from '@/components/layout/Banner'
import { ButtonLink } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <BannerPage title="Page not found">
      <p className="max-w-measure text-lg leading-relaxed text-body">
        The page you asked for is not here. It may have moved since the site was rebuilt.
      </p>
      <ButtonLink href="/" className="mt-8">
        Home
      </ButtonLink>
    </BannerPage>
  )
}
