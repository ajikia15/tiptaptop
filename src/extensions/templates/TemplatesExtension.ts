import { Extension } from "@tiptap/core";
import { z } from "zod";
import templateBrief from "@/templates/template-brief.json";
import templateOutline from "@/templates/template-outline.json";
import templateNotes from "@/templates/template-notes.json";

// Zod schema for validating template structure
const TemplateSchema = z.object({
  type: z.literal("doc"),
  content: z.array(z.any()),
});

export type TemplateName = "brief" | "outline" | "notes";

const templates: Record<TemplateName, any> = {
  brief: templateBrief,
  outline: templateOutline,
  notes: templateNotes,
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    templates: {
      insertTemplate: (templateName: TemplateName) => ReturnType;
    };
  }
}

export const TemplatesExtension = Extension.create({
  name: "templates",

  addCommands() {
    return {
      insertTemplate:
        (templateName: TemplateName) =>
        ({ chain, editor }) => {
          try {
            const template = templates[templateName];

            if (!template) {
              console.error(`Template "${templateName}" not found`);
              return false;
            }

            const validatedTemplate = TemplateSchema.parse(template);

            chain()
              .clearContent()
              .insertContent(validatedTemplate.content)
              .run();

            // Focus at the beginning of the document
            setTimeout(() => {
              editor.commands.focus("start");
            }, 10);

            return true;
          } catch (error) {
            console.error("Error inserting template:", error);
            return false;
          }
        },
    };
  },
});

export { templates };
