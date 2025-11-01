import { Editor } from '@tiptap/core';

/**
 * Debounce function for editor updates
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Log editor content to console
 */
export function logEditorContent(editor: Editor) {
  console.log('Editor HTML:', editor.getHTML());
  console.log('Editor JSON:', editor.getJSON());
}

/**
 * Focus editor at the end of content
 */
export function focusEditorEnd(editor: Editor) {
  const { doc } = editor.state;
  const endPos = doc.content.size;
  editor.commands.focus();
  editor.commands.setTextSelection(endPos);
}

/**
 * Focus editor at a specific position
 */
export function focusEditorAtPosition(editor: Editor, position: number) {
  editor.commands.focus();
  editor.commands.setTextSelection(position);
}

/**
 * Check if editor is empty
 */
export function isEditorEmpty(editor: Editor): boolean {
  const doc = editor.state.doc;
  const textContent = doc.textContent.trim();
  
  // Check if doc only has one paragraph with no content
  if (doc.childCount === 1) {
    const firstChild = doc.firstChild;
    if (firstChild?.type.name === 'paragraph' && !firstChild.childCount) {
      return true;
    }
  }
  
  return textContent.length === 0;
}

