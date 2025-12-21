import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import Image from '@/lib/models/Image';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type'); // 'manbo' | 'bodume' | 'accessory' | 'other'
    const locale = searchParams.get('locale') || 'ko';

    // 쿼리 빌드 (Public API는 활성화된 제품만)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { 
      is_active: true,
      deleted_at: { $exists: false },
    };

    if (type) {
      query.type = type;
    }

    // 전체 개수
    const total = await Product.countDocuments(query);

    // 데이터 조회 - 최적화된 쿼리
    const products = await Product.find(query)
      .sort({ display_order: 1, created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('slug product_id sku type name subtitle short_description thumbnail_image_id hero_image_id pricing inventory is_featured is_new is_best view_count') // 필요한 필드만
      .lean();

    // 이미지 ID 수집
    const imageIds: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products.forEach((product: any) => {
      if (product.thumbnail_image_id) {
        imageIds.push(product.thumbnail_image_id.toString());
      }
    });

    // 이미지 조회 - 필요한 필드만
    const images = await Image.find({ _id: { $in: imageIds } })
      .select('url public_url')
      .lean();

    // 이미지 맵 생성
    const imageMap = new Map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      images
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((img: any) => img && (img.url || img.public_url))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((img: any) => [img._id.toString(), img.url || img.public_url])
    );

    // 응답 데이터 변환
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedProducts = products.map((product: any) => {
      const name = locale === 'en' && product.name?.en ? product.name.en : product.name?.ko || '';
      const subtitle = locale === 'en' && product.subtitle?.en ? product.subtitle.en : product.subtitle?.ko || '';
      const shortDescription = locale === 'en' && product.short_description?.en 
        ? product.short_description.en 
        : product.short_description?.ko || '';

      // 썸네일 이미지 URL
      let thumbnailUrl: string | null = null;
      if (product.thumbnail_image_id) {
        const url = imageMap.get(product.thumbnail_image_id.toString());
        if (url && url.trim() && (url.startsWith('http') || url.startsWith('/'))) {
          thumbnailUrl = url;
        }
      }

      return {
        id: product._id.toString(),
        slug: product.slug,
        productId: product.product_id,
        sku: product.sku,
        type: product.type,
        name,
        subtitle,
        shortDescription,
        thumbnailUrl,
        pricing: {
          retailPrice: product.pricing?.retail_price,
          salePrice: product.pricing?.sale_price,
          currency: product.pricing?.currency || 'KRW',
        },
        inventory: {
          isInStock: product.inventory?.is_in_stock ?? true,
        },
        isFeatured: product.is_featured || false,
        isNew: product.is_new || false,
        isBest: product.is_best || false,
        viewCount: product.view_count || 0,
        locale,
      };
    });

            const response = NextResponse.json({
              success: true,
              data: formattedProducts,
              pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
              },
            });

            // 캐싱 헤더 추가
            response.headers.set(
              'Cache-Control',
              'public, s-maxage=3600, stale-while-revalidate=86400'
            );

            return response;
  } catch (error) {
    console.error('Products List API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

