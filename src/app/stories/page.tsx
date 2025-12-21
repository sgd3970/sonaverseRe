import { MainLayout } from "@/shared/components/layout/MainLayout"
import { StoriesClient } from "@/features/stories/components/StoriesClient"
import dbConnect from "@/lib/db"
import SonaverseStory from "@/lib/models/SonaverseStory"
import Image from "@/lib/models/Image" // Import Image model for population
import { Story } from "@/lib/hooks/useStories"
import { generateMetadata as genMeta } from "@/lib/seo/metadata"

export const revalidate = 3600 // 1 hour

export const metadata = genMeta({
  title: "소나버스 스토리",
  description: "Sonaverse의 혁신적인 제품과 서비스에 대한 이야기, 고객 사례, 그리고 시니어테크 산업의 최신 트렌드를 확인하세요.",
  keywords: ["소나버스 스토리", "시니어테크", "고객 사례", "제품 이야기"],
  ogType: "website",
  canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sonaverse.kr"}/stories`,
})

export default async function StoriesPage() {
    await dbConnect()

    // Fetch initial stories
    const storiesDocs = await SonaverseStory.find({ is_published: true })
        .sort({ published_date: -1 })
        .limit(50)
        .populate('thumbnail_image_id')
        .lean()

    // Transform to Story interface
    const initialStories: Story[] = storiesDocs.map((doc: any) => ({
        id: doc._id.toString(),
        slug: doc.slug,
        category: doc.category,
        title: doc.title?.ko || '',
        subtitle: doc.subtitle?.ko || '',
        excerpt: doc.excerpt?.ko || '',
        thumbnailUrl: doc.thumbnail_image_id?.url || '',
        youtubeUrl: doc.youtube_url,
        tags: doc.tags?.map((t: any) => t.toString()) || [],
        isMain: doc.is_main_story || false,
        publishedAt: doc.published_date ? new Date(doc.published_date).toISOString() : new Date().toISOString(),
        locale: 'ko', // Default to ko for initial load
    }))

    return (
        <MainLayout>
            <StoriesClient initialStories={initialStories} />
        </MainLayout>
    )
}

