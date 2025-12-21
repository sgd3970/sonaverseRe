"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { Badge } from "@/shared/components/ui/Badge"
import { Button } from "@/shared/components/ui/Button"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AdminHistoryPage() {
    const [isSeeding, setIsSeeding] = useState(false)

    // 연혁 목록 조회
    const { data, isLoading, mutate } = useSWR(
        '/api/admin/history',
        fetcher,
        { revalidateOnFocus: false }
    )

    const histories = data?.data || []

    // 초기 데이터 시딩
    const handleSeed = async () => {
        if (!confirm('초기 연혁 데이터를 생성하시겠습니까?')) return
        
        setIsSeeding(true)
        try {
            const res = await fetch('/api/admin/history/seed', { method: 'POST' })
            const result = await res.json()
            
            if (result.success) {
                alert(result.message)
                mutate()
            } else {
                alert(result.message || '시딩에 실패했습니다.')
            }
        } catch (error) {
            alert('시딩에 실패했습니다.')
        } finally {
            setIsSeeding(false)
        }
    }

    // 삭제 핸들러
    const handleDelete = async (id: string, year: number) => {
        if (!confirm(`${year}년 연혁을 삭제하시겠습니까?`)) return
        
        try {
            const res = await fetch(`/api/admin/history/${id}`, { method: 'DELETE' })
            if (res.ok) {
                mutate()
            } else {
                alert('삭제에 실패했습니다.')
            }
        } catch (error) {
            alert('삭제에 실패했습니다.')
        }
    }

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">연혁 관리</h1>
                    <p className="text-gray-500 mt-1">소나버스의 성장 여정을 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    {histories.length === 0 && (
                        <Button 
                            variant="outline" 
                            onClick={handleSeed}
                            disabled={isSeeding}
                        >
                            {isSeeding ? '생성 중...' : '초기 데이터 생성'}
                        </Button>
                    )}
                    <Button asChild>
                        <Link href="/admin/history/new">
                            <span className="material-symbols-outlined mr-2">add</span>
                            새 연혁 추가
                        </Link>
                    </Button>
                </div>
            </div>

            {/* 연혁 목록 */}
            {isLoading ? (
                <div className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-500">불러오는 중...</p>
                </div>
            ) : histories.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">timeline</span>
                        <p className="text-gray-500 mb-4">등록된 연혁이 없습니다</p>
                        <div className="flex gap-2 justify-center">
                            <Button variant="outline" onClick={handleSeed} disabled={isSeeding}>
                                {isSeeding ? '생성 중...' : '초기 데이터 생성'}
                            </Button>
                            <Button asChild>
                                <Link href="/admin/history/new">직접 추가하기</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {histories.map((history: {
                        id: string;
                        year: number;
                        title: string;
                        subtitle: string;
                        items: { text: string }[];
                        badgeColor: string;
                        textColor: string;
                        position: string;
                        isActive: boolean;
                    }) => (
                        <Card key={history.id} className="overflow-hidden">
                            <div className="flex">
                                {/* 연도 배지 */}
                                <div 
                                    className="w-24 shrink-0 flex items-center justify-center"
                                    style={{ backgroundColor: history.badgeColor }}
                                >
                                    <span 
                                        className="text-2xl font-bold"
                                        style={{ color: history.textColor }}
                                    >
                                        {history.year}
                                    </span>
                                </div>

                                {/* 내용 */}
                                <div className="flex-1 p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg text-gray-900">
                                                    {history.title}
                                                </h3>
                                                <Badge className={history.isActive 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-600'
                                                }>
                                                    {history.isActive ? '활성' : '비활성'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-500">{history.subtitle}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/admin/history/${history.id}`}>
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleDelete(history.id, history.year)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* 항목 목록 */}
                                    <div className="flex flex-wrap gap-2">
                                        {history.items.map((item: { text: string }, index: number) => (
                                            <span 
                                                key={index}
                                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                            >
                                                {item.text}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* 미리보기 링크 */}
            {histories.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-3">
                                <span className="material-symbols-outlined text-blue-600">info</span>
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium">연혁 타임라인</p>
                                    <p className="text-xs">홈페이지에서 연혁 섹션을 확인할 수 있습니다.</p>
                                </div>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/#history" target="_blank">
                                    <span className="material-symbols-outlined text-sm mr-1">visibility</span>
                                    미리보기
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

