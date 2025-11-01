import { TemplateName } from "@/extensions/templates/TemplatesExtension";
import { TEMPLATES } from "@/lib/templates";
import { TemplateCard } from "./TemplateCard";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface TemplateSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (templateName: TemplateName) => void;
}

export function TemplateSelectionDialog({
  open,
  onOpenChange,
  onSelectTemplate,
}: TemplateSelectionDialogProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
              onSelect={onSelectTemplate}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

