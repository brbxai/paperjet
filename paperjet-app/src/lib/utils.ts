import { type ClassValue, clsx } from "clsx";
import Decimal from "decimal.js";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

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

export function actionFailure(
  ...errors: { [key: string]: string[] }[] | z.ZodError[] | string[]
): {
  success: false;
  errors: { [key: string]: string[] | undefined };
} {
  let resultingErrors: { [key: string]: string[] | undefined };

  if (errors[0] instanceof z.ZodError) {
    resultingErrors = (errors[0] as z.ZodError).flatten().fieldErrors;
  } else if (Array.isArray(errors[0])) {
    resultingErrors = errors[0] as { [key: string]: string[] };
  } else {
    resultingErrors = { root: errors as string[] };
  }

  return {
    success: false,
    errors: resultingErrors,
  };
}

export function stringifyActionFailure(errors: {
  [key: string]: string[] | undefined;
}): string {
  const resultingErrors = Object.values(errors)
    .filter((v) => v !== undefined)
    .flat();

  return resultingErrors ? " " + resultingErrors.join(", ") : "";
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