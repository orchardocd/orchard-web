import { Banner, BannerTitle } from '@/components/layout/Banner'
import { ButtonLink } from '@/components/ui/Button'

export function NotFound() {
  return (
    <Banner>
      <BannerTitle>Page not found</BannerTitle>
      <p className="mt-6 max-w-measure text-base leading-relaxed text-balance text-white/92 md:text-lg">
        The page you asked for is not here. It may have moved since the site was rebuilt.
      </p>
      <ButtonLink href="/" variant="light" className="mt-8">
        Home
      </ButtonLink>
    </Banner>
  )
}
