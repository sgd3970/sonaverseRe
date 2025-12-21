"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import { IProduct } from "@/lib/models/Product"
import { IImage } from "@/lib/models/Image"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

interface HeroBadgeProps {
    icon: string
    text: string
    color?: string
}

function HeroBadge({ icon, text, color = "manbo-green" }: HeroBadgeProps) {
    return (
        <div className={`inline-flex w-fit items-center gap-2 rounded-full border border-${color}/20 bg-${color}/10 px-4 py-1.5 md:px-5 md:py-2`}>
            <span className={`material-symbols-outlined text-base md:text-lg text-${color}`}>{icon}</span>
            <span className={`text-[10px] font-black text-${color} uppercase tracking-[0.2em]`}>{text}</span>
        </div>
    )
}

interface HeroButtonProps {
    href: string
    variant: 'primary' | 'secondary'
    color?: string
    children: React.ReactNode
}

function HeroButton({ href, variant, color = "manbo-green", children }: HeroButtonProps) {
    if (variant === 'primary') {
        return (
            <button className={`h-14 md:h-16 px-8 md:px-12 rounded-full bg-gradient-to-br from-${color} to-[#1d8e4a] text-white text-xs md:text-sm font-black shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500 uppercase tracking-widest`}>
                <Link href={href}>{children}</Link>
            </button>
        )
    }

    return (
        <button className={`h-14 md:h-16 px-8 md:px-12 rounded-full bg-white text-gray-500 text-xs md:text-sm font-black border-2 border-gray-100 hover:border-${color} hover:text-${color} transition-all duration-300 uppercase tracking-widest`}>
            <Link href={href}>{children}</Link>
        </button>
    )
}

interface HeroImageProps {
    src: string
    alt: string
    color?: string
}

function HeroImage({ src, alt, color = "manbo-green" }: HeroImageProps) {
    return (
        <div className="flex-1 w-full relative mt-8 lg:mt-0">
            <div className={`absolute -inset-10 bg-${color}/20 rounded-full blur-[80px] opacity-20 animate-pulse`}></div>
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl md:rounded-[4rem] bg-white shadow-2xl border border-white/50 p-4 md:p-6">
                <OptimizedImage
                    alt={alt}
                    title={alt}
                    src={src}
                    fill
                    className="rounded-2xl md:rounded-[3rem]"
                    objectFit="cover"
                />
            </div>
        </div>
    )
}

interface ManboHeroProps {
    product?: IProduct | null;
    heroImage?: IImage | null;
}

export function ManboHero({ product, heroImage }: ManboHeroProps) {
    const { t, isLoading } = useTranslation()

    // Fallback data if product is not yet loaded or available (for development preview)
    const title = product?.name?.ko || "만보 / 워크메이트"
    const subtitle = product?.subtitle?.ko || "지능형 하이브리드 보행 보조기"
    const description = product?.short_description?.ko || "사용자의 의지를 읽는 인공지능 모터 제어.\n경사지에서도 평지처럼 가벼운 보행을 선물합니다."
    const imageUrl = heroImage?.url || "/images/product/manbo/product2.webp"

    if (isLoading) {
        return (
            <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center bg-[#F9F9F7]">
                <div className="text-center animate-pulse">
                    <div className="h-8 w-32 bg-gray-200 rounded mx-auto mb-6" />
                    <div className="h-16 w-64 bg-gray-200 rounded mx-auto mb-6" />
                    <div className="h-8 w-96 bg-gray-200 rounded mx-auto" />
                </div>
            </section>
        )
    }

    return (
        <section className="bg-gradient-to-b from-[#f0ece9] to-[#fcfbf9] pt-32 pb-16 md:pt-48 md:pb-32">
            <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                <div className="flex-1 flex flex-col gap-6 md:gap-10 z-10 text-center lg:text-left items-center lg:items-start">
                    <HeroBadge icon="verified" text="Innovation Leader" color="manbo-green" />

                    <div>
                        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-gray-900 leading-[1.1] mb-4 tracking-tighter whitespace-pre-line">
                            {title}
                        </h1>
                        <p className="text-lg md:text-2xl font-bold text-gray-600 tracking-tight">{subtitle}</p>
                    </div>

                    <p className="text-base md:text-xl leading-relaxed text-gray-500 max-w-xl font-light whitespace-pre-line">
                        {description}
                    </p>

                    <div className="pt-4 md:pt-6 flex flex-wrap justify-center lg:justify-start gap-4 md:gap-5">
                        <HeroButton href="/inquiry?product=manbo" variant="primary" color="manbo-green">
                            Consulting Request
                        </HeroButton>
                        <HeroButton href="/catalog/manbo" variant="secondary" color="manbo-green">
                            Catalog
                        </HeroButton>
                    </div>
                </div>

                <HeroImage src={imageUrl} alt={title} color="manbo-green" />
            </div>
        </section>
    )
}
