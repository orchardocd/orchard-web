import { CARD_TITLE_CLASSES } from '@/components/layout/Banner'
import { Container, Section } from '@/components/ui/Container'
import { MediaImage, RoundImage } from '@/components/ui/Media'
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

function PersonCard({
  person,
  compact = false,
  className,
}: {
  person: Person
  compact?: boolean
  className?: string
}) {
  // Supporters are organisations: their wordmarks belong on a plate, not in a portrait circle.
  const isOrganisation = person.group === 'partners'

  return (
    <li
      className={cn(
        'items-center gap-4 rounded-lg border border-line',
        compact
          ? 'relative grid grid-cols-[5.5rem_1fr] p-4 sm:flex sm:flex-col sm:p-6'
          : 'flex flex-col p-5 md:p-7',
        className,
      )}
    >
      {person.photo ? (
        isOrganisation ? (
          <div className="flex h-36 w-full items-center justify-center rounded-lg bg-mist p-6">
            <MediaImage
              media={person.photo}
              className="max-h-24 w-auto object-contain"
              sizes="240px"
            />
          </div>
        ) : (
          <RoundImage
            media={person.photo}
            className={compact ? 'w-full sm:w-28 lg:w-32' : 'w-36'}
            sizes="144px"
          />
        )
      ) : null}
      <div className="flex w-full flex-col items-center gap-4">
        <h3 className={cn(CARD_TITLE_CLASSES, 'text-center text-balance text-brand-link')}>
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
          <p className="w-full text-left text-base leading-relaxed text-body sm:text-sm">
            {person.excerpt}
          </p>
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
        const headingId = `people-${group.value}`
        // A 56-strong roster needs a denser grid than a nine-person team.
        const compact = group.value === 'college'

        return (
          <Section
            key={group.value}
            labelledBy={headingId}
            className={index % 2 === 0 ? 'bg-mist' : undefined}
          >
            <Container>
              <h2
                id={headingId}
                className="mb-9 text-2xl leading-[1.1] font-bold text-brand-deep md:text-3xl"
              >
                {group.label}
              </h2>
              <ul
                className={cn(
                  'grid items-stretch gap-x-6 gap-y-10 lg:flex lg:flex-wrap',
                  compact ? 'grid-cols-1 sm:grid-cols-3' : 'sm:grid-cols-2',
                )}
              >
                {members.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    compact={compact}
                    className={compact ? 'lg:flex-[1_1_15rem]' : 'lg:flex-[1_1_20rem]'}
                  />
                ))}
              </ul>
            </Container>
          </Section>
        )
      })}
    </>
  )
}
