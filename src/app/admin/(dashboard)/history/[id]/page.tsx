"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Badge } from "@/shared/components/ui/Badge"
import { Button } from "@/shared/components/ui/Button"
import { Input } from "@/shared/components/ui/Input"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AdminHistoryEditPage() {
    const params = useParams()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        year: 2024,
        title: '',
        titleEn: '',
        subtitle: '',
        subtitleEn: '',
        items: [{ text: '', textEn: '' }],
        badgeColor: '#0b3877',
        textColor: '#ffffff',
        isActive: true,
    })

    // 연혁 조회
    const { data, isLoading } = useSWR(
        params.id ? `/api/admin/history/${params.id}` : null,
        fetcher,
        { revalidateOnFocus: false }
    )

    // 데이터 로드 시 폼 초기화
    useEffect(() => {
        if (data?.data) {
            const history = data.data
            setFormData({
                year: history.year,
                title: history.title || '',
                titleEn: history.titleEn || '',
                subtitle: history.subtitle || '',
                subtitleEn: history.subtitleEn || '',
                items: history.items?.length > 0 
                    ? history.items.map((item: { text: string; textEn?: string }) => ({
                        text: item.text || '',
                        textEn: item.textEn || '',
                    }))
                    : [{ text: '', textEn: '' }],
                badgeColor: history.badgeColor || '#0b3877',
                textColor: history.textColor || '#ffffff',
                isActive: history.isActive !== false,
            })
        }
    }, [data])

    // 항목 추가
    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { text: '', textEn: '' }]
        }))
    }

    // 항목 삭제
    const removeItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }))
    }

    // 항목 수정
    const updateItem = (index: number, field: 'text' | 'textEn', value: string) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }))
    }

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            alert('제목을 입력해주세요.')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/admin/history/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    items: formData.items.filter(item => item.text.trim())
                }),
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
            const res = await fetch(`/api/admin/history/${params.id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                router.push('/admin/history')
            } else {
                alert('삭제에 실패했습니다.')
            }
        } catch (error) {
            alert('삭제에 실패했습니다.')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        )
    }

    if (!data?.data) {
        return (
            <div className="text-center py-12">
                <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">error</span>
                <p className="text-gray-500 mb-4">연혁을 찾을 수 없습니다.</p>
                <Button asChild variant="outline">
                    <Link href="/admin/history">목록으로 돌아가기</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/admin/history">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">{formData.year}년 연혁 수정</h1>
                        <Badge className={formData.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }>
                            {formData.isActive ? '활성' : '비활성'}
                        </Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline"
                        onClick={handleDelete}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                        삭제
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? '저장 중...' : '저장하기'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* 왼쪽: 메인 컨텐츠 */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 기본 정보 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>기본 정보</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        연도 *
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || 2024 }))}
                                        min={2000}
                                        max={2100}
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                            className="w-4 h-4 text-primary rounded border-gray-300"
                                        />
                                        <label htmlFor="isActive" className="text-sm text-gray-700">활성화</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    제목 (한국어) *
                                </label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="예: ㈜소나버스 법인 설립"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    제목 (영어)
                                </label>
                                <Input
                                    value={formData.titleEn}
                                    onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                                    placeholder="e.g., Sonaverse Inc. Established"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    부제목 (한국어)
                                </label>
                                <Input
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    부제목 (영어)
                                </label>
                                <Input
                                    value={formData.subtitleEn}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subtitleEn: e.target.value }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 주요 이벤트 */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>주요 이벤트</CardTitle>
                                <Button variant="outline" size="sm" onClick={addItem}>
                                    <span className="material-symbols-outlined text-sm mr-1">add</span>
                                    항목 추가
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.items.map((item, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            value={item.text}
                                            onChange={(e) => updateItem(index, 'text', e.target.value)}
                                            placeholder="이벤트 내용 (한국어)"
                                        />
                                        <Input
                                            value={item.textEn}
                                            onChange={(e) => updateItem(index, 'textEn', e.target.value)}
                                            placeholder="Event content (English)"
                                            className="text-sm"
                                        />
                                    </div>
                                    {formData.items.length > 1 && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => removeItem(index)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* 오른쪽: 스타일 설정 */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">스타일 설정</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    배지 배경색
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.badgeColor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, badgeColor: e.target.value }))}
                                        className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
                                    />
                                    <Input
                                        value={formData.badgeColor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, badgeColor: e.target.value }))}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    배지 텍스트색
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.textColor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                                        className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
                                    />
                                    <Input
                                        value={formData.textColor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 미리보기 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">미리보기</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div 
                                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                                    style={{ backgroundColor: formData.badgeColor }}
                                >
                                    <span 
                                        className="font-bold text-lg"
                                        style={{ color: formData.textColor }}
                                    >
                                        {formData.year}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900">{formData.title || '제목'}</p>
                                    <p className="text-sm text-gray-500">{formData.subtitle || '부제목'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

