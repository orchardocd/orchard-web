'use client'

import {
  CloseButton,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/cn'
import type { Navigation, SiteSetting } from '@/payload-types'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

type NavItem = NonNullable<Navigation['main']>[number]

const LINK_CLASSES =
  'text-[0.97rem] font-semibold text-ink no-underline hover:text-brand-link'

function TopLevelLink({ item }: { item: NavItem }) {
  const children = item.children ?? []

  if (children.length === 0) {
    return (
      <Link href={item.href} className={LINK_CLASSES}>
        {item.label}
      </Link>
    )
  }

  return (
    <Popover className="relative">
      <PopoverButton className={cn(LINK_CLASSES, 'flex items-center gap-1.5 data-open:text-brand-link')}>
        {item.label}
        <span aria-hidden="true" className="text-xs">
          ▾
        </span>
      </PopoverButton>
      <PopoverPanel
        transition
        className="absolute left-0 z-50 mt-3 w-72 rounded-lg border border-line bg-white p-2 shadow-xl transition data-closed:opacity-0"
      >
        <CloseButton
          as={Link}
          href={item.href}
          className="block rounded px-4 py-2.5 text-[0.95rem] font-bold text-brand-link no-underline hover:bg-mist"
        >
          {item.label} overview
        </CloseButton>
        {children.map((child) => (
          <CloseButton
            key={child.id ?? child.href}
            as={Link}
            href={child.href}
            className="block rounded px-4 py-2.5 text-[0.95rem] text-body no-underline hover:bg-mist hover:text-brand-link"
          >
            {child.label}
          </CloseButton>
        ))}
      </PopoverPanel>
    </Popover>
  )
}

export function Header({
  navigation,
  settings,
}: {
  navigation: Navigation
  settings: SiteSetting
}) {
  const items = navigation.main ?? []
  const announcement = settings.announcement

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-0 focus:z-60 focus:rounded-b focus:bg-brand-deep focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      {announcement?.enabled && announcement.text ? (
        <div className="bg-lime">
          <Container className="flex flex-wrap items-center justify-center gap-3 py-2.5 text-center">
            <span className="text-sm font-semibold text-ink-on-lime">{announcement.text}</span>
            {announcement.linkHref ? (
              <a
                href={announcement.linkHref}
                className="text-sm font-bold text-ink-on-lime underline underline-offset-2"
              >
                {announcement.linkLabel || 'Find out more'}
              </a>
            ) : null}
          </Container>
        </div>
      ) : null}

      <header className="sticky top-0 z-50 bg-white/96 shadow-[0_1px_0_rgba(14,42,39,0.1)] backdrop-blur-md">
        <Container className="flex items-center justify-between gap-8 py-3.5">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/brand/logo-pos.png"
              alt="Orchard OCD, advancing global OCD research"
              width={340}
              height={96}
              priority
              className="h-11 w-auto"
            />
          </Link>

          <PopoverGroup as="nav" aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {items.map((item) => (
              <TopLevelLink key={item.id ?? item.href} item={item} />
            ))}
            <ButtonLink href={settings.donateUrl} className="px-6 py-3 text-[0.97rem]">
              Donate
            </ButtonLink>
          </PopoverGroup>

          <Disclosure as="div" className="lg:hidden">
            {({ open }) => (
              <>
                <DisclosureButton className="rounded border-2 border-brand px-4 py-2 text-sm font-bold text-brand-link">
                  {open ? 'Close' : 'Menu'}
                </DisclosureButton>
                <DisclosurePanel className="absolute inset-x-0 top-full border-t border-line bg-white shadow-xl">
                  <nav aria-label="Main" className="flex flex-col gap-1 p-4">
                    {items.map((item) => (
                      <div key={item.id ?? item.href} className="border-b border-line pb-2">
                        <CloseButton
                          as={Link}
                          href={item.href}
                          className="block py-2.5 font-bold text-ink no-underline"
                        >
                          {item.label}
                        </CloseButton>
                        {(item.children ?? []).map((child) => (
                          <CloseButton
                            key={child.id ?? child.href}
                            as={Link}
                            href={child.href}
                            className="block py-2 pl-4 text-body no-underline"
                          >
                            {child.label}
                          </CloseButton>
                        ))}
                      </div>
                    ))}
                    <ButtonLink href={settings.donateUrl} className="mt-3">
                      Donate
                    </ButtonLink>
                  </nav>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        </Container>
      </header>
    </>
  )
}
