import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import SonaverseStory from '@/lib/models/SonaverseStory'

// 스토리 상세 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()
        const { id } = await params
        
        const story = await SonaverseStory.findById(id)
        
        if (!story) {
            return NextResponse.json(
                { success: false, message: '스토리를 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: {
                id: story._id,
                storyId: story.story_id,
                slug: story.slug,
                category: story.category,
                title: story.title?.ko || '',
                titleEn: story.title?.en || '',
                excerpt: story.excerpt?.ko || '',
                excerptEn: story.excerpt?.en || '',
                content: story.content?.ko || '',
                contentEn: story.content?.en || '',
                thumbnailImageId: story.thumbnail_image_id,
                featuredImageId: story.featured_image_id,
                youtubeUrl: story.youtube_url,
                isPublished: story.is_published,
                publishedDate: story.published_date,
                viewCount: story.view_count,
                createdAt: story.created_at,
                updatedAt: story.updated_at,
            }
        })
    } catch (error) {
        console.error('Error fetching story:', error)
        return NextResponse.json(
            { success: false, message: '스토리 조회에 실패했습니다.' },
            { status: 500 }
        )
    }
}

// 스토리 수정
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()
        const { id } = await params
        
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

        // 슬러그 중복 확인 (자기 자신 제외)
        if (slug) {
            const existingStory = await SonaverseStory.findOne({ 
                slug, 
                _id: { $ne: id } 
            })
            if (existingStory) {
                return NextResponse.json(
                    { success: false, message: '이미 사용 중인 슬러그입니다.' },
                    { status: 400 }
                )
            }
        }

        const currentStory = await SonaverseStory.findById(id)
        if (!currentStory) {
            return NextResponse.json(
                { success: false, message: '스토리를 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        // 업데이트 데이터
        const updateData: Record<string, unknown> = {
            updated_at: new Date(),
        }

        if (title !== undefined) updateData['title.ko'] = title
        if (titleEn !== undefined) updateData['title.en'] = titleEn
        if (slug !== undefined) updateData.slug = slug
        if (category !== undefined) updateData.category = category
        if (excerpt !== undefined) updateData['excerpt.ko'] = excerpt
        if (excerptEn !== undefined) updateData['excerpt.en'] = excerptEn
        if (content !== undefined) updateData['content.ko.body'] = content
        if (contentEn !== undefined) updateData['content.en.body'] = contentEn
        if (thumbnailImageId !== undefined) updateData.thumbnail_image_id = thumbnailImageId
        if (isPublished !== undefined) {
            updateData.is_published = isPublished
            // 처음 게시되는 경우 published_date 설정
            if (isPublished && !currentStory.published_date) {
                updateData.published_date = new Date()
            }
        }

        const story = await SonaverseStory.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )

        return NextResponse.json({
            success: true,
            data: story
        })
    } catch (error) {
        console.error('Error updating story:', error)
        return NextResponse.json(
            { success: false, message: '스토리 수정에 실패했습니다.' },
            { status: 500 }
        )
    }
}

// 스토리 삭제 (소프트 삭제)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()
        const { id } = await params
        
        const story = await SonaverseStory.findByIdAndUpdate(
            id,
            { 
                deleted_at: new Date(),
                updated_at: new Date(),
            },
            { new: true }
        )
        
        if (!story) {
            return NextResponse.json(
                { success: false, message: '스토리를 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: '스토리가 삭제되었습니다.'
        })
    } catch (error) {
        console.error('Error deleting story:', error)
        return NextResponse.json(
            { success: false, message: '스토리 삭제에 실패했습니다.' },
            { status: 500 }
        )
    }
}

