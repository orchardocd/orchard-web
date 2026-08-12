import Image from 'next/image'
import Link from 'next/link'

import type { Navigation, SiteSetting } from '@/payload-types'
import { Container } from '@/components/ui/Container'
import { SocialLinks } from '@/components/content/SocialLinks'

export function Footer({
  navigation,
  settings,
}: {
  navigation: Navigation
  settings: SiteSetting
}) {
  const columns = navigation.footer ?? []
  const contact = settings.contact
  const year = new Date().getFullYear()

  return (
    <footer className="bg-footer text-white">
      <Container className="pt-16 pb-7">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[2fr_1fr_1fr_1.4fr]">
          <div className="col-span-2 lg:col-span-1">
            <Image
              src="/brand/logo-neg.png"
              alt="Orchard OCD, advancing global OCD research"
              width={340}
              height={96}
              className="h-11 w-auto"
            />
            <h2 className="mt-6 mb-3 text-[0.8rem] font-bold tracking-[0.14em] text-white/55 uppercase">
              Follow us on social media
            </h2>
            <SocialLinks
              items={settings.social}
              linkClassName="block rounded-full bg-white/10 px-4 py-1.5 text-center text-[0.8rem] font-semibold text-white no-underline hover:bg-white/22"
            />
          </div>

          {columns.map((column) => (
            <nav key={column.id ?? column.heading} aria-label={column.heading}>
              <h2 className="mb-4 text-[0.8rem] font-bold tracking-[0.14em] text-white/55 uppercase">
                {column.heading}
              </h2>
              <ul className="flex flex-col gap-2">
                {(column.links ?? []).map((link) => (
                  <li key={link.id ?? link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.95rem] text-white/88 no-underline hover:text-lime hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="mb-4 text-[0.8rem] font-bold tracking-[0.14em] text-white/55 uppercase">
              Contact us
            </h2>
            <ul className="flex flex-col gap-3 text-[0.95rem] text-white/88">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="font-bold text-lime no-underline hover:underline"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                {contact.mapUrl ? (
                  <a
                    href={contact.mapUrl}
                    className="leading-relaxed text-white/88 no-underline hover:text-lime hover:underline"
                  >
                    {contact.address}
                  </a>
                ) : (
                  <span className="leading-relaxed">{contact.address}</span>
                )}
              </li>
              <li>
                Registered charity number:{' '}
                {contact.charityRegisterUrl ? (
                  <a
                    href={contact.charityRegisterUrl}
                    className="font-bold text-lime underline underline-offset-2"
                  >
                    {contact.charityNumber}
                  </a>
                ) : (
                  <strong>{contact.charityNumber}</strong>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap justify-between gap-6 border-t border-white/14 pt-6 text-[0.85rem] text-white/60">
          <p>© {year} Orchard OCD. Advancing global OCD research.</p>
          <p>Find · Filter · Fund</p>
        </div>
      </Container>
    </footer>
  )
}
