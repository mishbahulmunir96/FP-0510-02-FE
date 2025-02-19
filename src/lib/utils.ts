import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateGrowthPercentage = (
  current: number,
  previous: number,
) => {
  if (previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(2));
};
