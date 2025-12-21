import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PressRelease from '@/lib/models/PressRelease';
import Image from '@/lib/models/Image';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const locale = searchParams.get('locale') || 'ko';

    // 쿼리 빌드
    const query = { 
      is_published: true,
      deleted_at: { $exists: false }
    };

    // 전체 개수
    const total = await PressRelease.countDocuments(query);

    // 데이터 조회
    const pressItems = await PressRelease.find(query)
      .sort({ published_date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // 이미지 ID 수집
    const imageIds = pressItems
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => item.thumbnail_image_id)
      .filter(Boolean);

    // 이미지 조회
    const images = await Image.find({ _id: { $in: imageIds } })
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

    // 응답 데이터 변환 (로케일에 맞게)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedPress = pressItems.map((press: any) => {
      // 1. Title Resolution
      let title = '';
      if (press.content && press.content[locale] && press.content[locale].title) {
        title = press.content[locale].title;
      } else if (press.title && press.title[locale]) {
        title = press.title[locale];
      }

      // 2. Press Name Resolution
      let pressName = '';
      if (press.press_name && press.press_name[locale]) {
        pressName = press.press_name[locale];
      }

      // 3. Excerpt/Body Resolution
      let rawContent = '';
      let subtitle = '';
      
      if (press.content && press.content[locale]) {
        if (typeof press.content[locale] === 'string') {
           rawContent = press.content[locale];
        } else {
           rawContent = press.content[locale].body || '';
           subtitle = press.content[locale].subtitle || '';
        }
      } else if (press.excerpt && press.excerpt[locale]) {
        rawContent = press.excerpt[locale];
      } else if (press.content && press.content[locale]) { // Fallback if content is string
         rawContent = typeof press.content[locale] === 'string' ? press.content[locale] : '';
      }

      // HTML 태그 제거하여 excerpt 생성
      const cleanExcerpt = subtitle || rawContent.replace(/<[^>]*>/g, '').slice(0, 150) + (rawContent.length > 150 ? '...' : '') || '';

      // 4. Thumbnail Resolution
      let thumbnailUrl: string | null = null;
      
      // Priority 1: Direct thumbnail field (Backup schema)
      if (press.thumbnail) {
        thumbnailUrl = press.thumbnail;
      }
      // Priority 2: Content-level thumbnail (Backup schema)
      else if (press.content && press.content[locale] && press.content[locale].thumbnail_url) {
        thumbnailUrl = press.content[locale].thumbnail_url;
      }
      // Priority 3: Image ID reference (Model schema)
      else if (press.thumbnail_image_id) {
        const url = imageMap.get(press.thumbnail_image_id.toString());
        if (url && url.trim() && (url.startsWith('http') || url.startsWith('/'))) {
          thumbnailUrl = url;
        }
      }

      // 5. External URL Resolution
      const externalUrl = press.external_link || press.external_url;

      return {
        id: press._id.toString(),
        slug: press.slug,
        pressName,
        title,
        subtitle,
        excerpt: cleanExcerpt,
        thumbnailUrl,
        externalUrl,
        tags: press.tags?.[locale] || [],
        publishedAt: press.published_date || press.created_at,
        locale,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedPress,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Press API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch press items' },
      { status: 500 }
    );
  }
}

