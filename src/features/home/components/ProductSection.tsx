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

    return (
        <section id="products" className="py-16 md:py-24 bg-[#f5f2f0] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-12 md:mb-16 text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-gray-100 text-gray-600 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase mb-6 border border-gray-200/50">The Collection</span>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6 leading-[1.15]">삶의 품격을 높이는 <br className="md:hidden" />프리미엄 라인업</h2>
                </div>

                <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-2 lg:gap-12 lg:overflow-visible lg:pb-0 no-scrollbar scroll-smooth">
                    {/* Manbo Card */}
                    <div className="min-w-[85vw] md:min-w-[45vw] lg:min-w-0 snap-center group relative rounded-[3rem] bg-white shadow-2xl transition-all duration-700 flex flex-col overflow-hidden hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.15)] mr-6 lg:mr-0">
                        <div className="p-12 pb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-[2px] w-10 bg-manbo-green"></div>
                                <span className="text-manbo-green-dark font-black tracking-[0.2em] text-[10px] uppercase">Innovative Smart Walker</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">만보 워크메이트</h3>
                            <p className="text-gray-600 text-lg font-light leading-relaxed">자유로운 이동을 위한 테크놀로지의 집약</p>
                        </div>
                        <div className="aspect-[4/3] w-full bg-gray-50 relative overflow-hidden">
                            <OptimizedImage alt="Manbo" className="transition-transform duration-1000 group-hover:scale-110" src="https://picsum.photos/800/600?random=10" fill objectFit="cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity"></div>
                        </div>
                        <div className="p-10 pt-4 mt-auto flex gap-5">
                            <button className="flex-1 py-5 rounded-2xl border-2 border-gray-100 text-gray-500 font-black hover:border-manbo-green hover:text-manbo-green transition-all duration-300 uppercase tracking-widest text-xs">
                                <Link href="/products/manbo">View Detail</Link>
                            </button>
                            <button className="flex-1 py-5 rounded-2xl bg-gradient-to-br from-manbo-green to-[#1d8e4a] text-white font-black shadow-[0_15px_35px_-5px_rgba(46,184,101,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(46,184,101,0.6)] hover:-translate-y-1 transition-all duration-500 tracking-widest text-xs uppercase">
                                <Link href="/inquiry">Inquiry Now</Link>
                            </button>
                        </div>
                    </div>

                    {/* Bodume Card */}
                    <div className="min-w-[85vw] md:min-w-[45vw] lg:min-w-0 snap-center group relative rounded-[3rem] bg-white shadow-2xl transition-all duration-700 flex flex-col overflow-hidden hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.15)]">
                        <div className="p-12 pb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-[2px] w-10 bg-bodeum-green"></div>
                                <span className="text-bodume-green-dark font-black tracking-[0.2em] text-[10px] uppercase">Premium Care Diaper</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">보듬 기저귀</h3>
                            <p className="text-gray-600 text-lg font-light leading-relaxed">최상의 편안함과 위생을 향한 고집</p>
                        </div>
                        <div className="aspect-[4/3] w-full bg-gray-50 relative overflow-hidden">
                            <OptimizedImage alt="Bodeum" className="transition-transform duration-1000 group-hover:scale-110" src="https://picsum.photos/800/600?random=11" fill objectFit="cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity"></div>
                        </div>
                        <div className="p-10 pt-4 mt-auto flex gap-5">
                            <button className="flex-1 py-5 rounded-2xl border-2 border-gray-100 text-gray-500 font-black hover:border-bodeum-green hover:text-bodeum-green transition-all duration-300 uppercase tracking-widest text-xs">
                                <Link href="/products/bodume">Explore</Link>
                            </button>
                            <button className="flex-1 py-5 rounded-2xl bg-gradient-to-br from-bodeum-green to-[#469e66] text-white font-black shadow-[0_15px_35px_-5px_rgba(94,186,125,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(94,186,125,0.6)] hover:-translate-y-1 transition-all duration-500 tracking-widest text-xs uppercase">
                                <Link href="/products/bodume">Purchase Online</Link>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pagination Indicators - Mobile Only */}
                <div className="flex justify-center gap-3 mt-10 lg:hidden">
                    <button
                        onClick={() => scrollToProduct(0)}
                        className={`size-3 rounded-full transition-all duration-300 ${activeIndex === 0 ? 'bg-primary w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
                        aria-label="Go to product 1"
                    />
                    <button
                        onClick={() => scrollToProduct(1)}
                        className={`size-3 rounded-full transition-all duration-300 ${activeIndex === 1 ? 'bg-primary w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
                        aria-label="Go to product 2"
                    />
                </div>
            </div>
        </section>
    )
}
