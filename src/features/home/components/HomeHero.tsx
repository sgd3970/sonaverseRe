"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/shared/components/ui/Button"
import { useTranslation } from "@/lib/i18n"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

export function HomeHero() {
    const { t, isLoading } = useTranslation()

    if (isLoading) {
        return (
            <section className="relative w-full">
                <div className="block md:hidden relative w-full aspect-[4/3] bg-gray-900 animate-pulse" />
                <div className="hidden md:block relative w-full h-[85vh] min-h-[600px] bg-gray-900 animate-pulse" />
            </section>
        )
    }

    // 줄바꿈 처리를 위해 title을 split
    const heroTitle = t('home.hero.title')
    const titleLines = typeof heroTitle === 'string' ? heroTitle.split('\n') : ['시니어의', '더 나은 일상을 위해']

    return (
        <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
            {/* Background Image - Priority loading for LCP */}
            <OptimizedImage
                alt="Happy senior lifestyle"
                title="시니어의 더 나은 일상을 위한 소나버스"
                className="scale-105"
                src="/images/hero/home-hero.webp"
                fill
                priority
                sizes="100vw"
                objectFit="cover"
            />

            {/* Sophisticated Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center gap-10 animate-fade-in-up pt-10">
                <div className="space-y-4">
                    <span className="text-white/60 font-black tracking-[0.4em] text-xs md:text-sm uppercase block animate-pulse">For a Better Daily Life</span>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">
                        Sonaverse
                    </h1>
                </div>
                <p className="text-xl md:text-3xl text-white/90 max-w-3xl leading-relaxed font-extralight drop-shadow-lg">
                    시니어의 더 나은 일상을 위한<br className="md:hidden" /> <span className="font-bold">따뜻한 혁신</span>을 만들어갑니다.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 mt-6">
                    <Link
                        href="/products/manbo"
                        className="h-16 px-12 rounded-full bg-white text-gray-900 font-black hover:bg-gray-100 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.2)] hover:scale-105 hover:-translate-y-1 active:scale-95 flex items-center justify-center"
                    >
                        {t('home.hero.cta.products') || '제품 보러가기'}
                    </Link>
                    <Link
                        href="/stories"
                        className="h-16 px-12 rounded-full border border-white/30 bg-white/5 backdrop-blur-xl text-white font-bold hover:bg-white/10 transition-all hover:scale-105 flex items-center justify-center"
                    >
                        {t('home.hero.cta.story') || '브랜드 스토리'}
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
                <span className="material-symbols-outlined select-none text-4xl font-light">keyboard_arrow_down</span>
            </div>
        </section>
    )
}
