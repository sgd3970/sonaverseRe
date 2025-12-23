"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/Button"
import { Logo, FallbackLogo } from "@/shared/components/ui/Logo"
import { useTranslation, useLocale, useSetLocale, type Locale } from "@/lib/i18n"

// 제품 서브메뉴 (정적 정의)
const PRODUCT_SUB_ITEMS = [
    { nameKey: "common.nav.manbo", href: "/products/manbo" },
    { nameKey: "common.nav.bodume", href: "/products/bodume" },
]

// 메인 네비게이션 아이템 (정적 정의)
const NAV_ITEMS = [
    { nameKey: "common.nav.home", href: "/" },
    { nameKey: "common.nav.products", href: "/products", hasDropdown: true },
    { nameKey: "common.nav.stories", href: "/stories" },
    { nameKey: "common.nav.press", href: "/press" },
    { nameKey: "common.nav.inquiry", href: "/inquiry" },
]

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false)
    const [isProductsMenuOpen, setIsProductsMenuOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const pathname = usePathname()

    const { t, isLoading } = useTranslation()
    const locale = useLocale()
    const setLocale = useSetLocale()

    // Handle scroll effect
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close mobile menu on path change
    React.useEffect(() => {
        setIsMobileMenuOpen(false)
        setIsProductsMenuOpen(false)
    }, [pathname])

    // Close dropdowns on click outside
    React.useEffect(() => {
        const handleClickOutside = () => {
            setIsLangMenuOpen(false)
            setIsProductsMenuOpen(false)
        }
        if (isLangMenuOpen || isProductsMenuOpen) {
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    }, [isLangMenuOpen, isProductsMenuOpen])

    // 언어 전환 핸들러
    const handleLanguageChange = (newLocale: Locale) => {
        setLocale(newLocale)
        setIsLangMenuOpen(false)
    }

    const languageLabel = locale === 'ko' ? t('common.language.korean') : t('common.language.english')
    const otherLanguage: Locale = locale === 'ko' ? 'en' : 'ko'
    const otherLanguageLabel = locale === 'ko' ? t('common.language.english') : t('common.language.korean')
    const isProductsActive = pathname.startsWith('/products')

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled || isMobileMenuOpen ? "bg-white/98 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-white/20 backdrop-blur-sm"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Logo type="full" size="md" linkToHome priority={true} />

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 lg:gap-10 h-full">
                    {NAV_ITEMS.map((item) => (
                        <div key={item.href} className="relative group h-full flex items-center">
                            {item.hasDropdown ? (
                                <>
                                    <button
                                        className={cn(
                                            "text-lg font-bold flex items-center gap-1 transition-colors",
                                            isProductsActive
                                                ? 'text-primary'
                                                : 'text-gray-700 hover:text-primary'
                                        )}
                                    >
                                        {t(item.nameKey)}
                                        <span className="material-symbols-outlined text-xl">expand_more</span>
                                    </button>
                                    {/* Dropdown */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 hidden group-hover:block w-48">
                                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 flex flex-col animate-fade-in-up">
                                            {PRODUCT_SUB_ITEMS.map((subItem) => (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href}
                                                    className={cn(
                                                        "text-left px-5 py-3 text-sm font-bold hover:bg-gray-50 transition-colors",
                                                        pathname === subItem.href
                                                            ? 'text-primary bg-primary/5'
                                                            : 'text-gray-600 hover:text-primary'
                                                    )}
                                                >
                                                    {t(subItem.nameKey)}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "text-lg font-bold transition-colors",
                                        (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
                                            ? 'text-primary'
                                            : 'text-gray-700 hover:text-primary'
                                    )}
                                >
                                    {t(item.nameKey)}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Actions - Language Switcher */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            className="flex items-center gap-2 h-12 px-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all"
                        >
                            <span className="material-symbols-outlined text-xl">language</span>
                            <span className="font-bold text-sm">{languageLabel}</span>
                            <span className="material-symbols-outlined text-xl">expand_more</span>
                        </button>
                        {isLangMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 min-w-[140px] animate-fade-in-up">
                                <button
                                    onClick={() => handleLanguageChange(otherLanguage)}
                                    className="w-full text-left px-4 py-2 text-sm font-bold text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
                                >
                                    {otherLanguageLabel}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-gray-600"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="material-symbols-outlined text-3xl">
                        {isMobileMenuOpen ? "close" : "menu"}
                    </span>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl p-6 flex flex-col gap-2 md:hidden animate-fade-in-down max-h-[80vh] overflow-y-auto">
                    {NAV_ITEMS.map((item) => (
                        <div key={item.href} className="w-full">
                            {item.hasDropdown ? (
                                <div className="py-2">
                                    <div className="text-lg font-bold text-gray-800 mb-2">{t(item.nameKey)}</div>
                                    <div className="pl-4 flex flex-col gap-2 border-l-2 border-gray-100">
                                        {PRODUCT_SUB_ITEMS.map((subItem) => (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={cn(
                                                    "text-left text-base font-medium py-1",
                                                    pathname === subItem.href ? 'text-primary' : 'text-gray-500'
                                                )}
                                            >
                                                {t(subItem.nameKey)}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "text-left text-lg font-bold py-3 w-full border-b border-gray-50",
                                        (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)) ? 'text-primary' : 'text-gray-700'
                                    )}
                                >
                                    {t(item.nameKey)}
                                </Link>
                            )}
                        </div>
                    ))}

                    {/* Language Switcher - Mobile */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => {
                                handleLanguageChange(otherLanguage)
                                setIsMobileMenuOpen(false)
                            }}
                            className="w-full h-12 rounded-xl border border-gray-200 font-bold text-gray-700 flex items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all"
                        >
                            <span className="material-symbols-outlined text-xl">language</span>
                            <span>{otherLanguageLabel}</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    )
}
