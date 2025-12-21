import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getSession } from '@/lib/auth';
import Inquiry from '@/lib/models/Inquiry';

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // 쿼리 빌드
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { deleted_at: { $exists: false } };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    // 전체 개수
    const total = await Inquiry.countDocuments(query);

    // 데이터 조회
    const inquiries = await Inquiry.find(query)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // 응답 데이터 변환
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedInquiries = inquiries.map((inquiry: any) => ({
      id: inquiry._id.toString(),
      inquiryNumber: inquiry.inquiry_number,
      inquiryType: inquiry.inquiry_type,
      inquiryTypeLabel: inquiry.inquiry_type_label?.ko || inquiry.inquiry_type,
      name: inquiry.inquirer?.name,
      email: inquiry.inquirer?.email,
      phone: inquiry.inquirer?.phone_number,
      company: inquiry.inquirer?.company_name,
      message: inquiry.message?.slice(0, 100) + (inquiry.message?.length > 100 ? '...' : ''),
      status: inquiry.status,
      priority: inquiry.priority,
      createdAt: inquiry.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: formattedInquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin Inquiries API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

