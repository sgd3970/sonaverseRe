"use client"

import { useTranslation, useLocale } from "@/lib/i18n"
import { Button } from "@/shared/components/ui/Button"

interface InquiryResult {
    inquiryNumber: string
}

interface InquirySuccessProps {
    result: InquiryResult
    onReset: () => void
}

export function InquirySuccess({ result, onReset }: InquirySuccessProps) {
    const { t } = useTranslation()
    const locale = useLocale()

    return (
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl">check</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('inquiry.success.title') || (locale === 'en' ? 'Inquiry Submitted Successfully!' : '문의가 성공적으로 접수되었습니다!')}
            </h3>
            <p className="text-gray-600 mb-2">
                {t('inquiry.success.message') || (locale === 'en' ? 'We will review your inquiry and get back to you soon.' : '빠른 시일 내에 담당자가 연락드리겠습니다.')}
            </p>
            <p className="text-sm text-gray-500 mb-8">
                {t('inquiry.success.inquiryNumber') || (locale === 'en' ? 'Inquiry Number' : '문의 번호')}: <span className="font-mono font-bold">{result.inquiryNumber}</span>
            </p>
            <Button onClick={onReset} variant="outline">
                {t('common.buttons.create') || (locale === 'en' ? 'New Inquiry' : '새로운 문의하기')}
            </Button>
        </div>
    )
}
