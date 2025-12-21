"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

// Common Section Title Component for consistency
const SectionHeader = ({ badge, title, subtitle, align = 'center' }: { badge: string, title: React.ReactNode, subtitle?: string, align?: 'left' | 'center' }) => (
    <div className={cn("mb-16 md:mb-20", align === 'center' ? 'text-center' : 'text-left')}>
        <span className="inline-block py-1 px-3 rounded-full bg-gray-100 text-gray-500 text-xs font-bold tracking-widest uppercase mb-4 border border-gray-200">
            {badge}
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-tight">
            {title}
        </h2>
        {subtitle && (
            <p className={cn("text-lg text-gray-500 max-w-2xl leading-relaxed", align === 'center' ? 'mx-auto' : '')}>
                {subtitle}
            </p>
        )}
    </div>
)

export function ProblemSection() {
    const { t, isLoading } = useTranslation()

    // 문제 항목들 - i18n 키 매핑
    const problemKeys = ['aging', 'mobility', 'dignity'] as const

    if (isLoading) {
        return (
            <section className="py-20 lg:py-28 bg-white">
                <div className="container-custom">
                    <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-16 animate-pulse" />
                    <div className="flex flex-col gap-12">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col lg:flex-row items-center gap-8">
                                <div className="w-full lg:w-1/2 aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse" />
                                <div className="w-full lg:w-1/2 space-y-4">
                                    <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse" />
                                    <div className="h-20 bg-gray-100 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    const problems = problemKeys.map((key, index) => ({
        id: index + 1,
        title: t(`home.problems.items.${key}.title`),
        description: t(`home.problems.items.${key}.description`),
        image: index === 0 ? "bg-gray-200" : index === 1 ? "bg-gray-300" : "bg-gray-400",
    }))

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12 md:mb-16 text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-gray-100 text-gray-600 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase mb-6 border border-gray-200/50">Our Mission</span>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6 leading-[1.15]">우리가 해결하고자 하는 <br />새로운 <span className="text-primary italic font-serif">표준</span></h2>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed font-light mx-auto">단순한 도구를 넘어 시니어의 삶에 자부심을 더하는 프리미엄 솔루션을 제공합니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: 'warning', title: '안전성 문제', description: '단순 보조기를 넘어 능동적인 제어로 낙상 위험을 획기적으로 줄입니다.', color: 'bg-red-500' },
                        { icon: 'accessibility_new', title: '인체공학 설계', description: '사용자의 신체 구조를 고려한 설계로 장시간 사용에도 편안함을 제공합니다.', color: 'bg-blue-500' },
                        { icon: 'psychology_alt', title: '심리적 만족감', description: '시니어의 자존감을 높여주는 세련된 디자인과 사용자 경험을 제공합니다.', color: 'bg-orange-500' },
                        { icon: 'wifi_off', title: '기술 사각지대', description: '디지털 소외 계층도 쉽게 사용할 수 있는 직관적인 인터페이스를 연구합니다.', color: 'bg-purple-500' },
                    ].map((card, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-[2.5rem] bg-gray-50 p-10 transition-all duration-500 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-3">
                            <div className={cn("mb-8 flex size-16 items-center justify-center rounded-2xl", card.color, "bg-opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:bg-opacity-100 group-hover:text-white")}>
                                <span className={cn("material-symbols-outlined select-none text-3xl", card.color.replace('bg-', 'text-'), "group-hover:text-white")}>{card.icon}</span>
                            </div>
                            <h3 className="mb-4 text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">{card.title}</h3>
                            <p className="text-gray-500 leading-relaxed font-light">{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
