"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/shared/components/ui/Button"
import { useTranslation } from "@/lib/i18n"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

// Common Section Title Component
const SectionHeader = ({ badge, title }: { badge: string, title: React.ReactNode }) => (
    <div className="mb-16 md:mb-20 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-gray-100 text-gray-500 text-xs font-bold tracking-widest uppercase mb-4 border border-gray-200">
            {badge}
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-tight">
            {title}
        </h2>
    </div>
)

export function ProductSection() {
    const { t, isLoading } = useTranslation()
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = React.useState(0)

    const scrollToProduct = (index: number) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current
            const cardWidth = container.scrollWidth / 2 // 2 products
            container.scrollTo({
                left: cardWidth * index,
                behavior: 'smooth'
            })
            setActiveIndex(index)
        }
    }

    // Detect scroll position to update active indicator
    React.useEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft
            const cardWidth = container.scrollWidth / 2
            const index = Math.round(scrollLeft / cardWidth)
            setActiveIndex(index)
        }

        container.addEventListener('scroll', handleScroll)
        return () => container.removeEventListener('scroll', handleScroll)
    }, [])

    if (isLoading) {
        return (
            <section className="py-20 lg:py-28 bg-gray-50">
                <div className="container-custom">
                    <div className="h-10 bg-gray-200 rounded w-1/4 mx-auto mb-16 animate-pulse" />
                    <div className="grid lg:grid-cols-2 gap-8">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse">
                                <div className="aspect-[4/3] bg-gray-200" />
                                <div className="p-8 space-y-4">
                                    <div className="h-16 bg-gray-100 rounded" />
                                    <div className="h-10 bg-gray-200 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    const sectionBadge = t('home.products.section.badge') || 'The Collection'
    const sectionTitle = t('home.products.section.title') || '삶의 품격을 높이는 프리미엄 라인업'
    const manboBadge = t('home.products.section.manbo.badge') || 'Innovative Smart Walker'
    const manboName = t('home.products.section.manbo.name') || '만보 워크메이트'
    const manboDescription = t('home.products.section.manbo.description') || '자유로운 이동을 위한 테크놀로지의 집약'
    const manboViewDetail = t('home.products.section.manbo.viewDetail') || 'View Detail'
    const manboInquiryNow = t('home.products.section.manbo.inquiryNow') || 'Inquiry Now'
    const bodumeBadge = t('home.products.section.bodume.badge') || 'Premium Care Diaper'
    const bodumeName = t('home.products.section.bodume.name') || '보듬 기저귀'
    const bodumeDescription = t('home.products.section.bodume.description') || '최상의 편안함과 위생을 향한 고집'
    const bodumeExplore = t('home.products.section.bodume.explore') || 'Explore'
    const bodumePurchaseOnline = t('home.products.section.bodume.purchaseOnline') || 'Purchase Online'

    return (
        <section id="products" className="py-20 md:py-48 bg-[#f5f2f0] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-12 md:mb-28 text-center">
                    <span className="inline-block py-1 px-3 md:py-1.5 md:px-4 rounded-full bg-gray-100 text-gray-700 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase mb-4 md:mb-6 border border-gray-200/50">{sectionBadge}</span>
                    <h2 className="text-3xl md:text-6xl font-black text-gray-900 tracking-tight mb-4 md:mb-6 leading-[1.2] md:leading-[1.15]">{sectionTitle}</h2>
                </div>

                <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-2 lg:gap-12 lg:overflow-visible lg:pb-0 no-scrollbar scroll-smooth">
                    {/* Manbo Card */}
                    <div className="min-w-full md:min-w-[45vw] lg:min-w-0 snap-center group relative rounded-[2.5rem] md:rounded-[3rem] bg-white shadow-2xl transition-all duration-700 flex flex-col overflow-hidden mr-6 lg:mr-0" style={{ transform: 'scale(0.764)', transformOrigin: 'center' }}>
                        <div className="p-8 md:p-12 pb-6">
                            <div className="flex items-center gap-3 mb-4 md:mb-6">
                                <div className="h-[2px] w-8 md:w-10 bg-primary"></div>
                                <span className="text-primary font-black tracking-[0.2em] text-[9px] md:text-[10px] uppercase">{manboBadge}</span>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 md:mb-4 tracking-tight">{manboName}</h3>
                            <p className="text-gray-700 text-base md:text-lg font-light leading-relaxed">{manboDescription}</p>
                        </div>
                        <div className="aspect-[4/3] w-full bg-gray-50 relative overflow-hidden">
                            <OptimizedImage
                                alt="Manbo"
                                title="만보 워크메이트 - 자유로운 이동을 위한 테크놀로지의 집약"
                                className="transition-transform duration-1000 group-hover:scale-110"
                                src="/images/product/manbo/product2.webp"
                                fill
                                priority
                                sizes="(max-width: 1024px) 85vw, 50vw"
                                objectFit="cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity"></div>
                        </div>
                        <div className="p-8 md:p-10 pt-4 mt-auto flex gap-3 md:gap-5">
                            <Link href="/products/manbo" className="flex-1 py-4 md:py-5 border-2 border-gray-100 text-gray-600 font-medium hover:border-primary hover:text-primary transition-all duration-300 tracking-widest text-xs md:text-sm flex items-center justify-center" style={{ borderRadius: '2rem' }}>
                                {manboViewDetail}
                            </Link>
                            <Link href="/inquiry" className="flex-1 py-4 md:py-5 text-white font-medium shadow-lg hover:-translate-y-1 transition-all duration-500 tracking-widest text-xs md:text-sm flex items-center justify-center bg-primary hover:bg-primary-dark transition-colors" style={{ borderRadius: '2rem' }}>
                                {manboInquiryNow}
                            </Link>
                        </div>
                    </div>

                    {/* Bodume Card */}
                    <div className="min-w-full md:min-w-[45vw] lg:min-w-0 snap-center group relative rounded-[2.5rem] md:rounded-[3rem] bg-white shadow-2xl transition-all duration-700 flex flex-col overflow-hidden" style={{ transform: 'scale(0.764)', transformOrigin: 'center' }}>
                        <div className="p-8 md:p-12 pb-6">
                            <div className="flex items-center gap-3 mb-4 md:mb-6">
                                <div className="h-[2px] w-8 md:w-10 bg-primary"></div>
                                <span className="text-primary font-black tracking-[0.2em] text-[9px] md:text-[10px] uppercase">{bodumeBadge}</span>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 md:mb-4 tracking-tight">{bodumeName}</h3>
                            <p className="text-gray-700 text-base md:text-lg font-light leading-relaxed">{bodumeDescription}</p>
                        </div>
                        <div className="aspect-[4/3] w-full bg-gray-50 relative overflow-hidden">
                            <OptimizedImage
                                alt="Bodeum"
                                title="보듬 기저귀 - 최상의 편안함과 위생을 향한 고집"
                                className="transition-transform duration-1000 group-hover:scale-110"
                                src="/images/product/bodume/product1.webp"
                                fill
                                sizes="(max-width: 1024px) 85vw, 50vw"
                                objectFit="cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity"></div>
                        </div>
                        <div className="p-8 md:p-10 pt-4 mt-auto flex gap-3 md:gap-5">
                            <Link href="/products/bodume" className="flex-1 py-4 md:py-5 border-2 border-gray-100 text-gray-600 font-medium hover:border-primary hover:text-primary transition-all duration-300 tracking-widest text-xs md:text-sm flex items-center justify-center" style={{ borderRadius: '2rem' }}>
                                {bodumeExplore}
                            </Link>
                            <Link href="/products/bodume" className="flex-1 py-4 md:py-5 text-white font-medium shadow-lg hover:-translate-y-1 transition-all duration-500 tracking-widest text-xs md:text-sm flex items-center justify-center bg-primary hover:bg-primary-dark transition-colors" style={{ borderRadius: '2rem' }}>
                                {bodumePurchaseOnline}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Pagination Indicators - Mobile Only */}
                <div className="flex justify-center gap-4 mt-12 lg:hidden">
                    <button
                        onClick={() => scrollToProduct(0)}
                        className={`size-4 rounded-full transition-all duration-500 ${activeIndex === 0 ? 'bg-primary scale-125 shadow-lg ring-4 ring-primary/20' : 'bg-gray-300'}`}
                        aria-label="Go to product 1"
                    />
                    <button
                        onClick={() => scrollToProduct(1)}
                        className={`size-4 rounded-full transition-all duration-500 ${activeIndex === 1 ? 'bg-primary scale-125 shadow-lg ring-4 ring-primary/20' : 'bg-gray-300'}`}
                        aria-label="Go to product 2"
                    />
                </div>
            </div>
        </section>
    )
}
