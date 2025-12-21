import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SeoSettings from '@/lib/models/SeoSettings';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

// GET - Fetch SEO settings
export async function GET() {
  try {
    await dbConnect();

    // Get or create SEO settings
    const settings = await (SeoSettings as any).getSeoSettings();

    return successResponse({
      siteName: settings.site_name,
      siteUrl: settings.site_url,
      defaultTitle: settings.default_title,
      defaultDescription: settings.default_description,
      defaultKeywords: settings.default_keywords,
      defaultOgImage: settings.default_og_image,
      socialLinks: settings.social_links,
      contact: settings.contact,
    });
  } catch (error: any) {
    console.error('Error fetching SEO settings:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to fetch SEO settings'),
      500
    );
  }
}

// PUT - Update SEO settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorizedResponse('Unauthorized');
    }

    await dbConnect();

    const body = await request.json();

    // Get or create SEO settings
    let settings = await (SeoSettings as any).getSeoSettings();

    // Update fields
    if (body.siteName !== undefined) settings.site_name = body.siteName;
    if (body.siteUrl !== undefined) settings.site_url = body.siteUrl;
    if (body.defaultTitle !== undefined) settings.default_title = body.defaultTitle;
    if (body.defaultDescription !== undefined) settings.default_description = body.defaultDescription;
    if (body.defaultKeywords !== undefined) settings.default_keywords = body.defaultKeywords;
    if (body.defaultOgImage !== undefined) settings.default_og_image = body.defaultOgImage;
    if (body.socialLinks !== undefined) settings.social_links = body.socialLinks;
    if (body.contact !== undefined) settings.contact = body.contact;

    settings.updated_at = new Date();
    settings.updated_by = session.userId?.toString();

    await settings.save();

    return successResponse(
      {
        siteName: settings.site_name,
        siteUrl: settings.site_url,
        defaultTitle: settings.default_title,
        defaultDescription: settings.default_description,
        defaultKeywords: settings.default_keywords,
        defaultOgImage: settings.default_og_image,
        socialLinks: settings.social_links,
        contact: settings.contact,
      },
      200,
      {
        message: 'SEO 설정이 성공적으로 업데이트되었습니다.',
      }
    );
  } catch (error: any) {
    console.error('Error updating SEO settings:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to update SEO settings'),
      500
    );
  }
}
