"use client"

import { useState } from "react"
import { useTranslation, useLocale } from "@/lib/i18n"
import { IProduct } from "@/lib/models/Product"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

type ProductCategory = "all" | "pants" | "inner" | "mat"

interface Product {
    id: string
    category: ProductCategory
    nameKo: string
    nameEn: string
    descKo: string
    descEn: string
    price: number
    quantity: string
    image: string
}

interface CategoryButtonProps {
    label: string
    isActive: boolean
    onClick: () => void
    color?: string
}

function CategoryButton({ label, isActive, onClick, color = "bodeum-green" }: CategoryButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`whitespace-nowrap rounded-full px-5 md:px-7 py-2 md:py-3 transition-colors text-xs md:text-sm ${isActive
                ? 'bg-[#5eba7d] text-white font-bold shadow-md'
                : 'bg-white border border-gray-200 text-gray-500 font-medium hover:border-[#5eba7d] hover:text-[#5eba7d]'
                }`}
        >
            {label}
        </button>
    )
}

interface ProductCardProps {
    product: Product
    categoryLabel: string
    locale: string
    color?: string
}

function ProductCard({ product, categoryLabel, locale, color = "bodeum-green" }: ProductCardProps) {
    const name = locale === "en" ? product.nameEn : product.nameKo
    const desc = locale === "en" ? product.descEn : product.descKo

    return (
        <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100/50">
            {/* Product Image */}
            <div className="aspect-square relative overflow-hidden bg-gray-50/50 p-6 md:p-8">
                <OptimizedImage
                    src={product.image}
                    alt={name}
                    fill
                    className="transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
                    objectFit="contain"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[#5eba7d] text-[10px] font-bold shadow-sm">
                        {categoryLabel}
                    </span>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white text-[#5eba7d] font-bold px-6 py-2.5 rounded-full shadow-lg hidden md:block hover:bg-[#5eba7d] hover:text-white transition-colors">
                        자세히 보기
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-6 md:p-8">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{name}</h3>
                <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-6 line-clamp-2 leading-relaxed">
                    {desc}
                </p>
                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                    <span className="text-xl md:text-2xl font-black text-gray-900">
                        {product.price.toLocaleString()}원
                    </span>
                    <span className="text-[10px] md:text-sm font-medium text-gray-400 bg-gray-50 px-2 py-0.5 md:px-3 md:py-1 rounded-lg">
                        {product.quantity}
                    </span>
                </div>
            </div>
        </div>
    )
}

interface BodumeLineupProps {
    products?: IProduct[];
}

export function BodumeLineup({ products: dbProducts }: BodumeLineupProps) {
    const { t, isLoading } = useTranslation()
    const locale = useLocale()
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all")

    const defaultProducts: Product[] = [
        {
            id: "pants-large",
            category: "pants",
            nameKo: "보듬 팬티형 대형",
            nameEn: "Bodume Pants Large",
            descKo: "혼자서도 입고 벗기 편한 팬티형 기저귀. 활동량이 많은 분들에게 추천합니다.",
            descEn: "Easy to put on and take off. Recommended for active users.",
            price: 18000,
            quantity: "30매입",
            image: "/images/product/bodume/product1.webp",
        },
        {
            id: "pants-medium",
            category: "pants",
            nameKo: "보듬 팬티형 중형",
            nameEn: "Bodume Pants Medium",
            descKo: "부드러운 허리 밴드로 편안한 착용감을 제공합니다.",
            descEn: "Soft waistband provides comfortable fit.",
            price: 18000,
            quantity: "34매입",
            image: "/images/product/bodume/product1.webp",
        },
        {
            id: "inner-regular",
            category: "inner",
            nameKo: "보듬 속기저귀 일반형",
            nameEn: "Bodume Inner Pad Regular",
            descKo: "팬티형과 함께 사용하면 더욱 경제적인 교체형 속기저귀.",
            descEn: "Economical replacement inner pad for use with pants type.",
            price: 12000,
            quantity: "30매입",
            image: "/images/product/bodume/product1.webp",
        },
        {
            id: "mat",
            category: "mat",
            nameKo: "보듬 깔개매트",
            nameEn: "Bodume Underpad",
            descKo: "침구 오염을 방지하는 위생적인 일회용 매트.",
            descEn: "Hygienic disposable mat to prevent bedding contamination.",
            price: 15000,
            quantity: "10매입",
            image: "/images/product/bodume/product1.webp",
        },
    ]

    const products: Product[] = dbProducts?.length
        ? dbProducts.map(p => {
            // Determine category from name (tags are ObjectIds, so skipping for now unless populated)
            let category: ProductCategory = "pants"; // default
            if (p.name.ko.includes("속기저귀")) category = "inner";
            else if (p.name.ko.includes("매트")) category = "mat";
            else if (p.name.ko.includes("팬티")) category = "pants";

            // Determine quantity from subtitle or specs or hardcoded fallback
            // Assuming subtitle might contain "30매입" or similar
            const quantity = p.subtitle?.ko || "30매입";

            // Image
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imageUrl = (p.thumbnail_image_id as any)?.url || (p.hero_image_id as any)?.url || "/images/product/bodume/product1.webp";

            return {
                id: p._id.toString(),
                category,
                nameKo: p.name.ko,
                nameEn: p.name.en || p.name.ko,
                descKo: p.short_description?.ko || "",
                descEn: p.short_description?.en || "",
                price: p.pricing.retail_price || 0,
                quantity,
                image: imageUrl
            };
        })
        : defaultProducts;

    const categories = [
        { id: "all" as ProductCategory, labelKo: "전체 보기", labelEn: "All Products" },
        { id: "pants" as ProductCategory, labelKo: "팬티형", labelEn: "Pants Type" },
        { id: "inner" as ProductCategory, labelKo: "속기저귀", labelEn: "Inner Pad" },
        { id: "mat" as ProductCategory, labelKo: "깔개매트", labelEn: "Underpad" },
    ]

    const filteredProducts = selectedCategory === "all"
        ? products
        : products.filter(p => p.category === selectedCategory)

    if (isLoading) {
        return (
            <>
                <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 md:py-5 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 flex gap-3">
                        <div className="h-9 w-32 bg-gray-200 rounded-full animate-pulse" />
                        <div className="h-9 w-24 bg-gray-100 rounded-full animate-pulse" />
                        <div className="h-9 w-24 bg-gray-100 rounded-full animate-pulse" />
                    </div>
                </div>
                <section className="py-12 md:py-24 bg-bg-soft">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                                    <div className="aspect-square bg-gray-200" />
                                    <div className="p-6 md:p-8">
                                        <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
                                        <div className="h-16 bg-gray-100 rounded mb-6" />
                                        <div className="h-8 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </>
        )
    }

    return (
        <>
            {/* Sticky Filter Navigation */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 md:py-5 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 flex gap-3 overflow-x-auto no-scrollbar">
                    {categories.map((category) => {
                        const label = locale === "en" ? category.labelEn : category.labelKo
                        return (
                            <CategoryButton
                                key={category.id}
                                label={label}
                                isActive={selectedCategory === category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                color="bodeum-green"
                            />
                        )
                    })}
                </div>
            </div>

            {/* Products Grid */}
            <section className="py-12 md:py-24 bg-bg-soft">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredProducts.map((product) => {
                            const categoryLabel = locale === "en"
                                ? categories.find(c => c.id === product.category)?.labelEn
                                : categories.find(c => c.id === product.category)?.labelKo

                            return (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    categoryLabel={categoryLabel || ""}
                                    locale={locale}
                                    color="bodeum-green"
                                />
                            )
                        })}
                    </div>
                </div>
            </section>
        </>
    )
}
