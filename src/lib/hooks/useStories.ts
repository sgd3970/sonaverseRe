'use client';

import useSWR from 'swr';
import { useLocale } from '@/lib/i18n';

// API 응답 타입
export interface Story {
  id: string;
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  excerpt: string;
  thumbnailUrl?: string;
  youtubeUrl?: string;
  tags: string[];
  isMain: boolean;
  publishedAt: string;
  locale: string;
}

export interface StoryDetail extends Story {
  body: string;
  images: {
    src: string;
    alt: string;
    alignment: string;
    displaysize: number;
  }[];
  updatedAt: string;
}

interface StoriesResponse {
  success: boolean;
  data: Story[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface StoryDetailResponse {
  success: boolean;
  data: StoryDetail;
  relatedStories: Pick<Story, 'id' | 'slug' | 'title' | 'thumbnailUrl' | 'category' | 'publishedAt'>[];
}

// Fetcher 함수
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

// 스토리 목록 훅
export function useStories(options?: {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
}) {
  const locale = useLocale();
  const { page = 1, limit = 10, category, featured } = options || {};

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    locale,
  });

  if (category) params.set('category', category);
  if (featured) params.set('featured', 'true');

  const { data, error, isLoading, mutate } = useSWR<StoriesResponse>(
    `/api/stories?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1분 캐싱
    }
  );

  return {
    stories: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// 스토리 상세 훅
export function useStory(slug: string) {
  const locale = useLocale();

  const { data, error, isLoading, mutate } = useSWR<StoryDetailResponse>(
    slug ? `/api/stories/${slug}?locale=${locale}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    story: data?.data,
    relatedStories: data?.relatedStories || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// 메인 스토리 훅
export function useMainStories(limit = 3) {
  return useStories({ featured: true, limit });
}

