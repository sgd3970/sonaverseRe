import { MainLayout } from "@/shared/components/layout/MainLayout"
import { HomeHero } from "@/features/home/components/HomeHero"
import { ProblemSection } from "@/features/home/components/ProblemSection"
import { ProductSection } from "@/features/home/components/ProductSection"
import { CompanyHistory } from "@/features/home/components/CompanyHistory"
import { StoryHighlight } from "@/features/home/components/StoryHighlight"
import { PressSection } from "@/features/home/components/PressSection"
import { generateMetadata as genMeta } from "@/lib/seo/metadata"
import { OrganizationStructuredData } from "@/lib/seo/structured-data"

export const revalidate = 3600; // 1시간마다 재생성
export const dynamic = 'force-static'; // 가능한 경우 정적 생성

export const metadata = genMeta({
  title: "Sonaverse - 시니어의 더 나은 일상을 위한 혁신",
  description: "만보 워크메이트와 보듬 기저귀를 통해 시니어의 삶의 질을 향상시키는 혁신적인 솔루션을 제공합니다. Innovation for Better Senior Living.",
  keywords: ["시니어테크", "워크메이트", "보행기", "기저귀", "만보", "보듬", "senior tech", "walkmate", "diaper"],
  ogType: "website",
  canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://sonaverse.kr",
})

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sonaverse.kr";
  
  return (
    <>
      <OrganizationStructuredData
        name="Sonaverse"
        url={siteUrl}
        description="시니어의 더 나은 일상을 위한 혁신적인 기술 솔루션을 제공하는 기업"
        logo={`${siteUrl}/logo/ko_logo.png`}
        contactPoint={{
          contactType: "Customer Service",
          email: "info@sonaverse.kr",
        }}
        sameAs={[
          "https://www.facebook.com/sonaverse",
          "https://www.instagram.com/sonaverse",
        ]}
      />
      <MainLayout>
        <HomeHero />
        <ProblemSection />
        <ProductSection />
        <StoryHighlight />
        <CompanyHistory />
        <PressSection />
      </MainLayout>
    </>
  )
}
