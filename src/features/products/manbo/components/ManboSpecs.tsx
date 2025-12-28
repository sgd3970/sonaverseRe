"use client"

import { useTranslation, useLocale } from "@/lib/i18n"

import { IProduct } from "@/lib/models/Product"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

interface SpecSectionProps {
    image: string
    badge: string
    title: string
    highlight: string
    description: string
    reverse?: boolean
    color?: string
}

function SpecSection({ image, badge, title, highlight, description, reverse = false, color = "manbo-green" }: SpecSectionProps) {
    const FlexContainer = reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
    const TextAlign = reverse ? 'lg:text-right' : 'lg:text-left'

    return (
        <div className={`flex flex-col ${FlexContainer} items-center gap-12 md:gap-32`}>
            <div className="w-full lg:flex-1 rounded-3xl md:rounded-[3.5rem] overflow-hidden shadow-xl bg-white p-4 md:p-6 group">
                <div className="relative w-full aspect-[4/3]">
                    <OptimizedImage
                        alt={title}
                        src={image}
                        fill
                        className="rounded-2xl md:rounded-[2.5rem] transition-transform duration-1000 group-hover:scale-105"
                        objectFit="cover"
                    />
                </div>
            </div>
            <div className={`w-full lg:flex-1 space-y-6 md:space-y-10 text-center ${TextAlign}`}>
                <span className="text-primary font-black tracking-[0.3em] text-[10px] md:text-xs uppercase">{badge}</span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.2] tracking-tight">
                    {title} <br /><span className="text-primary italic font-serif">{highlight}</span>
                </h2>
                <p className={`text-base md:text-xl text-gray-500 leading-relaxed font-light ${reverse ? 'lg:ml-auto lg:max-w-lg' : ''}`}>
                    {description}
                </p>
            </div>
        </div>
    )
}

interface ManboSpecsProps {
    product?: IProduct | null;
}

export function ManboSpecs({ product }: ManboSpecsProps) {
    const { t, isLoading } = useTranslation()
    const locale = useLocale()

    if (isLoading) {
        return (
            <section className="py-20 bg-[#F9F9F7]">
                <div className="container-custom">
                    <div className="space-y-24">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex flex-col lg:flex-row gap-12 items-center animate-pulse">
                                <div className="w-full lg:w-1/2 h-80 bg-gray-200 rounded-[3rem]" />
                                <div className="w-full lg:w-1/2 space-y-4">
                                    <div className="h-4 w-32 bg-gray-200 rounded" />
                                    <div className="h-12 w-64 bg-gray-200 rounded" />
                                    <div className="h-24 w-full bg-gray-200 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 md:py-48 bg-[#f8f6f4]">
            <div className="max-w-7xl mx-auto px-6 space-y-24 md:space-y-48">
                <SpecSection
                    image="/images/product/manbo/product2.webp"
                    badge="Core Technology 01"
                    title="경사를 평지처럼,"
                    highlight="Hybrid Motor"
                    description="오르막에서는 뒤에서 밀어주는 힘을, 내리막에서는 일정한 속도를 유지하는 감속 제어를 통해 신체적 부담을 70% 이상 경감시킵니다."
                    reverse={false}
                    color="manbo-green"
                />

                <SpecSection
                    image="/images/product/manbo/product2.webp"
                    badge="Core Technology 02"
                    title="직관을 넘어서는"
                    highlight="Smart Display"
                    description="고해상도 저전력 LCD를 탑재하여 햇빛 아래에서도 선명합니다. 복잡한 설정 없이 잡기만 하면 자동으로 시작되는 보행 트래킹을 경험하세요."
                    reverse={true}
                    color="manbo-green"
                />
            </div>
        </section>
    )
}
