"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminAccountsPage() {
    const router = useRouter()

    // 임시 데이터
    const [accounts] = useState([
        {
            id: 1,
            name: "관리자",
            email: "admin@sonaverse.com",
            role: "최고관리자",
            status: "활성",
            statusColor: "bg-green-500/20 text-green-400",
            lastLogin: "2023-12-18 10:30"
        },
        {
            id: 2,
            name: "운영자",
            email: "operator@sonaverse.com",
            role: "운영자",
            status: "활성",
            statusColor: "bg-green-500/20 text-green-400",
            lastLogin: "2023-12-17 15:20"
        },
        {
            id: 3,
            name: "김매니저",
            email: "manager@sonaverse.com",
            role: "매니저",
            status: "대기",
            statusColor: "bg-yellow-500/20 text-yellow-400",
            lastLogin: "2023-12-15 09:45"
        }
    ])

    const handleEdit = (id: number) => {
        router.push(`/admin/accounts/${id}/edit`)
    }

    const handleAdd = () => {
        router.push('/admin/accounts/new')
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in space-y-6">
                {/* 헤더 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-admin-text-main text-2xl md:text-3xl font-bold tracking-tight">관리자 계정</h1>
                        <p className="text-admin-text-secondary mt-1">시스템 관리자들의 계정과 권한을 관리합니다.</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="w-full md:w-auto h-12 px-6 rounded-xl bg-admin-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-admin-primary-dark transition-all"
                    >
                        <span className="material-symbols-outlined select-none">add</span>
                        계정 추가
                    </button>
                </div>

                {/* 계정 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map((account) => (
                        <div
                            key={account.id}
                            className="bg-admin-surface border border-admin-border rounded-2xl p-6 flex flex-col hover:border-admin-primary/40 transition-all group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-12 rounded-full bg-admin-primary/10 text-admin-primary flex items-center justify-center font-black">
                                    {account.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-admin-text-main font-bold truncate">{account.name}</h4>
                                    <p className="text-admin-text-secondary text-xs truncate">{account.email}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${account.statusColor}`}>
                                    {account.status === "활성" ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-admin-border">
                                <div className="flex justify-between text-xs">
                                    <span className="text-admin-text-secondary">Role</span>
                                    <span className="text-admin-text-main font-bold">{account.role}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-admin-text-secondary">Last Login</span>
                                    <span className="text-admin-text-main">{account.lastLogin.split(' ')[0]}</span>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-2">
                                <button
                                    onClick={() => handleEdit(account.id)}
                                    className="flex-1 py-2 rounded-lg bg-admin-bg border border-admin-border text-xs font-bold text-admin-text-main hover:bg-admin-surface-hover transition-colors"
                                >
                                    수정
                                </button>
                                <button className="flex-1 py-2 rounded-lg bg-admin-danger/10 text-admin-danger text-xs font-bold hover:bg-admin-danger hover:text-white transition-colors">
                                    정지
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
