"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import useSWR from "swr"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AdminPopupPage() {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // API에서 데이터 가져오기
    const { data, isLoading, mutate } = useSWR('/api/admin/popup', fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 30000, // 30초 캐싱
    })

    const popups = data?.data || []

    const handleEdit = (id: string) => {
        router.push(`/admin/popup/${id}`)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return

        setIsDeleting(id)
        try {
            const res = await fetch(`/api/admin/popup/${id}`, {
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

                {/* 로딩 상태 */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-admin-primary border-t-transparent rounded-full" />
                    </div>
                )}

                {/* 데이터 없음 */}
                {!isLoading && popups.length === 0 && (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-5xl text-admin-text-secondary mb-4">campaign</span>
                        <p className="text-admin-text-secondary">등록된 팝업이 없습니다.</p>
                    </div>
                )}

                {/* 팝업 그리드 */}
                {!isLoading && popups.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popups.map((popup: any) => {
                            const title = popup.title || '제목 없음'
                            const buttonText = popup.buttonText || '확인'
                            const startDate = popup.startDate 
                                ? new Date(popup.startDate).toLocaleDateString('ko-KR', {
                                    year: '2-digit',
                                    month: '2-digit',
                                    day: '2-digit',
                                  })
                                : ''
                            const endDate = popup.endDate 
                                ? new Date(popup.endDate).toLocaleDateString('ko-KR', {
                                    year: '2-digit',
                                    month: '2-digit',
                                    day: '2-digit',
                                  })
                                : '종료일 없음'
                            const isActive = popup.isActive && popup.isPublished
                            const statusColor = isActive 
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-400'
                            const status = isActive ? '진행중' : '비활성'

                            return (
                                <div
                                    key={popup.id}
                                    className="bg-admin-surface rounded-xl border border-admin-border overflow-hidden"
                                >
                                    {/* 팝업 미리보기 */}
                                    <div className="bg-admin-bg p-8 flex items-center justify-center aspect-video relative">
                                        {popup.imageId ? (
                                            <OptimizedImage
                                                src={`/api/admin/images/${popup.imageId}`}
                                                alt={title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <h3 className="text-admin-text-main font-bold text-lg">
                                                    {title}
                                                </h3>
                                                <button className="mt-4 px-4 py-1.5 bg-admin-primary text-white text-xs rounded-full">
                                                    {buttonText}
                                                </button>
                                            </div>
                                        )}
                                        <span className={`absolute top-2 right-2 px-2 py-0.5 ${statusColor} text-xs font-bold rounded`}>
                                            {status}
                                        </span>
                                    </div>

                                    {/* 하단 정보 */}
                                    <div className="p-4 flex justify-between items-center">
                                        <span className="text-xs text-admin-text-secondary">
                                            {startDate} ~ {endDate}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(popup.id)}
                                                className="text-admin-text-secondary hover:text-white transition-colors"
                                            >
                                                <span className="material-symbols-outlined select-none">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(popup.id)}
                                                disabled={isDeleting === popup.id}
                                                className="text-admin-danger hover:text-red-400 transition-colors disabled:opacity-50"
                                            >
                                                {isDeleting === popup.id ? (
                                                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                                                ) : (
                                                    <span className="material-symbols-outlined select-none">delete</span>
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
