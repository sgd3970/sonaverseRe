import { MainLayout } from "@/shared/components/layout/MainLayout"
import dbConnect from "@/lib/db"
import Product from "@/lib/models/Product"
import Image from "@/lib/models/Image"
import { generateMetadata as genMeta } from "@/lib/seo/metadata"
import { ProductStructuredData } from "@/lib/seo/structured-data"
import { notFound } from "next/navigation"
import Link from "next/link"

type Props = {
    params: Promise<{ slug: string }>
}

export const revalidate = 3600; // 1 hour
export const dynamicParams = true; // 새 제품은 동적 생성

// 인기 제품 정적 생성
export async function generateStaticParams() {
  try {
    await dbConnect();
    const products = await Product.find({ 
      is_active: true,
      is_featured: true, // 피처된 제품만
    })
      .sort({ view_count: -1, display_order: 1 })
      .limit(20)
      .select('slug')
      .lean();
    
    return products.map((p: any) => ({ slug: p.slug }));
  } catch (error) {
    console.error('Error generating static params for products:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
    await dbConnect()
    const { slug } = await params

    const product = await Product.findOne({ slug, is_active: true })
        .populate('hero_image_id', 'url public_url')
        .populate('thumbnail_image_id', 'url public_url')
        .populate('seo.og_image_id', 'url public_url')
        .select('slug name subtitle short_description description seo thumbnail_image_id hero_image_id') // 메타데이터에 필요한 필드만
        .lean()

    if (!product) {
        return genMeta({
            title: "제품을 찾을 수 없습니다",
            description: "요청하신 제품을 찾을 수 없습니다.",
        })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sonaverse.kr"
    const ogImage = product.seo?.og_image_id?.url 
        || product.hero_image_id?.url 
        || product.thumbnail_image_id?.url 
        || `${siteUrl}/images/og-default.jpg`

    return genMeta({
        title: product.seo?.meta_title_ko || product.name?.ko || "제품 상세",
        description: product.seo?.meta_description_ko || product.short_description?.ko || product.description?.ko || "",
        keywords: product.seo?.keywords_ko || [],
        ogImage,
        ogType: "website", // OpenGraph는 'website' 또는 'article'만 허용
        canonicalUrl: product.seo?.canonical_url || `${siteUrl}/products/${slug}`,
    })
}

export default async function ProductDetailPage({ params }: Props) {
    await dbConnect()
    const { slug } = await params

    const productDoc = await Product.findOne({ slug, is_active: true })
        .populate('hero_image_id', 'url public_url')
        .populate('thumbnail_image_id', 'url public_url')
        .populate('gallery_image_ids', 'url public_url')
        .select('-__v -created_by -updated_by') // 불필요한 필드 제외
        .lean()

    if (!productDoc) {
        notFound()
    }

    const product = JSON.parse(JSON.stringify(productDoc))
    const heroImage = product.hero_image_id || product.thumbnail_image_id
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sonaverse.kr"

    // 타입별 색상 설정
    const typeColors: Record<string, { bg: string; text: string; border: string }> = {
        manbo: { bg: 'bg-[#6366F1]', text: 'text-[#6366F1]', border: 'border-[#6366F1]' },
        bodume: { bg: 'bg-bodeum-green', text: 'text-bodeum-green', border: 'border-bodeum-green' },
        accessory: { bg: 'bg-gray-600', text: 'text-gray-600', border: 'border-gray-600' },
        other: { bg: 'bg-gray-500', text: 'text-gray-500', border: 'border-gray-500' },
    }

    const colors = typeColors[product.type] || typeColors.other

    return (
        <>
            <ProductStructuredData
                name={product.name?.ko || "제품"}
                description={product.description?.ko || ""}
                image={heroImage?.url ? [heroImage.url] : []}
                brand={{ name: "Sonaverse" }}
                offers={{
                    price: product.pricing?.sale_price || product.pricing?.retail_price,
                    priceCurrency: product.pricing?.currency || "KRW",
                    availability: product.inventory?.is_in_stock
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
                }}
                sku={product.sku}
            />
            <MainLayout>
                <main className="flex-grow pt-0">
                    <div className="w-full bg-white pt-24 pb-20">
                        <div className="max-w-7xl mx-auto px-6">
                            {/* 상단 링크 */}
                            <div className="mb-6">
                                <Link
                                    href={`/products/${product.type}`}
                                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                                    <span>목록으로 돌아가기</span>
                                </Link>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-12">
                                {/* 왼쪽: 이미지 */}
                                <div className="flex-1">
                                    <div className="aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 mb-4">
                                        {heroImage?.url ? (
                                            <img
                                                alt={product.name?.ko || "제품 이미지"}
                                                className="w-full h-full object-cover"
                                                src={heroImage.url}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <span className="material-symbols-outlined text-6xl text-gray-300">
                                                    inventory_2
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* 갤러리 이미지 */}
                                    {product.gallery_image_ids && product.gallery_image_ids.length > 0 && (
                                        <div className="grid grid-cols-4 gap-4">
                                            {product.gallery_image_ids.slice(0, 4).map((img: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:border-gray-300 transition-colors"
                                                >
                                                    {img?.url && (
                                                        <img
                                                            src={img.url}
                                                            alt={`갤러리 ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 오른쪽: 정보 */}
                                <div className="flex-1 flex flex-col">
                                    {/* 배지 */}
                                    <div className="mb-2 flex items-center gap-2">
                                        {product.is_new && (
                                            <span className={`px-3 py-1 rounded-full ${colors.bg}/10 ${colors.text} text-sm font-bold`}>
                                                NEW
                                            </span>
                                        )}
                                        {product.is_best && (
                                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-bold">
                                                BEST
                                            </span>
                                        )}
                                    </div>

                                    {/* 제품명 */}
                                    <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                                        {product.name?.ko}
                                    </h1>

                                    {/* 부제목 */}
                                    {product.subtitle?.ko && (
                                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                            {product.subtitle.ko}
                                        </p>
                                    )}

                                    {/* 제품 스펙 */}
                                    {product.specifications && product.specifications.length > 0 && (
                                        <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                                {product.specifications.slice(0, 6).map((spec: any, idx: number) => (
                                                    <div key={idx} className="flex flex-col">
                                                        <span className="text-sm text-gray-500 mb-1">{spec.key}</span>
                                                        <span className="font-bold text-gray-800">
                                                            {spec.value_ko} {spec.unit || ''}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 주요 특징 */}
                                    {product.features?.ko && product.features.ko.length > 0 && (
                                        <div className="mb-10">
                                            <h3 className="font-bold text-gray-900 mb-3">주요 특징</h3>
                                            <ul className="space-y-2">
                                                {product.features.ko.map((feature: string, idx: number) => (
                                                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                                                        <span className={`material-symbols-outlined select-none ${colors.text} text-xl`}>
                                                            check_circle
                                                        </span>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* 가격 및 구매 버튼 */}
                                    <div className="mt-auto pt-8 border-t border-gray-100 flex items-center justify-between">
                                        <div>
                                            {product.pricing?.retail_price && product.pricing?.sale_price &&
                                                product.pricing.retail_price !== product.pricing.sale_price && (
                                                <p className="text-sm text-gray-400 line-through">
                                                    {product.pricing.retail_price.toLocaleString()}원
                                                </p>
                                            )}
                                            {product.pricing?.sale_price || product.pricing?.retail_price ? (
                                                <>
                                                    <p className="text-sm text-gray-400">판매가</p>
                                                    <p className="text-3xl font-black text-gray-900">
                                                        {(product.pricing.sale_price || product.pricing.retail_price).toLocaleString()}원
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-xl text-gray-500">가격 문의</p>
                                            )}
                                        </div>
                                        {product.purchase_options?.purchase_link ? (
                                            <a
                                                href={product.purchase_options.purchase_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`h-14 px-10 rounded-full ${colors.bg} text-white text-lg font-bold shadow-lg ${colors.bg}/20 hover:opacity-90 transition-opacity flex items-center justify-center`}
                                            >
                                                구매 문의하기
                                            </a>
                                        ) : (
                                            <Link
                                                href="/inquiry"
                                                className={`h-14 px-10 rounded-full ${colors.bg} text-white text-lg font-bold shadow-lg ${colors.bg}/20 hover:opacity-90 transition-opacity flex items-center justify-center`}
                                            >
                                                구매 문의하기
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 상세 설명 */}
                            {(product.description?.ko || product.content?.ko) && (
                                <div className="mt-24 pt-16 border-t border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                                        상세 제품 설명
                                    </h2>
                                    <div className="max-w-3xl mx-auto prose prose-lg">
                                        {product.description?.ko && (
                                            <div
                                                className="text-gray-600 leading-relaxed whitespace-pre-wrap"
                                                dangerouslySetInnerHTML={{ __html: product.description.ko }}
                                            />
                                        )}
                                        {product.content?.ko && (
                                            <div
                                                className="mt-8 text-gray-600 leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: product.content.ko }}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </MainLayout>
        </>
    )
}
