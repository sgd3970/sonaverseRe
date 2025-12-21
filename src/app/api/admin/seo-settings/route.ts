import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SeoSettings from '@/lib/models/SeoSettings';

// GET - Fetch SEO settings
export async function GET() {
  try {
    await dbConnect();

    // Get or create SEO settings
    const settings = await (SeoSettings as any).getSeoSettings();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    console.error('Error fetching SEO settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update SEO settings
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Get or create SEO settings
    let settings = await (SeoSettings as any).getSeoSettings();

    // Update fields
    if (body.site_name !== undefined) settings.site_name = body.site_name;
    if (body.site_url !== undefined) settings.site_url = body.site_url;
    if (body.default_title !== undefined) settings.default_title = body.default_title;
    if (body.default_description !== undefined) settings.default_description = body.default_description;
    if (body.default_keywords !== undefined) settings.default_keywords = body.default_keywords;
    if (body.default_og_image !== undefined) settings.default_og_image = body.default_og_image;
    if (body.social_links !== undefined) settings.social_links = body.social_links;
    if (body.contact !== undefined) settings.contact = body.contact;

    settings.updated_at = new Date();

    await settings.save();

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'SEO 설정이 성공적으로 업데이트되었습니다.',
    });
  } catch (error: any) {
    console.error('Error updating SEO settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
