import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getColorHex = (colorString: string) => {
  const lower = colorString.toLowerCase();
  if (lower.includes('black')) return '#1a1a1a';
  if (lower.includes('white')) return '#fcfcfc';
  if (lower.includes('blue') && lower.includes('light')) return '#bfdbfe';
  if (lower.includes('blue') && lower.includes('wash')) return '#60a5fa';
  if (lower.includes('blue')) return '#3b82f6';
  if (lower.includes('navy')) return '#1e3a8a';
  if (lower.includes('olive')) return '#4d7c0f';
  if (lower.includes('tan')) return '#d2b48c';
  if (lower.includes('charcoal')) return '#3f3f46';
  if (lower.includes('grey')) return '#9ca3af';
  if (lower.includes('neon')) return '#84cc16';
  return '#e5e7eb';
};

export function formatPrice(price: number): string {
  if (price % 1 === 0) {
    return price.toLocaleString();
  }
  return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
