"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminProductNewPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        // 기본 정보
        slug: '',
        product_id: '',
        sku: '',
        type: 'manbo' as 'manbo' | 'bodume' | 'accessory' | 'other',

        // 다국어 이름
        name_ko: '',
        name_en: '',
        subtitle_ko: '',
        subtitle_en: '',
        short_description_ko: '',
        short_description_en: '',
        description_ko: '',
        description_en: '',

        // 특징 (쉼표로 구분)
        features_ko: '',
        features_en: '',

        // 스펙 (JSON string)
        specifications: '',

        // 가격
        retail_price: '',
        sale_price: '',
        currency: 'KRW',

        // 재고
        quantity: '0',
        is_in_stock: true,

        // 이미지
        thumbnail_url: '',
        hero_url: '',

        // 구매 옵션
        purchase_link: '',

        // 상태
        display_order: '0',
        is_active: false,
        is_featured: false,
        is_new: false,
        is_best: false,
    })

    // 슬러그 자동 생성
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^가-힣a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50)
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        setFormData(prev => ({
            ...prev,
            name_ko: name,
            slug: generateSlug(name),
            product_id: `prod-${Date.now()}`,
        }))
    }

    const handleSubmit = async () => {
        if (!formData.name_ko.trim()) {
            alert('제품명을 입력해주세요.')
            return
        }

        setIsSubmitting(true)
        try {
            // specifications JSON 파싱
            let specs = []
            if (formData.specifications.trim()) {
                try {
                    specs = JSON.parse(formData.specifications)
                } catch (e) {
                    alert('스펙 JSON 형식이 올바르지 않습니다.')
                    setIsSubmitting(false)
                    return
                }
            }

            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug: formData.slug,
                    product_id: formData.product_id,
                    sku: formData.sku || undefined,
                    type: formData.type,
                    name: {
                        ko: formData.name_ko,
                        en: formData.name_en || undefined,
                    },
                    subtitle: {
                        ko: formData.subtitle_ko || undefined,
                        en: formData.subtitle_en || undefined,
                    },
                    short_description: {
                        ko: formData.short_description_ko || undefined,
                        en: formData.short_description_en || undefined,
                    },
                    description: {
                        ko: formData.description_ko || undefined,
                        en: formData.description_en || undefined,
                    },
                    features: {
                        ko: formData.features_ko ? formData.features_ko.split(',').map(f => f.trim()) : [],
                        en: formData.features_en ? formData.features_en.split(',').map(f => f.trim()) : undefined,
                    },
                    specifications: specs,
                    pricing: {
                        retail_price: formData.retail_price ? Number(formData.retail_price) : undefined,
                        sale_price: formData.sale_price ? Number(formData.sale_price) : undefined,
                        currency: formData.currency,
                        tax_included: true,
                    },
                    inventory: {
                        track_inventory: true,
                        quantity: Number(formData.quantity),
                        is_in_stock: formData.is_in_stock,
                        allow_backorder: false,
                    },
                    purchase_options: {
                        min_quantity: 1,
                        purchase_link: formData.purchase_link || undefined,
                    },
                    display_order: Number(formData.display_order),
                    is_active: formData.is_active,
                    is_featured: formData.is_featured,
                    is_new: formData.is_new,
                    is_best: formData.is_best,
                }),
            })

            if (res.ok) {
                const data = await res.json()
                router.push(`/admin/products/${data.data.id}`)
            } else {
                const error = await res.json()
                alert(error.message || '저장에 실패했습니다.')
            }
        } catch (error) {
            alert('저장에 실패했습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
                {/* 헤더 */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push('/admin/products')}
                        className="size-10 rounded-xl bg-admin-surface border border-admin-border flex items-center justify-center text-admin-text-secondary hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined select-none">arrow_back</span>
                    </button>
                    <h1 className="text-admin-text-main text-2xl font-bold">새 제품 등록</h1>
                </div>

                {/* 폼 */}
                <div className="bg-admin-surface border border-admin-border rounded-2xl p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 제품명 (한국어) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                제품명 (한국어) <span className="text-admin-danger">*</span>
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="예: 보듬 팬티형 대형"
                                value={formData.name_ko}
                                onChange={handleNameChange}
                            />
                        </div>

                        {/* 제품명 (English) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                제품명 (English)
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="Product Name"
                                value={formData.name_en}
                                onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                            />
                        </div>

                        {/* 제품 유형 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                제품 유형 <span className="text-admin-danger">*</span>
                            </label>
                            <select
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm text-admin-text-main"
                                value={formData.type}
                                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                            >
                                <option value="manbo">만보 (보행보조기)</option>
                                <option value="bodume">보듬 (기저귀)</option>
                                <option value="accessory">액세서리</option>
                                <option value="other">기타</option>
                            </select>
                        </div>

                        {/* SKU */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                SKU (상품 코드)
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="예: BODEUM-L-001"
                                value={formData.sku}
                                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                            />
                        </div>

                        {/* 부제목 (한국어) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                부제목 (한국어)
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="예: 혼자서도 입고 벗기 편한 팬티형 기저귀"
                                value={formData.subtitle_ko}
                                onChange={(e) => setFormData(prev => ({ ...prev, subtitle_ko: e.target.value }))}
                            />
                        </div>

                        {/* 부제목 (English) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                부제목 (English)
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="Subtitle"
                                value={formData.subtitle_en}
                                onChange={(e) => setFormData(prev => ({ ...prev, subtitle_en: e.target.value }))}
                            />
                        </div>

                        {/* 정가 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                정가 (원)
                            </label>
                            <input
                                type="number"
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="0"
                                value={formData.retail_price}
                                onChange={(e) => setFormData(prev => ({ ...prev, retail_price: e.target.value }))}
                            />
                        </div>

                        {/* 판매가 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                판매가 (원)
                            </label>
                            <input
                                type="number"
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="0"
                                value={formData.sale_price}
                                onChange={(e) => setFormData(prev => ({ ...prev, sale_price: e.target.value }))}
                            />
                        </div>

                        {/* 재고 수량 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                재고 수량
                            </label>
                            <input
                                type="number"
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="0"
                                value={formData.quantity}
                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                            />
                        </div>

                        {/* 표시 순서 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                표시 순서
                            </label>
                            <input
                                type="number"
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="0"
                                value={formData.display_order}
                                onChange={(e) => setFormData(prev => ({ ...prev, display_order: e.target.value }))}
                            />
                        </div>

                        {/* 썸네일 이미지 URL */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                썸네일 이미지 URL
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="https://..."
                                value={formData.thumbnail_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                            />
                        </div>

                        {/* 히어로 이미지 URL */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                히어로 이미지 URL
                            </label>
                            <input
                                className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                placeholder="https://..."
                                value={formData.hero_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, hero_url: e.target.value }))}
                            />
                        </div>

                        {/* 주요 특징 (한국어) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    주요 특징 (한국어, 쉼표로 구분)
                                </label>
                                <input
                                    className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                    placeholder="예: 3D 입체 샘방지, 전면 통기성 커버, 소취 기능"
                                    value={formData.features_ko}
                                    onChange={(e) => setFormData(prev => ({ ...prev, features_ko: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* 주요 특징 (English) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    주요 특징 (English, comma-separated)
                                </label>
                                <input
                                    className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                    placeholder="e.g., 3D leak prevention, Breathable cover"
                                    value={formData.features_en}
                                    onChange={(e) => setFormData(prev => ({ ...prev, features_en: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* 짧은 설명 (한국어) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    짧은 설명 (한국어)
                                </label>
                                <textarea
                                    className="w-full h-24 bg-admin-bg border border-admin-border rounded-xl p-4 text-sm resize-none"
                                    placeholder="목록에 표시될 짧은 설명"
                                    value={formData.short_description_ko}
                                    onChange={(e) => setFormData(prev => ({ ...prev, short_description_ko: e.target.value }))}
                                ></textarea>
                            </div>
                        </div>

                        {/* 짧은 설명 (English) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    짧은 설명 (English)
                                </label>
                                <textarea
                                    className="w-full h-24 bg-admin-bg border border-admin-border rounded-xl p-4 text-sm resize-none"
                                    placeholder="Short description for listing"
                                    value={formData.short_description_en}
                                    onChange={(e) => setFormData(prev => ({ ...prev, short_description_en: e.target.value }))}
                                ></textarea>
                            </div>
                        </div>

                        {/* 상세 설명 (한국어, HTML) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    상세 설명 (한국어, HTML)
                                </label>
                                <textarea
                                    className="w-full h-60 bg-admin-bg border border-admin-border rounded-xl p-4 text-sm font-mono"
                                    placeholder="제품 상세 설명을 HTML 형식으로 작성하세요"
                                    value={formData.description_ko}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description_ko: e.target.value }))}
                                ></textarea>
                            </div>
                        </div>

                        {/* 상세 설명 (English, HTML) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    상세 설명 (English, HTML)
                                </label>
                                <textarea
                                    className="w-full h-60 bg-admin-bg border border-admin-border rounded-xl p-4 text-sm font-mono"
                                    placeholder="Product description in HTML format"
                                    value={formData.description_en}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                                ></textarea>
                            </div>
                        </div>

                        {/* 제품 스펙 (JSON) */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    제품 스펙 (JSON 형식)
                                </label>
                                <textarea
                                    className="w-full h-40 bg-admin-bg border border-admin-border rounded-xl p-4 text-sm font-mono"
                                    placeholder={'[{"key":"흡수량","value_ko":"1400ml","value_en":"1400ml","unit":"ml","order":0}]'}
                                    value={formData.specifications}
                                    onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
                                ></textarea>
                            </div>
                        </div>

                        {/* 구매 문의 링크 */}
                        <div className="md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                                    구매 문의 링크
                                </label>
                                <input
                                    className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                                    placeholder="https://..."
                                    value={formData.purchase_link}
                                    onChange={(e) => setFormData(prev => ({ ...prev, purchase_link: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* 체크박스들 */}
                        <div className="md:col-span-2 flex flex-wrap gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                    className="w-4 h-4 rounded border-admin-border"
                                />
                                <span className="text-sm text-admin-text-secondary">게시</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                                    className="w-4 h-4 rounded border-admin-border"
                                />
                                <span className="text-sm text-admin-text-secondary">추천 제품</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_new}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_new: e.target.checked }))}
                                    className="w-4 h-4 rounded border-admin-border"
                                />
                                <span className="text-sm text-admin-text-secondary">신제품</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_best}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_best: e.target.checked }))}
                                    className="w-4 h-4 rounded border-admin-border"
                                />
                                <span className="text-sm text-admin-text-secondary">베스트셀러</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_in_stock}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_in_stock: e.target.checked }))}
                                    className="w-4 h-4 rounded border-admin-border"
                                />
                                <span className="text-sm text-admin-text-secondary">재고 있음</span>
                            </label>
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-admin-border">
                        <button
                            onClick={() => router.push('/admin/products')}
                            className="px-6 py-3 rounded-xl bg-admin-bg text-admin-text-secondary font-bold hover:text-white"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-10 py-3 rounded-xl bg-admin-primary text-white font-bold hover:bg-admin-primary-dark shadow-lg shadow-admin-primary/20 disabled:opacity-50"
                        >
                            {isSubmitting ? '저장 중...' : '제품 저장하기'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
