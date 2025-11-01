import { useState, useCallback } from "react";
import { Editor } from "@tiptap/core";
import { TemplateName } from "@/extensions/templates/TemplatesExtension";
import { isEditorEmpty } from "@/lib/editorUtils";

interface UseTemplateSelectionProps {
  editor: Editor | null;
  onSelectTemplate: (templateName: TemplateName) => void;
}

export function useTemplateSelection({
  editor,
  onSelectTemplate,
}: UseTemplateSelectionProps) {
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<TemplateName | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const openTemplates = useCallback(() => {
    setTemplatesOpen(true);
  }, []);

  const handleSelectTemplate = useCallback(
    (templateName: TemplateName) => {
      if (!editor) return;

      const isEmpty = isEditorEmpty(editor);

      if (!isEmpty) {
        setPendingTemplate(templateName);
        setShowConfirmDialog(true);
        setTemplatesOpen(false);
      } else {
        onSelectTemplate(templateName);
        setTemplatesOpen(false);
      }
    },
    [editor, onSelectTemplate]
  );

  const confirmTemplateSelection = useCallback(() => {
    if (pendingTemplate) {
      onSelectTemplate(pendingTemplate);
      setPendingTemplate(null);
    }
    setShowConfirmDialog(false);
  }, [pendingTemplate, onSelectTemplate]);

  const cancelTemplateSelection = useCallback(() => {
    setPendingTemplate(null);
    setShowConfirmDialog(false);
  }, []);

  return {
    templatesOpen,
    setTemplatesOpen,
    openTemplates,
    handleSelectTemplate,
    showConfirmDialog,
    confirmTemplateSelection,
    cancelTemplateSelection,
  };
}

