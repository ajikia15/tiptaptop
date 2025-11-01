import { useState, useCallback } from "react";
import { Editor } from "@tiptap/core";
import { importDocument } from "@/lib/documentParser";
import { fileToBase64, isImageFile } from "@/lib/utils";
import { isEditorEmpty } from "@/lib/editorUtils";

interface UseFileImportProps {
  editor: Editor | null;
  onConfirmImport?: () => void;
}

export function useFileImport({ editor, onConfirmImport }: UseFileImportProps) {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isImage, setIsImage] = useState(false);

  const handleDocumentImport = useCallback(
    async (file: File, skipConfirm = false) => {
      if (!editor) return;

      if (!skipConfirm) {
        const isEmpty = isEditorEmpty(editor);

        if (!isEmpty) {
          setPendingFile(file);
          setIsImage(false);
          setShowConfirmDialog(true);
          return;
        }
      }

      try {
        const content = await importDocument(file);
        editor.commands.setContent(content);
        editor.commands.focus("end");
        onConfirmImport?.();
      } catch (error) {
        console.error("Error importing document:", error);
        alert("Failed to import document. Please try again.");
      }
    },
    [editor, onConfirmImport]
  );

  const handleImageImport = useCallback(
    async (file: File) => {
      if (!editor) return;

      if (!isImageFile(file)) {
        alert("Please select a valid image file.");
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        editor.chain().focus().setImage({ src: base64 }).run();
        onConfirmImport?.();
      } catch (error) {
        console.error("Error importing image:", error);
        alert("Failed to import image. Please try again.");
      }
    },
    [editor, onConfirmImport]
  );

  const confirmImport = useCallback(() => {
    if (pendingFile) {
      if (isImage) {
        handleImageImport(pendingFile);
      } else {
        handleDocumentImport(pendingFile, true);
      }
      setPendingFile(null);
    }
    setShowConfirmDialog(false);
  }, [pendingFile, isImage, handleDocumentImport, handleImageImport]);

  const cancelImport = useCallback(() => {
    setPendingFile(null);
    setShowConfirmDialog(false);
  }, []);

  return {
    handleDocumentImport,
    handleImageImport,
    showConfirmDialog,
    confirmImport,
    cancelImport,
  };
}

