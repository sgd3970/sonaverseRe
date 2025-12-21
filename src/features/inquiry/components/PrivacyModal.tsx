"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTranslation, useLocale } from "@/lib/i18n"

interface PrivacyModalProps {
    isOpen: boolean
    onClose: () => void
    onAgree: () => void
}

export function PrivacyModal({ isOpen, onClose, onAgree }: PrivacyModalProps) {
    const { t } = useTranslation()
    const locale = useLocale()
    const [hasRead, setHasRead] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(false)
    const contentRef = React.useRef<HTMLDivElement>(null)

    // Reset state when opened
    React.useEffect(() => {
        if (isOpen) {
            setHasRead(false)
        }
    }, [isOpen])

    // Mobile detection
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget
        const isBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 5
        if (isBottom && !hasRead) {
            setHasRead(true)
        }
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className={cn(
                "bg-white rounded-2xl shadow-2xl flex flex-col",
                isMobile ? "w-full h-full max-h-screen" : "max-w-2xl w-full max-h-[80vh]"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">
                        {locale === 'en' ? 'Personal Information Collection and Use Agreement' : '개인정보 수집 및 이용 동의'}
                    </h3>
                    {!isMobile && (
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    )}
                </div>

                {/* Content */}
                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6 text-sm text-gray-700 space-y-4"
                >
                    <p className="whitespace-pre-line leading-relaxed">
                        소나버스(이하 "회사")는 「개인정보보호법」 등 관련 법령에 따라, 제휴 문의 접수 및 처리를 위해 아래와 같이 개인정보를 수집·이용하고자 합니다. 내용을 자세히 읽어보신 후 동의 여부를 결정해 주시기 바랍니다.
                    </p>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-2">1. 개인정보 수집 및 이용 목적</h4>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>제휴 제안 검토 및 결과 회신</li>
                            <li>제휴 관계 설정 및 유지·관리</li>
                            <li>원활한 의사소통 경로 확보</li>
                            <li>(동의 시) 회사 서비스 및 제휴 관련 정보 안내</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-2">2. 수집하는 개인정보 항목</h4>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>필수항목: 성함, 연락처, 이메일 주소, 문의내용</li>
                            <li>선택항목: 직급, 회사명, 첨부파일</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-2">3. 개인정보의 보유 및 이용 기간</h4>
                        <p className="mb-2">
                            수집된 개인정보는 제휴 검토 기간 동안 이용하며, 제휴 관계 종료 후 또는 정보주체의 삭제 요청 시까지 보유합니다. 단, 관계 법령의 규정에 따라 보존할 필요가 있는 경우, 회사는 아래와 같이 관계 법령에서 정한 일정한 기간 동안 개인정보를 보관합니다.
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                            <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-2">4. 동의를 거부할 권리 및 동의 거부에 따른 불이익</h4>
                        <p>
                            귀하는 위와 같은 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 필수항목에 대한 동의를 거부하실 경우, 정상적인 제휴 제안 접수 및 검토가 불가능하여 서비스 이용이 제한될 수 있습니다.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <p className="font-bold text-gray-900">
                            위 내용에 대해 충분히 이해하셨으며, 소나버스의 제휴 문의를 위한 개인정보 수집 및 이용에 동의하십니까?
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 space-y-3">
                    {!hasRead && (
                        <p className="text-sm text-amber-600 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">info</span>
                            {locale === 'en' ? 'Please scroll to the bottom to agree' : '전체 내용을 확인하시려면 끝까지 스크롤해주세요.'}
                        </p>
                    )}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all"
                        >
                            {locale === 'en' ? 'Close' : '닫기'}
                        </button>
                        <button
                            onClick={onAgree}
                            disabled={!hasRead}
                            className={cn(
                                "flex-1 h-12 rounded-xl font-bold transition-all",
                                hasRead
                                    ? "bg-primary text-white hover:bg-primary-dark"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            )}
                        >
                            {locale === 'en' ? 'Agree' : '동의'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
