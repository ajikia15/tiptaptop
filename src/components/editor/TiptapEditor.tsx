import React, { useCallback, useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Editor } from "@tiptap/core";
import { Toolbar } from "./Toolbar";
import DragHandle from "@tiptap/extension-drag-handle";
import { TemplateStarter } from "./TemplateStarter";
import { AskAiExtension } from "@/extensions/ask-ai/AskAiExtension";
import { MakeResearchExtension } from "@/extensions/make-research/MakeResearchExtension";
import { CreateTodoExtension } from "@/extensions/todo/CreateTodoExtension";
import { TemplatesExtension } from "@/extensions/templates/TemplatesExtension";
import { SlashCommandExtension } from "@/extensions/slash/SlashCommandExtension";
import { SmartPlaceholder } from "@/extensions/placeholder/SmartPlaceholder";
import { debounce, logEditorContent } from "@/lib/editorUtils";
import { importDocument } from "@/lib/documentParser";
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
  // Create debounced logger
  const debouncedLog = useMemo(
    () =>
      debounce((editor: Editor) => {
        logEditorContent(editor);
      }, 400),
    []
  );

  // Initialize editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      DragHandle.configure({
        render: () => {
          const element = document.createElement("div");
          element.classList.add("drag-handle");
          // simple grip icon using inline SVG for crisp rendering
          element.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="7" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="7" r="1.5" fill="currentColor"/>
              <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="9" cy="17" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="17" r="1.5" fill="currentColor"/>
            </svg>
          `;
          return element;
        },
        tippyOptions: {
          placement: "left",
          // Negative distance pulls the handle inside the block
          // so it sits within the left padding (gutter)
          offset: [0, -20],
        },
      }),
      SmartPlaceholder,
      AskAiExtension,
      MakeResearchExtension,
      CreateTodoExtension,
      TemplatesExtension,
      SlashCommandExtension,
    ],
    content: initialContent || "<p></p>",
    autofocus: autoFocus ? "end" : false,
    editorProps: {
      attributes: {
        class: "tiptap",
        role: "textbox",
        "aria-label": "Text editor",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor }) => {
      // Debounced console logging
      debouncedLog(editor);

      // Call optional update handler
      if (onUpdate) {
        onUpdate(editor);
      }
    },
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  // Handler for Ask AI button
  const handleAskAI = useCallback(() => {
    if (editor) {
      editor.commands.askAI();
    }
  }, [editor]);

  // Handler for Make Research button
  const handleMakeResearch = useCallback(() => {
    if (editor) {
      editor.commands.makeResearch();
    }
  }, [editor]);

  // Handler for Create To-Do List button
  const handleCreateTodo = useCallback(() => {
    if (editor) {
      editor.commands.insertTodoList();
    }
  }, [editor]);

  // Handler for Templates button
  const handleTemplates = useCallback(() => {
    if (editor) {
      // For the starter overlay, we'll just insert the first template as an example
      // The toolbar dropdown will handle specific templates
      editor.commands.insertTemplate("brief");
    }
  }, [editor]);

  // Handler for Import button
  const handleImport = useCallback(() => {
    // Open file dialog
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.docx";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && editor) {
        try {
          const content = await importDocument(file);
          editor.commands.setContent(content);
          editor.commands.focus("end");
        } catch (error) {
          console.error("Error importing document:", error);
          alert("Failed to import document. Please try again.");
        }
      }
    };
    input.click();
  }, [editor]);

  // Handler for toolbar import
  const handleToolbarImport = useCallback(
    async (file: File) => {
      if (editor) {
        try {
          const content = await importDocument(file);
          editor.commands.setContent(content);
          editor.commands.focus("end");
        } catch (error) {
          console.error("Error importing document:", error);
          alert("Failed to import document. Please try again.");
        }
      }
    },
    [editor]
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
      <Toolbar editor={editor} onImport={handleToolbarImport} />
      <div className="document-title-wrapper">
        <h1 className="text-4xl font-bold text-gray-900">Untitled doc</h1>
      </div>
      <div className="tiptap-editor-wrapper">
        <EditorContent editor={editor} />
      </div>
      <TemplateStarter
        editor={editor}
        onAskAI={handleAskAI}
        onMakeResearch={handleMakeResearch}
        onCreateTodo={handleCreateTodo}
        onTemplates={handleTemplates}
        onImport={handleImport}
      />
    </div>
  );
};

export default TiptapEditor;
