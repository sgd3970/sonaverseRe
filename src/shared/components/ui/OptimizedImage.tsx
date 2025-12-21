'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// 기본 blur placeholder (1x1 투명 이미지)
const defaultBlurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwYABQoC/eT4hwwAAAAASUVORK5CYII=';

// Gray placeholder
const grayBlurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/zfwYABgkC/sGi/HQAAAAASUVORK5CYII=';

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  containerClassName,
  objectFit = 'cover',
  placeholder = 'blur',
  blurDataURL,
  quality = 85,
  sizes,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // 외부 URL인지 확인
  const isExternal = src.startsWith('http://') || src.startsWith('https://');

  // Vercel Blob Storage URL인지 확인
  const isVercelBlob = src.includes('public.blob.vercel-storage.com');

  // 이미지 로드 완료 핸들러
  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // 이미지 에러 핸들러
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // 에러 시 플레이스홀더 표시
  if (hasError) {
    return (
      <div 
        className={cn(
          "bg-gray-200 flex items-center justify-center",
          fill ? "absolute inset-0" : "",
          containerClassName
        )}
        style={!fill ? { width, height } : undefined}
      >
        <span className="material-symbols-outlined text-gray-400 text-4xl">
          image_not_supported
        </span>
      </div>
    );
  }

  // sizes 기본값 설정 (반응형)
  const defaultSizes = sizes || (fill 
    ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    : undefined
  );

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* 로딩 상태 표시 */}
      {isLoading && (
        <div 
          className={cn(
            "absolute inset-0 bg-gray-100 animate-pulse",
            "flex items-center justify-center"
          )}
        >
          <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={defaultSizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL || (isExternal ? grayBlurDataURL : defaultBlurDataURL)}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          objectFit === 'cover' && "object-cover",
          objectFit === 'contain' && "object-contain",
          objectFit === 'fill' && "object-fill",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        // 외부 이미지 최적화 설정
        unoptimized={isExternal && !isVercelBlob}
      />
    </div>
  );
}

// 썸네일 이미지 컴포넌트
interface ThumbnailImageProps {
  src?: string;
  alt: string;
  aspectRatio?: '1/1' | '4/3' | '16/9' | '3/2';
  className?: string;
  priority?: boolean;
}

export function ThumbnailImage({
  src,
  alt,
  aspectRatio = '16/9',
  className,
  priority = false,
}: ThumbnailImageProps) {
  const aspectClasses = {
    '1/1': 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    '3/2': 'aspect-[3/2]',
  };

  if (!src) {
    return (
      <div className={cn(
        "relative bg-gray-200 flex items-center justify-center",
        aspectClasses[aspectRatio],
        className
      )}>
        <span className="material-symbols-outlined text-gray-400 text-4xl">
          image
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative", aspectClasses[aspectRatio], className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        objectFit="cover"
      />
    </div>
  );
}

// 히어로 이미지 컴포넌트
interface HeroImageProps {
  src?: string;
  alt: string;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

export function HeroImage({
  src,
  alt,
  className,
  overlay = true,
  overlayOpacity = 40,
}: HeroImageProps) {
  if (!src) {
    return (
      <div className={cn("absolute inset-0 bg-gray-800", className)} />
    );
  }

  return (
    <>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        priority
        objectFit="cover"
        containerClassName={cn("absolute inset-0", className)}
        sizes="100vw"
      />
      {overlay && (
        <div 
          className="absolute inset-0 bg-black z-10" 
          style={{ opacity: overlayOpacity / 100 }}
        />
      )}
    </>
  );
}

