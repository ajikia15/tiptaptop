import React from "react";
import { Editor } from "@tiptap/core";
import {
  AskAIIcon,
  MakeResearchIcon,
  TodoListIcon,
  TemplatesIcon,
  ImportIcon,
  ImportImageIcon,
} from "@/components/ui/icon";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

interface TemplateStarterProps {
  editor: Editor;
  onAskAI: () => void;
  onMakeResearch: () => void;
  onCreateTodo: () => void;
  onTemplates: () => void;
  onImport: () => void;
  onImportImage: () => void;
}

export const TemplateStarter: React.FC<TemplateStarterProps> = ({
  onAskAI,
  onMakeResearch,
  onCreateTodo,
  onTemplates,
  onImport,
  onImportImage,
}) => {
  // Helper function to detect Mac
  const isMac = () => {
    return typeof window !== "undefined" && window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  };

  const parseShortcut = (shortcut: string): React.ReactNode => {
    // Split shortcut into individual keys (handles Mac symbols and regular keys)
    const keys: string[] = [];
    let currentKey = '';
    
    for (let i = 0; i < shortcut.length; i++) {
      const char = shortcut[i];
      if (char === '⌘' || char === '⌥' || char === '⇧') {
        if (currentKey) {
          keys.push(currentKey);
          currentKey = '';
        }
        keys.push(char);
      } else if (char === '+' || char === ' ') {
        if (currentKey) {
          keys.push(currentKey);
          currentKey = '';
        }
        // Skip separator characters
      } else {
        currentKey += char;
      }
    }
    
    if (currentKey) {
      keys.push(currentKey);
    }
    
    return (
      <KbdGroup>
        {keys.map((key, index) => {
          const needsSeparator = index < keys.length - 1;
          const displayKey = isMac() 
            ? key 
            : key.replace(/⌘/g, "Ctrl").replace(/⌥/g, "Alt").replace(/⇧/g, "Shift");
          
          return (
            <React.Fragment key={index}>
              <Kbd>{displayKey}</Kbd>
              {needsSeparator && <span className="mx-0.5 text-muted-foreground">+</span>}
            </React.Fragment>
          );
        })}
      </KbdGroup>
    );
  };

  return (
    <div className="action-list-wrapper">
      <div className="flex flex-col gap-4 max-w-md">
        {/* AI Prompts & shortcuts */}
        <div className="flex flex-col gap-1">
          <div 
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
            }}
          >
            AI Prompts & shortcuts
          </div>
          <button
            onClick={onAskAI}
            className="group flex items-center justify-between gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              verticalAlign: 'middle'
            }}
          >
            <div className="flex items-center gap-3">
              <AskAIIcon className="w-4 h-4" />
              <span>Ask AI</span>
            </div>
            <span className="text-xs text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
              {parseShortcut("⌘⇧J")}
            </span>
          </button>

          <button
            onClick={onMakeResearch}
            className="group flex items-center justify-between gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              verticalAlign: 'middle'
            }}
          >
            <div className="flex items-center gap-3">
              <MakeResearchIcon className="w-4 h-4" />
              <span>Make Research</span>
            </div>
            <span className="text-xs text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
              {parseShortcut("⌘⇧M")}
            </span>
          </button>

          <button
            onClick={onCreateTodo}
            className="group flex items-center justify-between gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              verticalAlign: 'middle'
            }}
          >
            <div className="flex items-center gap-3">
              <TodoListIcon className="w-4 h-4" />
              <span>Create To-Do List</span>
            </div>
            <span className="text-xs text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
              {parseShortcut("⌘⇧D")}
            </span>
          </button>
        </div>

        {/* Other options */}
        <div className="flex flex-col gap-1">
          <div 
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
            }}
          >
            Other options
          </div>
          <button
            onClick={onTemplates}
            className="group flex items-center justify-between gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              verticalAlign: 'middle'
            }}
          >
            <div className="flex items-center gap-3">
              <TemplatesIcon className="w-4 h-4" />
              <span>Templates</span>
            </div>
          </button>

          <button
            onClick={onImport}
            className="group flex items-center justify-between gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              verticalAlign: 'middle'
            }}
          >
            <div className="flex items-center gap-3">
              <ImportIcon className="w-4 h-4" />
              <span>Import</span>
            </div>
          </button>

          <button
            onClick={onImportImage}
            className="group flex items-center justify-between gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              verticalAlign: 'middle'
            }}
          >
            <div className="flex items-center gap-3">
              <ImportImageIcon className="w-4 h-4" />
              <span>Import Image</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
