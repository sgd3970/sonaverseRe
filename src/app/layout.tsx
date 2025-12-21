import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import "material-symbols/outlined.css";
import { LanguageProvider } from "@/lib/i18n";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { A11yChecker } from "@/shared/components/a11y/A11yChecker";
import { OrganizationSchema } from "@/shared/components/seo/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // 폰트 로딩 최적화
  preload: true, // 폰트 preload 활성화
  fallback: ['system-ui', 'arial'], // 폰트 로드 실패 시 대체 폰트
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "700", "900"], // Added 900 for font-black
  display: "swap", // 폰트 로딩 최적화
  preload: true, // 폰트 preload 활성화
  fallback: ['system-ui', 'arial'], // 폰트 로드 실패 시 대체 폰트
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://sonaverse.co.kr'),
  title: {
    default: "Sonaverse | 시니어 통합 케어 플랫폼",
    template: "%s | Sonaverse",
  },
  description: "시니어의 더 나은 일상을 위한 혁신, 소나버스. 만보 보행기와 보듬 기저귀로 시니어의 삶을 케어합니다.",
  keywords: ["시니어 케어", "보행기", "성인용 기저귀", "만보", "보듬", "소나버스", "실버 산업"],
  authors: [{ name: "Sonaverse Team" }],
  creator: "Sonaverse",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://sonaverse.co.kr",
    title: "Sonaverse | 시니어 통합 케어 플랫폼",
    description: "시니어의 더 나은 일상을 위한 혁신, 소나버스. 만보 보행기와 보듬 기저귀로 시니어의 삶을 케어합니다.",
    siteName: "Sonaverse",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sonaverse - Innovation for Better Senior Living",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sonaverse | 시니어 통합 케어 플랫폼",
    description: "시니어의 더 나은 일상을 위한 혁신, 소나버스.",
    images: ["/images/og-image.jpg"],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버 사이드에서 기본 딕셔너리 로드 (한국어)
  const { getDictionary } = await import("@/lib/i18n");
  const dictionary = await getDictionary("ko");

  return (
    <html lang="ko" className={`${inter.variable} ${notoSansKr.variable}`}>
      <head>
        {/* Viewport 설정 최적화 (maximum-scale 제거로 접근성 개선) */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Material Symbols는 material-symbols 패키지로 로드되므로 외부 링크 제거 */}
        {/* 외부 Google Fonts 링크 제거 - 3.7MB 폰트 파일 문제 해결 */}

        {/* 사전 연결: 중요한 리소스에 대한 연결 사전 설정 - next/font가 자동으로 처리하므로 제거 */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" /> */}
        {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /> */}

        {/* Schema.org 구조화 데이터 */}
        <OrganizationSchema
          name="Sonaverse"
          url="https://sonaverse.co.kr"
          logo="https://sonaverse.co.kr/images/logo.png"
          description="시니어의 더 나은 일상을 위한 혁신, 소나버스. 만보 보행기와 보듬 기저귀로 시니어의 삶을 케어합니다."
          contactEmail="info@sonaverse.co.kr"
        />
      </head>
      <body className="antialiased font-sans">
        <A11yChecker />
        <LanguageProvider initialDictionary={dictionary} initialLocale="ko">
          {children}
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
