import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Premium utility to merge Tailwind classes with conflict resolution.
 * Essential for building reusable shadcn-style components.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
