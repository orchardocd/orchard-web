import { CARD_TITLE_CLASSES } from '@/components/layout/Banner'
import { PageSection, Plate } from '@/components/site'
import { RoundImage } from '@/components/ui/Media'
import { cn } from '@/lib/cn'
import { getPeople } from '@/lib/payload'
import type { Person } from '@/payload-types'

const GROUPS: { value: Person['group']; label: string }[] = [
  { value: 'team', label: 'Our team' },
  { value: 'scientific-advisory-board', label: 'Scientific advisory board' },
  { value: 'partners', label: 'Our supporters' },
  { value: 'ambassadors', label: 'Our volunteers' },
  { value: 'college', label: 'Our members' },
]

const MARK_SIZES = '(min-width: 1024px) 320px, (min-width: 640px) 288px, calc(100vw - 5.5rem)'

function PersonCard({ person, compact = false }: { person: Person; compact?: boolean }) {
  // Supporters are organisations: their wordmarks belong on a plate, not in a portrait circle.
  const isOrganisation = person.group === 'partners'

  return (
    <li
      className={cn(
        'items-center gap-4 rounded-lg border border-line',
        compact
          ? 'relative grid grid-cols-[5.5rem_1fr] p-4 sm:flex sm:flex-col sm:p-6'
          : 'flex flex-col p-5 md:p-7',
      )}
    >
      {person.photo ? (
        isOrganisation ? (
          <Plate media={person.photo} size="mark" sizes={MARK_SIZES} />
        ) : (
          <RoundImage
            media={person.photo}
            // The card carries the name in words, so the portrait adds nothing to read out.
            alt=""
            className={compact ? 'w-full sm:w-28 lg:w-32' : 'w-36'}
            sizes="144px"
          />
        )
      ) : null}
      <div
        className={cn(
          'flex w-full flex-col gap-4',
          compact ? 'items-start sm:items-center' : 'items-center',
        )}
      >
        <h3
          className={cn(
            CARD_TITLE_CLASSES,
            'text-balance text-brand-link',
            compact ? 'text-left sm:text-center' : 'text-center',
          )}
        >
          {person.website ? (
            <a
              href={person.website}
              className={cn(
                'text-brand-link no-underline hover:underline',
                compact ? 'after:absolute after:inset-0' : undefined,
              )}
            >
              {person.name}
            </a>
          ) : (
            person.name
          )}
        </h3>
        {person.excerpt ? (
          <p className="w-full text-left text-base leading-relaxed text-body">{person.excerpt}</p>
        ) : null}
      </div>
    </li>
  )
}

export async function PeopleSections({ only }: { only?: Person['group'][] } = {}) {
  const people = await getPeople()
  const groups = only ? GROUPS.filter((group) => only.includes(group.value)) : GROUPS

  return (
    <>
      {groups.map((group, index) => {
        const members = people.filter((person) => person.group === group.value)
        if (members.length === 0) return null
        // A 56-strong roster needs a denser grid than a nine-person team.
        const compact = group.value === 'college'

        return (
          <PageSection
            key={group.value}
            id={`people-${group.value}`}
            heading={group.label}
            tone={index % 2 === 0 ? 'mist' : 'plain'}
          >
            <ul
              className={cn(
                'grid items-stretch gap-x-6 gap-y-10',
                compact
                  ? 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-4'
                  : 'sm:grid-cols-2 lg:grid-cols-3',
              )}
            >
              {members.map((person) => (
                <PersonCard key={person.id} person={person} compact={compact} />
              ))}
            </ul>
          </PageSection>
        )
      })}
    </>
  )
}
