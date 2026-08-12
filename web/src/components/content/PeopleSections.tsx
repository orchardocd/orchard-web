import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { Container, Section } from '@/components/ui/Container'
import { RoundImage } from '@/components/ui/Media'
import { getPeople } from '@/lib/payload'
import type { Person } from '@/payload-types'

const GROUPS: { value: Person['group']; label: string }[] = [
  { value: 'team', label: 'Our team' },
  { value: 'scientific-advisory-board', label: 'Scientific advisory board' },
  { value: 'partners', label: 'Our supporters' },
  { value: 'ambassadors', label: 'Our volunteers' },
  { value: 'college', label: 'Our members' },
]

function PersonCard({ person }: { person: Person }) {
  return (
    <li className="flex flex-col items-center gap-4 rounded-lg border border-line p-7 text-center">
      {person.photo ? (
        <RoundImage media={person.photo} className="w-36" sizes="144px" />
      ) : null}
      <h3 className="text-xl font-bold text-brand-link">
        {person.website ? (
          <a href={person.website} className="text-brand-link no-underline hover:underline">
            {person.name}
          </a>
        ) : (
          person.name
        )}
      </h3>
      {person.excerpt ? (
        <p className="text-[0.97rem] leading-relaxed text-body">{person.excerpt}</p>
      ) : (
        <RenderBlocks blocks={person.bio} className="gap-3 text-left" />
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

        return (
          <Section
            key={group.value}
            labelledBy={headingId}
            className={index % 2 === 1 ? 'bg-mist' : undefined}
          >
            <Container>
              <h2 id={headingId} className="mb-9 text-3xl font-bold text-ink">
                {group.label}
              </h2>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </ul>
            </Container>
          </Section>
        )
      })}
    </>
  )
}
