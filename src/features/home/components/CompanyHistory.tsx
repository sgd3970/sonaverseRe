"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTranslation, useLocale } from "@/lib/i18n"

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

export function CompanyHistory() {
    const { t, isLoading: isTranslationLoading } = useTranslation()
    const locale = useLocale()
    const [historyItems, setHistoryItems] = React.useState<any[]>([])
    const [isDataLoading, setIsDataLoading] = React.useState(true)
    const [isExpanded, setIsExpanded] = React.useState(false)

    React.useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`/api/history?locale=${locale}`)
                const data = await res.json()
                if (data.success) {
                    setHistoryItems(data.data)
                }
            } catch (error) {
                console.error("Failed to fetch history:", error)
            } finally {
                setIsDataLoading(false)
            }
        }
        fetchHistory()
    }, [locale])

    // Sort items by year ascending (2022 -> 2026 -> 9999)
    const sortedItems = React.useMemo(() => {
        return [...historyItems].sort((a, b) => a.year - b.year)
    }, [historyItems])

    const visionItem = sortedItems.find(item => item.year === 9999) || {
        year: 9999,
        title: t('home.history.vision.title') || "계속되는 여정",
        subtitle: t('home.history.vision.subtitle') || "시니어 라이프 혁신을 위한 소나버스의 도전은 계속됩니다."
    }
    const timelineItems = sortedItems.filter(item => item.year !== 9999)

    // Show first 3 items or all if expanded
    const visibleTimelineItems = isExpanded ? timelineItems : timelineItems.slice(0, 3)

    if (isTranslationLoading || isDataLoading) {
        return (
            <section className="py-20 lg:py-28 bg-white">
                <div className="container-custom">
                    <div className="h-10 bg-gray-200 rounded w-1/4 mx-auto mb-16 animate-pulse" />
                    <div className="max-w-4xl mx-auto space-y-12">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col md:flex-row items-center gap-8 animate-pulse">
                                <div className="w-full md:w-1/2 h-8 bg-gray-200 rounded" />
                                <div className="w-full md:w-1/2 space-y-2">
                                    <div className="h-6 bg-gray-200 rounded w-2/3" />
                                    <div className="h-4 bg-gray-100 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 md:py-24 bg-[#fdfcfb] border-y border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none text-[20vw] font-black text-gray-800 flex items-center justify-center whitespace-nowrap">HISTORY HISTORY HISTORY</div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-12 md:mb-16 text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-gray-100 text-gray-600 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase mb-6 border border-gray-200/50">{t('home.history.section.badge') || 'Heritage'}</span>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6 leading-[1.15]">{t('home.history.section.title') || '소나버스가 걸어온 신뢰의 발자취'}</h2>
                </div>

                <div className="relative mt-24">
                    <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5"></div>

                    <div className="space-y-24 md:space-y-40">
                        {visibleTimelineItems.map((event, index) => (
                            <div key={event.id} className={cn(
                                "flex flex-col md:flex-row items-start md:items-center justify-between gap-12 relative pl-10 md:pl-0",
                                index % 2 === 0 ? 'md:flex-row-reverse' : ''
                            )}>
                                <div className={cn(
                                    "w-full md:w-[42%]",
                                    index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                                )}>
                                    <span className="text-6xl md:text-8xl font-black text-gray-100 mb-6 block tabular-nums tracking-tighter transition-colors hover:text-primary/10">{event.year}</span>
                                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">{event.title}</h3>
                                    <p className="text-gray-500 leading-relaxed font-light text-lg">{event.subtitle}</p>
                                </div>

                                <div className="absolute left-[-6px] md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full ring-8 ring-white shadow-xl z-10 top-2 md:top-1/2 md:-mt-2"></div>

                                <div className="w-full md:w-[42%] hidden md:block"></div>
                            </div>
                        ))}
                    </div>

                    {/* Vision Item (Year 9999) - Only visible when expanded */}
                    {isExpanded && visionItem && (
                        <div className="relative mt-24 mb-32">
                            <div className="relative max-w-3xl mx-auto text-center px-6">
                                {/* Infinity Bubble */}
                                <div className="absolute left-1/2 -top-12 transform -translate-x-1/2 z-20">
                                    <div className="w-24 h-24 rounded-full bg-[#5D5C61] border-[6px] border-white flex items-center justify-center shadow-xl">
                                        <span className="text-4xl text-white font-bold pb-1">∞</span>
                                    </div>
                                </div>

                                {/* Card */}
                                <div className="bg-gradient-to-br from-[#B1A296] to-[#8E7F70] rounded-[3rem] p-12 pt-20 shadow-2xl text-white relative z-10 overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                                    {/* Decorative Circles */}
                                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

                                    <h3 className="text-3xl md:text-4xl font-bold mb-6 relative z-10 tracking-tight">{visionItem.title}</h3>
                                    <p className="text-lg md:text-xl text-white/90 font-medium relative z-10 leading-relaxed max-w-2xl mx-auto">{visionItem.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Toggle Button - Placed at the bottom */}
                    {timelineItems.length > 3 && (
                        <div className="text-center mb-32 relative z-20">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <span className="text-lg">{isExpanded ? t('home.history.buttons.collapse') || '접기' : t('home.history.buttons.expand') || '전체 연혁 보기'}</span>
                                <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
