import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Image from '@/lib/models/Image';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from '@/lib/api-response';
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{ id: string }>;
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
      return notFoundResponse('Invalid image ID');
    }

    const image = await Image.findById(id);

    if (!image) {
      return notFoundResponse('Image not found');
    }

    // Soft delete
    image.deleted_at = new Date();
    await image.save();

    return successResponse(
      { message: 'Image deleted successfully' },
      200
    );
  } catch (error) {
    console.error('Error deleting image:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to delete image'),
      500,
      {
        message: '이미지 삭제에 실패했습니다.',
      }
    );
  }
}

