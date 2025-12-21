import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/db'
import SonaverseStory from '@/lib/models/SonaverseStory'
import { v4 as uuidv4 } from 'uuid'
import { getSession } from '@/lib/auth'

/**
 * Retrieves a paginated list of stories.
 * 
 * @route GET /api/admin/stories
 * @param {NextRequest} request - The request object containing query parameters (page, limit, category, search).
 * @returns {Promise<NextResponse>} JSON response with stories data and pagination info.
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await dbConnect()

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const category = searchParams.get('category')
        const search = searchParams.get('search')

        // 쿼리 빌드
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = { deleted_at: { $exists: false } }

        if (category && category !== 'all') {
            query.category = category
        }

        if (search) {
            query.$or = [
                { 'title.ko': { $regex: search, $options: 'i' } },
                { 'title.en': { $regex: search, $options: 'i' } },
            ]
        }

        const total = await SonaverseStory.countDocuments(query)

        const stories = await SonaverseStory.find(query)
            .sort({ created_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedStories = stories.map((story: any) => ({
            id: story._id.toString(),
            slug: story.slug,
            title: story.title?.ko || '',
            titleEn: story.title?.en || '',
            category: story.category,
            excerpt: story.excerpt?.ko || '',
            thumbnailUrl: story.thumbnail_url,
            isPublished: story.is_published,
            viewCount: story.view_count || 0,
            createdAt: story.created_at,
            publishedDate: story.published_date,
        }))

        return NextResponse.json({
            success: true,
            data: formattedStories,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching stories:', error)
        return NextResponse.json(
            { success: false, message: '스토리 목록 조회에 실패했습니다.' },
            { status: 500 }
        )
    }
}

// 카테고리 매핑
const categoryMap: Record<string, string> = {
    'brand': 'company_news',
    'product': 'product_story',
    'people': 'interview',
    'news': 'company_news',
}

/**
 * Creates a new story.
 * 
 * @route POST /api/admin/stories
 * @param {NextRequest} request - The request object containing story details in the body.
 * @returns {Promise<NextResponse>} JSON response with the created story ID and slug.
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await dbConnect()

        const body = await request.json()
        const {
            title,
            titleEn,
            slug,
            category,
            excerpt,
            excerptEn,
            content,
            contentEn,
            thumbnailImageId,
            isPublished,
        } = body

        // 필수 필드 검증
        if (!title?.trim()) {
            return NextResponse.json(
                { success: false, message: '제목을 입력해주세요.' },
                { status: 400 }
            )
        }

        // 슬러그 생성 (한글 지원 및 UUID 폴백)
        let storySlug = slug
        if (!storySlug) {
            // 영문/숫자/- 외의 문자는 제거하되, 한글이 모두 제거되어 빈 문자열이 되면 UUID 사용
            const sanitized = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            storySlug = sanitized || `story-${uuidv4().substring(0, 8)}`
        }

        // 슬러그 중복 확인
        const existingStory = await SonaverseStory.findOne({ slug: storySlug })
        if (existingStory) {
            return NextResponse.json(
                { success: false, message: '이미 사용 중인 슬러그입니다.' },
                { status: 400 }
            )
        }

        // 카테고리 매핑
        const mappedCategory = categoryMap[category] || 'company_news'

        const story = await SonaverseStory.create({
            story_id: `STR-${uuidv4().substring(0, 8).toUpperCase()}`,
            slug: storySlug,
            category: mappedCategory,
            title: { ko: title, en: titleEn || '' },
            excerpt: { ko: excerpt || '', en: excerptEn || '' },
            content: {
                ko: { body: content || '' },
                en: { body: contentEn || '' }
            },
            thumbnail_image_id: thumbnailImageId || undefined,
            is_published: isPublished || false,
            published_date: new Date(),
            view_count: 0,
            created_by: session.userId,
            created_at: new Date(),
            updated_at: new Date(),
        })

        return NextResponse.json({
            success: true,
            data: {
                id: story._id.toString(),
                slug: story.slug,
            }
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating story:', error)
        return NextResponse.json(
            { success: false, message: '스토리 생성에 실패했습니다.' },
            { status: 500 }
        )
    }
}

