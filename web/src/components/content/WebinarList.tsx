import { VideoEmbed } from '@/components/blocks/VideoEmbed'
import { CARD_TITLE_CLASSES } from '@/components/layout/Banner'
import { Container, Section } from '@/components/ui/Container'
import { cn } from '@/lib/cn'
import { getWebinars } from '@/lib/payload'

export async function WebinarList() {
  const webinars = await getWebinars()

  return (
    <Section label="Webinars">
      <Container>
        <ul className="grid items-stretch gap-x-6 gap-y-10 lg:grid-cols-2 xl:grid-cols-3">
          {webinars.map((webinar) => (
            <li key={webinar.id} className="flex flex-col gap-4">
              <VideoEmbed url={webinar.url} title={webinar.title} poster={webinar.image} />
              <h2 className={cn(CARD_TITLE_CLASSES, 'text-ink')}>{webinar.title}</h2>
              {webinar.description ? (
                <p className="text-sm leading-relaxed text-body">{webinar.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
