import { isMac } from "./utils"

/**
 * Parse a shortcut string into individual keys
 * @param shortcut - Shortcut string with Mac symbols (⌘, ⌥, ⇧) or regular format
 * @returns Array of key strings
 */
export function parseShortcutKeys(shortcut: string): string[] {
  const keys: string[] = []
  let currentKey = ""

  for (let i = 0; i < shortcut.length; i++) {
    const char = shortcut[i]
    if (char === "⌘" || char === "⌥" || char === "⇧") {
      if (currentKey) {
        keys.push(currentKey)
        currentKey = ""
      }
      keys.push(char)
    } else if (char === "+" || char === " ") {
      if (currentKey) {
        keys.push(currentKey)
        currentKey = ""
      }
      // Skip separator characters
    } else {
      currentKey += char
    }
  }

  if (currentKey) {
    keys.push(currentKey)
  }

  return keys
}

/**
 * Convert Mac symbols to platform-appropriate display text
 */
export function formatKeyForPlatform(key: string): string {
  if (isMac()) {
    return key
  }
  return key.replace(/⌘/g, "Ctrl").replace(/⌥/g, "Alt").replace(/⇧/g, "Shift")
}

/**
 * Format a shortcut string for display (returns plain string, not React node)
 * Useful for simple text display without keyboard component styling
 */
export function formatShortcut(shortcut: string): string {
  if (isMac()) {
    return shortcut
  }
  return shortcut
    .replace(/⌘/g, "Cmd")
    .replace(/⌥/g, "Alt")
    .replace(/⇧/g, "Shift")
    .replace(/\+/g, "+")
}

/**
 * Check if event target is an input element that should not trigger shortcuts
 */
export function shouldIgnoreKeyboardShortcut(
  target: EventTarget | null
): boolean {
  if (!target) return false

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement &&
      target.contentEditable === "true" &&
      target.closest(".document-title-wrapper") !== null)
  )
}

