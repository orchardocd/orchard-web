import { ArticleCard } from '@/components/content/ArticleCard'
import { Container, Section } from '@/components/ui/Container'
import { getStudies } from '@/lib/payload'
import { withoutRepeats } from '@/lib/unique-images'

export async function StudyList() {
  const studies = withoutRepeats(
    (await getStudies()).map((study) => ({ ...study, image: study.featuredImage })),
  )

  return (
    <Section label="Participate in research" className="border-t border-line">
      <Container>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <ArticleCard
              key={study.id}
              href={`/participate-research/${study.slug}`}
              title={study.title}
              date={study.publishedAt}
              excerpt={study.excerpt}
              image={study.image}
              imageClassName="aspect-video bg-mist object-contain"
            />
          ))}
        </ul>
      </Container>
    </Section>
  )
}
