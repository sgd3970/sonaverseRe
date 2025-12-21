"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/features/admin/components/AdminSidebar"
import { useAdminAuth } from "@/lib/hooks/useAdmin"

// This layout is for the Dashboard part of Admin (excluding login)
export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, isAuthenticated, isLoading } = useAdminAuth()
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    // 현재 페이지 이름 가져오기
    const getPageTitle = () => {
        const path = pathname.split('/').pop() || 'dashboard'
        return path === 'admin' ? 'dashboard' : path
    }

    // 인증 체크
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/admin/login')
        }
    }, [isLoading, isAuthenticated, router])

    // 경로 변경 시 모바일 사이드바 닫기
    useEffect(() => {
        setIsMobileSidebarOpen(false)
    }, [pathname])

    // 로딩 중
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">로딩 중...</p>
                </div>
            </div>
        )
    }

    // 인증되지 않은 경우
    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-admin-bg">
            {/* 모바일 사이드바 토글 버튼 */}
            <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="fixed left-0 top-1/2 -translate-y-1/2 z-40 md:hidden w-1 h-16 bg-admin-primary hover:w-2 transition-all duration-200"
                aria-label="Open sidebar"
            />

            {/* AdminSidebar with mobile props */}
            <AdminSidebar
                isMobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
            />

            <main className="md:pl-64 min-h-screen transition-all flex flex-col">
                {/* Header Area */}
                <header className="h-16 border-b border-admin-border flex items-center justify-between px-4 md:px-8 bg-admin-bg/80 backdrop-blur z-20 sticky top-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-admin-text-main capitalize hidden md:block">
                            {getPageTitle()}
                        </h2>
                        <h2 className="text-base font-bold text-admin-text-main capitalize md:hidden">
                            {getPageTitle()}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="size-10 rounded-lg transition-all duration-200 relative flex items-center justify-center bg-admin-primary text-white"
                            >
                                <span className="material-symbols-outlined select-none">notifications</span>
                                <span className="absolute top-1.5 right-1.5 size-2.5 bg-admin-danger rounded-full ring-2 ring-admin-bg animate-pulse"></span>
                            </button>

                            {isNotificationOpen && (
                                <div className="fixed right-2 md:absolute md:right-0 top-[calc(100%+8px)] w-[calc(100vw-1rem)] md:w-96 max-w-md bg-admin-surface border border-admin-border rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-fade-in-up origin-top-right">
                                    <div className="p-5 border-b border-admin-border flex justify-between items-center bg-admin-bg/50">
                                        <div>
                                            <h3 className="font-black text-admin-text-main">알림 센터</h3>
                                            <p className="text-[10px] text-admin-text-secondary uppercase tracking-widest mt-0.5">3개의 새로운 소식</p>
                                        </div>
                                        <button className="text-xs text-admin-primary font-bold hover:text-white transition-colors">모두 읽음 처리</button>
                                    </div>
                                    <div className="max-h-[420px] overflow-y-auto admin-scroll">
                                        <div className="p-5 border-b border-admin-border hover:bg-admin-surface-hover/30 cursor-pointer transition-all flex gap-4 relative group bg-admin-primary/5">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-admin-primary"></div>
                                            <div className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-400">
                                                <span className="material-symbols-outlined select-none text-xl">mail</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-admin-text-main font-bold mb-1 line-clamp-2 leading-snug group-hover:text-admin-primary transition-colors">[(주)한국요양] 새로운 제휴 문의가 도착했습니다.</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-admin-text-secondary font-medium">10분 전</span>
                                                    <span className="text-[10px] text-admin-text-secondary/50">•</span>
                                                    <span className="text-[10px] text-admin-text-secondary uppercase font-bold tracking-tight">inquiry</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5 border-b border-admin-border hover:bg-admin-surface-hover/30 cursor-pointer transition-all flex gap-4 relative group bg-admin-primary/5">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-admin-primary"></div>
                                            <div className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-admin-primary/10 text-admin-primary">
                                                <span className="material-symbols-outlined select-none text-xl">info</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-admin-text-main font-bold mb-1 line-clamp-2 leading-snug group-hover:text-admin-primary transition-colors">오늘 오후 11시부터 서버 정기 점검이 예정되어 있습니다.</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-admin-text-secondary font-medium">1시간 전</span>
                                                    <span className="text-[10px] text-admin-text-secondary/50">•</span>
                                                    <span className="text-[10px] text-admin-text-secondary uppercase font-bold tracking-tight">system</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5 border-b border-admin-border hover:bg-admin-surface-hover/30 cursor-pointer transition-all flex gap-4 relative group bg-admin-primary/5">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-admin-primary"></div>
                                            <div className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-admin-success/10 text-admin-success">
                                                <span className="material-symbols-outlined select-none text-xl">check_circle</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-admin-text-main font-bold mb-1 line-clamp-2 leading-snug group-hover:text-admin-primary transition-colors">보도자료 [소나버스 시리즈A 투자유치] 승인이 완료되었습니다.</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-admin-text-secondary font-medium">3시간 전</span>
                                                    <span className="text-[10px] text-admin-text-secondary/50">•</span>
                                                    <span className="text-[10px] text-admin-text-secondary uppercase font-bold tracking-tight">success</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5 border-b border-admin-border hover:bg-admin-surface-hover/30 cursor-pointer transition-all flex gap-4 relative group">
                                            <div className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-yellow-500/10 text-yellow-400">
                                                <span className="material-symbols-outlined select-none text-xl">security</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-admin-text-main font-bold mb-1 line-clamp-2 leading-snug group-hover:text-admin-primary transition-colors">비밀번호 변경 권장: 보안 등급이 낮습니다.</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-admin-text-secondary font-medium">1일 전</span>
                                                    <span className="text-[10px] text-admin-text-secondary/50">•</span>
                                                    <span className="text-[10px] text-admin-text-secondary uppercase font-bold tracking-tight">warning</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5 border-b border-admin-border hover:bg-admin-surface-hover/30 cursor-pointer transition-all flex gap-4 relative group">
                                            <div className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-admin-primary/10 text-admin-primary">
                                                <span className="material-symbols-outlined select-none text-xl">campaign</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-admin-text-main font-bold mb-1 line-clamp-2 leading-snug group-hover:text-admin-primary transition-colors">신규 팝업 [겨울 이벤트]가 노출 시작되었습니다.</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-admin-text-secondary font-medium">2일 전</span>
                                                    <span className="text-[10px] text-admin-text-secondary/50">•</span>
                                                    <span className="text-[10px] text-admin-text-secondary uppercase font-bold tracking-tight">system</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-admin-bg/50 text-center border-t border-admin-border">
                                        <button
                                            onClick={() => {
                                                setIsNotificationOpen(false)
                                                router.push('/admin/notifications')
                                            }}
                                            className="text-xs text-admin-text-secondary hover:text-white font-bold transition-colors"
                                        >
                                            알림 히스토리 전체보기
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="size-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    )
}
