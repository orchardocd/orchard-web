import { VideoEmbed } from '@/components/blocks/VideoEmbed'
import { Container, Section } from '@/components/ui/Container'
import { getWebinars } from '@/lib/payload'

export async function WebinarList() {
  const webinars = await getWebinars()

  return (
    <Section label="Webinars">
      <Container>
        <ul className="grid items-start gap-x-8 gap-y-12 lg:grid-cols-2 xl:grid-cols-3">
          {webinars.map((webinar) => (
            <li key={webinar.id} className="flex flex-col gap-4">
              <h3 className="text-lg leading-snug font-bold text-ink">{webinar.title}</h3>
              <VideoEmbed url={webinar.url} title={webinar.title} poster={webinar.image} />
              {webinar.description ? (
                <p className="text-sm leading-relaxed text-faint">{webinar.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
