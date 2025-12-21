"use client"

import { useState, useRef } from 'react'
import { Button } from './Button'
import { cn } from '@/lib/utils'
import { OptimizedImage } from './OptimizedImage'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
  className?: string
  aspectRatio?: 'video' | 'square' | 'portrait'
}

export function ImageUpload({ 
  value, 
  onChange, 
  folder = 'images',
  className,
  aspectRatio = 'video'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()

      if (result.success) {
        onChange(result.data.url)
      } else {
        setError(result.error || '업로드에 실패했습니다.')
      }
    } catch (err) {
      setError('업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
      // input 초기화
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* 미리보기 영역 */}
      <div 
        className={cn(
          "bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden relative group",
          aspectClasses[aspectRatio]
        )}
      >
        {value ? (
          <>
            <OptimizedImage
              src={value}
              alt="Preview"
              fill
              className="object-cover"
            />
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={() => inputRef.current?.click()}
                className="bg-white"
              >
                변경
              </Button>
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={handleRemove}
                className="bg-white text-red-600 hover:text-red-700"
              >
                삭제
              </Button>
            </div>
          </>
        ) : (
          <div 
            className="text-center text-gray-400 cursor-pointer p-4"
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm">업로드 중...</p>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
                <p className="text-sm mt-2">클릭하여 이미지 업로드</p>
                <p className="text-xs mt-1">JPG, PNG, GIF, WebP (최대 10MB)</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* 숨김 파일 입력 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* URL 직접 입력 */}
      {!value && (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="또는 이미지 URL 직접 입력..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement
                if (target.value) {
                  onChange(target.value)
                  target.value = ''
                }
              }
            }}
          />
        </div>
      )}
    </div>
  )
}

