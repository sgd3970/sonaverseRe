"use client"

import { useTranslation, useLocale } from "@/lib/i18n"
import { IProduct } from "@/lib/models/Product"
import { IImage } from "@/lib/models/Image"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

interface HeroBadgeProps {
    text: string
    color?: string
}

function HeroBadge({ text, color = "bodeum-green" }: HeroBadgeProps) {
    return (
        <span className="text-primary font-bold text-base md:text-lg mb-2 md:mb-3 block tracking-widest uppercase">
            {text}
        </span>
    )
}

interface StatItemProps {
    value: string
    label: string
    showBorder?: boolean
    color?: string
}

function StatItem({ value, label, showBorder = false, color = "bodeum-green" }: StatItemProps) {
    return (
        <div className={`text-center ${showBorder ? 'border-l border-gray-100 px-2 md:pl-8' : ''}`}>
            <p className="text-2xl md:text-4xl font-black text-primary mb-1">{value}</p>
            <p className="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wider">{label}</p>
        </div>
    )
}

interface FloatingCardProps {
    icon: string
    title: string
    subtitle: string
    color?: string
}

function FloatingCard({ icon, title, subtitle, color = "bodeum-green" }: FloatingCardProps) {
    return (
        <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 bg-white/95 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-white/50 animate-bounce-slow">
            <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined select-none text-sm md:text-base text-primary">{icon}</span>
                <span className="font-bold text-gray-800 text-sm md:text-lg">{title}</span>
            </div>
            <p className="text-[10px] md:text-sm text-gray-500 font-medium">{subtitle}</p>
        </div>
    )
}

interface HeroImageProps {
    src: string
    alt: string
    floatingCard?: {
        icon: string
        title: string
        subtitle: string
    }
    color?: string
}

function HeroImage({ src, alt, floatingCard, color = "bodeum-green" }: HeroImageProps) {
    return (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl md:rounded-[3rem] bg-white shadow-xl">
            <OptimizedImage src={src} alt={alt} fill className="rounded-2xl md:rounded-[3rem]" objectFit="cover" />
            {floatingCard && (
                <FloatingCard
                    icon={floatingCard.icon}
                    title={floatingCard.title}
                    subtitle={floatingCard.subtitle}
                    color={color}
                />
            )}
        </div>
    )
}

interface BodumeHeroProps {
    product?: IProduct | null;
    heroImage?: IImage | null;
}

export function BodumeHero({ product, heroImage }: BodumeHeroProps) {
    const { t, isLoading } = useTranslation()
    const locale = useLocale()

    // Fallback data
    const title = product?.name?.ko || "보듬"
    const subtitle = product?.subtitle?.ko || "프리미엄 성인용 기저귀"
    const imageUrl = heroImage?.url || "/images/product/bodume/product1.webp"

    if (isLoading) {
        return (
            <section className="relative w-full h-[70vh] min-h-[500px] flex items-center bg-white">
                <div className="container-custom flex flex-col lg:flex-row items-center gap-12">
                    <div className="w-full lg:w-1/2 h-[400px] bg-gray-100 rounded-3xl animate-pulse" />
                    <div className="w-full lg:w-1/2 animate-pulse">
                        <div className="h-8 w-40 bg-gray-200 rounded mb-6" />
                        <div className="h-16 w-96 bg-gray-200 rounded mb-6" />
                        <div className="h-8 w-80 bg-gray-100 rounded" />
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="pt-32 pb-16 md:pt-40 md:pb-32 bg-white relative overflow-hidden">
            {/* Background design - right half with soft blue */}
            <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-primary-light -z-10 lg:rounded-l-[5rem]" />

            <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row gap-10 lg:gap-16 items-center">
                {/* Left Image Side */}
                <div className="flex-1 w-full relative">
                    <HeroImage
                        src={imageUrl}
                        alt={title}
                        floatingCard={{
                            icon: "water_drop",
                            title: "초강력 흡수",
                            subtitle: "밤새 걱정 없는 12시간 지속"
                        }}
                        color="bodeum-green"
                    />
                </div>

                {/* Right Content Side */}
                <div className="flex-1 text-center lg:text-left">
                    <HeroBadge text="Premium Care" color="bodeum-green" />

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-4 md:mb-6 leading-tight">
                        {title}
                    </h1>

                    <p className="text-xl md:text-3xl text-gray-600 font-medium mb-8 md:mb-10">
                        {subtitle}
                    </p>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8 py-6 md:py-10 border-t border-gray-100">
                        <StatItem value="100%" label="순면 감촉" color="bodeum-green" />
                        <StatItem value="12h" label="안심 보호" showBorder color="bodeum-green" />
                        <StatItem value="ISO" label="국제 인증" showBorder color="bodeum-green" />
                    </div>
                </div>
            </div>
        </section>
    )
}
