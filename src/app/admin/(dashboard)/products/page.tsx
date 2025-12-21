"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import useSWR from "swr"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

const fetcher = (url: string) => fetch(url).then(res => res.json())

// 제품 유형 라벨 매핑
const typeLabels: Record<string, string> = {
    manbo: '만보',
    bodume: '보듬',
    accessory: '액세서리',
    other: '기타',
}

export default function AdminProductsPage() {
    const router = useRouter()

    // API에서 데이터 가져오기
    const { data, isLoading, mutate } = useSWR('/api/admin/products', fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 30000, // 30초 캐싱
    })

    const products = data?.data || []

    const handleEdit = (id: string) => {
        router.push(`/admin/products/${id}`)
    }

    const handleAdd = () => {
        router.push('/admin/products/new')
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in space-y-6">
                {/* 헤더 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-admin-text-main text-2xl md:text-3xl font-bold tracking-tight">제품 관리</h1>
                        <p className="text-admin-text-secondary mt-1">라인업 및 인벤토리를 관리합니다.</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="w-full md:w-auto h-12 px-6 rounded-xl bg-admin-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-admin-primary-dark transition-all"
                    >
                        <span className="material-symbols-outlined select-none">add</span>
                        제품 추가
                    </button>
                </div>

                {/* 로딩 상태 */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-admin-primary border-t-transparent rounded-full" />
                    </div>
                )}

                {/* 데이터 없음 */}
                {!isLoading && products.length === 0 && (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-5xl text-admin-text-secondary mb-4">inventory_2</span>
                        <p className="text-admin-text-secondary">등록된 제품이 없습니다.</p>
                    </div>
                )}

                {/* 제품 그리드 */}
                {!isLoading && products.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {products.map((product: any) => {
                            const imageUrl = product.thumbnailUrl || product.thumbnail_url || '/images/placeholder.png'
                            const typeLabel = typeLabels[product.type] || product.type || '제품'
                            const name = product.name || product.nameKo || '제품명 없음'
                            const price = product.salePrice || product.sale_price 
                                ? `${(product.salePrice || product.sale_price).toLocaleString()}원`
                                : product.retailPrice || product.retail_price
                                ? `${(product.retailPrice || product.retail_price).toLocaleString()}원`
                                : '가격 문의'
                            const inStock = product.inStock !== undefined ? product.inStock : product.in_stock !== undefined ? product.in_stock : true
                            const quantity = product.quantity || 0

                            return (
                                <div
                                    key={product.id}
                                    className="bg-admin-surface border border-admin-border rounded-2xl p-6 flex flex-col shadow-xl"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="size-16 rounded-xl bg-white p-2 flex items-center justify-center relative">
                                            <OptimizedImage
                                                alt={name}
                                                fill
                                                className="object-contain"
                                                src={imageUrl}
                                            />
                                        </div>
                                        <div className="text-right">
                                            <span className="px-2 py-0.5 rounded bg-admin-primary/10 text-admin-primary text-[10px] font-bold uppercase">
                                                {typeLabel}
                                            </span>
                                            <p className="text-admin-text-main font-black text-lg mt-1">
                                                {price}
                                            </p>
                                        </div>
                                    </div>
                                    <h3 className="text-admin-text-main font-bold mb-1">
                                        {name}
                                    </h3>
                                    <p className="text-admin-text-secondary text-xs line-clamp-2 mb-6 leading-relaxed">
                                        {product.shortDescription || product.short_description || product.description || ''}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-admin-border flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-admin-text-secondary uppercase">Stock</span>
                                            <span className={`text-sm font-bold ${inStock ? 'text-admin-success' : 'text-admin-danger'}`}>
                                                {inStock ? `재고 ${quantity > 0 ? quantity : '있음'}` : '품절'}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(product.id)}
                                                className="size-9 rounded-lg bg-admin-surface-hover flex items-center justify-center text-admin-text-secondary hover:text-white transition-colors"
                                            >
                                                <span className="material-symbols-outlined select-none text-sm">settings</span>
                                            </button>
                                            <a
                                                href={`/products/${product.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="size-9 rounded-lg bg-admin-surface-hover flex items-center justify-center text-admin-text-secondary hover:text-white transition-colors"
                                            >
                                                <span className="material-symbols-outlined select-none text-sm">visibility</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
