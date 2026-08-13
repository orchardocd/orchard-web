import type { Metadata } from 'next'

import { ArticleCards } from '@/components/content/ArticleCard'
import { Pagination } from '@/components/content/Pagination'
import { PageBanner, PageSection } from '@/components/site'
import { getPosts } from '@/lib/payload'
import { askedPage, type PagedParams } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Blog',
}

const PER_PAGE = 12

export default async function BlogIndex({ searchParams }: PagedParams) {
  const current = await askedPage(searchParams)
  const posts = await getPosts(PER_PAGE, current)

  return (
    <>
      <PageBanner title="Blog" />
      <PageSection label="Blog posts">
        <ArticleCards
          articles={posts.docs}
          basePath="/blog"
          className="grid items-start gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
        />
        <Pagination current={posts.page ?? current} total={posts.totalPages ?? 1} basePath="/blog" />
      </PageSection>
    </>
  )
}
