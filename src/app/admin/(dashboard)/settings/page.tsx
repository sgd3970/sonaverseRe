"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AdminSettingsPage() {
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        siteName: '',
        sitePhone: '',
        siteAddress: '',
        socialLinks: {
            youtube: '',
            instagram: '',
        },
    })

    const { data, isLoading, mutate } = useSWR('/api/admin/settings', fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60000, // 1분 캐싱 (설정은 자주 변경되지 않음)
    })

    useEffect(() => {
        if (data?.data) {
            setFormData({
                siteName: data.data.siteName || '',
                sitePhone: data.data.sitePhone || '',
                siteAddress: data.data.siteAddress || '',
                socialLinks: {
                    youtube: data.data.socialLinks?.youtube || '',
                    instagram: data.data.socialLinks?.instagram || '',
                },
            })
        }
    }, [data])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const result = await res.json()
            if (result.success) {
                mutate()
                alert('설정이 저장되었습니다.')
            } else {
                alert('저장에 실패했습니다.')
            }
        } catch (error) {
            alert('저장에 실패했습니다.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-admin-text-main text-2xl md:text-3xl font-bold tracking-tight">시스템 설정</h1>
                        <p className="text-admin-text-secondary mt-1">사이트의 기본 정보 및 SEO, SNS 링크를 설정합니다.</p>
                    </div>
                </div>

                <div className="bg-admin-surface border border-admin-border rounded-2xl p-6 md:p-8 space-y-8">
                    {/* 기본 정보 */}
                    <section className="space-y-6">
                        <h3 className="text-admin-text-main font-bold flex items-center gap-2 border-b border-admin-border pb-4">
                            <span className="material-symbols-outlined select-none text-admin-primary">info</span>
                            기본 정보
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary">사이트 이름</label>
                                <input
                                    value={formData.siteName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                                    className="w-full bg-admin-bg border border-admin-border rounded-xl h-12 px-4 text-sm focus:border-admin-primary focus:outline-none"
                                    placeholder="Sonaverse"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary">대표번호</label>
                                <input
                                    value={formData.sitePhone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, sitePhone: e.target.value }))}
                                    className="w-full bg-admin-bg border border-admin-border rounded-xl h-12 px-4 text-sm focus:border-admin-primary focus:outline-none"
                                    placeholder="010-5703-8899"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-admin-text-secondary">사업장 주소</label>
                                <input
                                    value={formData.siteAddress}
                                    onChange={(e) => setFormData(prev => ({ ...prev, siteAddress: e.target.value }))}
                                    className="w-full bg-admin-bg border border-admin-border rounded-xl h-12 px-4 text-sm focus:border-admin-primary focus:outline-none"
                                    placeholder="강원특별자치도 춘천시 후석로462번길 7 춘천ICT벤처센터 319호"
                                />
                            </div>
                        </div>
                    </section>

                    {/* SNS 채널 설정 */}
                    <section className="space-y-6">
                        <h3 className="text-admin-text-main font-bold flex items-center gap-2 border-b border-admin-border pb-4">
                            <span className="material-symbols-outlined select-none text-admin-primary">share</span>
                            SNS 채널 설정
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary">YouTube</label>
                                <input
                                    value={formData.socialLinks.youtube}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                                    }))}
                                    className="w-full bg-admin-bg border border-admin-border rounded-xl h-12 px-4 text-sm focus:border-admin-primary focus:outline-none"
                                    placeholder="https://youtube.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary">Instagram</label>
                                <input
                                    value={formData.socialLinks.instagram}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                                    }))}
                                    className="w-full bg-admin-bg border border-admin-border rounded-xl h-12 px-4 text-sm focus:border-admin-primary focus:outline-none"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* 저장 버튼 */}
                    <div className="pt-8 border-t border-admin-border flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-8 py-3 rounded-xl bg-admin-primary text-white font-bold hover:bg-admin-primary-dark transition-all shadow-lg shadow-admin-primary/20"
                        >
                            {isSaving ? '저장 중...' : '설정 저장하기'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
