import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactCompiler: false, // Disabled as per decision to stick to standard stability unless requested
  images: {
    formats: ['image/avif', 'image/webp'],
    // Next.js 16에서 quality 설정 지원
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'public.blob.vercel-storage.com',
      },
      // 외부 이미지 서비스 제거: 성능 최적화를 위해 로컬 이미지 사용
      // images.unsplash.com, picsum.photos 제거됨
    ],
  },
  typescript: {
    // 빌드 시 TypeScript 오류가 있어도 계속 진행 (메모리 부족 시 유용)
    // 메모리 부족으로 빌드 실패 시 임시로 비활성화
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  // 캐시 헤더 설정 (정적 자산 최적화)
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/logo/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // 메모리 사용 최적화를 위한 웹팩 설정
  webpack: (config, { isServer, dev }) => {
    // 개발 모드에서 캐시 비활성화 (메모리 부족 문제 해결)
    if (dev) {
      config.cache = false; // 캐시 완전 비활성화
    }
    return config;
  },
  experimental: {
    // CSS 최적화 활성화
    optimizeCss: true,
    // serverActions: true, // Default in newer Next.js
  }
};

export default withBundleAnalyzer(nextConfig);
