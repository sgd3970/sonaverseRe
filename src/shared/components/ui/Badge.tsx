import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-white hover:bg-primary/80",
                secondary:
                    "border-transparent bg-gray-100 text-gray-700",
                destructive:
                    "border-transparent bg-red-500 text-white hover:bg-red-500/80",
                outline: "border-gray-300 bg-transparent text-gray-700",

                // Section headers
                accent: "border-transparent bg-accent-light text-accent",

                // Product badges
                manbo: "border-transparent bg-[#e8f9ee] text-[#2eb865]",
                bodume: "border-transparent bg-[#edf7f1] text-[#5eba7d]",

                // Status badges
                new: "border-transparent bg-blue-600 text-white",
                featured: "border-transparent bg-black/70 backdrop-blur-sm text-white",

                // Category badges (on images)
                category: "border-transparent bg-white/90 backdrop-blur-sm text-gray-900",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
