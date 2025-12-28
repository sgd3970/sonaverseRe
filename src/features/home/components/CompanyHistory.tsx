"use client"

import * as React from "react"
import { useTranslation, useLocale } from "@/lib/i18n"

interface HistoryEvent {
    id: string
    year: number
    title: string
    subtitle: string
    items: string[]
    badgeColor?: string
    textColor?: string
}

export function CompanyHistory() {
    const { t, isLoading: isTranslationLoading } = useTranslation()
    const locale = useLocale()
    const [historyItems, setHistoryItems] = React.useState<HistoryEvent[]>([])
    const [isDataLoading, setIsDataLoading] = React.useState(true)
    const [activeHistoryIndex, setActiveHistoryIndex] = React.useState(0)
    const [isTransitioning, setIsTransitioning] = React.useState(false)
    const [autoPlay, setAutoPlay] = React.useState(true)
    const yearNavRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`/api/history?locale=${locale}`)
                const data = await res.json()
                if (data.success) {
                    // API 응답을 HistoryEvent 형식으로 변환
                    const formattedItems: HistoryEvent[] = data.data.map((item: any) => ({
                        id: item.id,
                        year: item.year,
                        title: item.title,
                        subtitle: item.subtitle || '',
                        items: item.items?.map((it: { text: string; order: number }) => it.text) || [],
                        badgeColor: item.badgeColor || '#0b3877', // hex 코드로 저장됨
                        textColor: item.textColor,
                    }))
                    setHistoryItems(formattedItems)
                    // 초기 인덱스를 마지막에서 두 번째로 설정 (또는 마지막이 있다면 마지막)
                    if (formattedItems.length > 0) {
                        setActiveHistoryIndex(Math.max(0, formattedItems.length - 2))
                    }
                }
            } catch (error) {
                console.error("Failed to fetch history:", error)
            } finally {
                setIsDataLoading(false)
            }
        }
        fetchHistory()
    }, [locale])

    // 부드러운 페이드-크로스 전환 함수
    const handleYearChange = React.useCallback((index: number) => {
        if (index < 0 || index >= historyItems.length) return
        setIsTransitioning(true)
        setTimeout(() => {
            setActiveHistoryIndex(index)
            setIsTransitioning(false)
        }, 400)
    }, [historyItems.length])

    // 사용자가 직접 클릭 시 자동 재생 멈춤
    const handleManualSelect = React.useCallback((index: number) => {
        setAutoPlay(false)
        handleYearChange(index)
    }, [handleYearChange])

    // 자동 재생 시퀀스 (5초 간격)
    React.useEffect(() => {
        let interval: number
        if (autoPlay && historyItems.length > 0) {
            interval = window.setInterval(() => {
                const nextIndex = (activeHistoryIndex + 1) % historyItems.length
                handleYearChange(nextIndex)
            }, 5000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [activeHistoryIndex, autoPlay, historyItems.length, handleYearChange])

    // 모바일/태블릿 가로 스크롤 동기화
    React.useEffect(() => {
        if (yearNavRef.current && historyItems.length > 0) {
            const activeEl = yearNavRef.current.children[activeHistoryIndex] as HTMLElement
            if (activeEl) {
                const scrollLeft = activeEl.offsetLeft - (yearNavRef.current.offsetWidth / 2) + (activeEl.offsetWidth / 2)
                yearNavRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' })
            }
        }
    }, [activeHistoryIndex, historyItems.length])

    if (isTranslationLoading || isDataLoading || historyItems.length === 0) {
        return (
            <section className="py-20 lg:py-28 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-10 bg-gray-200 rounded w-1/4 mb-16 animate-pulse" />
                    <div className="max-w-4xl space-y-12">
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

    const currentEvent = historyItems[activeHistoryIndex]

    return (
        <section id="history" className="py-8 md:py-12 lg:py-16 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                {/* 섹션 헤더 */}
                <div className="mb-6 md:mb-8 lg:mb-10 text-left">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-primary/5 text-primary text-xs font-black tracking-[0.3em] uppercase mb-3 border border-primary/10">
                        {t('home.history.section.badge') || 'Heritage'}
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-tight">
                        {t('home.history.section.title') || '소나버스가 걸어온 성장의 기록'}
                    </h2>
                </div>

                {/* [PC & TABLET] 가로 배열 레이아웃 (md 이상) */}
                <div className="hidden md:flex gap-6 lg:gap-12 xl:gap-20 items-stretch h-[calc(100vh-240px)] min-h-[450px] max-h-[600px]">
                    
                    {/* 좌측: 연도별 버튼 리스트 (5개 기준 높이, 스크롤 가능) */}
                    <div className="w-1/3 flex flex-col gap-1.5 lg:gap-2 overflow-y-auto no-scrollbar min-h-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {historyItems.map((event, index) => (
                            <button
                                key={event.id}
                                onClick={() => handleManualSelect(index)}
                                className={`group relative flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-2 lg:py-3 rounded-[1.5rem] lg:rounded-[2rem] border transition-all duration-500 text-left shrink-0 ${
                                    activeHistoryIndex === index ? 'border-transparent bg-gray-50 shadow-inner' : 'border-gray-50 bg-white hover:bg-gray-50/50'
                                }`}
                            >
                                {/* 플로팅 캡슐 인디케이터: 버튼 내부에 떠 있는 유기적인 막대 */}
                                <div className={`absolute left-2.5 lg:left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 lg:h-8 rounded-full transition-all duration-700 ${
                                    activeHistoryIndex === index ? 'opacity-100 scale-y-100 shadow-md' : 'opacity-0 scale-y-50'
                                }`}
                                style={{ backgroundColor: event.badgeColor || '#0b3877' }}
                                ></div>

                                <div className={`flex flex-col transition-all duration-500 ${activeHistoryIndex === index ? 'translate-x-1.5 lg:translate-x-2' : 'translate-x-0'}`}>
                                    <span className={`text-2xl lg:text-3xl font-black tracking-tighter transition-colors leading-tight ${
                                        activeHistoryIndex === index ? 'text-gray-900' : 'text-gray-500'
                                    }`}>
                                        {event.year}
                                    </span>
                                    <div className={`text-xs lg:text-sm font-bold mt-0 leading-tight ${activeHistoryIndex === index ? 'text-gray-800' : 'text-gray-500'}`}>
                                        {event.title}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* 우측: 상세 내용 카드 (페이드 전환) */}
                    <div className={`flex-1 bg-gray-50 rounded-[3rem] lg:rounded-[4rem] p-6 lg:p-10 xl:p-12 relative overflow-hidden flex flex-col justify-center border border-gray-100 shadow-xl transition-all duration-500 ${
                        isTransitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
                    }`}>
                        <div className="space-y-4 lg:space-y-6">
                            <div className="w-20 lg:w-24 h-2 lg:h-2.5 rounded-full opacity-80" style={{ backgroundColor: currentEvent.badgeColor || '#0b3877' }}></div>
                            <h3 className="text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 leading-tight">{currentEvent.title}</h3>
                            <p className="text-base lg:text-lg xl:text-xl text-gray-500 font-light max-w-xl leading-relaxed">{currentEvent.subtitle}</p>
                            
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 lg:gap-x-10 gap-y-3 lg:gap-y-4 pt-1 lg:pt-2">
                                {currentEvent.items?.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 lg:gap-4">
                                        <span className="material-symbols-outlined text-xl lg:text-2xl shrink-0" style={{ color: currentEvent.badgeColor || '#0b3877' }}>
                                            verified
                                        </span>
                                        <span className="text-base lg:text-lg font-bold text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* [MOBILE] 세로 스택 레이아웃 (md 미만) */}
                <div className="md:hidden space-y-4 h-[calc(100vh-180px)] flex flex-col min-h-0">
                    
                    {/* 4자리 년도 가로 스크롤 리본 (5개 기준 가로 길이, 고정) */}
                    <div ref={yearNavRef} className="relative flex items-center overflow-hidden py-3 shrink-0">
                        <div className="absolute left-0 right-0 h-[1px] bg-gray-100 top-1/2 -z-10"></div>
                        <div className="flex items-center w-full" style={{ gap: 'calc(1rem * 0.75)' }}>
                            {historyItems.map((event, index) => (
                                <button key={event.id} onClick={() => handleManualSelect(index)} className="flex flex-col items-center gap-2 shrink-0 flex-1">
                                    <div className={`h-1.5 transition-all duration-500 rounded-full ${
                                        activeHistoryIndex === index ? 'w-12 scale-110 shadow-md ring-[6px] ring-white' : 'bg-gray-200 w-3'
                                    }`}
                                    style={activeHistoryIndex === index ? { backgroundColor: event.badgeColor || '#0b3877' } : {}}
                                    ></div>
                                    <span className={`text-[12px] font-black tracking-tighter ${activeHistoryIndex === index ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {event.year}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 모바일 상세 카드 (페이드 + 스케일 전환) */}
                    <div className={`bg-white rounded-[2rem] border border-gray-100 shadow-2xl overflow-hidden transform transition-all duration-500 flex-1 flex flex-col min-h-0 ${
                        isTransitioning ? 'opacity-0 scale-[0.97] blur-sm' : 'opacity-100 scale-100 blur-0'
                    }`}>
                        <div className="h-2 w-full shrink-0" style={{ backgroundColor: currentEvent.badgeColor || '#0b3877' }}></div>
                        <div className="p-5 flex flex-col gap-3 flex-1 min-h-0 overflow-hidden">
                            <div className="space-y-2 shrink-0">
                                <h3 className="text-xl font-black text-gray-900 leading-tight">{currentEvent.title}</h3>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{currentEvent.subtitle}</p>
                            </div>

                            {/* 성과 리스트 (순차적 등장 효과) */}
                            <div className="space-y-2 pt-3 border-t border-gray-50 flex-1 min-h-0 overflow-y-auto">
                                {currentEvent.items?.map((item, i) => (
                                    <div key={i} className={`flex items-start gap-2.5 transition-all duration-500 shrink-0 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
                                         style={{ transitionDelay: `${i * 100}ms` }}>
                                        <span className="material-symbols-outlined text-sm mt-0.5 shrink-0" style={{ color: currentEvent.badgeColor || '#0b3877' }}>
                                            task_alt
                                        </span>
                                        <span className="text-[12px] font-bold text-gray-700 leading-snug">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
