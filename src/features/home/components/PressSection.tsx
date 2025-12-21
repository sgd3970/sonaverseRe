"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/lib/i18n"
import { usePress } from "@/lib/hooks"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

export function PressSection() {
    const { t, isLoading: isI18nLoading } = useTranslation()
    const { pressItems, isLoading: isDataLoading } = usePress({ limit: 4 })

    // 날짜 포맷 (2023.09.15 형식)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}.${month}.${day}`
    }

    const isLoading = isI18nLoading || isDataLoading

    if (isLoading) {
        return (
            <section className="py-24 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-10 w-48 bg-gray-200 rounded mx-auto mb-16 animate-pulse" />
                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="lg:w-3/5 h-96 bg-gray-200 rounded-3xl animate-pulse" />
                        <div className="lg:w-2/5 space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (!pressItems || pressItems.length === 0) {
        return null
    }

    const mainPress = pressItems[0]
    const subPress = pressItems.slice(1, 4)

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-12 md:mb-16 text-left">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-gray-100 text-gray-600 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase mb-6 border border-gray-200/50">Global Voice</span>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6 leading-[1.15]">미디어가 주목하는 소나버스</h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Main Featured Article (Left) */}
                    <div className="lg:w-[65%] group cursor-pointer">
                        <Link href={mainPress.externalUrl || `/press/${mainPress.slug}`}>
                            <div className="w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl mb-10 relative">
                                {mainPress.thumbnailUrl ? (
                                    <OptimizedImage 
                                        alt={mainPress.title} 
                                        title={mainPress.title}
                                        className="transition-transform duration-1000 group-hover:scale-110" 
                                        src={mainPress.thumbnailUrl} 
                                        fill 
                                        sizes="(max-width: 1024px) 100vw, 65vw"
                                        objectFit="cover" 
                                    />
                                ) : (
                                    <OptimizedImage 
                                        alt={mainPress.title} 
                                        title={mainPress.title}
                                        className="transition-transform duration-1000 group-hover:scale-110" 
                                        src="/images/press/press-thumb-1.webp"
                                        fill 
                                        sizes="(max-width: 1024px) 100vw, 65vw"
                                        objectFit="cover" 
                                    />
                                )}
                                <div className="absolute top-10 left-10 bg-white/95 backdrop-blur-xl px-6 py-3 rounded-2xl text-[10px] font-black text-gray-900 shadow-sm uppercase tracking-[0.2em]">Latest Release</div>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-black tracking-widest text-gray-400 mb-6 uppercase">
                                <span className="text-primary">{mainPress.pressName}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                                <span>{formatDate(mainPress.publishedAt)}</span>
                            </div>

                            <h3 className="text-4xl font-black text-gray-900 mb-6 group-hover:text-primary transition-colors leading-tight tracking-tight">{mainPress.title}</h3>
                            <p className="text-gray-400 font-light leading-relaxed text-xl line-clamp-2">{mainPress.excerpt || mainPress.subtitle}</p>
                        </Link>
                    </div>

                    {/* Side List (Right) */}
                    <div className="lg:w-[35%] flex flex-col">
                        <div className="flex flex-col gap-10">
                            {subPress.map((article, idx) => (
                                <div key={article.id} className="flex gap-6 group cursor-pointer">
                                    <Link href={article.externalUrl || `/press/${article.slug}`} className="flex gap-6 w-full">
                                        <div className="w-32 h-24 rounded-3xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                                            {article.thumbnailUrl ? (
                                                <OptimizedImage 
                                                    alt={article.title} 
                                                    title={article.title}
                                                    className="group-hover:scale-110 transition-transform duration-500" 
                                                    src={article.thumbnailUrl} 
                                                    fill 
                                                    sizes="128px"
                                                    objectFit="cover" 
                                                />
                                            ) : (
                                                <OptimizedImage 
                                                    alt={article.title} 
                                                    title={article.title}
                                                    className="group-hover:scale-110 transition-transform duration-500" 
                                                    src={idx === 0 ? "/images/press/press-thumb-2.webp" : idx === 1 ? "/images/press/press-thumb-3.webp" : "/images/press/press-thumb-4.webp"}
                                                    fill 
                                                    sizes="128px"
                                                    objectFit="cover" 
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <span className="text-[10px] font-black text-accent uppercase tracking-widest mb-2">{article.pressName}</span>
                                            <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">{article.title}</h4>
                                            <span className="text-[10px] text-gray-400 font-black tracking-widest">{formatDate(article.publishedAt)}</span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Read More Button */}
                        <button className="mt-16 w-full py-6 rounded-3xl border-2 border-gray-100 text-gray-900 font-black hover:bg-gray-50 hover:border-primary/20 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]">
                            <Link href="/press">Read More News</Link> <span className="material-symbols-outlined select-none text-lg">arrow_outward</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
