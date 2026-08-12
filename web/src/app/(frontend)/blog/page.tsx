import type { Metadata } from 'next'

import { PostCards } from '@/components/content/ArticleCard'
import { BannerPage } from '@/components/layout/Banner'
import { getPosts } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Blog',
}

export default async function BlogIndex() {
  const posts = await getPosts(100)

  return (
    <BannerPage title="Blog">
      <PostCards posts={posts.docs} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" />
    </BannerPage>
  )
}
