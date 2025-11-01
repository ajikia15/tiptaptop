import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Detect if the current platform is macOS
 * More reliable than checking user agent strings
 */
export function isMac(): boolean {
  return (
    typeof window !== "undefined" &&
    window.navigator.platform.toUpperCase().indexOf("MAC") >= 0
  )
}

/**
 * Check if a keyboard event matches a modifier key combination
 */
export function isModifierKey(
  event: KeyboardEvent,
  key: string,
  options?: {
    meta?: boolean
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
  }
): boolean {
  const normalizedKey = key.toLowerCase()
  const eventKey = event.key.toLowerCase()

  if (eventKey !== normalizedKey) {
    return false
  }

  const meta = options?.meta ?? true
  const ctrl = options?.ctrl ?? true
  const shift = options?.shift ?? false
  const alt = options?.alt ?? false

  const hasMetaOrCtrl = isMac() ? event.metaKey === meta : event.ctrlKey === ctrl

  return (
    hasMetaOrCtrl &&
    event.shiftKey === shift &&
    event.altKey === alt
  )
}

/**
 * Convert file to base64 data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/")
}

