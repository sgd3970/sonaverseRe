"use client"

import { useRouter } from "next/navigation"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminDashboardPage() {
    const router = useRouter()
    const { data, error } = useSWR('/api/admin/dashboard/stats', fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 30000, // 30초 캐싱
    })

    const isLoading = !data && !error
    const statsData = data?.data?.counts
    const activitiesData = data?.data?.activities || []

    const stats = [
        {
            title: "Total Users (Admin)",
            value: statsData?.users?.toLocaleString() || "-",
            icon: "group",
            trend: "-"
        },
        {
            title: "Total Stories",
            value: statsData?.stories?.toLocaleString() || "-",
            icon: "article",
            trend: "-"
        },
        {
            title: "Inquiries",
            value: statsData?.inquiries?.toLocaleString() || "-",
            icon: "mail",
            trend: "-"
        },
        {
            title: "Press Coverage",
            value: statsData?.press?.toLocaleString() || "-",
            icon: "newspaper",
            trend: "-"
        }
    ]

    const quickActions = [
        {
            title: "보도자료 등록",
            description: "새로운 기사 업로드",
            icon: "add",
            iconBg: "bg-admin-primary/10",
            iconColor: "text-admin-primary",
            iconHoverBg: "group-hover:bg-admin-primary",
            onClick: () => router.push('/admin/press/new')
        },
        {
            title: "스토리 등록",
            description: "새로운 스토리 작성",
            icon: "edit_note",
            iconBg: "bg-purple-500/10",
            iconColor: "text-purple-400",
            iconHoverBg: "group-hover:bg-purple-500",
            onClick: () => router.push('/admin/stories/new')
        },
        {
            title: "문의 내역 확인",
            description: "미확인 문의 관리",
            icon: "mail",
            iconBg: "bg-orange-500/10",
            iconColor: "text-orange-400",
            iconHoverBg: "group-hover:bg-orange-500",
            onClick: () => router.push('/admin/inquiries')
        }
    ]

    return (
        <div className="flex-1 overflow-y-auto p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in">
                {/* 페이지 제목 */}
                <h1 className="text-2xl font-bold text-admin-text-main mb-6">대시보드 개요</h1>

                {/* 통계 카드 그리드 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-xl bg-admin-surface border border-admin-border hover:border-admin-primary/50 transition-colors shadow-lg shadow-black/20"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-admin-bg rounded-lg text-admin-primary">
                                    <span className="material-symbols-outlined select-none text-2xl">
                                        {stat.icon}
                                    </span>
                                </div>
                                {/* Trend removed for now as we don't have historical data comparison yet */}
                                {/* <span className="bg-admin-success/10 text-admin-success text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                    <span className="material-symbols-outlined select-none text-sm">trending_up</span>
                                    {stat.trend}
                                </span> */}
                            </div>
                            <p className="text-admin-text-secondary text-sm font-medium mb-1">{stat.title}</p>
                            <p className="text-admin-text-main text-3xl font-bold">
                                {isLoading ? (
                                    <span className="animate-pulse bg-gray-700 h-8 w-24 block rounded"></span>
                                ) : (
                                    stat.value
                                )}
                            </p>
                        </div>
                    ))}
                </div>

                {/* 하단 그리드 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 최근 활동 */}
                    <div className="lg:col-span-2 bg-admin-surface rounded-xl border border-admin-border p-6 shadow-lg shadow-black/20">
                        <h3 className="text-admin-text-main text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined select-none text-admin-primary">history</span>
                            최근 활동
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-admin-border text-left">
                                        <th className="pb-3 text-xs font-semibold text-admin-text-secondary uppercase">유형</th>
                                        <th className="pb-3 text-xs font-semibold text-admin-text-secondary uppercase">내용</th>
                                        <th className="pb-3 text-xs font-semibold text-admin-text-secondary uppercase">일시</th>
                                        <th className="pb-3 text-xs font-semibold text-admin-text-secondary uppercase">상태</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-admin-border">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4} className="py-4 text-center text-admin-text-secondary">
                                                데이터를 불러오는 중...
                                            </td>
                                        </tr>
                                    ) : activitiesData.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-4 text-center text-admin-text-secondary">
                                                최근 활동이 없습니다.
                                            </td>
                                        </tr>
                                    ) : (
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        activitiesData.map((activity: any, index: number) => (
                                            <tr key={index} className="group">
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${activity.type === 'Inquiry' ? 'bg-purple-500/10 text-purple-400' :
                                                            activity.type === 'Press' ? 'bg-blue-500/10 text-blue-400' :
                                                                'bg-orange-500/10 text-orange-400'
                                                        }`}>
                                                        {activity.type}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-admin-text-main text-sm font-medium">
                                                    {activity.content}
                                                </td>
                                                <td className="py-4 text-admin-text-secondary text-sm">
                                                    {new Date(activity.time).toLocaleDateString()}
                                                </td>
                                                <td className="py-4">
                                                    <span className="flex items-center gap-1 text-xs text-admin-text-secondary">
                                                        <span className={`w-2 h-2 rounded-full ${activity.status === '게시됨' || activity.status === '완료' ? 'bg-green-500' :
                                                                activity.status === '대기중' ? 'bg-yellow-500' :
                                                                    'bg-gray-500'
                                                            }`}></span>
                                                        {activity.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 빠른 실행 */}
                    <div className="bg-admin-surface rounded-xl border border-admin-border p-6 shadow-lg shadow-black/20">
                        <h3 className="text-admin-text-main text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined select-none text-yellow-400">bolt</span>
                            빠른 실행
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={action.onClick}
                                    className="p-4 rounded-xl bg-admin-bg border border-admin-border hover:border-admin-primary hover:bg-admin-surface-hover transition-all text-left flex items-center gap-4 group"
                                >
                                    <div className={`w-10 h-10 rounded-lg ${action.iconBg} flex items-center justify-center ${action.iconColor} ${action.iconHoverBg} group-hover:text-white transition-colors`}>
                                        <span className="material-symbols-outlined select-none">
                                            {action.icon}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-admin-text-main font-bold text-sm">
                                            {action.title}
                                        </span>
                                        <span className="text-admin-text-secondary text-xs">
                                            {action.description}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
