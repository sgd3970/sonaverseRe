"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import useSWR from "swr"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

const fetcher = (url: string) => fetch(url).then(res => res.json())

// 카테고리 라벨 매핑
const categoryLabels: Record<string, string> = {
    product_story: '제품 스토리',
    usage: '사용 방법',
    health_info: '건강 정보',
    welfare_info: '복지 정보',
    company_news: '회사 소식',
    interview: '인터뷰',
}

export default function AdminStoriesPage() {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // API에서 데이터 가져오기
    const { data, isLoading, mutate } = useSWR('/api/admin/stories', fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 30000, // 30초 캐싱
    })

    const stories = data?.data || []

    const handleEdit = (id: string) => {
        router.push(`/admin/stories/${id}`)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return

        setIsDeleting(id)
        try {
            const res = await fetch(`/api/admin/stories/${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                mutate()
                alert('삭제되었습니다.')
            } else {
                alert('삭제에 실패했습니다.')
            }
        } catch (error) {
            alert('삭제에 실패했습니다.')
        } finally {
            setIsDeleting(null)
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

                {/* 로딩 상태 */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-admin-primary border-t-transparent rounded-full" />
                    </div>
                )}

                {/* 데이터 없음 */}
                {!isLoading && stories.length === 0 && (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-5xl text-admin-text-secondary mb-4">article</span>
                        <p className="text-admin-text-secondary">등록된 스토리가 없습니다.</p>
                    </div>
                )}

                {/* 카드 그리드 */}
                {!isLoading && stories.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stories.map((story: any) => {
                            const thumbnailUrl = story.thumbnailUrl || story.thumbnail_url || '/images/placeholder.png'
                            const category = categoryLabels[story.category] || story.category || '카테고리'
                            const title = story.title?.ko || story.title || '제목 없음'
                            const publishedDate = story.publishedDate || story.published_date
                                ? new Date(story.publishedDate || story.published_date).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                  })
                                : story.createdAt
                                ? new Date(story.createdAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                  })
                                : '날짜 없음'
                            const viewCount = story.viewCount || story.view_count || 0

                            return (
                                <div
                                    key={story.id}
                                    className="bg-admin-surface border border-admin-border rounded-2xl p-5 flex gap-4 hover:border-admin-primary/40 transition-all group"
                                >
                                    <div className="size-20 md:size-24 rounded-xl overflow-hidden shrink-0 bg-admin-bg relative">
                                        <OptimizedImage
                                            alt={title}
                                            fill
                                            className="object-cover"
                                            src={thumbnailUrl}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-black text-admin-primary uppercase tracking-widest mb-1 block">
                                            {category}
                                        </span>
                                        <h3 className="text-admin-text-main font-bold text-sm md:text-base line-clamp-1 mb-1">
                                            {title}
                                        </h3>
                                        <p className="text-admin-text-secondary text-xs mb-3">
                                            {publishedDate} · 조회 {viewCount}
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
                                                disabled={isDeleting === story.id}
                                                className="text-admin-danger text-[11px] font-bold hover:underline disabled:opacity-50"
                                            >
                                                {isDeleting === story.id ? '삭제 중...' : '삭제'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
