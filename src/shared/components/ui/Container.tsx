import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide";
}

/**
 * 컨테이너 컴포넌트
 * 최대 너비와 패딩을 제공합니다.
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "default", ...props }, ref) => {
    const sizeClasses = {
      narrow: "max-w-4xl",   // 896px
      default: "max-w-7xl",  // 1280px
      wide: "max-w-screen-2xl", // 1536px
    };

    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";

export { Container };
