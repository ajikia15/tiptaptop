import Placeholder from '@tiptap/extension-placeholder';

export const SmartPlaceholder = Placeholder.configure({
  placeholder: ({ node, pos }) => {
    if (pos === 0 && node.type.name === 'paragraph' && !node.textContent) {
      return "Type '/' for commands or start writing...";
    }

    if (node.type.name === 'heading' && !node.textContent) {
      return 'Heading';
    }
    
    return '';
  },
  showOnlyWhenEditable: true,
  showOnlyCurrent: false,
});

