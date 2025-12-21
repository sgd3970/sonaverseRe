import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Popup from '@/lib/models/Popup';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from '@/lib/api-response';
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
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
      return notFoundResponse('Invalid popup ID');
    }

    const popup = await Popup.findById(id).lean();

    if (!popup) {
      return notFoundResponse('Popup not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const popupData = popup as any;

    return successResponse({
      id: popupData._id.toString(),
      popupId: popupData.popup_id,
      title: popupData.title,
      content: popupData.content,
      buttonText: popupData.button_text,
      buttonLink: popupData.button_link,
      imageId: popupData.image_id?.toString(),
      position: popupData.position,
      size: popupData.size,
      startDate: popupData.start_date,
      endDate: popupData.end_date,
      isActive: popupData.is_active,
      isPublished: popupData.is_published,
      displayPriority: popupData.display_priority,
      viewCount: popupData.view_count || 0,
      clickCount: popupData.click_count || 0,
      createdAt: popupData.created_at,
      updatedAt: popupData.updated_at,
    });
  } catch (error) {
    console.error('Error fetching popup:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to fetch popup'),
      500
    );
  }
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
      return notFoundResponse('Invalid popup ID');
    }

    const popup = await Popup.findById(id);

    if (!popup) {
      return notFoundResponse('Popup not found');
    }

    // 업데이트할 필드만 설정
    if (body.title) popup.title = body.title;
    if (body.content) popup.content = body.content;
    if (body.button_text) popup.button_text = body.button_text;
    if (body.button_link !== undefined) popup.button_link = body.button_link;
    if (body.image_id !== undefined) popup.image_id = body.image_id;
    if (body.position) popup.position = body.position;
    if (body.size) popup.size = body.size;
    if (body.start_date) popup.start_date = new Date(body.start_date);
    if (body.end_date !== undefined) popup.end_date = body.end_date ? new Date(body.end_date) : undefined;
    if (body.is_active !== undefined) popup.is_active = body.is_active;
    if (body.is_published !== undefined) popup.is_published = body.is_published;
    if (body.display_priority !== undefined) popup.display_priority = body.display_priority;
    popup.updated_by = session.userId;

    await popup.save();

    return successResponse({
      id: popup._id.toString(),
      message: 'Popup updated successfully',
    });
  } catch (error) {
    console.error('Error updating popup:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to update popup'),
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
      return notFoundResponse('Invalid popup ID');
    }

    const popup = await Popup.findById(id);

    if (!popup) {
      return notFoundResponse('Popup not found');
    }

    // Soft delete
    popup.deleted_at = new Date();
    await popup.save();

    return successResponse({
      message: 'Popup deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting popup:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to delete popup'),
      500
    );
  }
}

