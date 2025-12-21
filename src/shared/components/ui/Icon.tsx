import * as React from "react";
import { cn } from "@/lib/utils";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
}

/**
 * Material Symbols Icon 컴포넌트
 * @see https://fonts.google.com/icons
 */
const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ name, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("material-symbols-outlined select-none", className)}
        {...props}
      >
        {name}
      </span>
    );
  }
);

Icon.displayName = "Icon";

export { Icon };
