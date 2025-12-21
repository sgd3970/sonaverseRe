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

// 카테고리 옵션
const categoryOptions = [
    { value: 'product_story', label: '제품 스토리' },
    { value: 'usage', label: '사용 방법' },
    { value: 'health_info', label: '건강 정보' },
    { value: 'welfare_info', label: '복지 정보' },
    { value: 'company_news', label: '회사 소식' },
    { value: 'interview', label: '인터뷰' },
]

export default function AdminStoryNewPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        titleEn: '',
        slug: '',
        category: 'product_story' as const,
        subtitle: '',
        subtitleEn: '',
        excerpt: '',
        excerptEn: '',
        content: '',
        contentEn: '',
        thumbnailUrl: '',
        featuredImageUrl: '',
        youtubeUrl: '',
        authorName: '',
        publishedDate: new Date().toISOString().split('T')[0],
        isPublished: false,
        isFeatured: false,
        isMainStory: false,
        displayPriority: 0,
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
        if (!formData.content.trim()) {
            alert('본문을 입력해주세요.')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/admin/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                const data = await res.json()
                router.push(`/admin/stories/${data.data.id}`)
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
                        onClick={() => router.push('/admin/stories')}
                        className="size-10 rounded-xl bg-admin-surface border border-admin-border flex items-center justify-center text-admin-text-secondary hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined select-none">arrow_back</span>
                    </button>
                    <h1 className="text-admin-text-main text-2xl font-bold">새 스토리 작성</h1>
                </div>

                {/* 폼 */}
                <div className="bg-admin-surface border border-admin-border rounded-2xl p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 스토리 제목 (한국어) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                스토리 제목 <span className="text-admin-danger">*</span>
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="스토리 제목을 입력하세요"
                                value={formData.title}
                                onChange={handleTitleChange}
                            />
                        </div>

                        {/* 카테고리 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                카테고리 <span className="text-admin-danger">*</span>
                            </label>
                            <select
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                            >
                                {categoryOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 부제목 (한국어) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                부제목
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="부제목을 입력하세요"
                                value={formData.subtitle}
                                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                            />
                        </div>

                        {/* 작성자 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                작성자
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="작성자 이름을 입력하세요"
                                value={formData.authorName}
                                onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
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

                        {/* 우선순위 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                노출 우선순위
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                type="number"
                                placeholder="0"
                                value={formData.displayPriority}
                                onChange={(e) => setFormData(prev => ({ ...prev, displayPriority: parseInt(e.target.value) || 0 }))}
                            />
                        </div>

                        {/* 썸네일 URL */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                썸네일 이미지 URL
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="https://..."
                                value={formData.thumbnailUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                            />
                        </div>

                        {/* 대표 이미지 URL */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                대표 이미지 URL
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="https://..."
                                value={formData.featuredImageUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, featuredImageUrl: e.target.value }))}
                            />
                        </div>

                        {/* YouTube URL */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                YouTube URL
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={formData.youtubeUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                            />
                        </div>

                        {/* 영어 제목 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                스토리 제목 (English)
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="Story Title"
                                value={formData.titleEn}
                                onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                            />
                        </div>

                        {/* 영어 부제목 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                부제목 (English)
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="Subtitle"
                                value={formData.subtitleEn}
                                onChange={(e) => setFormData(prev => ({ ...prev, subtitleEn: e.target.value }))}
                            />
                        </div>

                        {/* 스토리 요약 (한국어) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    스토리 요약(Snippet)
                                </label>
                                <textarea
                                    className="w-full h-24 bg-admin-bg border border-admin-border rounded-xl p-4 text-sm resize-none"
                                    placeholder="목록에 노출될 짧은 설명을 입력하세요"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                ></textarea>
                            </div>
                        </div>

                        {/* 스토리 요약 (English) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    스토리 요약 (English)
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
                                    상세 본문 <span className="text-admin-danger">*</span>
                                </label>
                                <RichTextEditor
                                    content={formData.content}
                                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                                    placeholder="스토리 본문 내용을 작성하세요."
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
                                    placeholder="Story content"
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
                                <span className="text-sm text-admin-text-secondary">주요 스토리</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isMainStory}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isMainStory: e.target.checked }))}
                                    className="w-4 h-4 rounded border-admin-border"
                                />
                                <span className="text-sm text-admin-text-secondary">메인 스토리</span>
                            </label>
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-admin-border">
                        <button
                            onClick={() => router.push('/admin/stories')}
                            className="px-6 py-3 rounded-xl bg-admin-bg text-admin-text-secondary font-bold hover:text-white"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-10 py-3 rounded-xl bg-admin-primary text-white font-bold hover:bg-admin-primary-dark shadow-lg shadow-admin-primary/20 disabled:opacity-50"
                        >
                            {isSubmitting ? '저장 중...' : '스토리 저장하기'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
