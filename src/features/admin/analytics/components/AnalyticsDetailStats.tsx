"use client"

export function AnalyticsDetailStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { title: "접속 기기", data: [{ name: "Mobile", value: 64 }, { name: "Desktop", value: 32 }, { name: "Tablet", value: 4 }] },
                { title: "주요 연령대", data: [{ name: "60s+", value: 72 }, { name: "50s", value: 18 }, { name: "Others", value: 10 }] },
                { title: "유입 채널", data: [{ name: "Search", value: 55 }, { name: "Direct", value: 25 }, { name: "Social", value: 20 }] },
                { title: "방문 지역", data: [{ name: "수도권", value: 60 }, { name: "경상", value: 20 }, { name: "기타", value: 20 }] }
            ].map((section, idx) => (
                <div key={idx} className="bg-admin-surface p-6 rounded-2xl border border-admin-border shadow-lg">
                    <h4 className="text-xs font-bold text-admin-text-secondary uppercase mb-6 tracking-widest">{section.title}</h4>
                    <div className="space-y-4">
                        {section.data.map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-admin-text-main font-medium">{item.name}</span>
                                    <span className="text-admin-text-secondary font-bold">{item.value}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-admin-bg rounded-full overflow-hidden">
                                    <div className="h-full bg-admin-primary opacity-80" style={{ width: `${item.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
