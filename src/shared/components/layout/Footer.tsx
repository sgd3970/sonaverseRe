"use client"

import * as React from "react"
import Link from "next/link"
import { Logo, FallbackLogo } from "@/shared/components/ui/Logo"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function Footer() {
    const currentYear = new Date().getFullYear()
    const { t, isLoading } = useTranslation()
    const [showPrivacyModal, setShowPrivacyModal] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(false)

    // 모바일 감지
    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // 번역 헬퍼 함수 (키를 찾지 못하면 fallback 반환)
    const getText = (key: string, fallback: string) => {
        const translated = t(key)
        return (translated && translated !== key) ? translated : fallback
    }

    if (isLoading) {
        return (
            <footer className="bg-white border-t border-gray-200 py-12">
                <div className="container-custom">
                    <div className="animate-pulse h-60 bg-gray-100 rounded" />
                </div>
            </footer>
        )
    }

    return (
        <footer className="bg-bg-beige py-16 border-t border-gray-200 text-sm">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                {/* Left Column: Company Info */}
                <div className="lg:col-span-7 flex flex-col space-y-8">
                    {/* Logo */}
                    <Logo type="full" size="md" linkToHome={false} />

                    {/* Grid Layout for Perfect Alignment */}
                    <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-4 gap-y-3 text-gray-600">
                        <div className="font-bold text-gray-800">상호명</div>
                        <div>{getText('common.footer.company.companyNameValue', '(주)소나버스')}</div>

                        <div className="font-bold text-gray-800">대표자명</div>
                        <div>{getText('common.footer.company.ceoNameValue', '이수진')}</div>

                        <div className="font-bold text-gray-800">사업장 주소</div>
                        <div>{getText('common.footer.company.addressValue', '(24232) 강원특별자치도 춘천시 후석로462번길 7 춘천ICT벤처센터 319호')}</div>

                        <div className="font-bold text-gray-800">대표 전화</div>
                        <div>
                            <a href="tel:010-5703-8899" className="hover:text-primary">
                                {getText('common.footer.company.phoneValue', '010-5703-8899')}
                            </a>
                        </div>

                        <div className="font-bold text-gray-800">사업자등록번호</div>
                        <div>{getText('common.footer.company.businessNumberValue', '697-87-02555')}</div>

                        <div className="font-bold text-gray-800">통신판매업 신고 번호</div>
                        <div>{getText('common.footer.company.salesNumberValue', '2023-강원춘천-0688')}</div>
                    </div>

                    <div className="flex flex-col gap-2 font-bold text-gray-700 pt-4">
                        <button
                            onClick={() => setShowPrivacyModal(true)}
                            className="text-left hover:text-primary transition-colors"
                        >
                            {getText('common.footer.support.privacy', '개인정보처리방침')}
                        </button>
                        <Link href="/catalog" className="text-left hover:text-primary transition-colors">
                            {getText('common.footer.support.catalog', '제품 카탈로그 다운로드')}
                        </Link>
                    </div>
                </div>

                {/* Middle Column: Sonaverse Links */}
                <div className="lg:col-span-2">
                    <h4 className="font-black text-primary text-lg mb-6 uppercase tracking-tight">SONAVERSE</h4>
                    <ul className="space-y-4 text-gray-600 font-medium">
                        <li>
                            <Link href="/products/manbo" className="cursor-pointer hover:text-primary transition-colors">
                                {getText('common.footer.links.manbo', '만보 보행기')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/products/bodume" className="cursor-pointer hover:text-primary transition-colors">
                                {getText('common.footer.links.bodume', 'BO DUME 기저귀')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/stories" className="cursor-pointer hover:text-primary transition-colors">
                                {getText('common.footer.links.stories', '소나버스 스토리')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/press" className="cursor-pointer hover:text-primary transition-colors">
                                {getText('common.footer.links.press', '언론보도')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/inquiry" className="cursor-pointer hover:text-primary transition-colors">
                                {getText('common.footer.links.inquiry', '구매/제휴 문의')}
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Right Column: Customer Support & SNS */}
                <div className="lg:col-span-3 space-y-10">
                    <div>
                        <h4 className="font-black text-primary text-lg mb-6">고객지원</h4>
                        <div className="space-y-6 text-gray-600">
                            <div>
                                <p className="font-bold text-gray-800 mb-1">고객센터</p>
                                <a href="tel:010-5703-8899" className="text-lg hover:text-primary">
                                    {getText('common.footer.support.customerPhone', '010-5703-8899')}
                                </a>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 mb-1">이메일</p>
                                <a href="mailto:shop@sonaverse.kr" className="hover:text-primary">
                                    {getText('common.footer.support.emailValue', 'shop@sonaverse.kr')}
                                </a>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 mb-1">운영시간</p>
                                <p className="leading-relaxed">
                                    {getText('common.footer.support.hoursValue', '평일 09:30 ~ 18:30')}
                                    <br />
                                    {getText('common.footer.support.hoursNote', '(주말·공휴일 휴무)')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-black text-primary text-lg mb-4">SNS</h4>
                        <div className="flex gap-3">
                            {/* Naver */}
                            <a
                                href="https://blog.naver.com/sonaverse"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-[#03C75A] flex items-center justify-center text-white font-black text-xl cursor-pointer hover:opacity-90 transition-opacity"
                                aria-label={getText('common.footer.social.naver', '네이버')}
                            >
                                N
                            </a>
                            {/* YouTube */}
                            <a
                                href="https://youtube.com/@sonaverse"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity"
                                aria-label={getText('common.footer.social.youtube', '유튜브')}
                            >
                                <span className="material-symbols-outlined text-2xl">play_arrow</span>
                            </a>
                            {/* Instagram */}
                            <a
                                href="https://instagram.com/sonaverse"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity"
                                aria-label={getText('common.footer.social.instagram', '인스타그램')}
                            >
                                <span className="material-symbols-outlined text-xl">photo_camera</span>
                            </a>
                            {/* Kakao */}
                            <a
                                href="https://pf.kakao.com/sonaverse"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-[#FEE500] flex items-center justify-center text-[#3c1e1e] cursor-pointer hover:opacity-90 transition-opacity"
                                aria-label={getText('common.footer.social.kakaotalk', '카카오톡')}
                            >
                                <span className="material-symbols-outlined text-xl">chat_bubble</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 개인정보처리방침 모달 */}
            {showPrivacyModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowPrivacyModal(false)
                    }}
                >
                    <div className={cn(
                        "bg-white rounded-2xl shadow-2xl flex flex-col",
                        isMobile ? "w-full h-full max-h-screen" : "max-w-4xl w-full max-h-[85vh]"
                    )}>
                        {/* 모달 헤더 */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                개인정보처리방침
                            </h3>
                            <button
                                onClick={() => setShowPrivacyModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* 모달 콘텐츠 */}
                        <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-700 space-y-6">
                            <section>
                                <h4 className="font-bold text-gray-900 text-base mb-3">1. 개인정보의 처리 목적</h4>
                                <p className="mb-2">(주)소나버스는 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의 목적 이외의 용도로는 이용하지 않습니다.</p>
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    <li>회원 가입 및 관리</li>
                                    <li>상품 주문 및 배송</li>
                                    <li>고객 상담 및 문의 응대</li>
                                    <li>마케팅 및 광고에의 활용</li>
                                    <li>서비스 제공 및 운영</li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-bold text-gray-900 text-base mb-3">2. 개인정보의 처리 및 보유기간</h4>
                                <p className="mb-2">회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    <li>회원정보: 회원탈퇴 시까지</li>
                                    <li>주문정보: 5년간 보관</li>
                                    <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                                    <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                                    <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-bold text-gray-900 text-base mb-3">3. 개인정보의 제3자 제공</h4>
                                <p>회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
                            </section>

                            <section>
                                <h4 className="font-bold text-gray-900 text-base mb-3">4. 개인정보처리의 위탁</h4>
                                <p className="mb-2">회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    <li>배송업무: 택배회사</li>
                                    <li>결제처리: 결제대행사</li>
                                    <li>고객상담: 고객상담업체</li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-bold text-gray-900 text-base mb-3">5. 정보주체의 권리·의무 및 그 행사방법</h4>
                                <p className="mb-2">이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.</p>
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    <li>개인정보 열람요구</li>
                                    <li>오류 등이 있을 경우 정정 요구</li>
                                    <li>삭제요구</li>
                                    <li>처리정지 요구</li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-bold text-gray-900 text-base mb-3">6. 개인정보의 파기</h4>
                                <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
                            </section>

                            <section>
                                <h4 className="font-bold text-gray-900 text-base mb-3">7. 개인정보의 안전성 확보 조치</h4>
                                <p className="mb-2">회사는 개인정보보호법 제29조에 따라 다음과 같은 안전성 확보조치를 취하고 있습니다.</p>
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    <li>개인정보의 암호화</li>
                                    <li>해킹 등에 대비한 기술적 대책</li>
                                    <li>개인정보에 대한 접근 제한</li>
                                    <li>개인정보 취급 직원의 최소화 및 교육</li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-bold text-gray-900 text-base mb-3">8. 개인정보 보호책임자</h4>
                                <p className="mb-2">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p><span className="font-bold">개인정보 보호책임자</span></p>
                                    <p><span className="font-bold">이름:</span> 이수진</p>
                                    <p><span className="font-bold">연락처:</span> 010-5703-8899</p>
                                    <p><span className="font-bold">이메일:</span> shop@sonaverse.kr</p>
                                </div>
                            </section>

                            <section>
                                <h4 className="font-bold text-gray-900 text-base mb-3">9. 개인정보 처리방침 변경</h4>
                                <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
                            </section>

                            <div className="pt-4 border-t border-gray-200 text-gray-600">
                                <p><span className="font-bold">시행일자:</span> 2025년 12월 01일</p>
                                <p><span className="font-bold">최종 수정일:</span> 2025년 12월 01일</p>
                            </div>
                        </div>

                        {/* 모달 푸터 */}
                        <div className="p-6 border-t border-gray-200">
                            <button
                                onClick={() => setShowPrivacyModal(false)}
                                className="w-full h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-all"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    )
}
