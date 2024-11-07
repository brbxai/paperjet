import { type ClassValue, clsx } from "clsx";
import Decimal from "decimal.js";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function actionSuccess<T = {}>(
  data: T = {} as T,
): { success: true; errors: undefined } & T {
  return {
    success: true,
    errors: undefined,
    ...data,
  };
}

export function actionFailure(...generalErrors: string[]): {
  success: false;
  errors: { root: string[] };
} {
  return {
    success: false,
    errors: {
      root: generalErrors,
    },
  };
}

export function formatCurrency(amount: Decimal) {
  return `€ ${amount.toFixed()}`;
}

export function parseInputDecimal(value: string) {
  try {
    const cleanedValue = value.toString().replace(",", ".").replace(/[^\d.-]/g, "");
    return new Decimal(cleanedValue);
  } catch {
    return new Decimal(0);
  }
}