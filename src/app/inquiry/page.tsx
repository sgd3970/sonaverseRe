import { MainLayout } from "@/shared/components/layout/MainLayout"
import InquiryPageClient from "./InquiryPageClient"
import { generateMetadata as genMeta } from "@/lib/seo/metadata"

export const metadata = genMeta({
  title: "문의하기",
  description: "Sonaverse 제품 및 서비스에 대해 궁금한 점이 있으시다면 언제든 문의해주세요. 고객님의 소중한 의견을 기다립니다.",
  keywords: ["문의", "고객지원", "상담", "제품문의", "서비스문의"],
  ogType: "website",
  canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sonaverse.kr"}/inquiry`,
})

export default function InquiryPage() {
  return (
    <MainLayout>
      <InquiryPageClient />
    </MainLayout>
  )
}
