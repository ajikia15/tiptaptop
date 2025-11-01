import { TemplateName } from "@/extensions/templates/TemplatesExtension";
import { TemplateConfig } from "@/lib/templates";
import { getTemplatePreview } from "@/lib/templateUtils";
import { TemplatesIcon } from "@/components/ui/icon";
import { TemplatePreview } from "./TemplatePreview";

interface TemplateCardProps {
  template: TemplateConfig;
  onSelect: (templateName: TemplateName) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const previewItems = getTemplatePreview(template.id);

  return (
    <button
      onClick={() => onSelect(template.id)}
      className="flex flex-col gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-md bg-muted p-2 aspect-square">
          <TemplatesIcon className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-1">
          <div
            className="font-medium"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {template.name}
          </div>
          <div
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {template.description}
          </div>
        </div>
      </div>
      <TemplatePreview previewItems={previewItems} />
    </button>
  );
}

