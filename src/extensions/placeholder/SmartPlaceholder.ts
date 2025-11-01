import Placeholder from '@tiptap/extension-placeholder';

/**
 * Enhanced placeholder extension with context-aware text
 */
export const SmartPlaceholder = Placeholder.configure({
  placeholder: ({ node, pos }) => {
    // Show placeholder for first empty paragraph
    if (pos === 0 && node.type.name === 'paragraph' && !node.textContent) {
      return "Type '/' for commands or start writing...";
    }
    
    // Show placeholder for empty heading nodes
    if (node.type.name === 'heading' && !node.textContent) {
      return 'Heading';
    }
    
    return '';
  },
  showOnlyWhenEditable: true,
  showOnlyCurrent: false,
});

