import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Settings from '@/lib/models/Settings';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export async function GET() {
  try {
    await dbConnect();

    // Get or create settings
    const settings = await (Settings as any).getSettings();

    return successResponse({
      siteName: settings.site_name,
      sitePhone: settings.site_phone,
      siteAddress: settings.site_address,
      socialLinks: settings.social_links || {},
    });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to fetch settings'),
      500
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorizedResponse('Unauthorized');
    }

    await dbConnect();

    const body = await request.json();

    // Get or create settings
    let settings = await (Settings as any).getSettings();

    // Update fields
    if (body.siteName !== undefined) settings.site_name = body.siteName;
    if (body.sitePhone !== undefined) settings.site_phone = body.sitePhone;
    if (body.siteAddress !== undefined) settings.site_address = body.siteAddress;
    if (body.socialLinks !== undefined) settings.social_links = body.socialLinks;
    settings.updated_at = new Date();
    settings.updated_by = session.userId?.toString();

    await settings.save();

    return successResponse(
      {
        siteName: settings.site_name,
        sitePhone: settings.site_phone,
        siteAddress: settings.site_address,
        socialLinks: settings.social_links,
      },
      200,
      {
        message: '설정이 성공적으로 업데이트되었습니다.',
      }
    );
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to update settings'),
      500
    );
  }
}

