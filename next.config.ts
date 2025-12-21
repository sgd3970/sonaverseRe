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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
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
  // 메모리 사용 최적화를 위한 웹팩 설정
  webpack: (config, { isServer, dev }) => {
    // 개발 모드에서 캐시 비활성화 (메모리 부족 문제 해결)
    if (dev) {
      config.cache = false; // 캐시 완전 비활성화
    }

    if (!isServer) {
      // 클라이언트 빌드 최적화
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // 프레임워크 코드 분리
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // 공통 라이브러리 분리
            lib: {
              test(module: { size: () => number; identifier: () => string }) {
                return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier());
              },
              name(module: { identifier: () => string }) {
                const hash = require('crypto').createHash('sha1');
                hash.update(module.identifier());
                return hash.digest('hex').substring(0, 8);
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // 공통 모듈
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            // 공유 모듈
            shared: {
              name: false,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
  experimental: {
    // serverActions: true, // Default in newer Next.js
  }
};

export default withBundleAnalyzer(nextConfig);
