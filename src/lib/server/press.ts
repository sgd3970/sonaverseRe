/**
 * Server-side press data fetching functions for SEO and metadata
 */

import { PressItem, PressDetail } from '@/lib/hooks/usePress';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface PressDetailResponse {
  success: boolean;
  data: PressDetail;
  relatedPress: Pick<PressItem, 'id' | 'slug' | 'title' | 'thumbnailUrl' | 'pressName' | 'publishedAt'>[];
}

/**
 * Fetch press data for metadata generation (server-side only)
 */
export async function getPressForMetadata(slug: string, locale: string = 'ko'): Promise<PressDetail | null> {
  try {
    const res = await fetch(`${API_URL}/api/press/${slug}?locale=${locale}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      return null;
    }

    const result: PressDetailResponse = await res.json();

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching press for metadata:', error);
    return null;
  }
}

/**
 * Generate press-specific metadata for SEO
 */
export function generatePressMetadata(press: PressDetail, locale: string = 'ko') {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sonaverse.kr';

  return {
    title: `${press.title} - ${press.pressName}`,
    description: press.excerpt || press.subtitle || press.title,
    keywords: [...press.tags, press.pressName, '소나버스', 'Sonaverse', '언론보도', '보도자료'].join(', '),
    ogImage: press.thumbnailUrl || `${siteUrl}/images/og-default.jpg`,
    canonicalUrl: `${siteUrl}/press/${press.slug}`,
    locale: locale as 'ko' | 'en',
    publishedTime: press.publishedAt,
    modifiedTime: press.updatedAt || press.publishedAt,
    authors: [press.pressName],
    tags: press.tags,
  };
}
