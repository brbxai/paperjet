import { type ClassValue, clsx } from "clsx";
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