import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

export interface SectionHeaderProps {
  badge?: string;
  badgeVariant?: "default" | "accent" | "manbo" | "bodume";
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

/**
 * 섹션 헤더 컴포넌트
 *
 * @example
 * <SectionHeader
 *   badge="OUR PRODUCTS"
 *   badgeVariant="accent"
 *   title="시니어를 위한 프리미엄 라인업"
 *   subtitle="불편을 겪는 사용자를 통해 발견한 혁신..."
 *   align="center"
 * />
 */
export function SectionHeader({
  badge,
  badgeVariant = "accent",
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div className={cn("flex flex-col", alignmentClasses[align], className)}>
      {badge && (
        <Badge variant={badgeVariant} className="mb-6">
          {badge}
        </Badge>
      )}

      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
        {title}
      </h2>

      {subtitle && (
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
