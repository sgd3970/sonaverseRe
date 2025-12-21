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
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
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
        {/* Material Symbols 아이콘 폰트 */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />

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
