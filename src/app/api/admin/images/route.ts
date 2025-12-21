import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Image from '@/lib/models/Image';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorizedResponse('Unauthorized');
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // 쿼리 빌드
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { 
      deleted_at: { $exists: false },
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { original_filename: { $regex: search, $options: 'i' } },
        { 'alt_text.ko': { $regex: search, $options: 'i' } },
        { 'alt_text.en': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // 전체 개수
    const total = await Image.countDocuments(query);

    // 데이터 조회
    const images = await Image.find(query)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // 응답 데이터 변환
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedImages = images.map((img: any) => ({
      id: img._id.toString(),
      filename: img.filename,
      originalFilename: img.original_filename,
      url: img.url || img.public_url,
      thumbnailUrl: img.url || img.public_url,
      mimeType: img.mime_type,
      size: img.size,
      width: img.width,
      height: img.height,
      aspectRatio: img.aspect_ratio,
      format: img.format,
      category: img.category,
      tags: img.tags || [],
      altText: img.alt_text,
      caption: img.caption,
      isOptimized: img.is_optimized || false,
      createdAt: img.created_at,
      usageCount: img.usage_count || 0,
    }));

    return successResponse(
      formattedImages,
      200,
      {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }
    );
  } catch (error) {
    console.error('Error fetching images:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to fetch images'),
      500,
      {
        message: '이미지 목록을 불러오는데 실패했습니다.',
      }
    );
  }
}

