"use client"

import { useState } from "react"
import useSWR from "swr"
import dynamic from 'next/dynamic'
import { AnalyticsStatsCards } from "@/features/admin/analytics/components/AnalyticsStatsCards"
// import { AnalyticsCharts } from "@/features/admin/analytics/components/AnalyticsCharts"
import { AnalyticsKeywords } from "@/features/admin/analytics/components/AnalyticsKeywords"
import { AnalyticsPopularPages } from "@/features/admin/analytics/components/AnalyticsPopularPages"
import { AnalyticsDetailStats } from "@/features/admin/analytics/components/AnalyticsDetailStats"

const AnalyticsCharts = dynamic(() => import('@/features/admin/analytics/components/AnalyticsCharts').then(mod => mod.AnalyticsCharts), {
    loading: () => <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />,
    ssr: false
})

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminAnalyticsPage() {
    const [period, setPeriod] = useState("monthly")
    const { data, error } = useSWR('/api/admin/dashboard/stats', fetcher)

    const isLoading = !data && !error
    const statsData = data?.data?.counts

    const totalViews = statsData?.totalViews || 0
    const inquiries = statsData?.inquiries || 0
    const conversionRate = totalViews > 0 ? ((inquiries / totalViews) * 100).toFixed(2) : "0"

    const stats = [
        { icon: "visibility", title: "전체 조회수 (Views)", value: totalViews.toLocaleString(), change: "-", trend: "up" },
        { icon: "timer", title: "평균 체류시간", value: "-", change: "-", trend: "up" },
        { icon: "ads_click", title: "문의 전환율", value: `${conversionRate}%`, change: "-", trend: "down" },
        { icon: "exit_to_app", title: "이탈률", value: "-", change: "-", trend: "up" },
        { icon: "person_add", title: "총 문의 수", value: inquiries.toLocaleString(), change: "-", trend: "up" },
        { icon: "description", title: "페이지뷰 (PV)", value: totalViews.toLocaleString(), change: "-", trend: "up" },
        { icon: "sensors", title: "활성 세션", value: "-", change: "-", trend: "up" },
        { icon: "person", title: "순방문자 (UV)", value: "-", change: "-", trend: "up" }
    ]

    if (isLoading) {
        return (
            <div className="flex-1 p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary"></div>
            </div>
        )
    }
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in space-y-8 pb-10">
                {/* 헤더 */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-admin-text-main text-2xl md:text-3xl font-bold tracking-tight">통계 및 분석 리포트</h1>
                        <p className="text-admin-text-secondary mt-1">실시간 데이터 기반 비즈니스 인사이트</p>
                    </div>
                    <div className="flex p-1 bg-admin-surface border border-admin-border rounded-xl overflow-x-auto no-scrollbar">
                        {["일간", "주간", "월간", "연간", "커스텀"].map((label, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPeriod(label)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${label === "월간" ? "bg-admin-primary text-white shadow-lg" : "text-admin-text-secondary hover:text-white"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 통계 카드 그리드 */}
                <AnalyticsStatsCards stats={stats} />

                {/* 차트 및 퍼널 */}
                <AnalyticsCharts />

                {/* 유입 키워드 & 인기 페이지 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AnalyticsKeywords />
                    <AnalyticsPopularPages />
                </div>

                {/* 세부 통계 */}
                <AnalyticsDetailStats />
            </div>
        </div>
    )
}
