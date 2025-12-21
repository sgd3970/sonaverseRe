import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/db'
import Product from '@/lib/models/Product'
import { v4 as uuidv4 } from 'uuid'
import { getSession } from '@/lib/auth'

// 제품 목록 조회
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
        const type = searchParams.get('type')

        // 쿼리 빌드
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = { deleted_at: { $exists: false } }

        if (search) {
            query.$or = [
                { 'name.ko': { $regex: search, $options: 'i' } },
                { 'name.en': { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
            ]
        }

        if (type) {
            query.type = type
        }

        const total = await Product.countDocuments(query)

        const products = await Product.find(query)
            .sort({ display_order: 1, created_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedProducts = products.map((product: any) => ({
            id: product._id.toString(),
            slug: product.slug,
            productId: product.product_id,
            sku: product.sku,
            type: product.type,
            name: product.name?.ko || '',
            nameEn: product.name?.en || '',
            subtitle: product.subtitle?.ko || '',
            retailPrice: product.pricing?.retail_price,
            salePrice: product.pricing?.sale_price,
            isActive: product.is_active,
            isFeatured: product.is_featured,
            isNew: product.is_new,
            isBest: product.is_best,
            inStock: product.inventory?.is_in_stock,
            quantity: product.inventory?.quantity,
            viewCount: product.view_count || 0,
            displayOrder: product.display_order,
            createdAt: product.created_at,
        }))

        return NextResponse.json({
            success: true,
            data: formattedProducts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json(
            { success: false, message: '제품 목록 조회에 실패했습니다.' },
            { status: 500 }
        )
    }
}

// 제품 생성
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

        // 필수 필드 검증
        if (!body.name?.ko?.trim()) {
            return NextResponse.json(
                { success: false, message: '제품명을 입력해주세요.' },
                { status: 400 }
            )
        }
        if (!body.slug?.trim()) {
            return NextResponse.json(
                { success: false, message: '슬러그를 입력해주세요.' },
                { status: 400 }
            )
        }

        // 슬러그 중복 확인
        const existingProduct = await Product.findOne({ slug: body.slug })
        if (existingProduct) {
            return NextResponse.json(
                { success: false, message: '이미 사용 중인 슬러그입니다.' },
                { status: 400 }
            )
        }

        const product = await Product.create({
            product_id: body.product_id || `PROD-${uuidv4().substring(0, 8).toUpperCase()}`,
            slug: body.slug,
            sku: body.sku,
            type: body.type || 'other',
            name: body.name,
            subtitle: body.subtitle,
            short_description: body.short_description,
            description: body.description,
            content: body.content,
            hero_image_id: body.hero_image_id,
            thumbnail_image_id: body.thumbnail_image_id,
            gallery_image_ids: body.gallery_image_ids || [],
            video_ids: body.video_ids || [],
            category_id: body.category_id,
            subcategory_ids: body.subcategory_ids || [],
            tags: body.tags || [],
            features: body.features || { ko: [], en: [] },
            specifications: body.specifications || [],
            pricing: body.pricing || {
                currency: 'KRW',
                tax_included: true,
            },
            inventory: body.inventory || {
                track_inventory: true,
                quantity: 0,
                is_in_stock: true,
                allow_backorder: false,
            },
            purchase_options: body.purchase_options || {
                min_quantity: 1,
                requires_login: false,
            },
            shipping: body.shipping || {
                requires_shipping: true,
            },
            related_product_ids: body.related_product_ids || [],
            related_story_ids: body.related_story_ids || [],
            seo: body.seo || {},
            display_order: body.display_order || 0,
            is_active: body.is_active || false,
            is_featured: body.is_featured || false,
            is_new: body.is_new || false,
            is_best: body.is_best || false,
            sales_start_at: body.sales_start_at,
            sales_end_at: body.sales_end_at,
            view_count: 0,
            like_count: 0,
            review_count: 0,
            average_rating: 0,
            created_by: session.userId,
            created_at: new Date(),
            updated_at: new Date(),
        })

        return NextResponse.json({
            success: true,
            data: {
                id: product._id.toString(),
                slug: product.slug,
            }
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating product:', error)
        return NextResponse.json(
            { success: false, message: '제품 생성에 실패했습니다.' },
            { status: 500 }
        )
    }
}
