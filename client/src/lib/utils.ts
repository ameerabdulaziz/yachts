import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to parse currency strings like "€2,750" or "$1,234" to numbers
export function parseCurrency(value: string | number): number {
  if (typeof value === 'number') return value;
  return parseFloat(value.replace(/[€$,]/g, '').trim()) || 0;
}
