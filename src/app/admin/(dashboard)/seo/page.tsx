"use client"

import { useState, useEffect } from "react"
import { Button } from "@/shared/components/ui/Button"

interface SeoSettings {
    site_name: string
    site_url: string
    default_title: {
        ko: string
        en: string
    }
    default_description: {
        ko: string
        en: string
    }
    default_keywords: {
        ko: string[]
        en: string[]
    }
    default_og_image: string
    social_links: {
        facebook?: string
        instagram?: string
        youtube?: string
        twitter?: string
    }
    contact: {
        email: string
        phone?: string
    }
}

export default function SeoSettingsPage() {
    const [settings, setSettings] = useState<SeoSettings | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/seo-settings')
            const data = await res.json()
            if (data.success && data.data) {
                setSettings({
                    site_name: data.data.siteName || '',
                    site_url: data.data.siteUrl || '',
                    default_title: data.data.defaultTitle || { ko: '', en: '' },
                    default_description: data.data.defaultDescription || { ko: '', en: '' },
                    default_keywords: data.data.defaultKeywords || { ko: [], en: [] },
                    default_og_image: data.data.defaultOgImage || '',
                    social_links: data.data.socialLinks || {},
                    contact: data.data.contact || { email: '', phone: '' },
                })
            }
        } catch (error) {
            console.error('Failed to fetch SEO settings:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        if (!settings) return

        setIsSaving(true)
        try {
            const res = await fetch('/api/admin/seo-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    siteName: settings.site_name,
                    siteUrl: settings.site_url,
                    defaultTitle: settings.default_title,
                    defaultDescription: settings.default_description,
                    defaultKeywords: settings.default_keywords,
                    defaultOgImage: settings.default_og_image,
                    socialLinks: settings.social_links,
                    contact: settings.contact,
                }),
            })

            const data = await res.json()
            if (data.success) {
                alert('SEO 설정이 저장되었습니다.')
            } else {
                alert('저장에 실패했습니다.')
            }
        } catch (error) {
            console.error('Failed to save SEO settings:', error)
            alert('저장 중 오류가 발생했습니다.')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading || !settings) {
        return (
            <div className="flex-1 overflow-y-auto p-8 admin-scroll bg-admin-bg">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-700 rounded w-1/4" />
                    <div className="h-4 bg-gray-700 rounded w-1/2" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in max-w-4xl">
                {/* 헤더 */}
                <div className="mb-8">
                    <h1 className="text-admin-text-main text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
                        <span className="material-symbols-outlined text-3xl">search</span>
                        공용 SEO 설정
                    </h1>
                    <p className="text-admin-text-secondary mt-2">
                        모든 페이지에 적용되는 기본 SEO 메타데이터를 설정합니다.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* 사이트 기본 정보 */}
                    <div className="bg-admin-surface rounded-xl border border-admin-border p-6">
                        <h2 className="text-admin-text-main text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">info</span>
                            사이트 기본 정보
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                                    사이트명
                                </label>
                                <input
                                    type="text"
                                    value={settings.site_name}
                                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                    className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-admin-text-main focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                                    사이트 URL
                                </label>
                                <input
                                    type="url"
                                    value={settings.site_url}
                                    onChange={(e) => setSettings({ ...settings, site_url: e.target.value })}
                                    className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-admin-text-main focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 기본 메타데이터 */}
                    <div className="bg-admin-surface rounded-xl border border-admin-border p-6">
                        <h2 className="text-admin-text-main text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">description</span>
                            기본 메타데이터
                        </h2>

                        <div className="space-y-6">
                            {/* 한국어 */}
                            <div className="space-y-4">
                                <h3 className="text-admin-text-main font-semibold">한국어 (KO)</h3>

                                <div>
                                    <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                                        기본 제목
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.default_title.ko}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            default_title: { ...settings.default_title, ko: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-admin-text-main focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                                        기본 설명
                                    </label>
                                    <textarea
                                        value={settings.default_description.ko}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            default_description: { ...settings.default_description, ko: e.target.value }
                                        })}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-admin-text-main focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                                        기본 키워드 (쉼표로 구분)
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.default_keywords.ko.join(', ')}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            default_keywords: { ...settings.default_keywords, ko: e.target.value.split(',').map(k => k.trim()) }
                                        })}
                                        className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-admin-text-main focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* 영어 */}
                            <div className="space-y-4 pt-6 border-t border-admin-border">
                                <h3 className="text-admin-text-main font-semibold">English (EN)</h3>

                                <div>
                                    <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                                        Default Title
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.default_title.en}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            default_title: { ...settings.default_title, en: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-admin-text-main focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                                        Default Description
                                    </label>
                                    <textarea
                                        value={settings.default_description.en}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            default_description: { ...settings.default_description, en: e.target.value }
                                        })}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-admin-text-main focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                                        Default Keywords (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.default_keywords.en.join(', ')}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            default_keywords: { ...settings.default_keywords, en: e.target.value.split(',').map(k => k.trim()) }
                                        })}
                                        className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-admin-text-main focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 소셜 링크 */}
                    <div className="bg-admin-surface rounded-xl border border-admin-border p-6">
                        <h2 className="text-admin-text-main text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">share</span>
                            소셜 미디어 링크
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                                    Facebook
                                </label>
                                <input
                                    type="url"
                                    value={settings.social_links.facebook || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        social_links: { ...settings.social_links, facebook: e.target.value }
                                    })}
                                    placeholder="https://facebook.com/sonaverse"
                                    className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-admin-text-main focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                                    Instagram
                                </label>
                                <input
                                    type="url"
                                    value={settings.social_links.instagram || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        social_links: { ...settings.social_links, instagram: e.target.value }
                                    })}
                                    placeholder="https://instagram.com/sonaverse"
                                    className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-admin-text-main focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                                    YouTube
                                </label>
                                <input
                                    type="url"
                                    value={settings.social_links.youtube || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        social_links: { ...settings.social_links, youtube: e.target.value }
                                    })}
                                    placeholder="https://youtube.com/@sonaverse"
                                    className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-admin-text-main focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                                    Twitter
                                </label>
                                <input
                                    type="url"
                                    value={settings.social_links.twitter || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        social_links: { ...settings.social_links, twitter: e.target.value }
                                    })}
                                    placeholder="https://twitter.com/sonaverse"
                                    className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-admin-text-main focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 연락처 */}
                    <div className="bg-admin-surface rounded-xl border border-admin-border p-6">
                        <h2 className="text-admin-text-main text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">contact_mail</span>
                            연락처 정보
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                                    이메일
                                </label>
                                <input
                                    type="email"
                                    value={settings.contact.email}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        contact: { ...settings.contact, email: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-admin-text-main focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                                    전화번호 (선택)
                                </label>
                                <input
                                    type="tel"
                                    value={settings.contact.phone || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        contact: { ...settings.contact, phone: e.target.value }
                                    })}
                                    placeholder="02-1234-5678"
                                    className="w-full px-4 py-2 bg-admin-bg border border-admin-border rounded-lg text-admin-text-main focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 저장 버튼 */}
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-12 px-8 bg-admin-primary hover:bg-admin-primary-dark"
                        >
                            {isSaving ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                                    저장 중...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined mr-2">save</span>
                                    설정 저장
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
