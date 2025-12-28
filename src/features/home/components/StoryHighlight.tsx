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
            title: t('home.stories.featured.0.title'),
            date: "2024.12.10",
            excerpt: t('home.stories.featured.0.excerpt'),
            image: "bg-gray-100",
        },
        {
            id: 2,
            category: "Product Story",
            categoryKey: "stories.categories.product_story",
            title: t('home.stories.featured.1.title'),
            date: "2024.11.25",
            excerpt: t('home.stories.featured.1.excerpt'),
            image: "bg-gray-200",
        },
        {
            id: 3,
            category: "Interview",
            categoryKey: "stories.categories.interview",
            title: t('home.stories.featured.2.title'),
            date: "2024.11.10",
            excerpt: t('home.stories.featured.2.excerpt'),
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
                        <span className="text-primary/80 font-black tracking-[0.3em] text-[10px] md:text-xs uppercase block">{t('home.stories.section.badge') || 'Insights & Heritage'}</span>
                        <h2 className="text-4xl md:text-7xl font-black text-primary leading-[1.1] tracking-tighter">{t('home.stories.section.title') || '소나버스 스토리'}</h2>
                    </div>
                    <Link href="/stories" className="group flex items-center gap-4 text-gray-500 font-black hover:text-primary transition-all text-sm tracking-widest uppercase p-2 min-h-[48px]">
                        {t('home.stories.section.viewAll') || 'View All Stories'} <span className="material-symbols-outlined select-none transition-transform group-hover:translate-x-2 text-xl">east</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Featured Story (Large Card) */}
                    <div className="lg:col-span-2 group cursor-pointer relative overflow-hidden rounded-[3.5rem] bg-gray-900 shadow-3xl h-[600px]" style={{ position: 'relative', height: '600px' }}>
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
                                <span className="inline-block px-4 py-1.5 bg-primary text-white text-[10px] font-black rounded-full mb-6 w-fit uppercase tracking-widest">{t(`stories.categories.${stories[0].categoryKey.split('.').pop()}`) || stories[0].category}</span>
                                <h3 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight max-w-4xl group-hover:translate-x-2 transition-transform duration-500">{stories[0].title}</h3>
                                <p className="text-white/60 text-xl font-light line-clamp-2 mb-10 max-w-2xl">{stories[0].excerpt}</p>
                                <div className="flex items-center text-white/40 text-sm font-bold tracking-widest uppercase">
                                    <span>{stories[0].date}</span>
                                    <span className="mx-4">•</span>
                                    <span className="group-hover:text-white transition-colors">{t('home.stories.section.readFullStory') || 'Read Full Story'}</span>
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
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        objectFit="cover"
                                    />
                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black text-gray-900 shadow-sm uppercase tracking-widest">{story.category}</div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">{story.title}</h3>
                                <span className="text-xs text-gray-500 font-black tracking-widest uppercase">{story.date}</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
