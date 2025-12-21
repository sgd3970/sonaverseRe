import { MainLayout } from "@/shared/components/layout/MainLayout"
import { ManboHero } from "@/features/products/manbo/components/ManboHero"
import { ManboFeatures } from "@/features/products/manbo/components/ManboFeatures"
import { ManboSpecs } from "@/features/products/manbo/components/ManboSpecs"
import dbConnect from "@/lib/db"
import Product from "@/lib/models/Product"
import Image from "@/lib/models/Image"
import { generateMetadata as genMeta } from "@/lib/seo/metadata"
import { ProductStructuredData } from "@/lib/seo/structured-data"

// Placeholder for Gallery if needed later

export const revalidate = 3600 // 1 hour

export const metadata = genMeta({
  title: "만보 워크메이트 - 하이브리드형 보행기",
  description: "듀얼 구동 방식을 적용한 차세대 하이브리드 워크메이트. 시니어의 안전하고 편안한 보행을 위한 혁신적인 제품입니다.",
  keywords: ["만보", "워크메이트", "보행기", "하이브리드", "시니어", "보행보조기"],
  ogType: "website",
  canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sonaverse.kr"}/products/manbo`,
})

export default async function ManboPage() {
    await dbConnect()

    // Fetch product data
    const productDoc = await Product.findOne({ type: 'manbo', is_active: true })
        .populate('hero_image_id')
        .lean()

    // Serialize for client components
    const product = productDoc ? JSON.parse(JSON.stringify(productDoc)) : null
    const heroImage = product?.hero_image_id ? product.hero_image_id : null

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sonaverse.kr";
    const productName = product?.name?.ko || "만보 워크메이트";
    const productDescription = product?.description?.ko || "듀얼 구동 방식을 적용한 차세대 하이브리드 워크메이트";
    const productImage = heroImage?.url || `${siteUrl}/images/product/manbo-hero.webp`;

    return (
        <>
            <ProductStructuredData
                name={productName}
                description={productDescription}
                image={[productImage]}
                brand={{ name: "Sonaverse" }}
                offers={{
                    availability: "https://schema.org/InStock",
                }}
            />
            <MainLayout>
                <ManboHero product={product} heroImage={heroImage} />
                <ManboFeatures product={product} />
                <ManboSpecs product={product} />
            </MainLayout>
        </>
    )
}
