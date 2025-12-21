"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

const statusOptions = [
    { value: 'active', label: '노출중' },
    { value: 'pending', label: '대기' },
    { value: 'ended', label: '종료' },
]

const targetOptions = [
    { value: 'all', label: '전체' },
    { value: 'main', label: '메인페이지' },
    { value: 'product', label: '제품페이지' },
]

export default function AdminPopupEditPage() {
    const params = useParams()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        status: 'pending' as const,
        target: 'all' as const,
        startDate: '',
        endDate: '',
        imageUrl: '',
        linkUrl: '',
    })

    // 팝업 조회
    const { data, isLoading } = useSWR(
        params.id ? `/api/admin/popup/${params.id}` : null,
        fetcher,
        { revalidateOnFocus: false }
    )

    // 데이터 로드 시 폼 초기화
    useEffect(() => {
        if (data?.data) {
            const popup = data.data
            setFormData({
                title: popup.title || '',
                status: popup.status || 'pending',
                target: popup.target || 'all',
                startDate: popup.startDate?.split('T')[0] || '',
                endDate: popup.endDate?.split('T')[0] || '',
                imageUrl: popup.imageUrl || '',
                linkUrl: popup.linkUrl || '',
            })
        }
    }, [data])

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            alert('팝업 타이틀을 입력해주세요.')
            return
        }
        if (!formData.startDate || !formData.endDate) {
            alert('시작일과 종료일을 입력해주세요.')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/admin/popup/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                alert('저장되었습니다.')
                router.refresh()
            } else {
                const error = await res.json()
                alert(error.message || '저장에 실패했습니다.')
            }
        } catch (error) {
            alert('저장에 실패했습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('정말 삭제하시겠습니까?')) return

        try {
            const res = await fetch(`/api/admin/popup/${params.id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                router.push('/admin/popup')
            } else {
                alert('삭제에 실패했습니다.')
            }
        } catch (error) {
            alert('삭제에 실패했습니다.')
        }
    }

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-admin-bg">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        )
    }

    if (!data?.data) {
        return (
            <div className="flex-1 flex items-center justify-center bg-admin-bg">
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">error</span>
                    <p className="text-gray-500 mb-4">팝업을 찾을 수 없습니다.</p>
                    <button
                        onClick={() => router.push('/admin/popup')}
                        className="px-6 py-3 rounded-xl bg-admin-surface border border-admin-border text-admin-text-secondary font-bold hover:text-white"
                    >
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
                {/* 헤더 */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push('/admin/popup')}
                        className="size-10 rounded-xl bg-admin-surface border border-admin-border flex items-center justify-center text-admin-text-secondary hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined select-none">arrow_back</span>
                    </button>
                    <h1 className="text-admin-text-main text-2xl font-bold">팝업 정보 수정</h1>
                    <div className="flex items-center gap-2 ml-auto">
                        {formData.status === 'active' && (
                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                                노출중
                            </span>
                        )}
                        {formData.status === 'pending' && (
                            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">
                                대기
                            </span>
                        )}
                        {formData.status === 'ended' && (
                            <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold">
                                종료
                            </span>
                        )}
                    </div>
                </div>

                {/* 폼 */}
                <div className="bg-admin-surface border border-admin-border rounded-2xl p-6 md:p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 팝업 타이틀 */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    팝업 타이틀 <span className="text-admin-danger">*</span>
                                </label>
                                <input
                                    className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                    placeholder="팝업 제목을 입력하세요"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* 노출 상태 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                노출 상태 <span className="text-admin-danger">*</span>
                            </label>
                            <select
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm text-admin-text-main"
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 노출 대상 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                노출 대상 <span className="text-admin-danger">*</span>
                            </label>
                            <select
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm text-admin-text-main"
                                value={formData.target}
                                onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value as any }))}
                            >
                                {targetOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 시작일 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                시작일 <span className="text-admin-danger">*</span>
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                            />
                        </div>

                        {/* 종료일 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                종료일 <span className="text-admin-danger">*</span>
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                            />
                        </div>

                        {/* 팝업 이미지 URL */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    팝업 이미지 URL
                                </label>
                                <input
                                    className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                    placeholder="https://..."
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* 링크 URL */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    링크 URL
                                </label>
                                <input
                                    className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                    placeholder="클릭 시 이동할 주소"
                                    value={formData.linkUrl}
                                    onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-between gap-3 pt-6 border-t border-admin-border">
                        <button
                            onClick={handleDelete}
                            className="px-6 py-3 rounded-xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 border border-red-500/20"
                        >
                            삭제
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push('/admin/popup')}
                                className="px-6 py-3 rounded-xl bg-admin-bg text-admin-text-secondary font-bold hover:text-white"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-10 py-3 rounded-xl bg-admin-primary text-white font-bold hover:bg-admin-primary-dark shadow-lg shadow-admin-primary/20 disabled:opacity-50"
                            >
                                {isSubmitting ? '저장 중...' : '저장하기'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
