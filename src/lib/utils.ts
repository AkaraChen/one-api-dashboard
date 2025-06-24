import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export const CURRENCY_UNITS = {
  USD: "$",
  CNY: "¥",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

export type CurrencyUnit = keyof typeof CURRENCY_UNITS;

/**
 * Returns the currency symbol based on the currency code
 * @param currencyUnit The currency code (USD, CNY, EUR, GBP, JPY, etc.)
 * @returns The currency symbol ($, ¥, €, £, etc.)
 */
export function getCurrencySymbol(currencyUnit: CurrencyUnit): string {
  return CURRENCY_UNITS[currencyUnit] || currencyUnit;
}
