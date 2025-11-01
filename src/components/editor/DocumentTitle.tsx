import { RefObject } from "react";
import { Editor } from "@tiptap/core";

interface DocumentTitleProps {
  editor: Editor | null;
  titleRef: RefObject<HTMLDivElement | null>;
  onTitleUpdate: (title: string) => void;
}

export function DocumentTitle({
  editor,
  titleRef,
  onTitleUpdate,
}: DocumentTitleProps) {
  return (
    <div className="document-title-wrapper">
      <div
        ref={titleRef}
        contentEditable
        suppressContentEditableWarning
        className="text-4xl font-bold text-gray-900 outline-none border-none focus:outline-none"
        onInput={(e) => {
          const target = e.currentTarget;
          const title = target.textContent || "";
          onTitleUpdate(title);
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
            onTitleUpdate("");
          } else {
            onTitleUpdate(target.textContent);
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
  );
}

