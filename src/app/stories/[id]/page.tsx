import type { Metadata } from 'next';
import { getStoryForMetadata, generateStoryMetadata } from '@/lib/server/stories';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import StoryDetailClient from './StoryDetailClient';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  // Fetch story data for metadata
  const story = await getStoryForMetadata(id);

  if (!story) {
    return {
      title: '스토리를 찾을 수 없습니다',
      description: '요청하신 스토리가 존재하지 않거나 삭제되었습니다.',
    };
  }

  // Generate story-specific metadata
  const storyMeta = generateStoryMetadata(story);

  // Generate final metadata using our utility
  return generateSEOMetadata({
    title: storyMeta.title,
    description: storyMeta.description,
    keywords: storyMeta.keywords?.split(', '),
    ogImage: storyMeta.ogImage,
    ogType: 'article',
    canonicalUrl: storyMeta.canonicalUrl,
    locale: storyMeta.locale,
    publishedTime: storyMeta.publishedTime,
    modifiedTime: storyMeta.modifiedTime,
    authors: storyMeta.authors,
    tags: storyMeta.tags,
  });
}

interface StoryDetailPageProps {
    params: Promise<{ id: string }>
}

export default function StoryDetailPage({ params }: StoryDetailPageProps) {
  return <StoryDetailClient params={params} />;
}
