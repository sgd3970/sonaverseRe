"use client"

import { useState } from "react"

type NotificationFilter = "all" | "inquiry" | "system" | "success" | "warning"

export default function NotificationsPage() {
    const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all")

    const notifications = [
        {
            id: 1,
            type: "inquiry",
            icon: "mail",
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-400",
            title: "[(주)한국요양] 새로운 제휴 문의가 도착했습니다.",
            date: "2023-12-11 14:20",
            timeAgo: "10분 전",
            isNew: true,
        },
        {
            id: 2,
            type: "system",
            icon: "info",
            iconBg: "bg-admin-primary/10",
            iconColor: "text-admin-primary",
            title: "오늘 오후 11시부터 서버 정기 점검이 예정되어 있습니다.",
            date: "2023-12-11 13:00",
            timeAgo: "1시간 전",
            isNew: true,
        },
        {
            id: 3,
            type: "success",
            icon: "check_circle",
            iconBg: "bg-admin-success/10",
            iconColor: "text-admin-success",
            title: "보도자료 [소나버스 시리즈A 투자유치] 승인이 완료되었습니다.",
            date: "2023-12-11 11:00",
            timeAgo: "3시간 전",
            isNew: true,
        },
        {
            id: 4,
            type: "warning",
            icon: "security",
            iconBg: "bg-yellow-500/10",
            iconColor: "text-yellow-400",
            title: "비밀번호 변경 권장: 보안 등급이 낮습니다.",
            date: "2023-12-10 10:00",
            timeAgo: "1일 전",
            isNew: false,
        },
        {
            id: 5,
            type: "system",
            icon: "campaign",
            iconBg: "bg-admin-primary/10",
            iconColor: "text-admin-primary",
            title: "신규 팝업 [겨울 이벤트]가 노출 시작되었습니다.",
            date: "2023-12-09 09:00",
            timeAgo: "2일 전",
            isNew: false,
        },
        {
            id: 6,
            type: "success",
            icon: "backup",
            iconBg: "bg-admin-success/10",
            iconColor: "text-admin-success",
            title: "사용자 데이터 백업이 성공적으로 완료되었습니다.",
            date: "2023-12-08 23:50",
            timeAgo: "3일 전",
            isNew: false,
        },
        {
            id: 7,
            type: "system",
            icon: "code",
            iconBg: "bg-admin-primary/10",
            iconColor: "text-admin-primary",
            title: "결제 모듈 업데이트 관련 API 변경 사항을 확인하세요.",
            date: "2023-12-07 15:30",
            timeAgo: "4일 전",
            isNew: false,
        },
        {
            id: 8,
            type: "warning",
            icon: "newspaper",
            iconBg: "bg-yellow-500/10",
            iconColor: "text-yellow-400",
            title: "관리자 이수진님이 새로운 언론보도를 등록했습니다.",
            date: "2023-12-06 11:15",
            timeAgo: "5일 전",
            isNew: false,
        },
    ]

    const filteredNotifications = activeFilter === "all"
        ? notifications
        : notifications.filter(n => n.type === activeFilter)

    const getFilterLabel = (type: NotificationFilter) => {
        switch (type) {
            case "all":
                return "전체"
            case "inquiry":
                return "문의"
            case "system":
                return "시스템"
            case "success":
                return "성공"
            case "warning":
                return "경고"
            default:
                return ""
        }
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in max-w-5xl mx-auto pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-admin-text-main text-2xl md:text-3xl font-bold tracking-tight">알림 히스토리</h1>
                        <p className="text-admin-text-secondary mt-1">Sonaverse의 모든 시스템 및 서비스 알림 내역입니다.</p>
                    </div>
                </div>

                <div className="bg-admin-surface border border-admin-border rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-4 bg-admin-bg/30 border-b border-admin-border flex gap-4 overflow-x-auto no-scrollbar">
                        {(["all", "inquiry", "system", "success", "warning"] as NotificationFilter[]).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeFilter === filter
                                        ? "text-white"
                                        : "text-admin-text-secondary hover:text-white"
                                    }`}
                            >
                                {getFilterLabel(filter)}
                            </button>
                        ))}
                    </div>

                    <div className="divide-y divide-admin-border">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-5 md:p-6 flex gap-4 md:gap-6 hover:bg-admin-surface-hover/20 transition-all cursor-pointer group ${notification.isNew ? "bg-admin-primary/5" : ""
                                    }`}
                            >
                                <div className={`size-10 md:size-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${notification.iconBg} ${notification.iconColor}`}>
                                    <span className="material-symbols-outlined select-none text-xl md:text-2xl">{notification.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
                                        <h3 className="text-sm md:text-base font-bold text-admin-text-main group-hover:text-admin-primary transition-colors line-clamp-2">
                                            {notification.title}
                                        </h3>
                                        <span className="text-[10px] md:text-xs text-admin-text-secondary font-mono shrink-0">{notification.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${notification.iconBg} ${notification.iconColor}`}>
                                            {notification.type}
                                        </span>
                                        <span className="text-[10px] md:text-xs text-admin-text-secondary">{notification.timeAgo}</span>
                                        {notification.isNew && (
                                            <span className="size-2 rounded-full bg-admin-primary animate-pulse"></span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
