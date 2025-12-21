import { type ReactNode } from 'react';

export interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
  };
  sameAs?: string[];
}

export interface ProductSchema {
  name: string;
  description: string;
  image?: string[];
  brand?: {
    name: string;
  };
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
  };
}

export interface ArticleSchema {
  headline: string;
  description: string;
  image?: string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
  };
  publisher?: {
    name: string;
    logo?: {
      url: string;
    };
  };
}

export interface BreadcrumbSchema {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function OrganizationStructuredData(data: OrganizationSchema) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    ...(data.logo && { logo: data.logo }),
    ...(data.description && { description: data.description }),
    ...(data.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        ...data.contactPoint,
      },
    }),
    ...(data.sameAs && { sameAs: data.sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductStructuredData(data: ProductSchema) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    ...(data.image && { image: data.image }),
    ...(data.brand && {
      brand: {
        '@type': 'Brand',
        name: data.brand.name,
      },
    }),
    ...(data.offers && {
      offers: {
        '@type': 'Offer',
        ...data.offers,
      },
    }),
    ...(data.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ...data.aggregateRating,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleStructuredData(data: ArticleSchema) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    ...(data.image && { image: data.image }),
    ...(data.datePublished && { datePublished: data.datePublished }),
    ...(data.dateModified && { dateModified: data.dateModified }),
    ...(data.author && {
      author: {
        '@type': 'Person',
        name: data.author.name,
      },
    }),
    ...(data.publisher && {
      publisher: {
        '@type': 'Organization',
        name: data.publisher.name,
        ...(data.publisher.logo && {
          logo: {
            '@type': 'ImageObject',
            url: data.publisher.logo.url,
          },
        }),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbStructuredData(data: BreadcrumbSchema) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

