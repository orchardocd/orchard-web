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
import { ANNOUNCEMENT, DONATE_URL, LOGO_ALT, MAIN_NAV, type NavItem } from '@/lib/site'
import { ButtonLink, buttonClasses } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

const LINK_CLASSES = 'text-base font-semibold text-ink no-underline hover:text-brand-link'

function DropdownLinks({
  item,
  parentClassName,
  childClassName,
  parentLabel,
}: {
  item: NavItem
  parentClassName: string
  childClassName: string
  parentLabel: string
}) {
  return (
    <>
      <CloseButton as={Link} href={item.href} className={parentClassName}>
        {parentLabel}
      </CloseButton>
      {item.children.map((child) => (
        <CloseButton key={child.href} as={Link} href={child.href} className={childClassName}>
          {child.label}
        </CloseButton>
      ))}
    </>
  )
}

function TopLevelLink({ item }: { item: NavItem }) {
  if (item.children.length === 0) {
    return (
      <Link href={item.href} className={LINK_CLASSES}>
        {item.label}
      </Link>
    )
  }

  return (
    <Popover className="relative">
      <PopoverButton
        className={cn(LINK_CLASSES, 'flex items-center gap-1.5 data-open:text-brand-link')}
      >
        {item.label}
        <span aria-hidden="true" className="text-xs">
          ▾
        </span>
      </PopoverButton>
      <PopoverPanel
        transition
        className="absolute left-0 z-50 mt-7 w-72 rounded-lg border border-line bg-white p-2 shadow-xl transition data-closed:opacity-0"
      >
        <DropdownLinks
          item={item}
          parentLabel={`${item.label} overview`}
          parentClassName="block rounded px-4 py-2.5 text-base font-bold text-brand-link no-underline hover:bg-mist"
          childClassName="block rounded px-4 py-2.5 text-base text-body no-underline hover:bg-mist hover:text-brand-link"
        />
      </PopoverPanel>
    </Popover>
  )
}

export function Header() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-0 focus:z-60 focus:rounded-b focus:bg-brand-deep focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <aside aria-label="Announcement" className="bg-lime">
        <Container className="flex flex-wrap items-center justify-center gap-3 py-2.5 text-center">
          <span className="text-sm font-semibold text-ink-on-lime">{ANNOUNCEMENT.text}</span>
          <a
            href={ANNOUNCEMENT.href}
            className="text-sm font-bold text-ink-on-lime underline underline-offset-2"
          >
            {ANNOUNCEMENT.label}
          </a>
        </Container>
      </aside>

      <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(14,42,39,0.12)]">
        <Container className="flex items-center justify-between gap-3 py-3.5 lg:gap-8">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/brand/logo-pos.png"
              alt={LOGO_ALT}
              width={340}
              height={96}
              priority
              className="h-9 w-auto sm:h-11"
            />
          </Link>

          <div className="hidden items-center gap-8 lg:flex xl:gap-10">
            <PopoverGroup as="nav" aria-label="Main" className="flex items-center gap-6 xl:gap-7">
              {MAIN_NAV.map((item) => (
                <TopLevelLink key={item.href} item={item} />
              ))}
            </PopoverGroup>
            <ButtonLink href={DONATE_URL} className="px-6 py-3">
              Donate
            </ButtonLink>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <ButtonLink href={DONATE_URL} className="px-4 py-2 text-sm">
              Donate
            </ButtonLink>

            <Disclosure as="div">
              {({ open }) => (
                <>
                  <DisclosureButton className={buttonClasses('secondary', 'px-4 py-2 text-sm')}>
                    {open ? 'Close' : 'Menu'}
                  </DisclosureButton>
                  <DisclosurePanel className="absolute inset-x-0 top-full max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain border-t border-line bg-white shadow-xl">
                    <nav aria-label="Main" className="flex flex-col gap-1 p-6">
                      {MAIN_NAV.map((item) => (
                        <div key={item.href} className="border-b border-line pb-2 last:border-b-0">
                          <DropdownLinks
                            item={item}
                            parentLabel={item.label}
                            parentClassName="block py-2.5 font-bold text-ink no-underline"
                            childClassName="block py-2 pl-4 text-body no-underline"
                          />
                        </div>
                      ))}
                    </nav>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        </Container>
      </header>
    </>
  )
}
