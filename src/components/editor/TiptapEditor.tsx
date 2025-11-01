import React, { useCallback, useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import { Editor } from "@tiptap/core";
import { Toolbar } from "./Toolbar";
import DragHandle from "@tiptap/extension-drag-handle";
import { TemplateStarter } from "./TemplateStarter";
import { AskAiExtension } from "@/extensions/ask-ai/AskAiExtension";
import { MakeResearchExtension } from "@/extensions/make-research/MakeResearchExtension";
import { CreateTodoExtension } from "@/extensions/todo/CreateTodoExtension";
import {
  TemplatesExtension,
  TemplateName,
} from "@/extensions/templates/TemplatesExtension";
import { SlashCommandExtension } from "@/extensions/slash/SlashCommandExtension";
import { SmartPlaceholder } from "@/extensions/placeholder/SmartPlaceholder";
import { debounce, logEditorContent } from "@/lib/editorUtils";
import { importDocument } from "@/lib/documentParser";
import { fileToBase64, isImageFile, isModifierKey } from "@/lib/utils";
import { shouldIgnoreKeyboardShortcut } from "@/lib/keyboardUtils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TEMPLATES } from "@/lib/templates";
import { TemplateCard } from "./TemplateCard";
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
  const titleRef = React.useRef<HTMLDivElement>(null);

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
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      DragHandle.configure({
        render: () => {
          const element = document.createElement("div");
          element.classList.add("drag-handle");
          // grip icon
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
          // Gutter for drag handle
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
      handleDOMEvents: {
        dragstart: () => {
          document.body.classList.add("is-dragging");
          // Forcefully hide all tippy boxes immediately
          document.querySelectorAll(".tippy-box").forEach((el) => {
            const box = el as HTMLElement;
            box.style.display = "none";
          });
          editor?.commands.lockDragHandle();
          return false;
        },
        dragend: (_view, event) => {
          const dragEvent = event as DragEvent;
          // Remove dragging class and restore tippy visibility
          document.body.classList.remove("is-dragging");
          document.querySelectorAll(".tippy-box").forEach((el) => {
            const box = el as HTMLElement;
            box.style.display = "";
          });

          // Unlock and force position refresh with actual mouse coordinates
          editor?.commands.unlockDragHandle();

          // Dispatch mousemove at drop position to trigger handle recalculation
          setTimeout(() => {
            const mouseEvent = new MouseEvent("mousemove", {
              bubbles: true,
              cancelable: true,
              clientX: dragEvent.clientX,
              clientY: dragEvent.clientY,
              view: window,
            });
            document
              .elementFromPoint(dragEvent.clientX, dragEvent.clientY)
              ?.dispatchEvent(mouseEvent);
          }, 50);
          return false;
        },
        drop: (_view, event) => {
          const dragEvent = event as DragEvent;
          document.body.classList.remove("is-dragging");
          document.querySelectorAll(".tippy-box").forEach((el) => {
            const box = el as HTMLElement;
            box.style.display = "";
          });

          editor?.commands.unlockDragHandle();

          // Check if dropped items are files (e.g., images)
          const files = dragEvent.dataTransfer?.files;
          if (files && files.length > 0 && editor) {
            const imageFiles = Array.from(files).filter((file) =>
              isImageFile(file)
            );

            if (imageFiles.length > 0) {
              // Handle image drops
              event.preventDefault();

              // Get drop position
              const coordinates = editor.view.posAtCoords({
                left: dragEvent.clientX,
                top: dragEvent.clientY,
              });

              // Insert images at drop position (async without blocking)
              imageFiles.forEach((file) => {
                fileToBase64(file)
                  .then((base64) => {
                    if (coordinates) {
                      editor
                        .chain()
                        .setTextSelection(coordinates.pos)
                        .setImage({ src: base64 })
                        .run();
                    } else {
                      editor.chain().focus().setImage({ src: base64 }).run();
                    }
                  })
                  .catch((error) => {
                    console.error("Error inserting image:", error);
                  });
              });

              return true;
            }
          }

          // Highlight the dropped block (for non-file drops)
          const targetElement = document.elementFromPoint(
            dragEvent.clientX,
            dragEvent.clientY
          );
          if (targetElement && editor) {
            // Find the closest block element (p, h1, h2, h3, li, etc.)
            const blockElement =
              targetElement.closest(
                "p, h1, h2, h3, h4, h5, h6, li, blockquote"
              ) || targetElement.closest(".tiptap > *");

            if (blockElement) {
              blockElement.classList.add("dragged-highlight");

              // Remove highlight on any click
              const removeHighlight = () => {
                document
                  .querySelectorAll(".dragged-highlight")
                  .forEach((el) => {
                    el.classList.remove("dragged-highlight");
                  });
                document.removeEventListener("click", removeHighlight, true);
              };
              // Use capture phase to catch clicks early
              setTimeout(() => {
                document.addEventListener("click", removeHighlight, true);
              }, 0);
            }
          }

          setTimeout(() => {
            const mouseEvent = new MouseEvent("mousemove", {
              bubbles: true,
              cancelable: true,
              clientX: dragEvent.clientX,
              clientY: dragEvent.clientY,
              view: window,
            });
            document
              .elementFromPoint(dragEvent.clientX, dragEvent.clientY)
              ?.dispatchEvent(mouseEvent);
          }, 50);
          return false;
        },
        paste: (_view, event) => {
          const clipboardEvent = event as ClipboardEvent;
          const items = clipboardEvent.clipboardData?.items;

          if (items && editor) {
            const imageItems = Array.from(items).filter((item) =>
              item.type.startsWith("image/")
            );

            if (imageItems.length > 0) {
              event.preventDefault();

              imageItems.forEach((item) => {
                const file = item.getAsFile();
                if (file) {
                  fileToBase64(file)
                    .then((base64) => {
                      editor.chain().focus().setImage({ src: base64 }).run();
                    })
                    .catch((error) => {
                      console.error("Error pasting image:", error);
                    });
                }
              });

              return true;
            }
          }

          return false;
        },
      },
    },
    onUpdate: ({ editor }) => {
      debouncedLog(editor);

      if (onUpdate) {
        onUpdate(editor);
      }
    },
  });

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

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (shouldIgnoreKeyboardShortcut(e.target)) {
        return;
      }

      if (isModifierKey(e, "j", { shift: true })) {
        e.preventDefault();
        handleAskAI();
        return;
      }

      if (isModifierKey(e, "m", { shift: true })) {
        e.preventDefault();
        handleMakeResearch();
        return;
      }

      if (isModifierKey(e, "d", { shift: true })) {
        e.preventDefault();
        handleCreateTodo();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, handleAskAI, handleMakeResearch, handleCreateTodo]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const [templatesOpen, setTemplatesOpen] = React.useState(false);

  const handleTemplates = useCallback(() => {
    setTemplatesOpen(true);
  }, []);

  const handleSelectTemplate = useCallback(
    (templateName: TemplateName) => {
      if (editor) {
        editor.commands.insertTemplate(templateName);
      }
      setTemplatesOpen(false);
    },
    [editor]
  );

  const handleImport = useCallback(() => {
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

  // Handler for Import Image button
  const handleImportImage = useCallback(() => {
    if (!editor) return;
    // Open file dialog for images
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && isImageFile(file)) {
        try {
          const base64 = await fileToBase64(file);
          editor.chain().focus().setImage({ src: base64 }).run();
        } catch (error) {
          console.error("Error importing image:", error);
          alert("Failed to import image. Please try again.");
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
        <div
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning
          className="text-4xl font-bold text-gray-900 outline-none border-none focus:outline-none"
          onInput={(e) => {
            const target = e.currentTarget;
            const title = target.textContent || "";
            debouncedUpdateTitle(title);
            if (
              target.textContent &&
              !target.classList.contains("has-content")
            ) {
              target.classList.add("has-content");
            }
          }}
          onBlur={(e) => {
            const target = e.currentTarget;
            if (!target.textContent || target.textContent.trim() === "") {
              target.textContent = "";
              target.classList.remove("has-content");
              debouncedUpdateTitle("");
            } else {
              debouncedUpdateTitle(target.textContent);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              editor?.commands.focus();
            }
          }}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "28px",
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: "0.1px",
            minHeight: "1.25em",
          }}
          data-placeholder="Untitled doc"
        />
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
        onImportImage={handleImportImage}
      />

      <Sheet open={templatesOpen} onOpenChange={setTemplatesOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[540px] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Choose a template</SheetTitle>
            <SheetDescription>
              Select a template to get started with a pre-formatted document.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-3 py-6">
            {TEMPLATES.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleSelectTemplate}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TiptapEditor;
