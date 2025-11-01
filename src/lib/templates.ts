import { TemplateName } from "@/extensions/templates/TemplatesExtension";
import templateBrief from "@/templates/template-brief.json";
import templateOutline from "@/templates/template-outline.json";
import templateNotes from "@/templates/template-notes.json";

export interface TemplateConfig {
  id: TemplateName;
  name: string;
  description: string;
  content: any;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "brief",
    name: "Project Brief",
    description:
      "Create a structured project brief with overview, objectives, and timeline",
    content: templateBrief,
  },
  {
    id: "outline",
    name: "Document Outline",
    description:
      "Organize your document with a hierarchical outline structure",
    content: templateOutline,
  },
  {
    id: "notes",
    name: "Meeting Notes",
    description:
      "Take structured meeting notes with attendees, agenda, and action items",
    content: templateNotes,
  },
];

