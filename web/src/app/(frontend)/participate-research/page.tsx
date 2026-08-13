import type { Metadata } from 'next'

import { ArticleCards } from '@/components/content/ArticleCard'
import { Pagination } from '@/components/content/Pagination'
import { PageBanner, PageSection } from '@/components/site'
import { getStudies } from '@/lib/payload'
import { askedPage, type PagedParams } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Participate in research',
}

const PER_PAGE = 12
const ACCENTS: [string, string] = ['#00877C', '#00655C']

export default async function StudiesIndex({ searchParams }: PagedParams) {
  const current = await askedPage(searchParams)
  const studies = await getStudies(PER_PAGE, current)

  return (
    <>
      <PageBanner title="Participate in research" />
      <PageSection label="Studies">
        <ArticleCards
          articles={studies.docs}
          basePath="/participate-research"
          accents={ACCENTS}
          className="md:grid-cols-2 lg:grid-cols-3"
        />
        <Pagination
          current={studies.page ?? current}
          total={studies.totalPages ?? 1}
          basePath="/participate-research"
        />
      </PageSection>
    </>
  )
}
