'use client'

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { RichText } from '@/components/RichText'

export type AccordionItem = {
  id?: string | null
  title: string
  content: SerializedEditorState
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="mx-auto max-w-measure divide-y divide-line border-y border-line">
      {items.map((item, index) => (
        <Disclosure key={item.id ?? index}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-bold text-ink hover:text-brand-link">
                <span>{item.title}</span>
                <span aria-hidden="true" className="text-2xl leading-none text-brand">
                  {open ? '−' : '+'}
                </span>
              </DisclosureButton>
              <DisclosurePanel className="pb-6">
                <RichText data={item.content} />
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  )
}
