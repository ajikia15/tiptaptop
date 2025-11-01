import React, { useCallback, useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import { Toolbar } from "./Toolbar";
import { TemplateStarter } from "./TemplateStarter";
import { TemplateSelectionDialog } from "./TemplateSelectionDialog";
import { DocumentTitle } from "./DocumentTitle";
import { ImportConfirmationDialog } from "./ImportConfirmationDialog";
import { getEditorExtensions } from "@/lib/editorConfig";
import { createEditorEventHandlers } from "@/lib/editorEventHandlers";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useEditorKeyboardShortcuts } from "@/hooks/useEditorKeyboardShortcuts";
import { useFileImport } from "@/hooks/useFileImport";
import { useTemplateSelection } from "@/hooks/useTemplateSelection";
import { debounce, logEditorContent } from "@/lib/editorUtils";
import { TemplateName } from "@/extensions/templates/TemplatesExtension";
import "@/styles/editor.scss";
import "tippy.js/dist/tippy.css";

interface TiptapEditorProps {
  initialContent?: string;
  autoFocus?: boolean;
  onUpdate?: (editor: Editor) => void;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  initialContent,
  autoFocus = true,
  onUpdate,
}) => {
  const { titleRef, debouncedUpdateTitle } = useDocumentTitle();

  const debouncedLog = useMemo(
    () =>
      debounce((editor: Editor) => {
        logEditorContent(editor);
      }, 400),
    []
  );

  const editor = useEditor({
    extensions: getEditorExtensions(),
    content: initialContent || "<p></p>",
    autofocus: autoFocus ? "end" : false,
    editorProps: {
      attributes: {
        class: "tiptap",
        role: "textbox",
        "aria-label": "Text editor",
        "aria-multiline": "true",
      },
      handleDOMEvents: createEditorEventHandlers(null),
    },
    onUpdate: ({ editor }) => {
      debouncedLog(editor);
      if (onUpdate) {
        onUpdate(editor);
      }
    },
  });

  // Update event handlers when editor is ready
  useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: {
          handleDOMEvents: createEditorEventHandlers(editor),
        },
      });
    }
  }, [editor]);

  const handleAskAI = useCallback(() => {
    if (editor) {
      editor.commands.askAI();
    }
  }, [editor]);

  const handleMakeResearch = useCallback(() => {
    if (editor) {
      editor.commands.makeResearch();
    }
  }, [editor]);

  const handleCreateTodo = useCallback(() => {
    if (editor) {
      editor.commands.insertTodoList();
    }
  }, [editor]);

  useEditorKeyboardShortcuts({
    editor,
    onAskAI: handleAskAI,
    onMakeResearch: handleMakeResearch,
    onCreateTodo: handleCreateTodo,
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const handleSelectTemplate = useCallback(
    (templateName: TemplateName) => {
      if (editor) {
        editor.commands.insertTemplate(templateName);
      }
    },
    [editor]
  );

  const templateSelection = useTemplateSelection({
    editor,
    onSelectTemplate: handleSelectTemplate,
  });

  const fileImport = useFileImport({ editor });

  const handleImportClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.docx";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        fileImport.handleDocumentImport(file);
      }
    };
    input.click();
  }, [fileImport]);

  const handleImportImageClick = useCallback(() => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        fileImport.handleImageImport(file);
      }
    };
    input.click();
  }, [editor, fileImport]);

  const handleToolbarImport = useCallback(
    (file: File) => {
      fileImport.handleDocumentImport(file);
    },
    [fileImport]
  );

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <Toolbar
        editor={editor}
        onImport={handleToolbarImport}
        onOpenTemplates={templateSelection.openTemplates}
      />
      <DocumentTitle
        editor={editor}
        titleRef={titleRef}
        onTitleUpdate={debouncedUpdateTitle}
      />
      <div className="tiptap-editor-wrapper">
        <EditorContent editor={editor} />
      </div>
      <TemplateStarter
        editor={editor}
        onAskAI={handleAskAI}
        onMakeResearch={handleMakeResearch}
        onCreateTodo={handleCreateTodo}
        onTemplates={templateSelection.openTemplates}
        onImport={handleImportClick}
        onImportImage={handleImportImageClick}
      />
      <TemplateSelectionDialog
        open={templateSelection.templatesOpen}
        onOpenChange={templateSelection.setTemplatesOpen}
        onSelectTemplate={templateSelection.handleSelectTemplate}
      />
      <ImportConfirmationDialog
        open={templateSelection.showConfirmDialog}
        onConfirm={templateSelection.confirmTemplateSelection}
        onCancel={templateSelection.cancelTemplateSelection}
        type="template"
      />
      <ImportConfirmationDialog
        open={fileImport.showConfirmDialog}
        onConfirm={fileImport.confirmImport}
        onCancel={fileImport.cancelImport}
        type="document"
      />
    </div>
  );
};

export default TiptapEditor;
