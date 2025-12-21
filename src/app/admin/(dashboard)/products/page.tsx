"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage"

export default function AdminProductsPage() {
    const router = useRouter()

    // 임시 데이터
    const [products] = useState([
        {
            id: 1,
            image: "https://picsum.photos/500/500?random=201",
            category: "팬티형",
            name: "보듬 팬티형 대형",
            price: "18,000원",
            description: "혼자서도 입고 벗기 편한 팬티형 기저귀. 활동량이 많은 분들에게 추천합니다.",
            specs: [
                { label: "흡수량", value: "1400ml" },
                { label: "사이즈", value: "대형 (허리 30~39인치)" }
            ]
        },
        {
            id: 2,
            image: "https://picsum.photos/500/500?random=202",
            category: "팬티형",
            name: "보듬 팬티형 중형",
            price: "18,000원",
            description: "부드러운 허리 밴드로 편안한 착용감을 제공합니다.",
            specs: [
                { label: "흡수량", value: "1200ml" },
                { label: "사이즈", value: "중형 (허리 24~33인치)" }
            ]
        },
        {
            id: 3,
            image: "https://picsum.photos/500/500?random=203",
            category: "속기저귀",
            name: "보듬 속기저귀 일반형",
            price: "12,000원",
            description: "팬티형과 함께 사용하면 더욱 경제적인 교체형 속기저귀.",
            specs: [
                { label: "흡수량", value: "800ml" },
                { label: "사이즈", value: "25cm x 50cm" }
            ]
        },
        {
            id: 4,
            image: "https://picsum.photos/500/500?random=204",
            category: "깔개매트",
            name: "보듬 깔개매트",
            price: "15,000원",
            description: "침구 오염을 방지하는 위생적인 일회용 매트.",
            specs: [
                { label: "사이즈", value: "60cm x 90cm" },
                { label: "매수", value: "10매" }
            ]
        }
    ])

    const handleEdit = (id: number) => {
        router.push(`/admin/products/${id}/edit`)
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

                {/* 제품 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-admin-surface border border-admin-border rounded-2xl p-6 flex flex-col shadow-xl"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="size-16 rounded-xl bg-white p-2 flex items-center justify-center relative">
                                    <OptimizedImage
                                        alt={product.name}
                                        fill
                                        className="object-contain"
                                        src={product.image}
                                    />
                                </div>
                                <div className="text-right">
                                    <span className="px-2 py-0.5 rounded bg-admin-primary/10 text-admin-primary text-[10px] font-bold uppercase">
                                        {product.category}
                                    </span>
                                    <p className="text-admin-text-main font-black text-lg mt-1">
                                        {product.price}
                                    </p>
                                </div>
                            </div>
                            <h3 className="text-admin-text-main font-bold mb-1">
                                {product.name}
                            </h3>
                            <p className="text-admin-text-secondary text-xs line-clamp-2 mb-6 leading-relaxed">
                                {product.description}
                            </p>
                            <div className="mt-auto pt-4 border-t border-admin-border flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-admin-text-secondary uppercase">Stock</span>
                                    <span className="text-sm font-bold text-admin-success">
                                        {product.specs.find(s => s.label === "매수")?.value || "재고관리"}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(product.id)}
                                        className="size-9 rounded-lg bg-admin-surface-hover flex items-center justify-center text-admin-text-secondary hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined select-none text-sm">settings</span>
                                    </button>
                                    <button className="size-9 rounded-lg bg-admin-surface-hover flex items-center justify-center text-admin-text-secondary hover:text-white transition-colors">
                                        <span className="material-symbols-outlined select-none text-sm">visibility</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
