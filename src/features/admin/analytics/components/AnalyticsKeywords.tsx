"use client"

export function AnalyticsKeywords() {
    return (
        <div className="bg-admin-surface rounded-2xl border border-admin-border overflow-hidden shadow-lg">
            <div className="p-6 border-b border-admin-border flex justify-between items-center">
                <h3 className="text-admin-text-main font-bold">유입 키워드 분석 (Top 10)</h3>
                <button className="text-xs text-admin-primary font-bold hover:underline">
                    상세 리포트 <span className="material-symbols-outlined select-none text-xs">open_in_new</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-admin-bg text-left">
                        <tr>
                            <th className="p-4 text-[10px] font-black text-admin-text-secondary uppercase">키워드</th>
                            <th className="p-4 text-[10px] font-black text-admin-text-secondary uppercase">검색량</th>
                            <th className="p-4 text-[10px] font-black text-admin-text-secondary uppercase">변화</th>
                            <th className="p-4 text-[10px] font-black text-admin-text-secondary uppercase">비중</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {[
                            { keyword: "노인 보행기 추천", searches: "12,402", change: "+24%", percentage: 70, isPositive: true },
                            { keyword: "성인용 기저귀 대량구매", searches: "8,294", change: "+15%", percentage: 44, isPositive: true },
                            { keyword: "소나버스", searches: "5,102", change: "+52%", percentage: 36, isPositive: true },
                            { keyword: "만보 워크메이트", searches: "4,203", change: "+8%", percentage: 24, isPositive: true },
                            { keyword: "실버테크 스타트업", searches: "2,940", change: "-2%", percentage: 16, isPositive: false },
                            { keyword: "부모님 효도 선물", searches: "1,204", change: "+10%", percentage: 10, isPositive: true }
                        ].map((item, idx) => (
                            <tr key={idx} className="hover:bg-admin-surface-hover/30 transition-colors">
                                <td className="p-4 text-sm font-bold text-admin-text-main">{item.keyword}</td>
                                <td className="p-4 text-sm text-admin-text-secondary">{item.searches}</td>
                                <td className={`p-4 text-xs font-bold ${item.isPositive ? "text-admin-success" : "text-admin-danger"}`}>
                                    {item.change}
                                </td>
                                <td className="p-4">
                                    <div className="w-24 h-1.5 bg-admin-bg rounded-full overflow-hidden">
                                        <div className="h-full bg-admin-primary" style={{ width: `${item.percentage}%` }} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
