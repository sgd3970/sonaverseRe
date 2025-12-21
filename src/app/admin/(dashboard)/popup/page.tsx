"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminPopupPage() {
    const router = useRouter()

    // 임시 데이터
    const [popups] = useState([
        {
            id: 1,
            title: "신제품 출시 안내",
            buttonText: "자세히 보기",
            status: "진행중",
            statusColor: "bg-green-500/20 text-green-400",
            startDate: "23.12.01",
            endDate: "23.12.31"
        }
    ])

    const handleEdit = (id: number) => {
        router.push(`/admin/popup/${id}/edit`)
    }

    const handleAdd = () => {
        router.push('/admin/popup/new')
    }

    return (
        <div className="flex-1 overflow-y-auto p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in">
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-admin-text-main text-3xl font-bold">팝업 관리</h1>
                        <p className="text-admin-text-secondary mt-1">메인 페이지 팝업 및 배너 관리</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 h-10 px-5 rounded-lg bg-admin-primary text-white font-bold hover:bg-admin-primary-dark transition-colors text-sm"
                    >
                        <span className="material-symbols-outlined select-none">add</span>
                        새 팝업
                    </button>
                </div>

                {/* 팝업 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popups.map((popup) => (
                        <div
                            key={popup.id}
                            className="bg-admin-surface rounded-xl border border-admin-border overflow-hidden"
                        >
                            {/* 팝업 미리보기 */}
                            <div className="bg-admin-bg p-8 flex items-center justify-center aspect-video relative">
                                <div className="text-center">
                                    <h3 className="text-admin-text-main font-bold text-lg">
                                        {popup.title}
                                    </h3>
                                    <button className="mt-4 px-4 py-1.5 bg-admin-primary text-white text-xs rounded-full">
                                        {popup.buttonText}
                                    </button>
                                </div>
                                <span className={`absolute top-2 right-2 px-2 py-0.5 ${popup.statusColor} text-xs font-bold rounded`}>
                                    {popup.status}
                                </span>
                            </div>

                            {/* 하단 정보 */}
                            <div className="p-4 flex justify-between items-center">
                                <span className="text-xs text-admin-text-secondary">
                                    {popup.startDate} ~ {popup.endDate}
                                </span>
                                <button
                                    onClick={() => handleEdit(popup.id)}
                                    className="text-admin-text-secondary hover:text-white"
                                >
                                    <span className="material-symbols-outlined select-none">edit</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
