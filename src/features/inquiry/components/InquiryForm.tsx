"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { useTranslation, useLocale } from "@/lib/i18n"
import { useInquirySubmit } from "@/lib/hooks"
import { PrivacyModal } from "./PrivacyModal"
import { FileUpload } from "./FileUpload"
import { InquirySuccess } from "./InquirySuccess"
import { getInquirySchema, InquiryFormValues, inquiryTypes } from "./schema"

export function InquiryForm() {
    const { t, isLoading: isI18nLoading } = useTranslation()
    const locale = useLocale()
    const { submitInquiry, isSubmitting, error: submitError, result, reset: resetSubmit } = useInquirySubmit()

    const [showPrivacyModal, setShowPrivacyModal] = React.useState(false)
    const [attachedFiles, setAttachedFiles] = React.useState<File[]>([])

    const inquirySchema = React.useMemo(() => getInquirySchema(locale, t), [locale, t])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<InquiryFormValues>({
        resolver: zodResolver(inquirySchema),
        defaultValues: {
            inquiryType: 'service_introduction',
            privacyConsented: false,
        }
    })

    const onSubmit = async (data: InquiryFormValues) => {
        // Here you might want to handle file uploads if the API supports it
        // For now, we just submit the form data
        const success = await submitInquiry(data)
        if (success) {
            reset()
            setAttachedFiles([])
        }
    }

    const handleNewInquiry = () => {
        resetSubmit()
        setAttachedFiles([])
    }

    const handlePrivacyAgree = () => {
        setValue('privacyConsented', true, { shouldValidate: true })
        setShowPrivacyModal(false)
    }

    if (isI18nLoading) {
        return (
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100 animate-pulse">
                <div className="space-y-6">
                    <div className="h-12 bg-gray-100 rounded-xl" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-12 bg-gray-100 rounded-xl" />
                        <div className="h-12 bg-gray-100 rounded-xl" />
                    </div>
                    <div className="h-40 bg-gray-100 rounded-xl" />
                </div>
            </div>
        )
    }

    if (result) {
        return <InquirySuccess result={result} onReset={handleNewInquiry} />
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100 space-y-6">
            {/* Error Message */}
            {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    <span className="material-symbols-outlined text-lg align-middle mr-2">error</span>
                    {submitError}
                </div>
            )}

            {/* Inquiry Type */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-gray-800 block">
                    {t('inquiry.form.inquiryType.label') || (locale === 'en' ? 'Inquiry Type' : '문의 유형')}
                </label>
                <div className="flex flex-wrap gap-3">
                    {inquiryTypes.map((type) => (
                        <label key={type.key} className="cursor-pointer">
                            <input
                                type="radio"
                                value={type.key}
                                className="peer sr-only"
                                {...register("inquiryType")}
                            />
                            <div className="h-10 px-5 flex items-center rounded-xl bg-gray-50 border border-gray-200 text-gray-600 font-medium peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all">
                                {t(`inquiry.form.inquiryType.options.${type.key}`) || (locale === 'en' ? type.labelEn : type.labelKo)}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-bold text-gray-800">
                    {t('inquiry.form.name.label') || (locale === 'en' ? 'Name *' : '성함 *')}
                </label>
                <input
                    id="name"
                    className={cn(
                        "w-full h-12 rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        errors.name ? "border-red-500" : "border-gray-200"
                    )}
                    placeholder={t('inquiry.form.name.placeholder') || (locale === 'en' ? 'John Doe' : '홍길동')}
                    {...register("name")}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Position */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    {t('inquiry.form.position.label') || (locale === 'en' ? 'Position' : '직급')}
                </label>
                <input
                    className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder={t('inquiry.form.position.placeholder') || (locale === 'en' ? 'Manager' : '과장')}
                    {...register("position")}
                />
            </div>

            {/* Company */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    {t('inquiry.form.companyName.label') || (locale === 'en' ? 'Company' : '회사명')}
                </label>
                <input
                    className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder={t('inquiry.form.companyName.placeholder') || (locale === 'en' ? 'Company Name' : '회사명')}
                    {...register("company")}
                />
            </div>

            {/* Phone */}
            <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-bold text-gray-800">
                    {t('inquiry.form.phoneNumber.label') || (locale === 'en' ? 'Phone *' : '연락처 *')}
                </label>
                <input
                    id="phoneNumber"
                    className={cn(
                        "w-full h-12 rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        errors.phoneNumber ? "border-red-500" : "border-gray-200"
                    )}
                    placeholder={t('inquiry.form.phoneNumber.placeholder') || "010-0000-0000"}
                    {...register("phoneNumber")}
                />
                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-gray-800">
                    {t('inquiry.form.email.label') || (locale === 'en' ? 'Email *' : '이메일 *')}
                </label>
                <input
                    id="email"
                    type="email"
                    className={cn(
                        "w-full h-12 rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        errors.email ? "border-red-500" : "border-gray-200"
                    )}
                    placeholder={t('inquiry.form.email.placeholder') || "example@email.com"}
                    {...register("email")}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Message */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">
                    {t('inquiry.form.message.label') || (locale === 'en' ? 'Message *' : '문의 내용 *')}
                </label>
                <textarea
                    className={cn(
                        "w-full h-40 rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none",
                        errors.message ? "border-red-500" : "border-gray-200"
                    )}
                    placeholder={t('inquiry.form.message.placeholder') || (locale === 'en' ? 'Please describe your inquiry in detail.' : '문의하실 내용을 입력해 주세요.')}
                    {...register("message")}
                />
                {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
            </div>

            {/* File Upload */}
            <FileUpload files={attachedFiles} onFilesChange={setAttachedFiles} />

            {/* Privacy Consent */}
            <div className="p-4 rounded-xl bg-primary-light border border-primary/20 flex items-start gap-3">
                <input
                    type="checkbox"
                    id="agree"
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary pointer-events-none"
                    {...register("privacyConsented")}
                    readOnly
                />
                <div className="text-sm text-gray-700 leading-snug">
                    <div>
                        <span className="font-bold text-primary">[필수]</span>{" "}
                        {t('inquiry.form.privacy.description') || (locale === 'en' ? 'I agree to the collection and use of personal information.' : '개인정보 수집 및 이용에 동의합니다.')}
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowPrivacyModal(true)}
                        className="mt-1 text-xs text-gray-400 underline hover:text-primary transition-colors"
                    >
                        {t('common.buttons.learnMore') || (locale === 'en' ? 'View Details' : '내용 보기')}
                    </button>
                </div>
            </div>
            {errors.privacyConsented && <p className="text-sm text-red-500 -mt-4">{errors.privacyConsented.message}</p>}

            {/* Privacy Modal */}
            <PrivacyModal
                isOpen={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
                onAgree={handlePrivacyAgree}
            />

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
                {isSubmitting ? (
                    <span className="flex items-center gap-2 justify-center">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('inquiry.form.submitting') || (locale === 'en' ? 'Submitting...' : '제출 중...')}
                    </span>
                ) : (
                    t('inquiry.form.submit') || (locale === 'en' ? 'Submit Inquiry' : '문의하기')
                )}
            </button>
        </form>
    )
}
