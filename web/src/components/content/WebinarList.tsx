import { VideoEmbed } from '@/components/blocks/VideoEmbed'
import { Container, Section } from '@/components/ui/Container'
import { getWebinars } from '@/lib/payload'

export async function WebinarList() {
  const webinars = await getWebinars()

  return (
    <Section label="Webinars" className="border-t border-line">
      <Container>
        <ul className="grid gap-12 lg:grid-cols-2">
          {webinars.map((webinar) => (
            <li key={webinar.id} className="flex flex-col gap-4">
              <h3 className="text-xl leading-snug font-bold text-ink">{webinar.title}</h3>
              <VideoEmbed url={webinar.url} title={webinar.title} poster={webinar.image} />
              {webinar.description ? (
                <p className="text-[0.97rem] leading-relaxed text-body">{webinar.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
