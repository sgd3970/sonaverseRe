"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAdminLogout, useAdminAuth } from "@/lib/hooks/useAdmin"

const navItems = [
    { name: "대시보드", href: "/admin", icon: "dashboard" },
    { name: "언론보도 관리", href: "/admin/press", icon: "newspaper" },
    { name: "소나버스 스토리", href: "/admin/stories", icon: "auto_stories" },
    { name: "제품 관리", href: "/admin/products", icon: "inventory_2" },
    { name: "문의 내역", href: "/admin/inquiries", icon: "inbox", badge: 3 },
    { name: "팝업 관리", href: "/admin/popup", icon: "web" },
    { name: "알림 히스토리", href: "/admin/notifications", icon: "notifications" },
    { name: "통계 분석", href: "/admin/analytics", icon: "bar_chart" },
    { name: "관리자 계정", href: "/admin/accounts", icon: "group" },
    { name: "설정", href: "/admin/settings", icon: "settings" },
]

interface AdminSidebarProps {
    isMobileOpen?: boolean
    onMobileClose?: () => void
}

export function AdminSidebar({ isMobileOpen = false, onMobileClose }: AdminSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { logout, isLoading: isLoggingOut } = useAdminLogout()
    const { user } = useAdminAuth()

    const handleLogout = async () => {
        const success = await logout()
        if (success) {
            router.push('/admin/login')
        }
    }

    return (
        <>
            {/* 모바일 오버레이 */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* 사이드바 */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-[90%] max-w-sm bg-slate-900 text-white flex flex-col transition-transform duration-300 md:w-64",
                isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
            {/* Logo & Close Button */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
                <Link href="/admin" className="text-xl font-black tracking-wider hover:text-primary transition-colors">
                    SONA_ADMIN
                </Link>
                {/* 모바일 닫기 버튼 */}
                <button
                    onClick={onMobileClose}
                    className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto admin-scroll">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/admin' && pathname.startsWith(item.href));
                    return (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-admin-primary text-white shadow-md shadow-admin-primary/20"
                                    : "text-admin-text-secondary hover:bg-admin-surface hover:text-white"
                            )}
                        >
                            <span className={cn(
                                "material-symbols-outlined select-none transition-colors",
                                isActive
                                    ? "text-white"
                                    : "text-admin-text-secondary group-hover:text-white"
                            )}>
                                {item.icon}
                            </span>
                            <span className="font-medium flex-1 text-left">{item.name}</span>
                            {item.badge && (
                                <span className="bg-admin-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-admin-border bg-[#0f172a]">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-admin-surface transition-colors cursor-pointer">
                    <div className="size-9 rounded-full bg-admin-surface flex items-center justify-center text-admin-text-secondary border border-admin-border">
                        <span className="material-symbols-outlined select-none">person</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">소나버스 관리자</p>
                        <p className="text-admin-text-secondary text-xs truncate">admin@sonaverse.kr</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full mt-2 flex items-center justify-center gap-2 text-admin-text-secondary hover:text-admin-danger text-xs py-2 hover:bg-admin-surface rounded transition-colors"
                >
                    <span className="material-symbols-outlined select-none text-sm">logout</span> 로그아웃
                </button>
            </div>
        </aside>
        </>
    )
}
