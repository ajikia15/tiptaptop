import { PreviewItem } from "@/lib/templateUtils";

interface TemplatePreviewProps {
  previewItems: PreviewItem[];
}

export function TemplatePreview({ previewItems }: TemplatePreviewProps) {
  return (
    <div className="relative rounded-md border bg-muted/30 p-3 space-y-1.5 min-h-[80px] max-h-[120px] overflow-hidden">
      <div className="space-y-1.5">
        {previewItems.map((item, idx) => (
          <div
            key={idx}
            className={`text-xs leading-relaxed ${
              item.type.startsWith("h")
                ? "font-semibold text-foreground"
                : item.type === "bullet" || item.type === "ordered"
                ? "text-muted-foreground ml-2"
                : item.type === "task"
                ? "text-muted-foreground"
                : "text-muted-foreground"
            }`}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {item.type === "h1" && (
              <div className="text-sm font-bold">{item.content}</div>
            )}
            {item.type === "h2" && (
              <div className="text-xs font-semibold">{item.content}</div>
            )}
            {item.type === "h3" && (
              <div className="text-xs font-medium">{item.content}</div>
            )}
            {item.type === "p" && <div>{item.content}</div>}
            {item.type === "bullet" && <div>• {item.content}</div>}
            {item.type === "ordered" && (
              <div>
                {idx + 1}. {item.content}
              </div>
            )}
            {item.type === "task" && <div>☐ {item.content}</div>}
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}

