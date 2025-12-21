"use client"

import { use } from "react"
import { MainLayout } from "@/shared/components/layout/MainLayout"
import { Button } from "@/shared/components/ui/Button"
import { Badge } from "@/shared/components/ui/Badge"
import Link from "next/link"
import { usePressDetail } from "@/lib/hooks/usePress"
import { useTranslation } from "@/lib/i18n"

interface PressDetailClientProps {
    params: Promise<{ id: string }>
}

export default function PressDetailClient({ params }: PressDetailClientProps) {
    const { id } = use(params)
    const { press, isLoading, isError } = usePressDetail(id)
    const { t } = useTranslation()

    // 날짜 포맷
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).replace(/\. /g, '. ')
    }

    if (isLoading) {
        return (
            <MainLayout>
                <article className="py-20 bg-white min-h-screen">
                    <div className="max-w-3xl mx-auto px-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
                        <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
                        <div className="h-4 bg-gray-100 rounded w-1/4 mb-12" />
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-100 rounded" />
                            <div className="h-4 bg-gray-100 rounded" />
                            <div className="h-4 bg-gray-100 rounded w-3/4" />
                        </div>
                    </div>
                </article>
            </MainLayout>
        )
    }

    if (isError || !press) {
        return (
            <MainLayout>
                <article className="py-20 bg-white min-h-screen">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">newspaper</span>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            언론보도를 찾을 수 없습니다
                        </h1>
                        <p className="text-gray-600 mb-8">
                            요청하신 보도자료가 존재하지 않거나 삭제되었습니다.
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/press">목록으로 돌아가기</Link>
                        </Button>
                    </div>
                </article>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <article className="py-20 bg-white min-h-screen">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="mb-8 border-b border-gray-200 pb-8">
                        <Badge variant="secondary" className="mb-4">보도자료</Badge>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            {press.title}
                        </h1>
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                            <span className="font-medium text-gray-900">{press.pressName}</span>
                            <span>|</span>
                            <span>{formatDate(press.publishedAt)}</span>
                        </div>
                    </div>

                    <div
                        className="prose prose-lg max-w-none text-gray-800
                            prose-headings:font-bold prose-headings:text-gray-900
                            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                            prose-p:leading-relaxed prose-p:mb-6
                            prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
                            prose-ul:my-4 prose-li:my-1
                            prose-strong:text-gray-900"
                        dangerouslySetInnerHTML={{ __html: press.body }}
                    />

                    {press.externalUrl && (
                        <div className="bg-gray-100 p-6 rounded-lg my-8">
                            <p className="text-sm text-gray-500 mb-2">원문 보기</p>
                            <a
                                href={press.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium break-all"
                            >
                                {press.externalUrl}
                            </a>
                        </div>
                    )}

                    <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center">
                        <Button asChild variant="outline" size="lg">
                            <Link href="/press">
                                <span className="material-symbols-outlined mr-2">arrow_back</span>
                                목록으로 돌아가기
                            </Link>
                        </Button>
                    </div>
                </div>
            </article>
        </MainLayout>
    )
}
