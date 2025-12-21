import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

// 기존 DB 구조에 맞는 스키마 정의 (Legacy)
const LegacyPressSchema = new mongoose.Schema({
  slug: String,
  press_name: {
    ko: String,
    en: String,
  },
  thumbnail: String,
  external_link: String,
  content: {
    ko: {
      title: String,
      subtitle: String,
      body: String,
      thumbnail_url: String,
      images: [mongoose.Schema.Types.Mixed],
    },
    en: {
      title: String,
      subtitle: String,
      body: String,
      thumbnail_url: String,
      images: [mongoose.Schema.Types.Mixed],
    },
  },
  tags: {
    ko: [String],
    en: [String],
  },
  created_at: Date,
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  is_active: { type: Boolean, default: true },
  last_updated: Date,
}, { 
  collection: 'press',
  timestamps: false 
});

// 모델 가져오기 (이미 존재하면 재사용)
const Press = mongoose.models.LegacyPress || mongoose.model('LegacyPress', LegacyPressSchema);

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
      ? { _id: slug, is_active: true }
      : { slug, is_active: true };

    const press = await Press.findOne(query)
      .select('slug press_name content thumbnail external_link tags created_at last_updated') // 필요한 필드만
      .lean();

    if (!press) {
      return NextResponse.json(
        { success: false, error: 'Press item not found' },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pressData = press as any;
    const content = locale === 'en' && pressData.content?.en ? pressData.content.en : pressData.content?.ko;
    const tags = locale === 'en' && pressData.tags?.en ? pressData.tags.en : pressData.tags?.ko;
    const pressName = locale === 'en' && pressData.press_name?.en ? pressData.press_name.en : pressData.press_name?.ko;

    // 응답 데이터 변환
    const formattedPress = {
      id: pressData._id.toString(),
      slug: pressData.slug,
      pressName,
      title: content?.title || '',
      subtitle: content?.subtitle || '',
      body: content?.body || '',
      thumbnailUrl: pressData.thumbnail || content?.thumbnail_url,
      externalUrl: pressData.external_link,
      images: content?.images || [],
      tags: tags || [],
      publishedAt: pressData.created_at,
      updatedAt: pressData.last_updated,
      locale,
    };

    // 관련 언론보도 조회 - 최적화된 쿼리 (병렬 처리)
    const [pressResult, relatedPress] = await Promise.all([
      Promise.resolve(press),
      Press.find({
        _id: { $ne: pressData._id },
        is_active: true,
      })
        .sort({ created_at: -1 })
        .limit(3)
        .select('slug press_name content thumbnail created_at') // 필요한 필드만
        .lean(),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedRelated = relatedPress.map((p: any) => {
      const relContent = locale === 'en' && p.content?.en ? p.content.en : p.content?.ko;
      const relPressName = locale === 'en' && p.press_name?.en ? p.press_name.en : p.press_name?.ko;
      
      return {
        id: p._id.toString(),
        slug: p.slug,
        pressName: relPressName,
        title: relContent?.title || '',
        thumbnailUrl: p.thumbnail || relContent?.thumbnail_url,
        publishedAt: p.created_at,
      };
    });

    const response = NextResponse.json({
      success: true,
      data: formattedPress,
      relatedPress: formattedRelated,
    });

    // 캐싱 헤더 추가
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    );

    return response;
  } catch (error) {
    console.error('Press Detail API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch press item' },
      { status: 500 }
    );
  }
}

