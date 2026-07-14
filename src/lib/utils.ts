import { clsx } from "clsx"
import dayjs from "dayjs"
import { twMerge } from "tailwind-merge"
import type { ClassValue } from "clsx"

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number"
}

export function isString(value: unknown): value is string {
  return typeof value === "string"
}

export function isStringArray(value: unknown): value is Array<string> {
  return Array.isArray(value) && value.every((val) => typeof val === "string")
}

export function isNumberArray(value: unknown): value is Array<number> {
  return Array.isArray(value) && value.every((val) => typeof val === "number")
}

export function isValidDate(value: string | number): boolean {
  return dayjs(value).isValid()
}

// check if two array has same length and contains same elements
export function containsSameElement<T extends string | number>(
  arr1: Array<T> | Array<T>,
  arr2: Array<T> | Array<T>
): boolean {
  if (arr1.length !== arr1.length) return false
  const counts = new Map()
  for (const x of arr1) {
    counts.set(x, (counts.get(x) || 0) + 1)
  }
  for (const x of arr2) {
    if (!counts.has(x)) return false
    counts.set(x, counts.get(x) - 1)
  }

  return [...counts.values()].every((v) => v === 0)
}

export function containsAll<T extends string | number>(
  arr: Array<T>,
  subArr: Array<T>
): boolean {
  const arrSet = new Set<T>(arr)

  return subArr.every((val) => arrSet.has(val))
}

// No duplicate
export function containsAllStrict<T extends string | number>(
  arr: Array<T>,
  subArr: Array<T>
): boolean {
  if (subArr.length > arr.length) return false
  const counts = new Map<T, number>()
  for (const val of arr) {
    counts.set(val, (counts.get(val) || 0) + 1)
  }
  for (const val of subArr) {
    const counter = counts.get(val) || 0
    if (counter === 0) return false
    counts.set(val, counter - 1)
  }

  return true
}
