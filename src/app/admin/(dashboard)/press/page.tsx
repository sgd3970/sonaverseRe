"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

export default function AdminPressPage() {
    const router = useRouter()

    // 임시 데이터 (실제로는 API에서 가져옴)
    const [pressItems] = useState([
        {
            id: 1,
            thumbnail: "https://picsum.photos/800/600?random=10",
            title: "소나버스, 시니어 테크의 새로운 지평을 열다",
            media: "TechCrunch Korea",
            date: "2023. 09. 15"
        },
        {
            id: 2,
            thumbnail: "https://picsum.photos/800/600?random=11",
            title: "혁신기업 100선 선정: 소나버스",
            media: "Economic Daily",
            date: "2023. 10. 01"
        },
        {
            id: 3,
            thumbnail: "https://picsum.photos/800/600?random=12",
            title: "AI가 결합된 실버 케어의 미래",
            media: "AI Times",
            date: "2023. 11. 20"
        },
        {
            id: 4,
            thumbnail: "https://picsum.photos/800/600?random=13",
            title: "CES 2024 혁신상 수상 기대작",
            media: "Startup Today",
            date: "2023. 12. 05"
        }
    ])

    const handleEdit = (id: number) => {
        router.push(`/admin/press/${id}/edit`)
    }

    const handleDelete = (id: number) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            console.log('Delete:', id)
        }
    }

    const handleAdd = () => {
        router.push('/admin/press/new')
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in space-y-6">
                {/* 헤더 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-admin-text-main text-2xl md:text-3xl font-bold tracking-tight">언론보도 관리</h1>
                        <p className="text-admin-text-secondary mt-1">최신 기사 및 보도자료를 등록하고 관리합니다.</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="w-full md:w-auto h-12 px-6 rounded-xl bg-admin-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-admin-primary-dark transition-all"
                    >
                        <span className="material-symbols-outlined select-none">add</span>
                        새 기사 등록
                    </button>
                </div>

                {/* 카드 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {pressItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-admin-surface border border-admin-border rounded-2xl overflow-hidden flex flex-col group"
                        >
                            {/* 썸네일 */}
                            <div className="aspect-video relative overflow-hidden bg-admin-bg">
                                <OptimizedImage
                                    alt={item.title}
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                    src={item.thumbnail}
                                />
                                <div className="absolute top-4 left-4 px-3 py-1 bg-admin-bg/80 backdrop-blur-md rounded-lg text-[10px] font-black text-admin-primary uppercase tracking-widest border border-admin-border">
                                    {item.media}
                                </div>
                            </div>

                            {/* 내용 */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-admin-text-main font-bold mb-2 line-clamp-2 leading-snug">
                                    {item.title}
                                </h3>
                                <p className="text-admin-text-secondary text-xs mb-4">
                                    {item.date}
                                </p>

                                {/* 하단 액션 */}
                                <div className="mt-auto flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item.id)}
                                        className="flex-1 h-10 rounded-lg bg-admin-surface-hover border border-admin-border text-xs font-bold text-admin-text-main flex items-center justify-center gap-2 hover:border-admin-primary transition-all"
                                    >
                                        <span className="material-symbols-outlined select-none text-sm">edit</span>
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="h-10 w-10 rounded-lg bg-admin-danger/10 border border-admin-danger/20 text-admin-danger flex items-center justify-center hover:bg-admin-danger hover:text-white transition-all"
                                    >
                                        <span className="material-symbols-outlined select-none text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
