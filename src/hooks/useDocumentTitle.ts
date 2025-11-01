import { useCallback, useEffect, useMemo, useRef } from "react";
import { debounce } from "@/lib/editorUtils";

export function useDocumentTitle() {
  const titleRef = useRef<HTMLDivElement>(null);

  const updateDocumentTitle = useCallback((title: string) => {
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      document.title = trimmedTitle;
    } else {
      document.title = "Tiptap Editor";
    }
  }, []);

  const debouncedUpdateTitle = useMemo(
    () => debounce((title: string) => updateDocumentTitle(title), 300),
    [updateDocumentTitle]
  );

  useEffect(() => {
    document.title = "Tiptap Editor";
    if (titleRef.current) {
      const initialTitle = titleRef.current.textContent || "";
      if (initialTitle.trim()) {
        debouncedUpdateTitle(initialTitle);
      }
    }
  }, [debouncedUpdateTitle]);

  return {
    titleRef,
    debouncedUpdateTitle,
  };
}

