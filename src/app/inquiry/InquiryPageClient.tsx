"use client"

import { InquiryForm } from "@/features/inquiry/components/InquiryForm"
import { useTranslation, useLocale } from "@/lib/i18n"

export default function InquiryPageClient() {
    const { t, isLoading } = useTranslation()
    const locale = useLocale()

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                    <div className="animate-pulse space-y-8">
                        <div className="h-12 bg-gray-200 rounded w-64 mx-auto" />
                        <div className="h-6 bg-gray-100 rounded w-96 mx-auto" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-black text-primary mb-4">
                        {locale === "en" ? "Contact Us" : "문의하기"}
                    </h1>
                    <p className="text-gray-600">
                        {locale === "en"
                            ? "If you have any questions, please feel free to contact us."
                            : "궁금한 점이 있으시다면 언제든 문의해주세요."}
                    </p>
                </div>

                <div className="w-full max-w-[640px]">
                    <InquiryForm />
                </div>
            </div>
        </div>
    )
}
