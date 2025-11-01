import React from "react";
import { Editor } from "@tiptap/core";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
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
} from "lucide-react";
import {
  AskAIIcon,
  MakeResearchIcon,
  TodoListIcon,
  TemplatesIcon,
  ImportIcon,
  ImportImageIcon,
} from "@/components/ui/icon";
import { isMac } from "@/lib/utils";
import { shouldIgnoreKeyboardShortcut } from "@/lib/keyboardUtils";

interface ToolbarProps {
  editor: Editor;
  onImport: (file: File) => void;
  onOpenTemplates: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  editor,
  onImport,
  onOpenTemplates,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key === "k" &&
        (e.metaKey || e.ctrlKey) &&
        !shouldIgnoreKeyboardShortcut(e.target)
      ) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleAskAI = () => {
    editor.commands.askAI();
    setOpen(false);
  };

  const handleMakeResearch = () => {
    editor.commands.makeResearch();
    setOpen(false);
  };

  const handleCreateTodo = () => {
    editor.commands.insertTodoList();
    setOpen(false);
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    setOpen(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.onerror = () => {
        console.error("Error reading image file");
        alert("Failed to import image. Please try again.");
      };
      reader.readAsDataURL(file);
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    setOpen(false);
  };

  return (
    <>
      <div className="editor-toolbar-minimal">
        <Button
          variant="ghost"
          size="sm"
          className="toolbar-toggle"
          aria-label="Toggle command menu"
          onClick={() => setOpen(true)}
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
        >
          <KbdGroup>
            {isMac() ? (
              <>
                <Kbd>⌘</Kbd>
                <span>+</span>
                <Kbd>K</Kbd>
              </>
            ) : (
              <>
                <Kbd>Ctrl</Kbd>
                <span>+</span>
                <Kbd>K</Kbd>
              </>
            )}
          </KbdGroup>
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* AI Prompts & shortcuts */}
          <CommandGroup heading="AI Prompts & shortcuts">
            <CommandItem onSelect={handleAskAI}>
              <AskAIIcon className="w-4 h-4" />
              <span>Ask AI</span>
              <CommandShortcut>
                {isMac() ? "⌘⇧J" : "Ctrl+Shift+J"}
              </CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={handleMakeResearch}>
              <MakeResearchIcon className="w-4 h-4" />
              <span>Make Research</span>
              <CommandShortcut>
                {isMac() ? "⌘⇧M" : "Ctrl+Shift+M"}
              </CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={handleCreateTodo}>
              <TodoListIcon className="w-4 h-4" />
              <span>Create To-Do List</span>
              <CommandShortcut>
                {isMac() ? "⌘⇧D" : "Ctrl+Shift+D"}
              </CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* Formatting */}
          <CommandGroup heading="Formatting">
            <CommandItem
              onSelect={() => {
                editor.chain().focus().setParagraph().run();
                setOpen(false);
              }}
            >
              <span style={{ fontFamily: "Inter" }}>¶</span>
              <span>Paragraph</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                editor.chain().focus().toggleBold().run();
                setOpen(false);
              }}
            >
              <Bold />
              <span>Bold</span>
              <CommandShortcut>{isMac() ? "⌘B" : "Ctrl+B"}</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                editor.chain().focus().toggleItalic().run();
                setOpen(false);
              }}
            >
              <Italic />
              <span>Italic</span>
              <CommandShortcut>{isMac() ? "⌘I" : "Ctrl+I"}</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                editor.chain().focus().toggleStrike().run();
                setOpen(false);
              }}
            >
              <Strikethrough />
              <span>Strikethrough</span>
              <CommandShortcut>
                {isMac() ? "⌘⇧S" : "Ctrl+Shift+S"}
              </CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                editor.chain().focus().toggleCode().run();
                setOpen(false);
              }}
            >
              <Code />
              <span>Code</span>
              <CommandShortcut>{isMac() ? "⌘E" : "Ctrl+E"}</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                setOpen(false);
              }}
            >
              <Heading1 />
              <span>Heading 1</span>
              <CommandShortcut>
                {isMac() ? "⌘⌥1" : "Ctrl+Alt+1"}
              </CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                setOpen(false);
              }}
            >
              <Heading2 />
              <span>Heading 2</span>
              <CommandShortcut>
                {isMac() ? "⌘⌥2" : "Ctrl+Alt+2"}
              </CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                setOpen(false);
              }}
            >
              <Heading3 />
              <span>Heading 3</span>
              <CommandShortcut>
                {isMac() ? "⌘⌥3" : "Ctrl+Alt+3"}
              </CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                editor.chain().focus().toggleBulletList().run();
                setOpen(false);
              }}
            >
              <List />
              <span>Bullet List</span>
              <CommandShortcut>
                {isMac() ? "⌘⇧8" : "Ctrl+Shift+8"}
              </CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                editor.chain().focus().toggleOrderedList().run();
                setOpen(false);
              }}
            >
              <ListOrdered />
              <span>Numbered List</span>
              <CommandShortcut>
                {isMac() ? "⌘⇧7" : "Ctrl+Shift+7"}
              </CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* Other options */}
          <CommandGroup heading="Other options">
            <CommandItem
              onSelect={() => {
                onOpenTemplates();
                setOpen(false);
              }}
            >
              <TemplatesIcon className="w-4 h-4" />
              <span>Templates</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                handleImportClick();
                setOpen(false);
              }}
            >
              <ImportIcon className="w-4 h-4" />
              <span>Import Document</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                handleImportImageClick();
                setOpen(false);
              }}
            >
              <ImportImageIcon className="w-4 h-4" />
              <span>Import Image</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.docx"
        onChange={handleFileChange}
        style={{ display: "none" }}
        aria-label="Import file"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
        aria-label="Import image"
      />
    </>
  );
};
