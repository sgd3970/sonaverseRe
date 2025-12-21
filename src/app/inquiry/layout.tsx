import { generateMetadata as genMeta } from "@/lib/seo/metadata"

export const metadata = genMeta({
  title: "구매/제휴 문의",
  description: "Sonaverse 제품 구매 및 제휴 문의를 남겨주세요. 빠른 시일 내에 답변드리겠습니다.",
  keywords: ["문의", "구매 문의", "제휴", "상담"],
  ogType: "website",
  canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sonaverse.kr"}/inquiry`,
})

export default function InquiryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

