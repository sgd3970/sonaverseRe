import { MainLayout } from "@/shared/components/layout/MainLayout"
import { BodumeHero } from "@/features/products/bodume/components/BodumeHero"
import { BodumeLineup } from "@/features/products/bodume/components/BodumeLineup"
import dbConnect from "@/lib/db"
import Product from "@/lib/models/Product"
import Image from "@/lib/models/Image"
import { generateMetadata as genMeta } from "@/lib/seo/metadata"
import { ProductStructuredData } from "@/lib/seo/structured-data"

export const revalidate = 3600 // 1 hour

export const metadata = genMeta({
  title: "보듬 기저귀 - 프리미엄 성인용 기저귀",
  description: "보듬(BO DUME) 프리미엄 성인용 기저귀. 최고의 품질과 편안함으로 시니어의 일상을 더욱 편리하게 만듭니다.",
  keywords: ["보듬", "기저귀", "성인용 기저귀", "프리미엄", "시니어 케어"],
  ogType: "website",
  canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sonaverse.kr"}/products/bodume`,
})

export default async function BodumePage() {
    await dbConnect()

    // Fetch main product for Hero (e.g. featured one or just the first one)
    const mainProductDoc = await Product.findOne({ type: 'bodume', is_active: true, is_featured: true })
        .populate('hero_image_id')
        .lean() || await Product.findOne({ type: 'bodume', is_active: true }).populate('hero_image_id').lean()

    // Fetch all products for Lineup
    const allProductsDocs = await Product.find({ type: 'bodume', is_active: true })
        .populate('thumbnail_image_id')
        .lean()

    const mainProduct = mainProductDoc ? JSON.parse(JSON.stringify(mainProductDoc)) : null
    const heroImage = mainProduct?.hero_image_id ? mainProduct.hero_image_id : null
    const allProducts = allProductsDocs ? JSON.parse(JSON.stringify(allProductsDocs)) : []

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sonaverse.kr";
    const productName = mainProduct?.name?.ko || "보듬 기저귀";
    const productDescription = mainProduct?.description?.ko || "프리미엄 성인용 기저귀";
    const productImage = heroImage?.url || `${siteUrl}/images/product/bodume-hero.webp`;

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
                <BodumeHero product={mainProduct} heroImage={heroImage} />
                <BodumeLineup products={allProducts} />
                {/* <BodumeFeatures /> - Can be added similarly if needed */}
            </MainLayout>
        </>
    )
}
