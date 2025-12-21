"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

export default function AdminStoriesPage() {
    const router = useRouter()

    // 임시 데이터
    const [stories] = useState([
        {
            id: 1,
            thumbnail: "https://picsum.photos/800/600?random=1",
            title: "만보 워크메이트 개발 비하인드",
            category: "제품스토리",
            date: "2023. 10. 25",
            viewCount: 1234
        },
        {
            id: 2,
            thumbnail: "https://picsum.photos/800/600?random=2",
            title: "시니어 걷기 운동의 중요성",
            category: "건강정보",
            date: "2023. 11. 02",
            viewCount: 1234
        },
        {
            id: 3,
            thumbnail: "https://picsum.photos/800/600?random=3",
            title: "2024년 노인장기요양보험 혜택",
            category: "복지정보",
            date: "2023. 12. 10",
            viewCount: 1234
        }
    ])

    const handleEdit = (id: number) => {
        router.push(`/admin/stories/${id}/edit`)
    }

    const handleDelete = (id: number) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            console.log('Delete:', id)
        }
    }

    const handleAdd = () => {
        router.push('/admin/stories/new')
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in space-y-6">
                {/* 헤더 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-admin-text-main text-2xl md:text-3xl font-bold tracking-tight">소나버스 스토리</h1>
                        <p className="text-admin-text-secondary mt-1">제품 이야기와 유용한 정보를 발행합니다.</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="w-full md:w-auto h-12 px-6 rounded-xl bg-admin-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-admin-primary-dark transition-all"
                    >
                        <span className="material-symbols-outlined select-none">add</span>
                        새 스토리 작성
                    </button>
                </div>

                {/* 카드 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map((story) => (
                        <div
                            key={story.id}
                            className="bg-admin-surface border border-admin-border rounded-2xl p-5 flex gap-4 hover:border-admin-primary/40 transition-all group"
                        >
                            <div className="size-20 md:size-24 rounded-xl overflow-hidden shrink-0 bg-admin-bg relative">
                                <OptimizedImage
                                    alt={story.title}
                                    fill
                                    className="object-cover"
                                    src={story.thumbnail}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-black text-admin-primary uppercase tracking-widest mb-1 block">
                                    {story.category}
                                </span>
                                <h3 className="text-admin-text-main font-bold text-sm md:text-base line-clamp-1 mb-1">
                                    {story.title}
                                </h3>
                                <p className="text-admin-text-secondary text-xs mb-3">
                                    {story.date}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(story.id)}
                                        className="text-admin-primary text-[11px] font-bold hover:underline"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(story.id)}
                                        className="text-admin-danger text-[11px] font-bold hover:underline"
                                    >
                                        삭제
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
