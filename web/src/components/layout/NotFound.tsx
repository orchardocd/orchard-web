import { Banner, BannerTitle } from '@/components/layout/Banner'
import { BANNER_LEAD_CLASSES } from '@/components/site'
import { ButtonLink } from '@/components/ui/Button'

export function NotFound() {
  return (
    <Banner screen>
      <BannerTitle>Page not found</BannerTitle>
      <div className={BANNER_LEAD_CLASSES}>
        <p>The page you asked for is not here. It may have moved since the site was rebuilt.</p>
      </div>
      <ButtonLink href="/" variant="light" className="mt-8">
        Home
      </ButtonLink>
    </Banner>
  )
}
