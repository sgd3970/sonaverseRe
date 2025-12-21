import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

// 기존 DB 구조에 맞는 스키마 정의 (Legacy)
const LegacyStorySchema = new mongoose.Schema({
  slug: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  created_at: Date,
  updated_at: Date,
  last_updated: Date,
  is_published: { type: Boolean, default: false },
  is_main: { type: Boolean, default: false },
  category: String,
  tags: [String],
  thumbnail_url: String,
  youtube_url: String,
  content: {
    title: String,
    subtitle: String,
    body: String,
    thumbnail_url: String,
    images: [{
      src: String,
      alt: String,
      alignment: String,
      displaysize: Number,
      originalWidth: Number,
      originalHeight: Number,
      uploadAt: Date,
    }],
  },
}, { 
  collection: 'sonaversestories',
  timestamps: false 
});

// 모델 가져오기 (이미 존재하면 재사용)
const Story = mongoose.models.LegacyStory || mongoose.model('LegacyStory', LegacyStorySchema);

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const locale = searchParams.get('locale') || 'ko';

    // 쿼리 빌드
    const query: any = { 
      is_published: true,
    };

    // 카테고리 필터
    if (category) {
      query.category = category;
    }

    // 전체 개수
    const total = await Story.countDocuments(query);

    // 데이터 조회 - 최적화된 쿼리
    const stories = await Story.find(query)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('slug category content thumbnail_url youtube_url tags is_main created_at updated_at last_updated') // 필요한 필드만
      .lean();

    // 응답 데이터 변환 - 최소 필드만
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedStories = stories.map((story: any) => {
      const content = locale === 'en' && story.content?.en ? story.content.en : story.content?.ko;
      const title = content?.title || '';
      const subtitle = content?.subtitle || '';
      const body = content?.body || '';
      const excerpt = body.replace(/<[^>]*>/g, '').slice(0, 150) + (body.length > 150 ? '...' : '');

      return {
        id: story._id.toString(),
        slug: story.slug,
        category: story.category,
        title,
        subtitle,
        excerpt,
        thumbnailUrl: story.thumbnail_url || content?.thumbnail_url,
        youtubeUrl: story.youtube_url,
        tags: story.tags || [],
        isMain: story.is_main || false,
        publishedAt: story.created_at,
        locale,
      };
    });

    const response = NextResponse.json({
      success: true,
      data: formattedStories,
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
    console.error('Stories List API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}

