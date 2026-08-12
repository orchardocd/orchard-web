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
        <ul className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <ArticleCard
              key={study.id}
              href={`/participate-research/${study.slug}`}
              title={study.title}
              date={study.publishedAt}
              excerpt={study.excerpt}
              image={study.image}
              imageClassName="aspect-[4/3] border-b border-line bg-mist object-contain p-4"
            />
          ))}
        </ul>
      </Container>
    </Section>
  )
}
