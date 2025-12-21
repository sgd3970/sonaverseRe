"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

// 카테고리 옵션
const categoryOptions = [
    { value: 'product_story', label: '제품 스토리' },
    { value: 'usage', label: '사용 방법' },
    { value: 'health_info', label: '건강 정보' },
    { value: 'welfare_info', label: '복지 정보' },
    { value: 'company_news', label: '회사 소식' },
    { value: 'interview', label: '인터뷰' },
]

export default function AdminStoryEditPage() {
    const params = useParams()
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
        publishedDate: '',
        isPublished: false,
        isFeatured: false,
        isMainStory: false,
        displayPriority: 0,
    })

    // 스토리 조회
    const { data, isLoading } = useSWR(
        params.id ? `/api/admin/stories/${params.id}` : null,
        fetcher,
        { revalidateOnFocus: false }
    )

    // 데이터 로드 시 폼 초기화
    useEffect(() => {
        if (data?.data) {
            const story = data.data
            setFormData({
                title: story.title?.ko || '',
                titleEn: story.title?.en || '',
                slug: story.slug || '',
                category: story.category || 'product_story',
                subtitle: story.subtitle?.ko || '',
                subtitleEn: story.subtitle?.en || '',
                excerpt: story.excerpt?.ko || '',
                excerptEn: story.excerpt?.en || '',
                content: story.content?.ko?.body || '',
                contentEn: story.content?.en?.body || '',
                thumbnailUrl: story.thumbnail_image_id?.url || '',
                featuredImageUrl: story.featured_image_id?.url || '',
                youtubeUrl: story.youtube_url || '',
                authorName: story.author_name || '',
                publishedDate: story.published_date?.split('T')[0] || '',
                isPublished: story.is_published || false,
                isFeatured: story.is_featured || false,
                isMainStory: story.is_main_story || false,
                displayPriority: story.display_priority || 0,
            })
        }
    }, [data])

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
            const res = await fetch(`/api/admin/stories/${params.id}`, {
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
            const res = await fetch(`/api/admin/stories/${params.id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                router.push('/admin/stories')
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
                    <p className="text-gray-500 mb-4">스토리를 찾을 수 없습니다.</p>
                    <button
                        onClick={() => router.push('/admin/stories')}
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
                        onClick={() => router.push('/admin/stories')}
                        className="size-10 rounded-xl bg-admin-surface border border-admin-border flex items-center justify-center text-admin-text-secondary hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined select-none">arrow_back</span>
                    </button>
                    <h1 className="text-admin-text-main text-2xl font-bold">스토리 수정</h1>
                    <div className="flex items-center gap-2 ml-auto">
                        {formData.isPublished && (
                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                                게시됨
                            </span>
                        )}
                        {formData.isFeatured && (
                            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">
                                주요 스토리
                            </span>
                        )}
                        {formData.isMainStory && (
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                                메인 스토리
                            </span>
                        )}
                    </div>
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
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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

                        {/* 상세 본문 (한국어, HTML) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    상세 본문(HTML) <span className="text-admin-danger">*</span>
                                </label>
                                <textarea
                                    className="w-full h-60 bg-admin-bg border border-admin-border rounded-xl p-4 text-sm font-mono"
                                    placeholder="스토리 본문 내용을 HTML 형식으로 작성할 수 있습니다."
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
                                    placeholder="Story content in HTML format"
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
                    <div className="flex justify-between gap-3 pt-6 border-t border-admin-border">
                        <button
                            onClick={handleDelete}
                            className="px-6 py-3 rounded-xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 border border-red-500/20"
                        >
                            삭제
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push('/admin/stories')}
                                className="px-6 py-3 rounded-xl bg-admin-bg text-admin-text-secondary font-bold hover:text-white"
                            >
                                취소
                            </button>
                            <a
                                href={`/stories/${params.id}`}
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
                                {isSubmitting ? '저장 중...' : '스토리 저장하기'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
