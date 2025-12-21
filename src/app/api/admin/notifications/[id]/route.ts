import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/lib/models/Notification';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from '@/lib/api-response';
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorizedResponse('Unauthorized');
    }

    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return notFoundResponse('Invalid notification ID');
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return notFoundResponse('Notification not found');
    }

    // 읽음 처리
    if (body.isRead !== undefined) {
      notification.is_read = body.isRead;
      if (body.isRead) {
        notification.read_at = new Date();
      } else {
        notification.read_at = undefined;
      }
    }

    await notification.save();

    return successResponse({
      id: notification._id.toString(),
      message: 'Notification updated successfully',
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to update notification'),
      500
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorizedResponse('Unauthorized');
    }

    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return notFoundResponse('Invalid notification ID');
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return notFoundResponse('Notification not found');
    }

    await Notification.deleteOne({ _id: id });

    return successResponse({
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to delete notification'),
      500
    );
  }
}

