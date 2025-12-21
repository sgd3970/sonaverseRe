import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Popup from '@/lib/models/Popup';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorizedResponse('Unauthorized');
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // 쿼리 빌드
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { deleted_at: { $exists: false } };

    const total = await Popup.countDocuments(query);

    const popups = await Popup.find(query)
      .sort({ display_priority: 1, created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedPopups = popups.map((popup: any) => ({
      id: popup._id.toString(),
      popupId: popup.popup_id,
      title: popup.title?.ko || '',
      titleEn: popup.title?.en || '',
      content: popup.content?.ko || '',
      contentEn: popup.content?.en || '',
      buttonText: popup.button_text?.ko || '',
      buttonLink: popup.button_link,
      imageId: popup.image_id?.toString(),
      position: popup.position,
      size: popup.size,
      startDate: popup.start_date,
      endDate: popup.end_date,
      isActive: popup.is_active,
      isPublished: popup.is_published,
      displayPriority: popup.display_priority,
      viewCount: popup.view_count || 0,
      clickCount: popup.click_count || 0,
      createdAt: popup.created_at,
    }));

    return successResponse(
      formattedPopups,
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
    console.error('Error fetching popups:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to fetch popups'),
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorizedResponse('Unauthorized');
    }

    await dbConnect();

    const body = await request.json();
    const {
      title,
      titleEn,
      content,
      contentEn,
      buttonText,
      buttonTextEn,
      buttonLink,
      imageId,
      position,
      size,
      startDate,
      endDate,
      isActive,
      isPublished,
      displayPriority,
    } = body;

    if (!title?.ko?.trim()) {
      return errorResponse(new Error('제목을 입력해주세요.'), 400);
    }

    const popup = await Popup.create({
      popup_id: `popup-${Date.now()}-${uuidv4().substring(0, 8)}`,
      title: {
        ko: title.ko,
        en: titleEn || title.en,
      },
      content: {
        ko: content.ko || '',
        en: contentEn || content.en,
      },
      button_text: {
        ko: buttonText?.ko || buttonText,
        en: buttonTextEn || buttonText?.en,
      },
      button_link: buttonLink,
      image_id: imageId,
      position: position || 'center',
      size: size || 'medium',
      start_date: startDate ? new Date(startDate) : new Date(),
      end_date: endDate ? new Date(endDate) : undefined,
      is_active: isActive !== undefined ? isActive : true,
      is_published: isPublished !== undefined ? isPublished : false,
      display_priority: displayPriority || 0,
      created_by: session.userId,
    });

    return successResponse(
      {
        id: popup._id.toString(),
        popupId: popup.popup_id,
      },
      201
    );
  } catch (error) {
    console.error('Error creating popup:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to create popup'),
      500
    );
  }
}

