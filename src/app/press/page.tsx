import { MainLayout } from "@/shared/components/layout/MainLayout"
import { PressClient } from "@/features/press/components/PressClient"
import dbConnect from "@/lib/db"
import PressRelease from "@/lib/models/PressRelease"
import Image from "@/lib/models/Image" // Import Image model for population
import { PressItem } from "@/lib/hooks/usePress"
import { generateMetadata as genMeta } from "@/lib/seo/metadata"

export const revalidate = 3600 // 1 hour

export const metadata = genMeta({
  title: "언론보도",
  description: "Sonaverse의 언론보도 자료를 확인하세요. 주요 미디어에서 다룬 우리의 혁신적인 제품과 서비스에 대한 보도를 만나보세요.",
  keywords: ["언론보도", "보도자료", "미디어", "뉴스"],
  ogType: "website",
  canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sonaverse.kr"}/press`,
})

export default async function PressPage() {
    await dbConnect()

    // Fetch initial press items
    const pressDocs = await PressRelease.find({ is_published: true })
        .sort({ published_date: -1 })
        .limit(8)
        .populate('thumbnail_image_id')
        .lean()

    // Transform to PressItem interface
    const initialPressItems: PressItem[] = pressDocs.map((doc: any) => ({
        id: doc._id.toString(),
        slug: doc.slug,
        pressName: doc.press_name?.ko || '',
        title: doc.title?.ko || '',
        subtitle: '', // Not in schema but in interface
        excerpt: doc.excerpt?.ko || '',
        thumbnailUrl: doc.thumbnail_image_id?.url || '',
        externalUrl: doc.external_url,
        tags: doc.tags?.map((t: any) => t.toString()) || [],
        publishedAt: doc.published_date ? new Date(doc.published_date).toISOString() : new Date().toISOString(),
        locale: 'ko',
    }))

    return (
        <MainLayout>
            <PressClient initialPressItems={initialPressItems} />
        </MainLayout>
    )
}

