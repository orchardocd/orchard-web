import Link from 'next/link'

import { formatDate } from '@/lib/format'
import { getStudies } from '@/lib/payload'
import { Container, Section } from '@/components/ui/Container'
import { Image } from '@/components/ui/Media'

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
            <li
              key={study.id}
              className="flex flex-col gap-3 overflow-hidden rounded-lg border border-line"
            >
              {study.featuredImage ? (
                <Image
                  media={study.featuredImage}
                  className="aspect-video object-cover"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              ) : null}
              <div className="flex flex-1 flex-col gap-3 p-7">
                <p className="text-xs font-bold tracking-[0.1em] text-faint uppercase">
                  {formatDate(study.publishedAt)}
                </p>
                <h3 className="text-xl leading-snug font-bold">
                  <Link
                    href={`/participate-research/${study.slug}`}
                    className="text-ink no-underline hover:text-brand-link"
                  >
                    {study.title}
                  </Link>
                </h3>
                {study.excerpt ? (
                  <p className="line-clamp-4 text-[0.97rem] leading-relaxed text-body">
                    {study.excerpt}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
