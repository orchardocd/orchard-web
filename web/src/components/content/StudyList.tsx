import { ArticleCard } from '@/components/content/ArticleCard'
import { Container, Section } from '@/components/ui/Container'
import { getStudies } from '@/lib/payload'

export async function StudyList() {
  const studies = await getStudies()

  return (
    <Section labelledBy="studies-heading" className="border-t border-line">
      <Container>
        <h2 id="studies-heading" className="mb-9 text-3xl font-bold text-ink">
          Studies you can take part in
        </h2>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <ArticleCard
              key={study.id}
              href={`/participate-research/${study.slug}`}
              title={study.title}
              date={study.publishedAt}
              excerpt={study.excerpt}
              image={study.featuredImage}
              imageClassName="aspect-video object-cover"
            />
          ))}
        </ul>
      </Container>
    </Section>
  )
}
