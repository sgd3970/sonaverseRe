import { z } from "zod"

export const getInquirySchema = (locale: string) => z.object({
    inquiryType: z.enum(['service_introduction', 'product_inquiry', 'quote_request', 'demo_request', 'partnership_proposal', 'technical_partnership', 'channel_partnership', 'other']),
    name: z.string().min(1, locale === 'en' ? 'Name is required' : '이름을 입력해주세요'),
    position: z.string().optional(),
    company: z.string().optional(),
    phoneNumber: z.string().min(1, locale === 'en' ? 'Phone number is required' : '연락처를 입력해주세요'),
    email: z.string()
        .min(1, locale === 'en' ? 'Email is required' : '이메일을 입력해주세요')
        .regex(/@/, locale === 'en' ? 'Email must contain @' : '이메일에 @가 포함되어야 합니다')
        .email(locale === 'en' ? 'Invalid email format' : '유효한 이메일 형식이 아닙니다'),
    message: z.string().min(1, locale === 'en' ? 'Message is required' : '내용을 입력해주세요'),
    privacyConsented: z.boolean().refine((val) => val === true, {
        message: locale === 'en' ? 'You must agree to the privacy policy' : '개인정보 수집 및 이용에 동의해주세요',
    }),
})

export type InquiryFormValues = z.infer<ReturnType<typeof getInquirySchema>>

export const inquiryTypes = [
    { key: 'service_introduction', labelKo: '서비스 도입', labelEn: 'Service Introduction' },
    { key: 'product_inquiry', labelKo: '제품 기능', labelEn: 'Product Features' },
    { key: 'partnership_proposal', labelKo: '사업 제휴', labelEn: 'Business Partnership' },
    { key: 'other', labelKo: '기타', labelEn: 'Other' },
] as const
