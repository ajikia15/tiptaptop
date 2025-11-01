import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    askAi: {
      /**
       * Trigger the Ask AI command
       */
      askAI: () => ReturnType;
    };
  }
}

/**
 * Custom extension that adds an "Ask AI" command
 * Currently triggers an alert, can be extended with actual AI functionality
 */
export const AskAiExtension = Extension.create({
  name: 'askAi',

  addCommands() {
    return {
      askAI: () => () => {
        alert('Ask AI');
        return true;
      },
    };
  },
});

