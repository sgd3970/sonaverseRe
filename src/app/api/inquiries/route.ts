import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';
import { z } from 'zod';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { successResponse, errorResponse, validationErrorResponse, rateLimitResponse } from '@/lib/api-response';

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

    // Rate limiting 체크
    const ip = getClientIP(request);
    const rateLimitResult = await checkRateLimit(ip);
    
    if (!rateLimitResult.allowed) {
      return rateLimitResponse(
        rateLimitResult.resetTime,
        '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
      );
    }

    const body = await request.json();
    
    // 유효성 검사
    const validationResult = createInquirySchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.issues,
        '입력 정보를 확인해주세요.'
      );
    }

    const data = validationResult.data;

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

    return successResponse(
      {
        inquiryNumber: inquiry.inquiry_number,
        message: data.locale === 'en' 
          ? 'Your inquiry has been submitted successfully.'
          : '문의가 정상적으로 접수되었습니다.',
      },
      201,
      {
        message: data.locale === 'en' 
          ? 'Your inquiry has been submitted successfully.'
          : '문의가 정상적으로 접수되었습니다.',
      }
    );

  } catch (error) {
    console.error('Inquiry API Error:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to submit inquiry'),
      500,
      {
        message: '문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      }
    );
  }
}

