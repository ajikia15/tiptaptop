import { Editor } from '@tiptap/core';

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

export function logEditorContent(editor: Editor) {
  console.log('Editor HTML:', editor.getHTML());
  console.log('Editor JSON:', editor.getJSON());
}

export function focusEditorEnd(editor: Editor) {
  const { doc } = editor.state;
  const endPos = doc.content.size;
  editor.commands.focus();
  editor.commands.setTextSelection(endPos);
}

export function focusEditorAtPosition(editor: Editor, position: number) {
  editor.commands.focus();
  editor.commands.setTextSelection(position);
}

export function isEditorEmpty(editor: Editor): boolean {
  const doc = editor.state.doc;
  const textContent = doc.textContent.trim();

  if (doc.childCount === 1) {
    const firstChild = doc.firstChild;
    if (firstChild?.type.name === 'paragraph' && !firstChild.childCount) {
      return true;
    }
  }
  
  return textContent.length === 0;
}

