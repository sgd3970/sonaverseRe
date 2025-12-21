"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AdminPressEditPage() {
    const params = useParams()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        titleEn: '',
        slug: '',
        pressName: '',
        pressNameEn: '',
        excerpt: '',
        excerptEn: '',
        content: '',
        contentEn: '',
        externalUrl: '',
        thumbnailUrl: '',
        publishedDate: '',
        isPublished: false,
        isFeatured: false,
    })

    // 언론보도 조회
    const { data, isLoading } = useSWR(
        params.id ? `/api/admin/press/${params.id}` : null,
        fetcher,
        { revalidateOnFocus: false }
    )

    // 데이터 로드 시 폼 초기화
    useEffect(() => {
        if (data?.data) {
            const press = data.data
            setFormData({
                title: press.title || '',
                titleEn: press.titleEn || '',
                slug: press.slug || '',
                pressName: press.pressName || '',
                pressNameEn: press.pressNameEn || '',
                excerpt: press.excerpt || '',
                excerptEn: press.excerptEn || '',
                content: press.content || '',
                contentEn: press.contentEn || '',
                externalUrl: press.externalUrl || '',
                thumbnailUrl: press.thumbnailUrl || '',
                publishedDate: press.publishedDate?.split('T')[0] || '',
                isPublished: press.isPublished || false,
                isFeatured: press.isFeatured || false,
            })
        }
    }, [data])

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            alert('제목을 입력해주세요.')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/admin/press/${params.id}`, {
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
            const res = await fetch(`/api/admin/press/${params.id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                router.push('/admin/press')
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
                    <p className="text-gray-500 mb-4">언론보도를 찾을 수 없습니다.</p>
                    <button
                        onClick={() => router.push('/admin/press')}
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
                        onClick={() => router.push('/admin/press')}
                        className="size-10 rounded-xl bg-admin-surface border border-admin-border flex items-center justify-center text-admin-text-secondary hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined select-none">arrow_back</span>
                    </button>
                    <h1 className="text-admin-text-main text-2xl font-bold">기사 정보 수정</h1>
                    <div className="flex items-center gap-2 ml-auto">
                        {formData.isPublished && (
                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                                게시됨
                            </span>
                        )}
                        {formData.isFeatured && (
                            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">
                                주요뉴스
                            </span>
                        )}
                    </div>
                </div>

                {/* 폼 */}
                <div className="bg-admin-surface border border-admin-border rounded-2xl p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 기사 제목 (한국어) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                기사 제목 <span className="text-admin-danger">*</span>
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="기사 제목을 입력하세요"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>

                        {/* 출처(언론사) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                출처(언론사) <span className="text-admin-danger">*</span>
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="예: 소나뉴스"
                                value={formData.pressName}
                                onChange={(e) => setFormData(prev => ({ ...prev, pressName: e.target.value }))}
                            />
                        </div>

                        {/* 발행 일자 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                발행 일자 <span className="text-admin-danger">*</span>
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                type="date"
                                value={formData.publishedDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, publishedDate: e.target.value }))}
                            />
                        </div>

                        {/* 이미지 URL */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                이미지 URL
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="https://..."
                                value={formData.thumbnailUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                            />
                        </div>

                        {/* 원문 링크 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                원문 링크
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="https://..."
                                value={formData.externalUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, externalUrl: e.target.value }))}
                            />
                        </div>

                        {/* 영어 제목 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                기사 제목 (English)
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="Press Title"
                                value={formData.titleEn}
                                onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                            />
                        </div>

                        {/* 영어 언론사 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                출처 (English)
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="e.g., Sonanews"
                                value={formData.pressNameEn}
                                onChange={(e) => setFormData(prev => ({ ...prev, pressNameEn: e.target.value }))}
                            />
                        </div>

                        {/* 기사 요약 (한국어) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    기사 요약(Snippet) <span className="text-admin-danger">*</span>
                                </label>
                                <textarea
                                    className="w-full h-24 bg-admin-bg border border-admin-border rounded-xl p-4 text-sm resize-none"
                                    placeholder="목록에 노출될 짧은 설명을 입력하세요"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                ></textarea>
                            </div>
                        </div>

                        {/* 기사 요약 (English) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    기사 요약 (English)
                                </label>
                                <textarea
                                    className="w-full h-24 bg-admin-bg border border-admin-border rounded-xl p-4 text-sm resize-none"
                                    placeholder="Short description for listing"
                                    value={formData.excerptEn}
                                    onChange={(e) => setFormData(prev => ({ ...prev, excerptEn: e.target.value }))}
                                ></textarea>
                            </div>
                        </div>

                        {/* 상세 본문 (한국어, HTML) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    상세 본문(HTML)
                                </label>
                                <textarea
                                    className="w-full h-60 bg-admin-bg border border-admin-border rounded-xl p-4 text-sm font-mono"
                                    placeholder="기사 본문 내용을 HTML 형식으로 작성할 수 있습니다."
                                    value={formData.content}
                                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                ></textarea>
                            </div>
                        </div>

                        {/* 상세 본문 (English, HTML) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    상세 본문 (English, HTML)
                                </label>
                                <textarea
                                    className="w-full h-60 bg-admin-bg border border-admin-border rounded-xl p-4 text-sm font-mono"
                                    placeholder="Press content in HTML format"
                                    value={formData.contentEn}
                                    onChange={(e) => setFormData(prev => ({ ...prev, contentEn: e.target.value }))}
                                ></textarea>
                            </div>
                        </div>

                        {/* 체크박스들 */}
                        <div className="md:col-span-2 flex flex-wrap gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                                    className="w-4 h-4 rounded border-admin-border"
                                />
                                <span className="text-sm text-admin-text-secondary">게시</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                    className="w-4 h-4 rounded border-admin-border"
                                />
                                <span className="text-sm text-admin-text-secondary">주요 뉴스</span>
                            </label>
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
                                onClick={() => router.push('/admin/press')}
                                className="px-6 py-3 rounded-xl bg-admin-bg text-admin-text-secondary font-bold hover:text-white"
                            >
                                취소
                            </button>
                            <a
                                href={`/press/${formData.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 rounded-xl bg-admin-bg text-admin-text-secondary font-bold hover:text-white border border-admin-border flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">visibility</span>
                                미리보기
                            </a>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-10 py-3 rounded-xl bg-admin-primary text-white font-bold hover:bg-admin-primary-dark shadow-lg shadow-admin-primary/20 disabled:opacity-50"
                            >
                                {isSubmitting ? '저장 중...' : '기사 저장하기'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
