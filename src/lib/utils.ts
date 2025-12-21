import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names with Tailwind CSS conflict resolution.
 * 
 * This utility combines `clsx` for conditional class joining and `tailwind-merge`
 * for resolving conflicting Tailwind CSS classes (e.g., 'px-2 px-4' becomes 'px-4').
 * 
 * @param {...ClassValue[]} inputs - Class names, objects, or arrays to merge.
 * @returns {string} The merged class string.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
