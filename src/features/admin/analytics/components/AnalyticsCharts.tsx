"use client"

export function AnalyticsCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-admin-surface rounded-2xl border border-admin-border p-6 md:p-8 shadow-2xl shadow-black/20 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-10 gap-4">
                    <div>
                        <h3 className="text-admin-text-main text-xl font-bold">방문자 유입 트렌드</h3>
                        <p className="text-admin-text-secondary text-sm">기간: MONTH</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-admin-primary"></div>
                            <span className="text-xs text-admin-text-secondary">방문자수</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-admin-success/50"></div>
                            <span className="text-xs text-admin-text-secondary">페이지뷰</span>
                        </div>
                    </div>
                </div>

                {/* SVG 차트 */}
                <div className="relative h-60 md:h-72 w-full mt-4">
                    <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        {/* 그라데이션 정의 */}
                        <defs>
                            <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* 그리드 라인 */}
                        <line x1="0" y1="0" x2="1000" y2="0" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                        <line x1="0" y1="50" x2="1000" y2="50" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                        <line x1="0" y1="100" x2="1000" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                        <line x1="0" y1="150" x2="1000" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                        <line x1="0" y1="200" x2="1000" y2="200" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                        <line x1="0" y1="250" x2="1000" y2="250" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />

                        {/* 영역 채우기 (Area) */}
                        <path
                            d="M 0 242.30769230769232 C 45.45454545454545 242.30769230769232, 45.45454545454545 213.46153846153845, 90.9090909090909 213.46153846153845 C 136.36363636363637 213.46153846153845, 136.36363636363637 232.69230769230768, 181.8181818181818 232.69230769230768 C 227.27272727272728 232.69230769230768, 227.27272727272728 184.6153846153846, 272.72727272727275 184.6153846153846 C 318.1818181818182 184.6153846153846, 318.1818181818182 194.23076923076923, 363.6363636363636 194.23076923076923 C 409.09090909090907 194.23076923076923, 409.09090909090907 146.15384615384616, 454.5454545454545 146.15384615384616 C 500 146.15384615384616, 500 165.3846153846154, 545.4545454545455 165.3846153846154 C 590.909090909091 165.3846153846154, 590.909090909091 126.92307692307693, 636.3636363636364 126.92307692307693 C 681.8181818181818 126.92307692307693, 681.8181818181818 88.46153846153845, 727.2727272727273 88.46153846153845 C 772.7272727272727 88.46153846153845, 772.7272727272727 107.69230769230768, 818.1818181818181 107.69230769230768 C 863.6363636363635 107.69230769230768, 863.6363636363635 50, 909.090909090909 50 C 954.5454545454545 50, 954.5454545454545 69.23076923076923, 1000 69.23076923076923 L 1000 300 L 0 300 Z"
                            fill="url(#gradientPrimary)"
                            className="transition-all duration-700 ease-in-out"
                        />

                        {/* 페이지뷰 선 */}
                        <path
                            d="M 0 234.21052631578948 C 45.45454545454545 234.21052631578948, 45.45454545454545 207.89473684210526, 90.9090909090909 207.89473684210526 C 136.36363636363637 207.89473684210526, 136.36363636363637 221.05263157894737, 181.8181818181818 221.05263157894737 C 227.27272727272728 221.05263157894737, 227.27272727272728 181.57894736842104, 272.72727272727275 181.57894736842104 C 318.1818181818182 181.57894736842104, 318.1818181818182 188.1578947368421, 363.6363636363636 188.1578947368421 C 409.09090909090907 188.1578947368421, 409.09090909090907 135.52631578947367, 454.5454545454545 135.52631578947367 C 500 135.52631578947367, 500 148.68421052631578, 545.4545454545455 148.68421052631578 C 590.909090909091 148.68421052631578, 590.909090909091 115.78947368421052, 636.3636363636364 115.78947368421052 C 681.8181818181818 115.78947368421052, 681.8181818181818 89.47368421052633, 727.2727272727273 89.47368421052633 C 772.7272727272727 89.47368421052633, 772.7272727272727 102.63157894736841, 818.1818181818181 102.63157894736841 C 863.6363636363635 102.63157894736841, 863.6363636363635 50, 909.090909090909 50 C 954.5454545454545 50, 954.5454545454545 63.15789473684211, 1000 63.15789473684211"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeLinecap="round"
                            opacity="0.4"
                            className="transition-all duration-700 ease-in-out"
                        />

                        {/* 방문자수 선 */}
                        <path
                            d="M 0 242.30769230769232 C 45.45454545454545 242.30769230769232, 45.45454545454545 213.46153846153845, 90.9090909090909 213.46153846153845 C 136.36363636363637 213.46153846153845, 136.36363636363637 232.69230769230768, 181.8181818181818 232.69230769230768 C 227.27272727272728 232.69230769230768, 227.27272727272728 184.6153846153846, 272.72727272727275 184.6153846153846 C 318.1818181818182 184.6153846153846, 318.1818181818182 194.23076923076923, 363.6363636363636 194.23076923076923 C 409.09090909090907 194.23076923076923, 409.09090909090907 146.15384615384616, 454.5454545454545 146.15384615384616 C 500 146.15384615384616, 500 165.3846153846154, 545.4545454545455 165.3846153846154 C 590.909090909091 165.3846153846154, 590.909090909091 126.92307692307693, 636.3636363636364 126.92307692307693 C 681.8181818181818 126.92307692307693, 681.8181818181818 88.46153846153845, 727.2727272727273 88.46153846153845 C 772.7272727272727 88.46153846153845, 772.7272727272727 107.69230769230768, 818.1818181818181 107.69230769230768 C 863.6363636363635 107.69230769230768, 863.6363636363635 50, 909.090909090909 50 C 954.5454545454545 50, 954.5454545454545 69.23076923076923, 1000 69.23076923076923"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="4"
                            strokeLinecap="round"
                            className="transition-all duration-700 ease-in-out"
                        />
                    </svg>

                    {/* X축 레이블 */}
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest px-1">
                        <span>1주</span>
                        <span>2주</span>
                        <span>3주</span>
                        <span>4주</span>
                        <span>5주</span>
                    </div>
                </div>
            </div>

            <div className="bg-admin-surface rounded-2xl border border-admin-border p-8 shadow-2xl">
                <h3 className="text-admin-text-main text-xl font-bold mb-2">전환 퍼널 (Funnel)</h3>
                <p className="text-admin-text-secondary text-sm mb-8">유입부터 최종 문의까지 단계별 생존율</p>
                <div className="space-y-6">
                    {[
                        { label: "전체 유입", value: "48,294 (100%)", width: 100, color: "bg-admin-primary" },
                        { label: "제품 상세 조회", value: "12,042 (24.9%)", width: 24.9, color: "bg-blue-400" },
                        { label: "문의 폼 진입", value: "4,520 (9.3%)", width: 9.3, color: "bg-indigo-400" },
                        { label: "문의 완료 (Goal)", value: "1,652 (3.4%)", width: 3.4, color: "bg-admin-success" }
                    ].map((step, idx) => (
                        <div key={idx} className="relative">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-bold text-admin-text-main">{step.label}</span>
                                <span className="text-xs text-admin-text-secondary">{step.value}</span>
                            </div>
                            <div className="h-4 w-full bg-admin-bg rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ease-out ${step.color}`} style={{ width: `${step.width}%` }} />
                            </div>
                            {idx < 3 && (
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-admin-text-secondary opacity-30">
                                    <span className="material-symbols-outlined select-none text-sm">south</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 인사이트 박스 */}
                <div className="mt-12 p-4 bg-admin-bg/50 rounded-xl border border-admin-border">
                    <p className="text-xs text-admin-text-secondary leading-relaxed">
                        <span className="material-symbols-outlined select-none text-yellow-400 text-sm mr-1">lightbulb</span>
                        <strong>인사이트:</strong> 제품 상세에서 문의 폼으로 넘어가는 단계의 이탈률이 가장 높습니다. 상세 페이지 하단의 CTA 버튼 가시성을 개선해 보세요.
                    </p>
                </div>
            </div>
        </div>
    )
}
