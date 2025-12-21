"use client"

interface StatItem {
    icon: string
    title: string
    value: string
    change: string
    trend: string
}

interface AnalyticsStatsCardsProps {
    stats: StatItem[]
}

export function AnalyticsStatsCards({ stats }: AnalyticsStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-admin-surface p-6 rounded-2xl border border-admin-border hover:border-admin-primary/40 transition-all group shadow-xl shadow-black/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="size-10 rounded-xl bg-admin-bg flex items-center justify-center text-admin-primary group-hover:bg-admin-primary group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined select-none text-xl">{stat.icon}</span>
                        </div>
                        <div className="flex items-end gap-1 h-8 w-24">
                            {[37.5, 56.25, 43.75, 75, 68.75, 100, 87.5].map((height, i) => (
                                <div key={i} className={`flex-1 ${stat.trend === "down" ? "bg-admin-danger" : "bg-admin-success"} rounded-t-sm opacity-50 hover:opacity-100 transition-opacity`} style={{ height: `${height}%` }} />
                            ))}
                        </div>
                    </div>
                    <p className="text-admin-text-secondary text-xs font-bold mb-1 uppercase tracking-wider">{stat.title}</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-black text-admin-text-main tracking-tight">{stat.value}</h3>
                        <span className={`text-xs font-bold flex items-center gap-0.5 ${stat.trend === "down" ? "text-admin-danger" : "text-admin-success"}`}>
                            <span className="material-symbols-outlined select-none text-sm">{stat.trend === "down" ? "trending_down" : "trending_up"}</span>
                            {stat.change}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}
