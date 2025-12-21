import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getSession } from '@/lib/auth';
import Inquiry from '@/lib/models/Inquiry';
import PressRelease from '@/lib/models/PressRelease';
import SonaverseStory from '@/lib/models/SonaverseStory';
import AdminUser from '@/lib/models/AdminUser';

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

    // 병렬로 데이터 조회
    const [
      inquiryCount,
      pressCount,
      storyCount,
      adminCount,
      recentInquiries,
      recentPress,
      recentStories,
      storyViews,
      pressViews
    ] = await Promise.all([
      Inquiry.countDocuments({ deleted_at: { $exists: false } }),
      PressRelease.countDocuments({ deleted_at: { $exists: false } }),
      SonaverseStory.countDocuments({ deleted_at: { $exists: false } }),
      AdminUser.countDocuments({ deleted_at: { $exists: false } }),
      Inquiry.find({ deleted_at: { $exists: false } }).sort({ created_at: -1 }).limit(5).lean(),
      PressRelease.find({ deleted_at: { $exists: false } }).sort({ created_at: -1 }).limit(5).lean(),
      SonaverseStory.find({ deleted_at: { $exists: false } }).sort({ created_at: -1 }).limit(5).lean(),
      SonaverseStory.aggregate([
        { $match: { deleted_at: { $exists: false } } },
        { $group: { _id: null, total: { $sum: "$view_count" } } }
      ]),
      PressRelease.aggregate([
        { $match: { deleted_at: { $exists: false } } },
        { $group: { _id: null, total: { $sum: "$view_count" } } }
      ])
    ]);

    const totalStoryViews = storyViews[0]?.total || 0;
    const totalPressViews = pressViews[0]?.total || 0;
    const totalViews = totalStoryViews + totalPressViews;

    // 최근 활동 통합 및 정렬
    const activities = [
      ...recentInquiries.map((item: any) => ({
        type: 'Inquiry',
        content: `문의: ${item.inquirer?.company_name || item.inquirer?.name} - ${item.inquiry_type}`,
        time: item.created_at,
        status: item.status,
        original: item
      })),
      ...recentPress.map((item: any) => ({
        type: 'Press',
        content: `보도자료: ${item.title?.ko || item.title?.en}`,
        time: item.created_at,
        status: item.is_published ? '게시됨' : '임시저장',
        original: item
      })),
      ...recentStories.map((item: any) => ({
        type: 'Story',
        content: `스토리: ${item.title?.ko || item.title?.en}`,
        time: item.created_at,
        status: item.is_published ? '게시됨' : '임시저장',
        original: item
      }))
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          inquiries: inquiryCount,
          press: pressCount,
          stories: storyCount,
          users: adminCount, // 현재는 관리자 수만 표시
          totalViews
        },
        activities
      }
    });

  } catch (error) {
    console.error('Dashboard Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
