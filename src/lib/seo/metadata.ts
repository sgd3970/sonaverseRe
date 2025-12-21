import type { Metadata } from 'next';

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
  locale?: 'ko' | 'en';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

export function generateMetadata(pageMeta: PageMetadata): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sonaverse.kr';
  const defaultOgImage = `${siteUrl}/images/og-default.jpg`;
  
  return {
    title: {
      default: pageMeta.title,
      template: `%s | Sonaverse`,
    },
    description: pageMeta.description,
    keywords: pageMeta.keywords?.join(', '),
    authors: [{ name: 'Sonaverse' }],
    creator: 'Sonaverse',
    publisher: 'Sonaverse',
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: pageMeta.canonicalUrl || siteUrl,
      languages: {
        'ko-KR': `${siteUrl}/ko`,
        'en-US': `${siteUrl}/en`,
      },
    },
    openGraph: {
      type: pageMeta.ogType || 'website',
      locale: pageMeta.locale === 'en' ? 'en_US' : 'ko_KR',
      url: pageMeta.canonicalUrl || siteUrl,
      title: pageMeta.title,
      description: pageMeta.description,
      siteName: 'Sonaverse',
      images: [
        {
          url: pageMeta.ogImage || defaultOgImage,
          width: 1200,
          height: 630,
          alt: pageMeta.title,
        },
      ],
      ...(pageMeta.ogType === 'article' && {
        publishedTime: pageMeta.publishedTime,
        modifiedTime: pageMeta.modifiedTime,
        authors: pageMeta.authors,
        tags: pageMeta.tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: pageMeta.title,
      description: pageMeta.description,
      images: [pageMeta.ogImage || defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

