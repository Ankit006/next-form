import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ClassValue } from "clsx"

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function isNumber(value: unknown) {
  return typeof value === "number"
}

export function isString(value: unknown) {
  return typeof value === "string"
}
