import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:scale-95 touch-target",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary-dark hover:shadow-lg hover:-translate-y-0.5",
                destructive:
                    "bg-red-500 text-white shadow-sm hover:bg-red-600",
                outline:
                    "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all",
                secondary:
                    "bg-white text-primary border-2 border-border-light shadow-sm hover:bg-gray-50",
                ghost: "hover:bg-primary-light hover:text-primary",
                link: "text-primary underline-offset-4 hover:underline inline-flex items-center gap-2 hover:gap-3 transition-all",

                // Product-specific buttons (changed to primary color)
                manbo: "bg-primary text-white shadow-md hover:bg-primary-dark hover:-translate-y-0.5 transition-all",
                "manbo-outline": "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all",
                bodume: "bg-primary text-white shadow-md hover:bg-primary-dark hover:-translate-y-0.5 transition-all",
                "bodume-outline": "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all",

                // Category/Filter buttons
                "category-active": "bg-primary text-white shadow-sm",
                "category-inactive": "bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors",
            },
            size: {
                default: "h-12 px-6 py-3 text-base min-h-[44px]", // 접근성: 최소 44px 터치 영역
                sm: "h-10 px-4 text-sm min-h-[44px]", // 접근성: 최소 44px 터치 영역
                lg: "h-14 px-10 text-lg min-h-[44px]", // Desktop large
                icon: "h-12 w-12 min-h-[44px] min-w-[44px]", // 접근성: 최소 44x44px 터치 영역
                xl: "h-14 px-10 text-lg min-h-[44px]", // Hero CTA
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
