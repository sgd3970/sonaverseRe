'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n';

// 문의 폼 데이터 타입
export interface InquiryFormData {
  inquiryType: string;
  name: string;
  position?: string;
  companyName?: string;
  phoneNumber: string;
  email: string;
  message: string;
  privacyConsented: boolean;
}

// 문의 응답 타입
interface InquiryResponse {
  success: boolean;
  data?: {
    inquiryNumber: string;
    message: string;
  };
  error?: string;
  details?: { message: string }[];
}

// 문의 제출 훅
export function useInquirySubmit() {
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InquiryResponse['data'] | null>(null);

  const submitInquiry = async (formData: InquiryFormData): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      });

      const data: InquiryResponse = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = data.details?.[0]?.message || data.error || 
          (locale === 'en' ? 'Failed to submit inquiry' : '문의 접수에 실패했습니다');
        setError(errorMessage);
        return false;
      }

      setResult(data.data || null);
      return true;

    } catch (err) {
      const errorMessage = locale === 'en' 
        ? 'An error occurred. Please try again later.'
        : '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      setError(errorMessage);
      console.error('Inquiry submit error:', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setError(null);
    setResult(null);
  };

  return {
    submitInquiry,
    isSubmitting,
    error,
    result,
    reset,
  };
}

