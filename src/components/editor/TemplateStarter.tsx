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
  return (
    <div className="action-list-wrapper">
      <div className="flex flex-col gap-4 max-w-xs">
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
            className="flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              verticalAlign: 'middle'
            }}
          >
            <AskAIIcon className="w-4 h-4" />
            <span>Ask AI</span>
          </button>

          <button
            onClick={onMakeResearch}
            className="flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              verticalAlign: 'middle'
            }}
          >
            <MakeResearchIcon className="w-4 h-4" />
            <span>Make Research</span>
          </button>

          <button
            onClick={onCreateTodo}
            className="flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              verticalAlign: 'middle'
            }}
          >
            <TodoListIcon className="w-4 h-4" />
            <span>Create To-Do List</span>
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
            className="flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              verticalAlign: 'middle'
            }}
          >
            <TemplatesIcon className="w-4 h-4" />
            <span>Templates</span>
          </button>

          <button
            onClick={onImport}
            className="flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              verticalAlign: 'middle'
            }}
          >
            <ImportIcon className="w-4 h-4" />
            <span>Import</span>
          </button>

          <button
            onClick={onImportImage}
            className="flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              verticalAlign: 'middle'
            }}
          >
            <ImportImageIcon className="w-4 h-4" />
            <span>Import Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
