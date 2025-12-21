import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/db'
import PressRelease from '@/lib/models/PressRelease'
import { v4 as uuidv4 } from 'uuid'
import { getSession } from '@/lib/auth'

// 언론보도 목록 조회
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
        const search = searchParams.get('search')

        // 쿼리 빌드
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = { deleted_at: { $exists: false } }

        if (search) {
            query.$or = [
                { 'title.ko': { $regex: search, $options: 'i' } },
                { 'title.en': { $regex: search, $options: 'i' } },
                { 'press_name.ko': { $regex: search, $options: 'i' } },
            ]
        }

        const total = await PressRelease.countDocuments(query)

        const pressItems = await PressRelease.find(query)
            .sort({ published_date: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedPress = pressItems.map((press: any) => ({
            id: press._id.toString(),
            slug: press.slug,
            title: press.title?.ko || '',
            titleEn: press.title?.en || '',
            pressName: press.press_name?.ko || '',
            pressNameEn: press.press_name?.en || '',
            excerpt: press.excerpt?.ko || '',
            thumbnailUrl: press.thumbnail_url,
            externalUrl: press.external_url,
            isPublished: press.is_published,
            isFeatured: press.is_featured,
            viewCount: press.view_count || 0,
            publishedDate: press.published_date,
            createdAt: press.created_at,
        }))

        return NextResponse.json({
            success: true,
            data: formattedPress,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching press:', error)
        return NextResponse.json(
            { success: false, message: '언론보도 목록 조회에 실패했습니다.' },
            { status: 500 }
        )
    }
}

// 언론보도 생성
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
            pressName,
            pressNameEn,
            excerpt,
            excerptEn,
            content,
            contentEn,
            externalUrl,
            thumbnailImageId,
            publishedDate,
            isPublished,
            isFeatured,
        } = body

        // 필수 필드 검증
        if (!title?.trim()) {
            return NextResponse.json(
                { success: false, message: '제목을 입력해주세요.' },
                { status: 400 }
            )
        }
        if (!pressName?.trim()) {
            return NextResponse.json(
                { success: false, message: '언론사를 입력해주세요.' },
                { status: 400 }
            )
        }

        // 슬러그 생성 (한글 지원 및 UUID 폴백)
        let generatedSlug = slug
        if (!generatedSlug) {
            const sanitized = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            generatedSlug = sanitized || `press-${uuidv4().substring(0, 8)}`
        }

        // 슬러그 중복 확인
        const existingPress = await PressRelease.findOne({ slug: generatedSlug })
        if (existingPress) {
            return NextResponse.json(
                { success: false, message: '이미 사용 중인 슬러그입니다.' },
                { status: 400 }
            )
        }

        const press = await PressRelease.create({
            press_id: `PRS-${uuidv4().substring(0, 8).toUpperCase()}`,
            slug: generatedSlug,
            title: { ko: title, en: titleEn || '' },
            press_name: { ko: pressName, en: pressNameEn || pressName },
            excerpt: { ko: excerpt || '', en: excerptEn || '' },
            content: { ko: content || title, en: contentEn || '' },
            external_url: externalUrl || '',
            thumbnail_image_id: thumbnailImageId || undefined,
            published_date: publishedDate ? new Date(publishedDate) : new Date(),
            is_published: isPublished || false,
            is_featured: isFeatured || false,
            view_count: 0,
            created_by: session.userId,
            created_at: new Date(),
            updated_at: new Date(),
        })

        return NextResponse.json({
            success: true,
            data: {
                id: press._id.toString(),
                slug: press.slug,
            }
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating press:', error)
        return NextResponse.json(
            { success: false, message: '언론보도 생성에 실패했습니다.' },
            { status: 500 }
        )
    }
}

