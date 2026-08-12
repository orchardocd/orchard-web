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
      <PostCards posts={posts.docs} className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3"
          imageClassName="aspect-video border-b border-line bg-mist object-contain p-4" />
    </BannerPage>
  )
}
