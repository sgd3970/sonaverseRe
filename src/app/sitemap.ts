import { MetadataRoute } from 'next'
import dbConnect from '@/lib/db'
import SonaverseStory from '@/lib/models/SonaverseStory'
import PressRelease from '@/lib/models/PressRelease'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sonaverse.co.kr'

  // 고정 페이지
  const routes = [
    '',
    '/products',
    '/products/manbo',
    '/products/bodume',
    '/stories',
    '/press',
    '/inquiry',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 동적 페이지 (Stories)
  await dbConnect()
  const stories = await SonaverseStory.find({ is_published: true }).select('slug updated_at').lean()
  const storyRoutes = stories.map((story) => ({
    url: `${baseUrl}/stories/${story.slug}`,
    lastModified: story.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // 동적 페이지 (Press)
  const pressReleases = await PressRelease.find({ is_published: true }).select('slug updated_at').lean()
  const pressRoutes = pressReleases.map((press) => ({
    url: `${baseUrl}/press/${press.slug}`,
    lastModified: press.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...routes, ...storyRoutes, ...pressRoutes]
}
