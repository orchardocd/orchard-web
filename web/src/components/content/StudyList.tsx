import { ArticleCard } from '@/components/content/ArticleCard'
import { Container, Section } from '@/components/ui/Container'
import { getStudies } from '@/lib/payload'
import { withoutRepeats } from '@/lib/unique-images'

export async function StudyList() {
  const studies = withoutRepeats(
    (await getStudies()).map((study) => ({ ...study, image: study.featuredImage })),
  )

  return (
    <Section label="Participate in research">
      <Container>
        <ul className="grid items-stretch gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((study, index) => (
            <ArticleCard
              key={study.id}
              accent={index % 2 === 0 ? '#00877C' : '#00655C'}
              href={`/participate-research/${study.slug}`}
              title={study.title}
              date={study.publishedAt}
              excerpt={study.excerpt}
              image={study.image}
            />
          ))}
        </ul>
      </Container>
    </Section>
  )
}
