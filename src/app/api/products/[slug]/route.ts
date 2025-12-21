import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import Image from '@/lib/models/Image';
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await dbConnect();

    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ko';

    // slug 또는 _id로 조회 - 최적화된 쿼리
    const query = mongoose.Types.ObjectId.isValid(slug)
      ? { _id: slug, is_active: true, deleted_at: { $exists: false } }
      : { slug, is_active: true, deleted_at: { $exists: false } };

    const product = await Product.findOne(query)
      .select('-__v -created_by -updated_by') // 불필요한 필드 제외
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productData = product as any;

    // 이미지 ID 수집
    const imageIds: string[] = [];
    if (productData.thumbnail_image_id) {
      imageIds.push(productData.thumbnail_image_id.toString());
    }
    if (productData.hero_image_id) {
      imageIds.push(productData.hero_image_id.toString());
    }
    if (productData.gallery_image_ids && Array.isArray(productData.gallery_image_ids)) {
      productData.gallery_image_ids.forEach((id: mongoose.Types.ObjectId) => {
        imageIds.push(id.toString());
      });
    }

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

    // 로케일에 맞는 데이터 추출
    const name = locale === 'en' && productData.name?.en ? productData.name.en : productData.name?.ko || '';
    const subtitle = locale === 'en' && productData.subtitle?.en ? productData.subtitle.en : productData.subtitle?.ko || '';
    const shortDescription = locale === 'en' && productData.short_description?.en 
      ? productData.short_description.en 
      : productData.short_description?.ko || '';
    const description = locale === 'en' && productData.description?.en 
      ? productData.description.en 
      : productData.description?.ko || '';
    const features = locale === 'en' && productData.features?.en 
      ? productData.features.en 
      : productData.features?.ko || [];

    // 이미지 URL 추출
    const thumbnailUrl = productData.thumbnail_image_id 
      ? imageMap.get(productData.thumbnail_image_id.toString()) || null
      : null;
    const heroUrl = productData.hero_image_id 
      ? imageMap.get(productData.hero_image_id.toString()) || null
      : null;
    const galleryUrls = productData.gallery_image_ids 
      ? productData.gallery_image_ids
          .map((id: mongoose.Types.ObjectId) => imageMap.get(id.toString()))
          .filter(Boolean)
      : [];

    // 스펙 변환
    const specifications = (productData.specifications || []).map((spec: any) => ({
      key: spec.key,
      value: locale === 'en' && spec.value_en ? spec.value_en : spec.value_ko,
      unit: spec.unit,
      order: spec.order,
    }));

    // 응답 데이터 변환
    const formattedProduct = {
      id: productData._id.toString(),
      slug: productData.slug,
      productId: productData.product_id,
      sku: productData.sku,
      type: productData.type,
      name,
      subtitle,
      shortDescription,
      description,
      features,
      specifications,
      thumbnailUrl,
      heroUrl,
      galleryUrls,
      pricing: {
        retailPrice: productData.pricing?.retail_price,
        salePrice: productData.pricing?.sale_price,
        discountRate: productData.pricing?.discount_rate,
        currency: productData.pricing?.currency || 'KRW',
        taxIncluded: productData.pricing?.tax_included ?? true,
        pricingNote: locale === 'en' && productData.pricing?.pricing_note_en
          ? productData.pricing.pricing_note_en
          : productData.pricing?.pricing_note_ko,
      },
      inventory: {
        isInStock: productData.inventory?.is_in_stock ?? true,
        quantity: productData.inventory?.quantity,
        allowBackorder: productData.inventory?.allow_backorder ?? false,
      },
      purchaseOptions: {
        minQuantity: productData.purchase_options?.min_quantity ?? 1,
        maxQuantity: productData.purchase_options?.max_quantity,
        purchaseLink: productData.purchase_options?.purchase_link,
      },
      isFeatured: productData.is_featured || false,
      isNew: productData.is_new || false,
      isBest: productData.is_best || false,
      viewCount: productData.view_count || 0,
      likeCount: productData.like_count || 0,
      reviewCount: productData.review_count || 0,
      averageRating: productData.average_rating || 0,
      locale,
    };

    // 관련 제품 조회 - 최적화된 쿼리 (병렬 처리)
    const [productResult, relatedProducts] = await Promise.all([
      Promise.resolve(product),
      Product.find({
        _id: { $ne: productData._id },
        type: productData.type,
        is_active: true,
        deleted_at: { $exists: false },
      })
        .sort({ display_order: 1, created_at: -1 })
        .limit(3)
        .select('slug name thumbnail_image_id pricing') // 필요한 필드만
        .lean(),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedRelated = relatedProducts.map((p: any) => {
      const relName = locale === 'en' && p.name?.en ? p.name.en : p.name?.ko || '';
      const relThumbnailUrl = p.thumbnail_image_id 
        ? imageMap.get(p.thumbnail_image_id.toString()) || null
        : null;

      return {
        id: p._id.toString(),
        slug: p.slug,
        name: relName,
        thumbnailUrl: relThumbnailUrl,
        pricing: {
          salePrice: p.pricing?.sale_price,
          currency: p.pricing?.currency || 'KRW',
        },
      };
    });

    const response = NextResponse.json({
      success: true,
      data: formattedProduct,
      relatedProducts: formattedRelated,
    });

    // 캐싱 헤더 추가
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    );

    return response;
  } catch (error) {
    console.error('Product Detail API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

