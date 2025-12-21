"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminInquiriesPage() {
    const router = useRouter()

    // 임시 데이터
    const [inquiries] = useState([
        {
            id: 1,
            type: "서비스 도입",
            typeColor: "bg-blue-500/10 text-blue-400",
            name: "(주)한국요양",
            phone: "010-1234-5678",
            date: "2023-12-10",
            status: "대기중",
            statusColor: "text-yellow-400"
        },
        {
            id: 2,
            type: "제품 기능",
            typeColor: "bg-gray-500/10 text-gray-400",
            name: "김철수",
            phone: "010-9876-5432",
            date: "2023-12-09",
            status: "답변완료",
            statusColor: "text-green-400"
        }
    ])

    const handleView = (id: number) => {
        router.push(`/admin/inquiries/${id}`)
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in space-y-6">
                {/* 헤더 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-admin-text-main text-2xl md:text-3xl font-bold tracking-tight">문의 내역</h1>
                        <p className="text-admin-text-secondary mt-1">고객 및 파트너사의 문의를 실시간으로 확인합니다.</p>
                    </div>
                </div>

                {/* 문의 목록 */}
                <div className="flex flex-col gap-4">
                    {inquiries.map((inquiry) => (
                        <div
                            key={inquiry.id}
                            className="bg-admin-surface border border-admin-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:border-admin-primary/30 transition-all"
                        >
                            <div className="flex items-center gap-4 min-w-[150px]">
                                <div className="size-12 rounded-full bg-admin-bg flex items-center justify-center text-admin-primary border border-admin-border">
                                    <span className="material-symbols-outlined select-none">person</span>
                                </div>
                                <div>
                                    <h4 className="text-admin-text-main font-bold">{inquiry.name}</h4>
                                    <p className="text-admin-text-secondary text-xs">{inquiry.phone}</p>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-0.5 ${inquiry.typeColor} text-[10px] font-bold rounded uppercase`}>
                                        {inquiry.type}
                                    </span>
                                    <span className="text-[10px] text-admin-text-secondary">{inquiry.date}</span>
                                </div>
                                <p className="text-admin-text-main text-sm font-medium line-clamp-1">
                                    문의 상세 내용이 여기에 표시됩니다.
                                </p>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-admin-border">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                                    inquiry.status === "대기중"
                                        ? "bg-admin-danger/10 text-admin-danger"
                                        : "bg-admin-success/10 text-admin-success"
                                }`}>
                                    {inquiry.status === "대기중" ? "대기" : "완료"}
                                </span>
                                <button
                                    onClick={() => handleView(inquiry.id)}
                                    className="h-10 px-6 rounded-xl bg-admin-surface-hover text-admin-text-main text-xs font-bold hover:bg-admin-primary hover:text-white transition-all"
                                >
                                    상세보기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
