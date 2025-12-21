"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import useSWR from "swr"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AdminPressPage() {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // API에서 데이터 가져오기
    const { data, isLoading, mutate } = useSWR('/api/admin/press', fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 30000, // 30초 캐싱 (관리자 페이지는 짧게)
    })

    const pressItems = data?.data || []

    const handleEdit = (id: string) => {
        router.push(`/admin/press/${id}`)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return

        setIsDeleting(id)
        try {
            const res = await fetch(`/api/admin/press/${id}`, {
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

                {/* 로딩 상태 */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-admin-primary border-t-transparent rounded-full" />
                    </div>
                )}

                {/* 데이터 없음 */}
                {!isLoading && pressItems.length === 0 && (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-5xl text-admin-text-secondary mb-4">article</span>
                        <p className="text-admin-text-secondary">등록된 기사가 없습니다.</p>
                    </div>
                )}

                {/* 카드 그리드 */}
                {!isLoading && pressItems.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                        {pressItems.map((item: any) => {
                            const thumbnailUrl = item.thumbnailUrl || '/images/placeholder.png'
                            const pressName = item.pressName || '언론사'
                            const title = item.title || '제목 없음'
                            const publishedDate = item.publishedDate 
                                ? new Date(item.publishedDate).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                  })
                                : item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                  })
                                : '날짜 없음'

                            return (
                                <div
                                    key={item.id}
                                    className="bg-admin-surface border border-admin-border rounded-2xl overflow-hidden flex flex-col group"
                                >
                                    {/* 썸네일 */}
                                    <div className="aspect-video relative overflow-hidden bg-admin-bg">
                                        <OptimizedImage
                                            alt={title}
                                            fill
                                            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                            src={thumbnailUrl}
                                        />
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-admin-bg/80 backdrop-blur-md rounded-lg text-[10px] font-black text-admin-primary uppercase tracking-widest border border-admin-border">
                                            {pressName}
                                        </div>
                                    </div>

                                    {/* 내용 */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-admin-text-main font-bold mb-2 line-clamp-2 leading-snug">
                                            {title}
                                        </h3>
                                        <p className="text-admin-text-secondary text-xs mb-4">
                                            {publishedDate}
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
                                                disabled={isDeleting === item.id}
                                                className="h-10 w-10 rounded-lg bg-admin-danger/10 border border-admin-danger/20 text-admin-danger flex items-center justify-center hover:bg-admin-danger hover:text-white transition-all disabled:opacity-50"
                                            >
                                                {isDeleting === item.id ? (
                                                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                                                ) : (
                                                    <span className="material-symbols-outlined select-none text-sm">delete</span>
                                                )}
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
