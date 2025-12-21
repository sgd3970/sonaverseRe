"use client"

import { use } from "react"
import { MainLayout } from "@/shared/components/layout/MainLayout"
import { Button } from "@/shared/components/ui/Button"
import { Badge } from "@/shared/components/ui/Badge"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/Card"
import { ThumbnailImage } from "@/shared/components/ui/OptimizedImage"
import { useStory } from "@/lib/hooks"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

interface StoryDetailClientProps {
    params: Promise<{ id: string }>
}

export default function StoryDetailClient({ params }: StoryDetailClientProps) {
    const { id } = use(params)
    const { t, isLoading: isI18nLoading } = useTranslation()
    const { story, relatedStories, isLoading, isError } = useStory(id)

    // 날짜 포맷
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    if (isLoading || isI18nLoading) {
        return (
            <MainLayout>
                <article className="py-20 bg-white min-h-screen">
                    <div className="max-w-3xl mx-auto px-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-24 mx-auto mb-4" />
                        <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-6" />
                        <div className="h-4 bg-gray-100 rounded w-1/4 mx-auto mb-12" />
                        <div className="aspect-video bg-gray-200 rounded-2xl mb-12" />
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

    if (isError || !story) {
        return (
            <MainLayout>
                <article className="py-20 bg-white min-h-screen">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">article</span>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            스토리를 찾을 수 없습니다
                        </h1>
                        <p className="text-gray-600 mb-8">
                            요청하신 스토리가 존재하지 않거나 삭제되었습니다.
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/stories">{t('common.common.viewMore')}</Link>
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
                    {/* 헤더 */}
                    <div className="mb-8 text-center">
                        <Badge className="mb-4">{story.category}</Badge>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                            {story.title}
                        </h1>
                        {story.subtitle && (
                            <p className="text-xl text-gray-600 mb-6">{story.subtitle}</p>
                        )}
                        <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
                            <span>{formatDate(story.publishedAt)}</span>
                            {story.tags.length > 0 && (
                                <>
                                    <span>•</span>
                                    <span>{story.tags.slice(0, 2).join(', ')}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* 썸네일 이미지 */}
                    {story.thumbnailUrl && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-12">
                            <ThumbnailImage
                                src={story.thumbnailUrl}
                                alt={story.title}
                                title={story.title}
                                aspectRatio="16/9"
                                priority
                            />
                        </div>
                    )}

                    {/* YouTube 비디오 */}
                    {story.youtubeUrl && (
                        <div className="aspect-video mb-12 rounded-2xl overflow-hidden">
                            <iframe
                                src={`https://www.youtube.com/embed/${story.youtubeUrl.split('v=')[1]?.split('&')[0] || story.youtubeUrl}`}
                                className="w-full h-full"
                                allowFullScreen
                                title={story.title}
                            />
                        </div>
                    )}

                    {/* 본문 */}
                    <div
                        className="prose prose-lg max-w-none text-gray-800
                            prose-headings:font-bold prose-headings:text-gray-900
                            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                            prose-p:leading-relaxed prose-p:mb-6
                            prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
                            prose-ul:my-4 prose-li:my-1
                            prose-strong:text-gray-900"
                        dangerouslySetInnerHTML={{ __html: story.body }}
                    />

                    {/* 태그 */}
                    {story.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                                {story.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-sm">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 목록으로 돌아가기 */}
                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                        <Button asChild variant="outline" size="lg">
                            <Link href="/stories">
                                <span className="material-symbols-outlined mr-2">arrow_back</span>
                                {t('stories.title')}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* 관련 스토리 */}
                {relatedStories.length > 0 && (
                    <div className="mt-20 py-16 bg-gray-50">
                        <div className="container-custom">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">
                                {t('stories.relatedStories')}
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {relatedStories.map((related) => (
                                    <Card
                                        key={related.id}
                                        className="border-none shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden"
                                    >
                                        <ThumbnailImage
                                            src={related.thumbnailUrl}
                                            alt={related.title}
                                            title={related.title}
                                            aspectRatio="16/9"
                                            className="group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <CardHeader className="pb-2">
                                            <Badge variant="secondary" className="w-fit mb-2">{related.category}</Badge>
                                            <h3 className="font-bold line-clamp-2 group-hover:text-primary transition-colors">
                                                <Link href={`/stories/${related.slug}`}>{related.title}</Link>
                                            </h3>
                                        </CardHeader>
                                        <CardContent className="text-sm text-gray-400">
                                            {formatDate(related.publishedAt)}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </article>
        </MainLayout>
    )
}
