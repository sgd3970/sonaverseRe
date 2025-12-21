import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/lib/models/Product'
import { getSession } from '@/lib/auth'

// 제품 상세 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await dbConnect()
        const { id } = await params

        const product = await Product.findById(id)

        if (!product) {
            return NextResponse.json(
                { success: false, message: '제품을 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: {
                id: product._id,
                product_id: product.product_id,
                slug: product.slug,
                sku: product.sku,
                type: product.type,
                name: product.name,
                subtitle: product.subtitle,
                short_description: product.short_description,
                description: product.description,
                content: product.content,
                hero_image_id: product.hero_image_id,
                thumbnail_image_id: product.thumbnail_image_id,
                gallery_image_ids: product.gallery_image_ids,
                video_ids: product.video_ids,
                category_id: product.category_id,
                subcategory_ids: product.subcategory_ids,
                tags: product.tags,
                features: product.features,
                specifications: product.specifications,
                pricing: product.pricing,
                inventory: product.inventory,
                purchase_options: product.purchase_options,
                shipping: product.shipping,
                related_product_ids: product.related_product_ids,
                related_story_ids: product.related_story_ids,
                view_count: product.view_count,
                like_count: product.like_count,
                review_count: product.review_count,
                average_rating: product.average_rating,
                seo: product.seo,
                display_order: product.display_order,
                is_active: product.is_active,
                is_featured: product.is_featured,
                is_new: product.is_new,
                is_best: product.is_best,
                sales_start_at: product.sales_start_at,
                sales_end_at: product.sales_end_at,
                version: product.version,
                created_at: product.created_at,
                updated_at: product.updated_at,
            }
        })
    } catch (error) {
        console.error('Error fetching product:', error)
        return NextResponse.json(
            { success: false, message: '제품 조회에 실패했습니다.' },
            { status: 500 }
        )
    }
}

// 제품 수정
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await dbConnect()
        const { id } = await params

        const body = await request.json()

        // 슬러그 중복 확인 (자기 자신 제외)
        if (body.slug) {
            const existingProduct = await Product.findOne({
                slug: body.slug,
                _id: { $ne: id }
            })
            if (existingProduct) {
                return NextResponse.json(
                    { success: false, message: '이미 사용 중인 슬러그입니다.' },
                    { status: 400 }
                )
            }
        }

        const currentProduct = await Product.findById(id)
        if (!currentProduct) {
            return NextResponse.json(
                { success: false, message: '제품을 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        // 업데이트 데이터
        const updateData: Record<string, unknown> = {
            updated_at: new Date(),
            updated_by: session.userId,
        }

        // 각 필드별 업데이트
        if (body.slug !== undefined) updateData.slug = body.slug
        if (body.sku !== undefined) updateData.sku = body.sku
        if (body.type !== undefined) updateData.type = body.type
        if (body.name !== undefined) updateData.name = body.name
        if (body.subtitle !== undefined) updateData.subtitle = body.subtitle
        if (body.short_description !== undefined) updateData.short_description = body.short_description
        if (body.description !== undefined) updateData.description = body.description
        if (body.content !== undefined) updateData.content = body.content
        if (body.hero_image_id !== undefined) updateData.hero_image_id = body.hero_image_id
        if (body.thumbnail_image_id !== undefined) updateData.thumbnail_image_id = body.thumbnail_image_id
        if (body.gallery_image_ids !== undefined) updateData.gallery_image_ids = body.gallery_image_ids
        if (body.video_ids !== undefined) updateData.video_ids = body.video_ids
        if (body.category_id !== undefined) updateData.category_id = body.category_id
        if (body.subcategory_ids !== undefined) updateData.subcategory_ids = body.subcategory_ids
        if (body.tags !== undefined) updateData.tags = body.tags
        if (body.features !== undefined) updateData.features = body.features
        if (body.specifications !== undefined) updateData.specifications = body.specifications
        if (body.pricing !== undefined) updateData.pricing = body.pricing
        if (body.inventory !== undefined) updateData.inventory = body.inventory
        if (body.purchase_options !== undefined) updateData.purchase_options = body.purchase_options
        if (body.shipping !== undefined) updateData.shipping = body.shipping
        if (body.related_product_ids !== undefined) updateData.related_product_ids = body.related_product_ids
        if (body.related_story_ids !== undefined) updateData.related_story_ids = body.related_story_ids
        if (body.seo !== undefined) updateData.seo = body.seo
        if (body.display_order !== undefined) updateData.display_order = body.display_order
        if (body.is_active !== undefined) updateData.is_active = body.is_active
        if (body.is_featured !== undefined) updateData.is_featured = body.is_featured
        if (body.is_new !== undefined) updateData.is_new = body.is_new
        if (body.is_best !== undefined) updateData.is_best = body.is_best
        if (body.sales_start_at !== undefined) updateData.sales_start_at = body.sales_start_at
        if (body.sales_end_at !== undefined) updateData.sales_end_at = body.sales_end_at

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )

        return NextResponse.json({
            success: true,
            data: product
        })
    } catch (error) {
        console.error('Error updating product:', error)
        return NextResponse.json(
            { success: false, message: '제품 수정에 실패했습니다.' },
            { status: 500 }
        )
    }
}

// 제품 삭제 (소프트 삭제)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await dbConnect()
        const { id } = await params

        const product = await Product.findByIdAndUpdate(
            id,
            {
                deleted_at: new Date(),
                updated_at: new Date(),
                updated_by: session.userId,
            },
            { new: true }
        )

        if (!product) {
            return NextResponse.json(
                { success: false, message: '제품을 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: '제품이 삭제되었습니다.'
        })
    } catch (error) {
        console.error('Error deleting product:', error)
        return NextResponse.json(
            { success: false, message: '제품 삭제에 실패했습니다.' },
            { status: 500 }
        )
    }
}
