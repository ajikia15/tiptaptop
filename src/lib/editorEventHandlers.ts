import { Editor } from "@tiptap/core";
import { fileToBase64, isImageFile } from "@/lib/utils";

export function createEditorEventHandlers(editor: Editor | null) {
  return {
    dragstart: () => {
      document.body.classList.add("is-dragging");
      document.querySelectorAll(".tippy-box").forEach((el) => {
        const box = el as HTMLElement;
        box.style.display = "none";
      });
      editor?.commands.lockDragHandle();
      return false;
    },
    dragend: (_view: any, event: Event) => {
      const dragEvent = event as DragEvent;
      document.body.classList.remove("is-dragging");
      document.querySelectorAll(".tippy-box").forEach((el) => {
        const box = el as HTMLElement;
        box.style.display = "";
      });

      editor?.commands.unlockDragHandle();

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
    drop: (_view: any, event: Event) => {
      const dragEvent = event as DragEvent;
      document.body.classList.remove("is-dragging");
      document.querySelectorAll(".tippy-box").forEach((el) => {
        const box = el as HTMLElement;
        box.style.display = "";
      });

      editor?.commands.unlockDragHandle();

      const files = dragEvent.dataTransfer?.files;
      if (files && files.length > 0 && editor) {
        const imageFiles = Array.from(files).filter((file) =>
          isImageFile(file)
        );

        if (imageFiles.length > 0) {
          event.preventDefault();

          const coordinates = editor.view.posAtCoords({
            left: dragEvent.clientX,
            top: dragEvent.clientY,
          });

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

      const targetElement = document.elementFromPoint(
        dragEvent.clientX,
        dragEvent.clientY
      );
      if (targetElement && editor) {
        const blockElement =
          targetElement.closest(
            "p, h1, h2, h3, h4, h5, h6, li, blockquote"
          ) || targetElement.closest(".tiptap > *");

        if (blockElement) {
          blockElement.classList.add("dragged-highlight");

          const removeHighlight = () => {
            document
              .querySelectorAll(".dragged-highlight")
              .forEach((el) => {
                el.classList.remove("dragged-highlight");
              });
            document.removeEventListener("click", removeHighlight, true);
          };
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
    paste: (_view: any, event: Event) => {
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
  };
}

