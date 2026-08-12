import type { Metadata } from 'next'

import { PostCards } from '@/components/content/ArticleCard'
import { Pagination } from '@/components/content/Pagination'
import { BannerPage } from '@/components/layout/Banner'
import { getPosts } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Blog',
}

const PER_PAGE = 12

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const current = Math.max(1, Number(page) || 1)
  const posts = await getPosts(PER_PAGE, current)

  return (
    <BannerPage title="Blog">
      <PostCards
        posts={posts.docs}
        className="grid items-stretch gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
      />
      <Pagination current={posts.page ?? current} total={posts.totalPages ?? 1} basePath="/blog" />
    </BannerPage>
  )
}
