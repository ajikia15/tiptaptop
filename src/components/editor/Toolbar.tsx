import React from "react";
import { Editor } from "@tiptap/core";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Sparkles,
  Search,
  FileText,
  Upload,
  MoreHorizontal,
} from "lucide-react";
import { TemplateName } from "@/extensions/templates/TemplatesExtension";

interface ToolbarProps {
  editor: Editor;
  onImport: (file: File) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor, onImport }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAskAI = () => {
    editor.commands.askAI();
  };

  const handleMakeResearch = () => {
    editor.commands.makeResearch();
  };

  const handleCreateTodo = () => {
    editor.commands.insertTodoList();
  };

  const handleInsertTemplate = (templateName: TemplateName) => {
    editor.commands.insertTemplate(templateName);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="editor-toolbar-minimal">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="toolbar-toggle"
              aria-label="Toggle toolbar"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" side="bottom" className="w-auto p-3">
            <div className="flex flex-wrap gap-2">
              {/* Formatting Tools */}
              <div className="toolbar-group">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  disabled={!editor.can().chain().focus().toggleBold().run()}
                  className={editor.isActive("bold") ? "bg-accent" : ""}
                  aria-label="Bold"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  disabled={!editor.can().chain().focus().toggleItalic().run()}
                  className={editor.isActive("italic") ? "bg-accent" : ""}
                  aria-label="Italic"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  disabled={!editor.can().chain().focus().toggleStrike().run()}
                  className={editor.isActive("strike") ? "bg-accent" : ""}
                  aria-label="Strikethrough"
                >
                  <Strikethrough className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  disabled={!editor.can().chain().focus().toggleCode().run()}
                  className={editor.isActive("code") ? "bg-accent" : ""}
                  aria-label="Code"
                >
                  <Code className="w-4 h-4" />
                </Button>
              </div>

              {/* Headings */}
              <div className="toolbar-group">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""
                  }
                  aria-label="Heading 1"
                >
                  <Heading1 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""
                  }
                  aria-label="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""
                  }
                  aria-label="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </Button>
              </div>

              {/* Lists */}
              <div className="toolbar-group">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={editor.isActive("bulletList") ? "bg-accent" : ""}
                  aria-label="Bullet List"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  className={editor.isActive("orderedList") ? "bg-accent" : ""}
                  aria-label="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCreateTodo}
                  className={editor.isActive("taskList") ? "bg-accent" : ""}
                  aria-label="To-Do List"
                >
                  <CheckSquare className="w-4 h-4" />
                </Button>
              </div>

              {/* Actions */}
              <div className="toolbar-group">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAskAI}
                  className="gap-2"
                  aria-label="Ask AI"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Ask AI</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMakeResearch}
                  className="gap-2"
                  aria-label="Make Research"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Research</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      aria-label="Templates"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Templates</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => handleInsertTemplate("brief")}
                    >
                      Project Brief
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleInsertTemplate("outline")}
                    >
                      Document Outline
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleInsertTemplate("notes")}
                    >
                      Meeting Notes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleImportClick}
                  className="gap-2"
                  aria-label="Import"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Import</span>
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.docx"
        onChange={handleFileChange}
        style={{ display: "none" }}
        aria-label="Import file"
      />
    </>
  );
};
