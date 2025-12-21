import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/lib/models/Notification';
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    // 쿼리 빌드
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {
      $or: [
        { target_user_id: session.userId },
        { target_user_id: { $exists: false } },
        { target_role: { $in: session.roles || [] } },
      ],
      expires_at: { $or: [{ $exists: false }, { $gt: new Date() }] },
    };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (unreadOnly) {
      query.is_read = false;
    }

    const total = await Notification.countDocuments(query);

    const notifications = await Notification.find(query)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedNotifications = notifications.map((notif: any) => ({
      id: notif._id.toString(),
      notificationId: notif.notification_id,
      type: notif.type,
      title: notif.title?.ko || '',
      titleEn: notif.title?.en || '',
      message: notif.message?.ko || '',
      messageEn: notif.message?.en || '',
      icon: notif.icon,
      link: notif.link,
      isRead: notif.is_read,
      readAt: notif.read_at,
      priority: notif.priority,
      createdAt: notif.created_at,
      metadata: notif.metadata,
    }));

    return successResponse(
      formattedNotifications,
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
    console.error('Error fetching notifications:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to fetch notifications'),
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
      type,
      title,
      titleEn,
      message,
      messageEn,
      icon,
      link,
      targetUserId,
      targetRole,
      priority,
      expiresAt,
      metadata,
    } = body;

    if (!title?.ko?.trim()) {
      return errorResponse(new Error('제목을 입력해주세요.'), 400);
    }

    const notification = await Notification.create({
      notification_id: `notif-${Date.now()}-${uuidv4().substring(0, 8)}`,
      type: type || 'info',
      title: {
        ko: title.ko,
        en: titleEn || title.en,
      },
      message: {
        ko: message.ko || '',
        en: messageEn || message.en,
      },
      icon,
      link,
      target_user_id: targetUserId,
      target_role: targetRole,
      priority: priority || 'medium',
      expires_at: expiresAt ? new Date(expiresAt) : undefined,
      metadata,
      created_by: session.userId,
    });

    return successResponse(
      {
        id: notification._id.toString(),
        notificationId: notification.notification_id,
      },
      201
    );
  } catch (error) {
    console.error('Error creating notification:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to create notification'),
      500
    );
  }
}

