import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatScore(score: number): string {
  return score.toFixed(2);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}


