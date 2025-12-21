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
      ? { _id: slug, is_published: true }
      : { slug, is_published: true };

    const story = await Story.findOne(query)
      .select('slug category content thumbnail_url youtube_url tags is_main created_at updated_at') // 필요한 필드만
      .lean();

    if (!story) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storyData = story as any;

    // 응답 데이터 변환
    const formattedStory = {
      id: storyData._id.toString(),
      slug: storyData.slug,
      category: storyData.category,
      title: storyData.content?.title || '',
      subtitle: storyData.content?.subtitle || '',
      body: storyData.content?.body || '',
      thumbnailUrl: storyData.thumbnail_url || storyData.content?.thumbnail_url,
      youtubeUrl: storyData.youtube_url,
      images: storyData.content?.images || [],
      tags: storyData.tags || [],
      isMain: storyData.is_main,
      publishedAt: storyData.created_at,
      updatedAt: storyData.updated_at,
      locale,
    };

    // 관련 스토리 조회 - 최적화된 쿼리 (병렬 처리)
    const [storyResult, relatedStories] = await Promise.all([
      Promise.resolve(story),
      Story.find({
        _id: { $ne: storyData._id },
        category: storyData.category,
        is_published: true,
      })
        .sort({ created_at: -1 })
        .limit(3)
        .select('slug content thumbnail_url category created_at') // 필요한 필드만
        .lean(),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedRelated = relatedStories.map((s: any) => ({
      id: s._id.toString(),
      slug: s.slug,
      title: s.content?.title || '',
      thumbnailUrl: s.thumbnail_url || s.content?.thumbnail_url,
      category: s.category,
      publishedAt: s.created_at,
    }));

    const response = NextResponse.json({
      success: true,
      data: formattedStory,
      relatedStories: formattedRelated,
    });

    // 캐싱 헤더 추가
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    );

    return response;
  } catch (error) {
    console.error('Story Detail API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch story' },
      { status: 500 }
    );
  }
}

