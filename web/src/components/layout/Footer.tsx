import Image from 'next/image'
import Link from 'next/link'

import {
  CONTACT,
  FOOTER_COLUMNS,
  LOGO_ALT,
  SITE_STRAPLINE,
  SITE_TAGLINE,
  SITE_NAME,
  SOCIAL,
} from '@/lib/site'
import { Container } from '@/components/ui/Container'
import { LABEL_CLASSES } from '@/components/site'
import { SocialLinks } from '@/components/content/SocialLinks'
import { cn } from '@/lib/cn'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-footer text-white">
      <Container className="pt-16 pb-7 md:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-[2.9fr_0.8fr_0.8fr_1.3fr] lg:gap-y-10">
          <div className="col-span-2 lg:col-span-1">
            <Image
              src="/brand/logo-neg.png"
              alt={LOGO_ALT}
              width={340}
              height={96}
              className="h-11 w-auto"
            />
            <h2 className={cn(LABEL_CLASSES, 'mt-6 mb-3 text-white/55')}>
              Follow us on social media
            </h2>
            <SocialLinks
              items={SOCIAL}
              linkClassName="block rounded-full bg-white/10 px-4 py-2 text-center text-sm font-semibold text-white no-underline hover:bg-white/22"
            />
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className={cn(LABEL_CLASSES, 'mb-4 text-white/55')}>{column.heading}</h2>
              <ul className="flex flex-col gap-1">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block py-1 text-sm text-white/88 no-underline hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 lg:col-span-1">
            <h2 className={cn(LABEL_CLASSES, 'mb-4 text-white/55')}>Contact us</h2>
            <ul className="flex flex-col gap-3 text-sm text-white/88">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="font-bold text-white underline underline-offset-2"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.mapUrl}
                  className="leading-relaxed text-white/88 no-underline hover:text-white hover:underline"
                >
                  {CONTACT.address}
                </a>
              </li>
              <li>
                Registered charity number:{' '}
                <a
                  href={CONTACT.charityRegisterUrl}
                  className="font-bold text-white underline underline-offset-2"
                >
                  {CONTACT.charityNumber}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-between gap-x-6 gap-y-4 border-t border-white/14 pt-5 text-sm text-white/60 lg:mt-14 lg:gap-6 lg:pt-6">
          <p>
            © {year} {SITE_NAME}. {SITE_TAGLINE}.
          </p>
          <p>{SITE_STRAPLINE}</p>
        </div>
      </Container>
    </footer>
  )
}
