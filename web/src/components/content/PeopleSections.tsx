import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { Container, Section } from '@/components/ui/Container'
import { MediaImage, RoundImage } from '@/components/ui/Media'
import { cn } from '@/lib/cn'
import { getPeople } from '@/lib/payload'
import type { Person } from '@/payload-types'

export const GROUPS: { value: Person['group']; label: string }[] = [
  { value: 'team', label: 'Our team' },
  { value: 'scientific-advisory-board', label: 'Scientific advisory board' },
  { value: 'partners', label: 'Our supporters' },
  { value: 'ambassadors', label: 'Our volunteers' },
  { value: 'college', label: 'Our members' },
]

function PersonCard({ person, compact = false }: { person: Person; compact?: boolean }) {
  // Supporters are organisations: their wordmarks belong on a plate, not in a portrait circle.
  const isOrganisation = person.group === 'partners'

  return (
    <li
      className={cn(
        'flex flex-col items-center gap-4 rounded-lg border border-line',
        compact ? 'p-4 sm:p-6' : 'p-7',
      )}
    >
      {person.photo ? (
        isOrganisation ? (
          <MediaImage
            media={person.photo}
            className="h-20 w-auto max-w-[70%] object-contain"
            sizes="200px"
          />
        ) : (
          <RoundImage
            media={person.photo}
            className={compact ? 'w-24 sm:w-28 lg:w-32' : 'w-36'}
            sizes="144px"
          />
        )
      ) : null}
      <h3 className="text-center text-xl font-bold text-brand-link">
        {person.website ? (
          <a href={person.website} className="text-brand-link no-underline hover:underline">
            {person.name}
          </a>
        ) : (
          person.name
        )}
      </h3>
      {person.excerpt ? (
        <p className="w-full text-base leading-relaxed text-body">{person.excerpt}</p>
      ) : (
        <RenderBlocks blocks={person.bio} className="w-full" />
      )}
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
              <h2 id={headingId} className="mb-9 text-4xl font-bold text-ink">
                {group.label}
              </h2>
              <ul
                className={cn(
                  'grid items-start gap-6',
                  compact
                    ? 'grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'
                    : 'sm:grid-cols-2 lg:grid-cols-3',
                )}
              >
                {members.map((person) => (
                  <PersonCard key={person.id} person={person} compact={compact} />
                ))}
              </ul>
            </Container>
          </Section>
        )
      })}
    </>
  )
}
