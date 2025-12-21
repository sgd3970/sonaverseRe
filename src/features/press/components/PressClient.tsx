"use client"

import { useState } from "react"
import Link from "next/link"
import { usePress } from "@/lib/hooks"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"
import { useTranslation, useLocale } from "@/lib/i18n"
import { PressItem } from "@/lib/hooks/usePress"

interface PressClientProps {
    initialPressItems?: PressItem[]
}

export function PressClient({ initialPressItems = [] }: PressClientProps) {
    const { t, isLoading: isI18nLoading } = useTranslation()
    const locale = useLocale()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")

    const { pressItems, pagination, isLoading, isError } = usePress({
        page: currentPage,
        limit: 8,
    })

    const displayItems = (isLoading && initialPressItems.length > 0) ? initialPressItems : pressItems

    // 검색 필터링
    const filteredItems = displayItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pressName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // 날짜 포맷
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).replace(/\. /g, '. ')
    }

    // 페이지네이션 핸들러
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
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
                        {locale === "en" ? "Press Coverage" : "언론보도"}
                    </h1>
                    <p className="text-xl text-gray-600">
                        {locale === "en"
                            ? "Latest news and press releases about Sonaverse."
                            : "소나버스의 새로운 소식과 언론에 비친 우리의 모습을 전해드립니다."}
                    </p>
                </div>

                {/* 검색바 */}
                <div className="relative w-full max-w-2xl mb-12">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined select-none text-gray-400">search</span>
                    </div>
                    <input
                        type="text"
                        placeholder={locale === "en" ? "Search for companies, press, or news" : "기사 제목 또는 언론사를 검색하세요"}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white shadow-sm ring-1 ring-gray-200 text-lg focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                    />
                </div>

                {/* 로딩 상태 */}
                {isLoading && initialPressItems.length === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-white border border-gray-100 animate-pulse">
                                <div className="w-full md:w-48 aspect-video md:aspect-square rounded-xl bg-gray-200 flex-shrink-0" />
                                <div className="flex flex-col justify-center flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                                    <div className="h-6 bg-gray-100 rounded w-3/4 mb-3" />
                                    <div className="h-4 bg-gray-100 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 에러 상태 */}
                {isError && (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">error</span>
                        <p className="text-gray-600">{t('common.common.error')}</p>
                    </div>
                )}

                {/* 언론보도 그리드 */}
                {(!isLoading || initialPressItems.length > 0) && !isError && (
                    <>
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-20">
                                <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">newspaper</span>
                                <p className="text-gray-500">
                                    {searchQuery ? (locale === "en" ? "No results found" : "검색 결과가 없습니다") : (locale === "en" ? "No press coverage yet" : "언론보도가 없습니다")}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/press/${item.slug}`}
                                        className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                                    >
                                        {/* 이미지 */}
                                        <div className="w-full md:w-48 aspect-video md:aspect-square rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            {item.thumbnailUrl ? (
                                                <OptimizedImage
                                                    src={item.thumbnailUrl}
                                                    alt={item.title}
                                                    title={item.title}
                                                    fill
                                                    className="transition-transform duration-500 group-hover:scale-105"
                                                    objectFit="cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-gray-300 text-5xl">newspaper</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* 내용 */}
                                        <div className="flex flex-col justify-center flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm font-bold text-accent">
                                                    {item.pressName}
                                                </span>
                                                <span className="text-gray-300">|</span>
                                                <span className="text-sm text-gray-400">
                                                    {formatDate(item.publishedAt)}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                                {item.excerpt}
                                            </p>
                                            <div className="mt-auto flex items-center text-sm font-bold text-gray-400 group-hover:text-primary transition-colors">
                                                {locale === "en" ? "Read more" : "자세히 보기"}
                                                <span className="material-symbols-outlined select-none ml-1 text-base">
                                                    arrow_forward
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* 페이지네이션 */}
                        {pagination && pagination.totalPages > 1 && !searchQuery && (
                            <div className="mt-16 flex justify-center gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Previous page"
                                >
                                    <span className="material-symbols-outlined select-none">chevron_left</span>
                                </button>

                                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                                    let pageNum: number
                                    if (pagination.totalPages <= 5) {
                                        pageNum = i + 1
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1
                                    } else if (currentPage >= pagination.totalPages - 2) {
                                        pageNum = pagination.totalPages - 4 + i
                                    } else {
                                        pageNum = currentPage - 2 + i
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${pageNum === currentPage
                                                ? "bg-primary text-white"
                                                : "border border-gray-200 hover:bg-gray-50 text-gray-500"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                })}

                                <button
                                    disabled={currentPage === pagination.totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Next page"
                                >
                                    <span className="material-symbols-outlined select-none">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
