"use client"

import { useTranslation } from "@/lib/i18n"
import { IProduct } from "@/lib/models/Product"

interface FeatureCardProps {
    icon: string
    title: string
    description: string
    color?: string
}

function FeatureCard({ icon, title, description, color = "manbo-green" }: FeatureCardProps) {
    return (
        <div className="p-8 md:p-12 rounded-3xl md:rounded-[3rem] bg-[#fafafa] border border-gray-100 hover:shadow-xl transition-all duration-500 group text-center md:text-left">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto md:mx-0 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary mb-6 md:mb-10 transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-3xl md:text-4xl">{icon}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 md:mb-4">{title}</h3>
            <p className="text-gray-400 leading-relaxed font-light text-base md:text-lg">{description}</p>
        </div>
    )
}

interface ManboFeaturesProps {
    product?: IProduct | null;
}

export function ManboFeatures({ product }: ManboFeaturesProps) {
    const { t, isLoading } = useTranslation()

    const defaultFeatures = [
        { icon: 'insights', title: '하이브리드 주행', description: '사용자의 보행 습관을 분석하여 실시간으로 최적의 보조력을 지원합니다.' },
        { icon: 'shield', title: '스마트 브레이크', description: '손을 떼는 순간 즉각적으로 반응하는 0.1초 전자식 자동 제동.' },
        { icon: 'emergency_share', title: '안심 케어 시스템', description: '실시간 위치 공유 및 위험 상황 알림으로 보호자에게 안심을 전합니다.' },
    ]

    const ICONS = ['insights', 'shield', 'emergency_share', 'bolt', 'favorite', 'verified'];

    const features = product?.features?.ko?.length
        ? product.features.ko.map((feature, idx) => {
            // Assuming feature string might be "Title|Description" or just "Description"
            // If just string, use it as description and generic title, or split if possible.
            // For now, let's assume simple string and use it as Title, with empty description or generic.
            // Or better, if the user entered "Title: Description", split it.
            const parts = feature.split(':');
            const title = parts[0].trim();
            const description = parts.length > 1 ? parts.slice(1).join(':').trim() : "Sonaverse Technology";

            return {
                icon: ICONS[idx % ICONS.length],
                title: title,
                description: description
            };
        })
        : defaultFeatures;

    if (isLoading) {
        return (
            <section className="py-20 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 bg-gray-200 rounded-[3rem]" />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                    {features.map((card, idx) => (
                        <FeatureCard
                            key={idx}
                            icon={card.icon}
                            title={card.title}
                            description={card.description}
                            color="manbo-green"
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
