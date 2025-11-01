import React from "react"
import { Kbd, KbdGroup } from "./kbd"
import { parseShortcutKeys, formatKeyForPlatform } from "@/lib/keyboardUtils"

interface KeyboardShortcutProps {
  shortcut?: string
}

/**
 * Component for displaying keyboard shortcuts with proper styling
 * Handles Mac/Windows symbol conversion automatically
 */
export function KeyboardShortcut({ shortcut }: KeyboardShortcutProps) {
  if (!shortcut) return null

  const keys = parseShortcutKeys(shortcut)

  return (
    <KbdGroup>
      {keys.map((key, index) => {
        const needsSeparator = index < keys.length - 1
        const displayKey = formatKeyForPlatform(key)

        return (
          <React.Fragment key={index}>
            <Kbd>{displayKey}</Kbd>
            {needsSeparator && (
              <span className="mx-0.5 text-muted-foreground">+</span>
            )}
          </React.Fragment>
        )
      })}
    </KbdGroup>
  )
}

