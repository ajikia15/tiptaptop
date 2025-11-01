import { isMac } from "./utils"

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
    } else {
      currentKey += char
    }
  }

  if (currentKey) {
    keys.push(currentKey)
  }

  return keys
}

export function formatKeyForPlatform(key: string): string {
  if (isMac()) {
    return key
  }
  return key.replace(/⌘/g, "Ctrl").replace(/⌥/g, "Alt").replace(/⇧/g, "Shift")
}

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

