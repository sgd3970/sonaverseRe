import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import History from '@/lib/models/History';

// 연혁 목록 조회 (공개)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ko';

    const histories = await History.find({ 
      is_active: true,
      deleted_at: { $exists: false }
    })
      .sort({ year: 1, order: 1 })
      .select('year title subtitle items badge_color text_color position') // 필요한 필드만
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedHistories = histories.map((history: any) => ({
      id: history._id.toString(),
      year: history.year,
      title: locale === 'en' && history.title?.en ? history.title.en : history.title?.ko,
      subtitle: locale === 'en' && history.subtitle?.en ? history.subtitle.en : history.subtitle?.ko,
      items: history.items?.map((item: { text: { ko: string; en: string }; order: number }) => ({
        text: locale === 'en' && item.text?.en ? item.text.en : item.text?.ko,
        order: item.order,
      })).sort((a: { order: number }, b: { order: number }) => a.order - b.order) || [],
      badgeColor: history.badge_color,
      textColor: history.text_color,
      position: history.position,
    }));

    const response = NextResponse.json({
      success: true,
      data: formattedHistories,
    });

    // 캐싱 헤더 추가 (연혁은 자주 변경되지 않음)
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=7200, stale-while-revalidate=86400'
    );

    return response;
  } catch (error) {
    console.error('History API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

