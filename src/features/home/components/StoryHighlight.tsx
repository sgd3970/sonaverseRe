"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/lib/i18n"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

export function StoryHighlight() {
    const { t, isLoading } = useTranslation()

    // TODO: API 연동 후 실제 데이터로 교체
    const stories = [
        {
            id: 1,
            category: "Press",
            categoryKey: "stories.categories.company_news",
            title: "소나버스, 시니어 통합 케어 플랫폼 '소나버스' 런칭",
            date: "2024.12.10",
            excerpt: "시니어의 일상을 혁신하는 통합 케어 플랫폼 소나버스가 정식 런칭했습니다.",
            image: "bg-gray-100",
        },
        {
            id: 2,
            category: "Product Story",
            categoryKey: "stories.categories.product_story",
            title: "Manbo Walker 개발 비하인드 스토리",
            date: "2024.11.25",
            excerpt: "수백 번의 실패 끝에 탄생한 스마트 워커 Manbo의 개발 과정을 공개합니다.",
            image: "bg-gray-200",
        },
        {
            id: 3,
            category: "Interview",
            categoryKey: "stories.categories.interview",
            title: "사용자와 함께 만든 혁신, BO DUME 기저귀",
            date: "2024.11.10",
            excerpt: "실제 요양 현장의 목소리를 담아 만든 BO DUME 기저귀 개발 인터뷰.",
            image: "bg-gray-300",
        },
    ]

    if (isLoading) {
        return (
            <section className="py-20 lg:py-28 bg-gray-50">
                <div className="container-custom">
                    <div className="h-10 bg-gray-200 rounded w-1/4 mb-12 animate-pulse" />
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md animate-pulse">
                                <div className="aspect-video bg-gray-200 rounded-t-xl" />
                                <div className="p-6 space-y-3">
                                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-100 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-16 gap-6 md:gap-10">
                    <div className="text-left space-y-4 items-start flex flex-col">
                        <span className="text-primary/60 font-black tracking-[0.3em] text-[10px] md:text-xs uppercase block">Insights &amp; Heritage</span>
                        <h2 className="text-4xl md:text-7xl font-black text-primary leading-[1.1] tracking-tighter">소나버스 <br />스토리</h2>
                    </div>
                    <button className="group flex items-center gap-4 text-gray-400 font-black hover:text-primary transition-all text-sm tracking-widest uppercase">
                        <Link href="/stories">View All Stories</Link> <span className="material-symbols-outlined select-none transition-transform group-hover:translate-x-2 text-xl">east</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Featured Story (Large Card) */}
                    <div className="lg:col-span-2 group cursor-pointer relative overflow-hidden rounded-[3.5rem] bg-gray-900 shadow-3xl h-[600px]">
                        <div className="absolute inset-0 opacity-70 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-105">
                            <OptimizedImage 
                                alt="만보 워크메이트 개발 비하인드" 
                                title="만보 워크메이트 개발 비하인드 스토리"
                                src="/images/stories/story-thumb-1.webp"
                                fill 
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                objectFit="cover" 
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        <div className="relative p-12 md:p-20 flex flex-col justify-end h-full">
                            <Link href={`/stories/${stories[0].id}`}>
                                <span className="inline-block px-4 py-1.5 bg-accent text-white text-[10px] font-black rounded-full mb-6 w-fit uppercase tracking-widest">제품스토리</span>
                                <h3 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight max-w-4xl group-hover:translate-x-2 transition-transform duration-500">{stories[0].title}</h3>
                                <p className="text-white/60 text-xl font-light line-clamp-2 mb-10 max-w-2xl">{stories[0].excerpt}</p>
                                <div className="flex items-center text-white/40 text-sm font-bold tracking-widest uppercase">
                                    <span>{stories[0].date}</span>
                                    <span className="mx-4">•</span>
                                    <span className="group-hover:text-white transition-colors">Read Full Story</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Sub Stories Grid */}
                    {stories.slice(1).map((story, i) => (
                        <div key={story.id} className="group cursor-pointer flex flex-col">
                            <Link href={`/stories/${story.id}`}>
                                <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-8 shadow-sm relative bg-gray-100">
                                    <OptimizedImage 
                                        alt={story.title} 
                                        title={story.title} 
                                        className="transition-transform duration-700 group-hover:scale-110" 
                                        src={i === 0 ? "/images/stories/story-thumb-2.webp" : "/images/stories/story-thumb-3.webp"}
                                        fill 
                                        objectFit="cover" 
                                    />
                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black text-gray-900 shadow-sm uppercase tracking-widest">{story.category}</div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">{story.title}</h3>
                                <span className="text-xs text-gray-400 font-black tracking-widest uppercase">{story.date}</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
