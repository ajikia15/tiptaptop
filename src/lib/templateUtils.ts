import { TemplateName } from "@/extensions/templates/TemplatesExtension";
import templateBrief from "@/templates/template-brief.json";
import templateOutline from "@/templates/template-outline.json";
import templateNotes from "@/templates/template-notes.json";

export interface PreviewItem {
  type: string;
  content: string;
}

const templates = {
  brief: templateBrief,
  outline: templateOutline,
  notes: templateNotes,
};

export function getTemplatePreview(
  templateName: TemplateName
): PreviewItem[] {
  const template = templates[templateName];
  if (!template?.content) return [];

  const preview: PreviewItem[] = [];
  template.content.slice(0, 5).forEach((node: any) => {
    if (node.type === "heading") {
      const level = node.attrs?.level || 1;
      const text = node.content?.[0]?.text || "";
      preview.push({ type: `h${level}`, content: text });
    } else if (node.type === "paragraph") {
      const text = node.content?.[0]?.text || "";
      if (text && text.length > 0) {
        preview.push({
          type: "p",
          content: text.length > 50 ? text.substring(0, 50) + "..." : text,
        });
      }
    } else if (node.type === "bulletList") {
      const items = node.content?.slice(0, 2) || [];
      items.forEach((item: any) => {
        const text = item?.content?.[0]?.content?.[0]?.text || "";
        if (text) preview.push({ type: "bullet", content: text });
      });
    } else if (node.type === "orderedList") {
      const items = node.content?.slice(0, 2) || [];
      items.forEach((item: any) => {
        const text = item?.content?.[0]?.content?.[0]?.text || "";
        if (text) preview.push({ type: "ordered", content: text });
      });
    } else if (node.type === "taskList") {
      const items = node.content?.slice(0, 2) || [];
      items.forEach((item: any) => {
        const text = item?.content?.[0]?.content?.[0]?.text || "";
        if (text) preview.push({ type: "task", content: text });
      });
    }
    if (preview.length >= 5) return;
  });
  return preview.slice(0, 5);
}

