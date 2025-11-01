import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import DragHandle from "@tiptap/extension-drag-handle";
import { AskAiExtension } from "@/extensions/ask-ai/AskAiExtension";
import { MakeResearchExtension } from "@/extensions/make-research/MakeResearchExtension";
import { CreateTodoExtension } from "@/extensions/todo/CreateTodoExtension";
import { TemplatesExtension } from "@/extensions/templates/TemplatesExtension";
import { SlashCommandExtension } from "@/extensions/slash/SlashCommandExtension";
import { SmartPlaceholder } from "@/extensions/placeholder/SmartPlaceholder";
import { EditorOptions } from "@tiptap/react";

export function getEditorExtensions(): EditorOptions["extensions"] {
  return [
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
        offset: [0, -20],
      },
    }),
    SmartPlaceholder,
    AskAiExtension,
    MakeResearchExtension,
    CreateTodoExtension,
    TemplatesExtension,
    SlashCommandExtension,
  ];
}

