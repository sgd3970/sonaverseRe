import type { Metadata } from 'next';
import { getPressForMetadata, generatePressMetadata } from '@/lib/server/press';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import PressDetailClient from './PressDetailClient';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  // Fetch press data for metadata
  const press = await getPressForMetadata(id);

  if (!press) {
    return {
      title: '언론보도를 찾을 수 없습니다',
      description: '요청하신 언론보도가 존재하지 않거나 삭제되었습니다.',
    };
  }

  // Generate press-specific metadata
  const pressMeta = generatePressMetadata(press);

  // Generate final metadata using our utility
  return generateSEOMetadata({
    title: pressMeta.title,
    description: pressMeta.description,
    keywords: pressMeta.keywords?.split(', '),
    ogImage: pressMeta.ogImage,
    ogType: 'article',
    canonicalUrl: pressMeta.canonicalUrl,
    locale: pressMeta.locale,
    publishedTime: pressMeta.publishedTime,
    modifiedTime: pressMeta.modifiedTime,
    authors: pressMeta.authors,
    tags: pressMeta.tags,
  });
}

interface PressDetailPageProps {
    params: Promise<{ id: string }>
}

export default function PressDetailPage({ params }: PressDetailPageProps) {
  return <PressDetailClient params={params} />;
}
