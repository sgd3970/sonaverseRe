"use client"

import { useState } from "react"
import Link from "next/link"
import { useStories } from "@/lib/hooks"
import { useTranslation, useLocale } from "@/lib/i18n"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"
import { Story } from "@/lib/hooks/useStories"

// 카테고리 정의
const categories = [
    { key: 'all', labelKo: '전체', labelEn: 'All' },
    { key: '제품스토리', labelKo: '제품스토리', labelEn: 'Product Story' },
    { key: '사용법', labelKo: '사용법', labelEn: 'How to Use' },
    { key: '건강정보', labelKo: '건강정보', labelEn: 'Health Info' },
    { key: '복지정보', labelKo: '복지정보', labelEn: 'Welfare Info' },
]

interface StoriesClientProps {
    initialStories?: Story[]
}

export function StoriesClient({ initialStories = [] }: StoriesClientProps) {
    const { t, isLoading: isI18nLoading } = useTranslation()
    const locale = useLocale()
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [displayLimit, setDisplayLimit] = useState(6)

    const { stories, isLoading, isError } = useStories({
        page: currentPage,
        limit: 50,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
    })

    // Use initial data if loading and available (simple hydration strategy)
    // Note: Ideally useSWR fallback would be better, but for now this prevents flash
    const displayStories = (isLoading && initialStories.length > 0) ? initialStories : stories

    // Featured 스토리 (첫 번째 또는 isMain인 스토리)
    const featuredStory = displayStories.find(s => s.isMain) || displayStories[0]
    const regularStories = displayStories.filter(s => s.id !== featuredStory?.id).slice(0, displayLimit)

    // 날짜 포맷
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).replace(/\. /g, '. ')
    }

    // 카테고리 변경 핸들러
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        setDisplayLimit(6)
    }

    // 더 보기 핸들러
    const handleLoadMore = () => {
        setDisplayLimit(prev => prev + 6)
    }

    if (isI18nLoading) {
        return (
            <div className="bg-white min-h-screen pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="animate-pulse space-y-8">
                        <div className="h-12 bg-gray-200 rounded w-1/3" />
                        <div className="h-6 bg-gray-100 rounded w-1/2" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* 헤더 */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-primary mb-4">
                        {locale === "en" ? "Sonaverse Story" : "소나버스 스토리"}
                    </h1>
                    <p className="text-xl text-gray-600">
                        {locale === "en" ? (
                            <>Product development stories and useful <span className="text-accent font-bold underline decoration-2 decoration-accent/30 underline-offset-4">welfare/health information</span>!</>
                        ) : (
                            <>제품 개발 이야기부터 유용한 <span className="text-accent font-bold underline decoration-2 decoration-accent/30 underline-offset-4">복지/건강 정보</span>까지!</>
                        )}
                    </p>
                </div>

                {/* 카테고리 필터 */}
                <div className="overflow-x-auto pb-4 mb-8 no-scrollbar">
                    <div className="flex min-w-max gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => handleCategoryChange(cat.key)}
                                className={`h-12 rounded-full px-6 text-lg font-bold transition-colors ${selectedCategory === cat.key
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "bg-white border-2 border-gray-100 text-gray-500 hover:border-accent hover:text-primary hover:bg-accent-light"
                                    }`}
                            >
                                {locale === "en" ? cat.labelEn : cat.labelKo}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 로딩 상태 */}
                {isLoading && initialStories.length === 0 && (
                    <div>
                        <div className="mb-12 rounded-3xl overflow-hidden bg-white shadow-lg border border-gray-100 flex flex-col md:flex-row animate-pulse">
                            <div className="md:w-[60%] aspect-video bg-gray-200" />
                            <div className="md:w-[40%] p-8 md:p-12 flex flex-col justify-center">
                                <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
                                <div className="h-10 bg-gray-100 rounded w-3/4 mb-4" />
                                <div className="h-6 bg-gray-100 rounded w-full mb-6" />
                                <div className="h-4 bg-gray-100 rounded w-32" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col animate-pulse">
                                    <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-4" />
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-gray-100 rounded w-full mb-3" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 에러 상태 */}
                {isError && (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">error</span>
                        <p className="text-gray-600">{t('common.common.error')}</p>
                    </div>
                )}

                {/* 스토리 목록 */}
                {(!isLoading || initialStories.length > 0) && !isError && (
                    <>
                        {displayStories.length === 0 ? (
                            <div className="text-center py-20">
                                <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">article</span>
                                <p className="text-gray-500">
                                    {locale === "en" ? "No stories yet" : "스토리가 없습니다"}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Featured 스토리 */}
                                {featuredStory && (
                                    <Link
                                        href={`/stories/${featuredStory.slug}`}
                                        className="mb-12 rounded-3xl overflow-hidden bg-white shadow-lg border border-gray-100 flex flex-col md:flex-row group cursor-pointer hover:shadow-xl transition-shadow"
                                    >
                                        <div className="md:w-[60%] aspect-video relative overflow-hidden">
                                            {featuredStory.thumbnailUrl ? (
                                                <OptimizedImage
                                                    src={featuredStory.thumbnailUrl}
                                                    alt={featuredStory.title}
                                                    fill
                                                    className="transition-transform duration-700 group-hover:scale-105"
                                                    objectFit="cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-gray-400 text-6xl">article</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden" />
                                        </div>
                                        <div className="md:w-[40%] p-8 md:p-12 flex flex-col justify-center">
                                            <span className="text-accent font-bold mb-4 block">FEATURED</span>
                                            <h3 className="text-3xl font-black text-primary mb-4 leading-tight line-clamp-3">
                                                {featuredStory.title}
                                            </h3>
                                            <p className="text-gray-500 text-lg mb-6 line-clamp-3">
                                                {featuredStory.excerpt}
                                            </p>
                                            <span className="text-gray-400 font-medium">
                                                {formatDate(featuredStory.publishedAt)}
                                            </span>
                                        </div>
                                    </Link>
                                )}

                                {/* 일반 스토리 그리드 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {regularStories.map((story) => (
                                        <Link
                                            key={story.id}
                                            href={`/stories/${story.slug}`}
                                            className="group cursor-pointer flex flex-col"
                                        >
                                            <div className="relative overflow-hidden rounded-2xl mb-4 shadow-sm aspect-[4/3]">
                                                {story.thumbnailUrl ? (
                                                    <OptimizedImage
                                                        src={story.thumbnailUrl}
                                                        alt={story.title}
                                                        fill
                                                        className="transition-transform duration-500 group-hover:scale-105"
                                                        objectFit="cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-gray-400 text-5xl">article</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                                                    {story.category}
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                {story.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                                                {story.excerpt}
                                            </p>
                                            <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
                                                <span>{formatDate(story.publishedAt)}</span>
                                                <span className="group-hover:translate-x-1 transition-transform text-primary font-bold">
                                                    Read more
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* 더 보기 버튼 */}
                                {regularStories.length < displayStories.length - 1 && (
                                    <div className="mt-16 text-center">
                                        <button
                                            onClick={handleLoadMore}
                                            className="h-14 px-12 rounded-full border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                                        >
                                            {locale === "en" ? "Load More" : "더 보기"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
