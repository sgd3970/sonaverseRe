"use client"

export function AnalyticsPopularPages() {
    return (
        <div className="bg-admin-surface rounded-2xl border border-admin-border overflow-hidden shadow-lg">
            <div className="p-6 border-b border-admin-border flex justify-between items-center">
                <h3 className="text-admin-text-main font-bold">인기 방문 페이지</h3>
                <select className="bg-admin-bg border border-admin-border text-xs text-admin-text-secondary rounded px-2 py-1 outline-none">
                    <option>페이지뷰순</option>
                    <option>체류시간순</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-admin-bg text-left">
                        <tr>
                            <th className="p-4 text-[10px] font-black text-admin-text-secondary uppercase">페이지 경로</th>
                            <th className="p-4 text-[10px] font-black text-admin-text-secondary uppercase">PV</th>
                            <th className="p-4 text-[10px] font-black text-admin-text-secondary uppercase">평균 체류</th>
                            <th className="p-4 text-[10px] font-black text-admin-text-secondary uppercase">이탈률</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {[
                            { path: "/products/manbo", pv: "42,904", duration: "03:42", bounceRate: "12.4%" },
                            { path: "/", pv: "38,201", duration: "01:20", bounceRate: "34.5%" },
                            { path: "/story/1", pv: "12,042", duration: "05:12", bounceRate: "8.2%" },
                            { path: "/products/bodeum", pv: "8,294", duration: "02:50", bounceRate: "18.1%" },
                            { path: "/press", pv: "5,102", duration: "01:10", bounceRate: "42.9%" },
                            { path: "/inquiry", pv: "2,940", duration: "04:15", bounceRate: "25.3%" }
                        ].map((item, idx) => (
                            <tr key={idx} className="hover:bg-admin-surface-hover/30 transition-colors">
                                <td className="p-4">
                                    <span className="text-sm font-bold text-admin-primary block">{item.path}</span>
                                </td>
                                <td className="p-4 text-sm text-admin-text-main font-medium">{item.pv}</td>
                                <td className="p-4 text-sm text-admin-text-secondary">{item.duration}</td>
                                <td className="p-4 text-sm text-admin-text-secondary font-mono">{item.bounceRate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
