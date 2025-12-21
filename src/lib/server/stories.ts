/**
 * Server-side story data fetching functions for SEO and metadata
 */

import { Story, StoryDetail } from '@/lib/hooks/useStories';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface StoryDetailResponse {
  success: boolean;
  data: StoryDetail;
  relatedStories: Pick<Story, 'id' | 'slug' | 'title' | 'thumbnailUrl' | 'category' | 'publishedAt'>[];
}

/**
 * Fetch story data for metadata generation (server-side only)
 */
export async function getStoryForMetadata(slug: string, locale: string = 'ko'): Promise<StoryDetail | null> {
  try {
    const res = await fetch(`${API_URL}/api/stories/${slug}?locale=${locale}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      return null;
    }

    const result: StoryDetailResponse = await res.json();

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching story for metadata:', error);
    return null;
  }
}

/**
 * Generate story-specific metadata for SEO
 */
export function generateStoryMetadata(story: StoryDetail, locale: string = 'ko') {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sonaverse.kr';

  return {
    title: story.title,
    description: story.excerpt || story.subtitle || story.title,
    keywords: [...story.tags, story.category, '소나버스', 'Sonaverse'].join(', '),
    ogImage: story.thumbnailUrl || `${siteUrl}/images/og-default.jpg`,
    canonicalUrl: `${siteUrl}/stories/${story.slug}`,
    locale: locale as 'ko' | 'en',
    publishedTime: story.publishedAt,
    modifiedTime: story.updatedAt || story.publishedAt,
    authors: ['Sonaverse'],
    tags: story.tags,
  };
}
