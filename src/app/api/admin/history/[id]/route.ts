import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import History, { IHistoryItem } from '@/lib/models/History';

// 연혁 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const history = await History.findById(id);
    
    if (!history) {
      return NextResponse.json(
        { success: false, message: '연혁을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: history._id,
        year: history.year,
        title: history.title?.ko || '',
        titleEn: history.title?.en || '',
        subtitle: history.subtitle?.ko || '',
        subtitleEn: history.subtitle?.en || '',
        items: history.items?.map((item: IHistoryItem) => ({
          text: item.text?.ko || '',
          textEn: item.text?.en || '',
          order: item.order,
        })) || [],
        badgeColor: history.badge_color,
        textColor: history.text_color,
        position: history.position,
        order: history.order,
        isActive: history.is_active,
        createdAt: history.created_at,
        updatedAt: history.updated_at,
      }
    });
  } catch (error) {
    console.error('Get History Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

// 연혁 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
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

    // 연도 중복 확인 (자기 자신 제외)
    if (year !== undefined) {
      const existing = await History.findOne({ 
        year, 
        _id: { $ne: id },
        deleted_at: { $exists: false }
      });
      if (existing) {
        return NextResponse.json(
          { success: false, message: '이미 해당 연도의 연혁이 존재합니다.' },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date(),
    };

    if (year !== undefined) updateData.year = year;
    if (title !== undefined) updateData['title.ko'] = title;
    if (titleEn !== undefined) updateData['title.en'] = titleEn;
    if (subtitle !== undefined) updateData['subtitle.ko'] = subtitle;
    if (subtitleEn !== undefined) updateData['subtitle.en'] = subtitleEn;
    if (items !== undefined) {
      updateData.items = items.map((item: { text: string; textEn?: string }, index: number) => ({
        text: { ko: item.text, en: item.textEn || '' },
        order: index,
      }));
    }
    if (badgeColor !== undefined) updateData.badge_color = badgeColor;
    if (textColor !== undefined) updateData.text_color = textColor;
    if (position !== undefined) updateData.position = position;
    if (isActive !== undefined) updateData.is_active = isActive;

    const history = await History.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!history) {
      return NextResponse.json(
        { success: false, message: '연혁을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Update History Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update history' },
      { status: 500 }
    );
  }
}

// 연혁 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const history = await History.findByIdAndUpdate(
      id,
      { 
        deleted_at: new Date(),
        updated_at: new Date(),
      },
      { new: true }
    );
    
    if (!history) {
      return NextResponse.json(
        { success: false, message: '연혁을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '연혁이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('Delete History Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete history' },
      { status: 500 }
    );
  }
}
