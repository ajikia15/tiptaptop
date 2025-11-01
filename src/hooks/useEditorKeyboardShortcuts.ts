import { useEffect } from "react";
import { Editor } from "@tiptap/core";
import { isModifierKey } from "@/lib/utils";
import { shouldIgnoreKeyboardShortcut } from "@/lib/keyboardUtils";

interface UseEditorKeyboardShortcutsProps {
  editor: Editor | null;
  onAskAI: () => void;
  onMakeResearch: () => void;
  onCreateTodo: () => void;
}

export function useEditorKeyboardShortcuts({
  editor,
  onAskAI,
  onMakeResearch,
  onCreateTodo,
}: UseEditorKeyboardShortcutsProps) {
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (shouldIgnoreKeyboardShortcut(e.target)) {
        return;
      }

      if (isModifierKey(e, "j", { shift: true })) {
        e.preventDefault();
        onAskAI();
        return;
      }

      if (isModifierKey(e, "m", { shift: true })) {
        e.preventDefault();
        onMakeResearch();
        return;
      }

      if (isModifierKey(e, "d", { shift: true })) {
        e.preventDefault();
        onCreateTodo();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, onAskAI, onMakeResearch, onCreateTodo]);
}

