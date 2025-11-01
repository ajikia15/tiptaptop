import React from "react";
import { Editor } from "@tiptap/core";
import { Sparkles, Search, CheckSquare, FileText, Upload } from "lucide-react";

interface TemplateStarterProps {
  editor: Editor;
  onAskAI: () => void;
  onMakeResearch: () => void;
  onCreateTodo: () => void;
  onTemplates: () => void;
  onImport: () => void;
}

export const TemplateStarter: React.FC<TemplateStarterProps> = ({
  onAskAI,
  onMakeResearch,
  onCreateTodo,
  onTemplates,
  onImport,
}) => {
  return (
    <div className="action-list-wrapper">
      <div className="flex flex-col gap-1 max-w-xs">
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
          <Sparkles className="w-4 h-4" />
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
          <Search className="w-4 h-4" />
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
          <CheckSquare className="w-4 h-4" />
          <span>Create To-Do List</span>
        </button>

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
          <FileText className="w-4 h-4" />
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
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </button>
      </div>
    </div>
  );
};
