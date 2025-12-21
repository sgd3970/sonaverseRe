import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import PressRelease from '@/lib/models/PressRelease'

// 언론보도 상세 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()
        const { id } = await params
        
        const press = await PressRelease.findById(id)
        
        if (!press) {
            return NextResponse.json(
                { success: false, message: '언론보도를 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: {
                id: press._id,
                pressId: press.press_id,
                slug: press.slug,
                title: press.title?.ko || '',
                titleEn: press.title?.en || '',
                pressName: press.press_name?.ko || '',
                pressNameEn: press.press_name?.en || '',
                excerpt: press.excerpt?.ko || '',
                excerptEn: press.excerpt?.en || '',
                content: press.content?.ko || '',
                contentEn: press.content?.en || '',
                externalUrl: press.external_url,
                thumbnailImageId: press.thumbnail_image_id,
                featuredImageId: press.featured_image_id,
                publishedDate: press.published_date,
                isPublished: press.is_published,
                isFeatured: press.is_featured,
                viewCount: press.view_count,
                createdAt: press.created_at,
                updatedAt: press.updated_at,
            }
        })
    } catch (error) {
        console.error('Error fetching press:', error)
        return NextResponse.json(
            { success: false, message: '언론보도 조회에 실패했습니다.' },
            { status: 500 }
        )
    }
}

// 언론보도 수정
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

        // 슬러그 중복 확인 (자기 자신 제외)
        if (slug) {
            const existingPress = await PressRelease.findOne({ 
                slug, 
                _id: { $ne: id } 
            })
            if (existingPress) {
                return NextResponse.json(
                    { success: false, message: '이미 사용 중인 슬러그입니다.' },
                    { status: 400 }
                )
            }
        }

        const currentPress = await PressRelease.findById(id)
        if (!currentPress) {
            return NextResponse.json(
                { success: false, message: '언론보도를 찾을 수 없습니다.' },
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
        if (pressName !== undefined) updateData['press_name.ko'] = pressName
        if (pressNameEn !== undefined) updateData['press_name.en'] = pressNameEn
        if (excerpt !== undefined) updateData['excerpt.ko'] = excerpt
        if (excerptEn !== undefined) updateData['excerpt.en'] = excerptEn
        if (content !== undefined) updateData['content.ko'] = content
        if (contentEn !== undefined) updateData['content.en'] = contentEn
        if (externalUrl !== undefined) updateData.external_url = externalUrl
        if (thumbnailImageId !== undefined) updateData.thumbnail_image_id = thumbnailImageId
        if (publishedDate !== undefined) updateData.published_date = new Date(publishedDate)
        if (isPublished !== undefined) updateData.is_published = isPublished
        if (isFeatured !== undefined) updateData.is_featured = isFeatured

        const press = await PressRelease.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )

        return NextResponse.json({
            success: true,
            data: press
        })
    } catch (error) {
        console.error('Error updating press:', error)
        return NextResponse.json(
            { success: false, message: '언론보도 수정에 실패했습니다.' },
            { status: 500 }
        )
    }
}

// 언론보도 삭제 (소프트 삭제)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()
        const { id } = await params
        
        const press = await PressRelease.findByIdAndUpdate(
            id,
            { 
                deleted_at: new Date(),
                updated_at: new Date(),
            },
            { new: true }
        )
        
        if (!press) {
            return NextResponse.json(
                { success: false, message: '언론보도를 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: '언론보도가 삭제되었습니다.'
        })
    } catch (error) {
        console.error('Error deleting press:', error)
        return NextResponse.json(
            { success: false, message: '언론보도 삭제에 실패했습니다.' },
            { status: 500 }
        )
    }
}

