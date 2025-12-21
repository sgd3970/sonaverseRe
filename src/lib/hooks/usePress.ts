'use client';

import useSWR from 'swr';
import { useLocale } from '@/lib/i18n';

// API 응답 타입
export interface PressItem {
  id: string;
  slug: string;
  pressName: string;
  title: string;
  subtitle: string;
  excerpt: string;
  thumbnailUrl?: string;
  externalUrl?: string;
  tags: string[];
  publishedAt: string;
  locale: string;
}

export interface PressDetail extends PressItem {
  body: string;
  images: {
    src: string;
    alt: string;
  }[];
  updatedAt: string;
}

interface PressResponse {
  success: boolean;
  data: PressItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PressDetailResponse {
  success: boolean;
  data: PressDetail;
  relatedPress: Pick<PressItem, 'id' | 'slug' | 'title' | 'thumbnailUrl' | 'pressName' | 'publishedAt'>[];
}

// Fetcher 함수
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

// 언론보도 목록 훅
export function usePress(options?: {
  page?: number;
  limit?: number;
}) {
  const locale = useLocale();
  const { page = 1, limit = 10 } = options || {};

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    locale,
  });

  const { data, error, isLoading, mutate } = useSWR<PressResponse>(
    `/api/press?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1분 캐싱
    }
  );

  return {
    pressItems: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// 언론보도 상세 훅
export function usePressDetail(slug: string) {
  const locale = useLocale();

  const { data, error, isLoading, mutate } = useSWR<PressDetailResponse>(
    slug ? `/api/press/${slug}?locale=${locale}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    press: data?.data,
    relatedPress: data?.relatedPress || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

