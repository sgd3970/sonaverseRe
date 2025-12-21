"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { OptimizedImage } from "./OptimizedImage"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface MediaLibraryProps {
  onSelect?: (imageUrl: string, imageId?: string) => void
  onClose?: () => void
  category?: string
  multiple?: boolean
}

const categoryLabels: Record<string, string> = {
  all: '전체',
  hero: '히어로',
  product: '제품',
  story: '스토리',
  press: '언론보도',
  profile: '프로필',
  logo: '로고',
  icon: '아이콘',
  common: '일반',
}

export function MediaLibrary({ 
  onSelect, 
  onClose, 
  category: initialCategory,
  multiple = false 
}: MediaLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all')
  const [search, setSearch] = useState('')
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)

  const { data, isLoading, mutate } = useSWR(
    `/api/admin/images?category=${selectedCategory}&search=${search}&page=${page}&limit=20`,
    fetcher,
    { revalidateOnFocus: false }
  )

  const images = data?.data || []

  const handleImageClick = (image: any) => {
    if (multiple) {
      const newSelected = new Set(selectedImages)
      if (newSelected.has(image.id)) {
        newSelected.delete(image.id)
      } else {
        newSelected.add(image.id)
      }
      setSelectedImages(newSelected)
    } else {
      if (onSelect) {
        onSelect(image.url, image.id)
      }
      if (onClose) {
        onClose()
      }
    }
  }

  const handleConfirm = () => {
    if (onSelect && selectedImages.size > 0) {
      const selectedImage = images.find((img: any) => selectedImages.has(img.id))
      if (selectedImage) {
        onSelect(selectedImage.url, selectedImage.id)
      }
    }
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-admin-surface border border-admin-border rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* 헤더 */}
        <div className="p-6 border-b border-admin-border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-admin-text-main">미디어 라이브러리</h2>
            <p className="text-sm text-admin-text-secondary mt-1">이미지를 선택하거나 업로드하세요</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="size-10 rounded-xl bg-admin-bg border border-admin-border flex items-center justify-center text-admin-text-secondary hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined select-none">close</span>
            </button>
          )}
        </div>

        {/* 필터 및 검색 */}
        <div className="p-6 border-b border-admin-border space-y-4">
          <div className="flex gap-2 overflow-x-auto">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedCategory(key)
                  setPage(1)
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors",
                  selectedCategory === key
                    ? "bg-admin-primary text-white"
                    : "bg-admin-bg border border-admin-border text-admin-text-secondary hover:text-white"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="이미지 검색..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary"
          />
        </div>

        {/* 이미지 그리드 */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-admin-primary border-t-transparent rounded-full" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-5xl text-admin-text-secondary mb-4">image</span>
              <p className="text-admin-text-secondary">이미지가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((image: any) => {
                const isSelected = selectedImages.has(image.id)
                return (
                  <div
                    key={image.id}
                    onClick={() => handleImageClick(image)}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all group",
                      isSelected
                        ? "border-admin-primary ring-2 ring-admin-primary"
                        : "border-admin-border hover:border-admin-primary/50"
                    )}
                  >
                    <OptimizedImage
                      src={image.thumbnailUrl || image.url}
                      alt={image.altText?.ko || image.originalFilename}
                      fill
                      className="object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-admin-primary/20 flex items-center justify-center">
                        <div className="size-8 rounded-full bg-admin-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-sm">check</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-white truncate">{image.originalFilename}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 하단 액션 */}
        {multiple && selectedImages.size > 0 && (
          <div className="p-6 border-t border-admin-border flex items-center justify-between">
            <span className="text-sm text-admin-text-secondary">
              {selectedImages.size}개 선택됨
            </span>
            <button
              onClick={handleConfirm}
              className="px-6 py-3 rounded-xl bg-admin-primary text-white font-bold hover:bg-admin-primary-dark transition-all"
            >
              선택 완료
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

