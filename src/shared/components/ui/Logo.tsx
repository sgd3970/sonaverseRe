"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface LogoProps {
  /**
   * 로고 타입
   * - full: 텍스트 포함 전체 로고 (언어별 자동 전환)
   * - symbol: 심볼만 있는 로고
   */
  type?: "full" | "symbol";

  /**
   * 로고 크기
   */
  size?: "sm" | "md" | "lg";

  /**
   * 클릭 시 홈으로 이동 여부
   */
  linkToHome?: boolean;

  /**
   * 추가 클래스명
   */
  className?: string;

  /**
   * 이미지 우선순위 (LCP 최적화)
   */
  priority?: boolean;
}

/**
 * 로고 컴포넌트
 *
 * 언어 설정에 따라 자동으로 한국어/영문 로고를 전환합니다.
 *
 * @example
 * // Header에서 전체 로고 사용
 * <Logo type="full" size="md" linkToHome priority />
 *
 * @example
 * // Footer에서 심볼 로고 사용
 * <Logo type="symbol" size="sm" />
 */
export function Logo({
  type = "full",
  size = "md",
  linkToHome = true,
  className,
  priority = false,
}: LogoProps) {
  const locale = useLocale();
  const [imageSrc, setImageSrc] = React.useState<string>("");

  // 크기 설정
  const sizeConfig = {
    full: {
      sm: { width: 96, height: 32 },   // 모바일
      md: { width: 120, height: 40 },  // 데스크톱
      lg: { width: 160, height: 53 },  // 대형
    },
    symbol: {
      sm: { width: 32, height: 32 },
      md: { width: 40, height: 40 },
      lg: { width: 56, height: 56 },
    },
  };

  const dimensions = sizeConfig[type][size];

  // 로고 경로 결정 - useEffect로 변경하여 클라이언트 사이드에서만 실행
  React.useEffect(() => {
    if (type === "symbol") {
      setImageSrc("/logo/symbol_logo.png");
    } else {
      // 언어에 따라 로고 전환
      setImageSrc(locale === "ko" ? "/logo/ko_logo.png" : "/logo/en_logo.png");
    }
  }, [locale, type]);

  // alt 텍스트
  const altText =
    type === "symbol"
      ? "Sonaverse"
      : locale === "ko"
      ? "소나버스 로고"
      : "Sonaverse Logo";

  // 고정된 크기의 컨테이너로 레이아웃 시프트 방지
  const logoImage = (
    <div
      style={{
        width: dimensions.width,
        height: dimensions.height,
        minWidth: dimensions.width,
        minHeight: dimensions.height
      }}
      className="relative flex items-center justify-center"
    >
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={altText}
          width={dimensions.width}
          height={dimensions.height}
          priority={priority}
          className={cn(
            "object-contain",
            type === "full" && "h-auto w-full",
            className
          )}
        />
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link
        href="/"
        className={cn(
          "flex items-center cursor-pointer transition-opacity hover:opacity-80",
          className
        )}
        aria-label="홈으로 이동"
      >
        {logoImage}
      </Link>
    );
  }

  return logoImage;
}

/**
 * 폴백 로고 컴포넌트 (이미지 로드 실패 시)
 *
 * SVG/PNG 파일이 없을 경우 텍스트 로고로 대체됩니다.
 */
export function FallbackLogo({
  linkToHome = true,
  className,
}: Pick<LogoProps, "linkToHome" | "className">) {
  const locale = useLocale();

  const logoText = (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
        <span className="material-symbols-outlined text-3xl">
          accessibility_new
        </span>
      </div>
      <h1 className="text-2xl font-black tracking-tight text-primary">
        {locale === "ko" ? "소나버스" : "Sonaverse"}
      </h1>
    </div>
  );

  if (linkToHome) {
    return (
      <Link
        href="/"
        className="flex items-center cursor-pointer group"
        aria-label="홈으로 이동"
      >
        {logoText}
      </Link>
    );
  }

  return logoText;
}
