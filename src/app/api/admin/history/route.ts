import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import History from '@/lib/models/History';
import { getSession } from '@/lib/auth';

// 연혁 목록 조회 (관리자)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const histories = await History.find({
      deleted_at: { $exists: false }
    })
      .sort({ year: 1, order: 1 })
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedHistories = histories.map((history: any) => ({
      id: history._id.toString(),
      year: history.year,
      title: history.title?.ko || '',
      titleEn: history.title?.en || '',
      subtitle: history.subtitle?.ko || '',
      subtitleEn: history.subtitle?.en || '',
      // items의 text도 한글만 추출
      items: (history.items || []).map((item: { text?: { ko?: string; en?: string } | string; order?: number }) => ({
        text: typeof item.text === 'string' ? item.text : (item.text?.ko || ''),
        textEn: typeof item.text === 'string' ? '' : (item.text?.en || ''),
        order: item.order || 0,
      })),
      badgeColor: history.badge_color,
      textColor: history.text_color,
      position: history.position,
      order: history.order,
      isActive: history.is_active,
      createdAt: history.created_at,
      updatedAt: history.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: formattedHistories,
    });
  } catch (error) {
    console.error('Admin History API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

// 연혁 생성
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const {
      year,
      title,
      titleEn,
      subtitle,
      subtitleEn,
      items,
      badgeColor,
      textColor,
      position,
      isActive,
    } = body;

    // 연도 중복 확인
    const existing = await History.findOne({ year, deleted_at: { $exists: false } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: '이미 해당 연도의 연혁이 존재합니다.' },
        { status: 400 }
      );
    }

    // 순서 계산
    const lastHistory = await History.findOne({ deleted_at: { $exists: false } })
      .sort({ order: -1 })
      .lean();
    const order = lastHistory ? (lastHistory as { order?: number }).order! + 1 : 0;

    const history = await History.create({
      year,
      title: { ko: title, en: titleEn || '' },
      subtitle: { ko: subtitle || '', en: subtitleEn || '' },
      items: items?.map((item: { text: string; textEn?: string }, index: number) => ({
        text: { ko: item.text, en: item.textEn || '' },
        order: index,
      })) || [],
      badge_color: badgeColor || '#0b3877',
      text_color: textColor || '#ffffff',
      position: position || (order % 2 === 0 ? 'right' : 'left'),
      order,
      is_active: isActive !== false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: { id: history._id.toString() }
    }, { status: 201 });
  } catch (error) {
    console.error('Create History Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create history' },
      { status: 500 }
    );
  }
}

