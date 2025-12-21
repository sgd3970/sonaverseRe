import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';
import { z } from 'zod';

// 문의 생성 스키마
const createInquirySchema = z.object({
  inquiryType: z.enum([
    'service_introduction',
    'product_inquiry',
    'quote_request',
    'demo_request',
    'partnership_proposal',
    'technical_partnership',
    'channel_partnership',
    'other',
  ]),
  name: z.string().min(1, '이름을 입력해주세요'),
  position: z.string().optional(),
  companyName: z.string().optional(),
  phoneNumber: z.string().min(1, '연락처를 입력해주세요'),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  message: z.string().min(1, '문의 내용을 입력해주세요'),
  privacyConsented: z.boolean().refine(val => val === true, '개인정보 수집 동의가 필요합니다'),
  locale: z.enum(['ko', 'en']).optional().default('ko'),
});

// 문의 유형 라벨 매핑
const inquiryTypeLabels: Record<string, { ko: string; en: string }> = {
  service_introduction: { ko: '서비스 소개', en: 'Service Introduction' },
  product_inquiry: { ko: '제품 문의', en: 'Product Inquiry' },
  quote_request: { ko: '견적 요청', en: 'Quote Request' },
  demo_request: { ko: '데모 요청', en: 'Demo Request' },
  partnership_proposal: { ko: '제휴 제안', en: 'Partnership Proposal' },
  technical_partnership: { ko: '기술 제휴', en: 'Technical Partnership' },
  channel_partnership: { ko: '유통 제휴', en: 'Channel Partnership' },
  other: { ko: '기타', en: 'Other' },
};

// 문의 번호 생성
function generateInquiryNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INQ-${year}${month}${day}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    
    // 유효성 검사
    const validationResult = createInquirySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // IP 주소 가져오기
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // 문의 생성
    const inquiry = await Inquiry.create({
      inquiry_number: generateInquiryNumber(),
      inquiry_type: data.inquiryType,
      inquiry_type_label: inquiryTypeLabels[data.inquiryType],
      inquirer: {
        name: data.name,
        position: data.position,
        company_name: data.companyName,
        phone_number: data.phoneNumber,
        email: data.email,
        language: data.locale,
      },
      message: data.message,
      status: 'pending',
      priority: 'medium',
      privacy_consented: data.privacyConsented,
      privacy_consented_at: new Date(),
      ip_address: ip,
      user_agent: request.headers.get('user-agent') || '',
      referrer: request.headers.get('referer') || '',
    });

    return NextResponse.json({
      success: true,
      data: {
        inquiryNumber: inquiry.inquiry_number,
        message: data.locale === 'en' 
          ? 'Your inquiry has been submitted successfully.'
          : '문의가 정상적으로 접수되었습니다.',
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Inquiry API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}

