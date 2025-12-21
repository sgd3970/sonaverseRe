"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// RichTextEditor 동적 임포트 (관리자 페이지에서만 필요)
const RichTextEditor = dynamic(
  () => import("@/shared/components/ui/RichTextEditor").then(mod => mod.RichTextEditor),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-admin-bg border border-admin-border rounded-xl animate-pulse" />
  }
)

export default function AdminPressNewPage() {
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
        publishedDate: new Date().toISOString().split('T')[0],
        isPublished: false,
        isFeatured: false,
    })

    // 슬러그 자동 생성
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^가-힣a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50)
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        setFormData(prev => ({
            ...prev,
            title,
            slug: generateSlug(title),
        }))
    }

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            alert('제목을 입력해주세요.')
            return
        }
        if (!formData.pressName.trim()) {
            alert('언론사를 입력해주세요.')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/admin/press', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                const data = await res.json()
                router.push(`/admin/press/${data.data.id}`)
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
                    <h1 className="text-admin-text-main text-2xl font-bold">새 기사 등록</h1>
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
                                onChange={handleTitleChange}
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

                        {/* 상세 본문 (한국어) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    상세 본문
                                </label>
                                <RichTextEditor
                                    content={formData.content}
                                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                                    placeholder="기사 본문 내용을 작성하세요."
                                />
                            </div>
                        </div>

                        {/* 상세 본문 (English) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    상세 본문 (English)
                                </label>
                                <RichTextEditor
                                    content={formData.contentEn}
                                    onChange={(content) => setFormData(prev => ({ ...prev, contentEn: content }))}
                                    placeholder="Press content"
                                />
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
                    <div className="flex justify-end gap-3 pt-6 border-t border-admin-border">
                        <button
                            onClick={() => router.push('/admin/press')}
                            className="px-6 py-3 rounded-xl bg-admin-bg text-admin-text-secondary font-bold hover:text-white"
                        >
                            취소
                        </button>
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
    )
}
